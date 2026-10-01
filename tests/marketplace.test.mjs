import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  offers,
  remaining,
  reserve,
  transition,
  isMarketState,
} from "../src/marketplace.ts";
const offer = offers[0];
const now = "2026-10-01T12:00:00Z";
test("reservation calculates MAD total and consumes inventory without mutating input", () => {
  const state = reserve(initialState, offer, 2, "a", now);
  assert.equal(state.orders[0].total, 58);
  assert.equal(remaining(offer, state.orders), 3);
  assert.equal(initialState.orders.length, 0);
});
test("rejects invalid quantities, duplicate references and overselling", () => {
  for (const quantity of [0, -1, 1.5, NaN, 6])
    assert.throws(() => reserve(initialState, offer, quantity, "a", now));
  const sold = reserve(initialState, offer, 5, "a", now);
  assert.throws(() => reserve(sold, offer, 1, "b", now));
  const state = reserve(initialState, offer, 1, "a", now);
  assert.throws(() => reserve(state, offer, 1, "a", now));
});
test("cancellation restores inventory; collection does not", () => {
  const state = reserve(initialState, offer, 2, "a", now);
  assert.equal(remaining(offer, transition(state, "a", "cancelled").orders), 5);
  assert.equal(remaining(offer, transition(state, "a", "collected").orders), 3);
});
test("completed and missing reservations cannot be modified", () => {
  const state = transition(
    reserve(initialState, offer, 1, "a", now),
    "a",
    "collected",
  );
  assert.throws(() => transition(state, "a", "cancelled"));
  assert.throws(() => transition(state, "missing", "collected"));
});
test("storage validation rejects malformed data and accepts a complete round trip", () => {
  const state = reserve(initialState, offer, 1, "a", now);
  assert.equal(isMarketState(JSON.parse(JSON.stringify(state))), true);
  for (const bad of [
    null,
    {},
    { orders: [null], favorites: [] },
    { orders: [], favorites: [12] },
  ])
    assert.equal(isMarketState(bad), false);
  assert.equal(
    isMarketState({ ...state, orders: [...state.orders, ...state.orders] }),
    false,
  );
  assert.equal(
    isMarketState({ ...state, orders: [{ ...state.orders[0], total: 1 }] }),
    false,
  );
  assert.equal(
    isMarketState({
      ...state,
      orders: [{ ...state.orders[0], quantity: 6, total: 6 * offer.price }],
    }),
    false,
  );
});
