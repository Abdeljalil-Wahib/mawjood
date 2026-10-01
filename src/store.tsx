import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  initialState,
  isMarketState,
  MarketState,
  Offer,
  reserve,
  transition,
} from "./marketplace";

const KEY = "mawjood.demo.v1";
type Store = {
  state: MarketState;
  error: string;
  toggleFavorite: (id: string) => void;
  book: (offer: Offer, quantity: number) => string;
  updateOrder: (id: string, status: "collected" | "cancelled") => void;
};
const Context = createContext<Store | null>(null);
export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const current = useRef(state);
  const writes = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (!isMarketState(saved)) throw new Error("Invalid saved data");
          current.current = saved;
          setState(saved);
        }
      })
      .catch(() => {
        if (active) setError("Les données locales n’ont pas pu être chargées.");
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  function commit(next: MarketState) {
    current.current = next;
    setState(next);
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(next)))
      .then(() => setError(""))
      .catch(() =>
        setError(
          "Sauvegarde indisponible : vos changements risquent d’être perdus à la fermeture.",
        ),
      );
  }
  const value: Store = {
    state,
    error,
    toggleFavorite(id) {
      const s = current.current;
      commit({
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((f) => f !== id)
          : [...s.favorites, id],
      });
    },
    book(offer, quantity) {
      const id = `MW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      commit(
        reserve(current.current, offer, quantity, id, new Date().toISOString()),
      );
      return id;
    },
    updateOrder(id, status) {
      commit(transition(current.current, id, status));
    },
  };
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAF7F0",
          gap: 16,
        }}
      >
        <ActivityIndicator color="#244D3E" />
        <Text>Un petit instant…</Text>
      </View>
    );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useMarket() {
  const store = useContext(Context);
  if (!store) throw new Error("MarketProvider is required");
  return store;
}
