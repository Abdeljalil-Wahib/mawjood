# Mawjood

A Moroccan surplus-food marketplace customer prototype for iOS and Android, built with Expo SDK 57, React Native, TypeScript and Expo Router. The first interface is French, with Casablanca demo merchants and prices in Moroccan dirhams (MAD/DH).

## Run

Use Node 22.13+ (Node 22.18+ for the native TypeScript test runner) and npm.

```sh
npm ci
npm start
```

Open with a compatible Expo Go client on a physical device. `npm run android` opens an installed Android emulator; `npm run ios` opens the iOS simulator on macOS. `npm run web` provides a browser preview. Native device behavior still needs testing on both platforms.

## Included

- Discovery with text search, category filters and offer details.
- Saved offers and persistent local reservations using AsyncStorage.
- Quantity selection, inventory checks and simulated reservation totals.
- Pickup code, explicit pickup confirmation, cancellation and order history.
- Local profile showing simulated savings from collected orders.
- Safe-area layouts, screen routes, accessible labels and empty/error states.

All merchants, addresses, ratings and distances are fictional. Images are illustrative Unsplash photos bundled locally in `assets/food`; their source URLs are preserved in `src/marketplace.ts`. Reservation windows are static demo slots, not dated live inventory. Orders do not reach a merchant and no money is charged. Storage is local to one installation; reinstalling or clearing application data removes it. Default Expo app icons remain placeholders.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run export
```

Tests cover stock accounting, overselling, quantities, duplicate references, cancellation, pickup transitions and malformed saved data. Export creates JavaScript bundles; it does not create signed store binaries.

## Production work still required

This is the first customer flow, not complete Too Good To Go feature parity. Next milestones:

1. Backend, authentication, merchant onboarding and an admin dashboard. Store dated inventory with the `Africa/Casablanca` timezone and prices in integer minor units. Enforce stock and order transitions transactionally on the server.
2. Select a payment provider available to the Moroccan business; implement payment intents, verified webhooks, refunds and reconciliation. Never treat the client reservation or a local pickup code as authoritative.
3. Real merchant catalog, location/map search, Arabic/RTL and Darija content, notifications, support and verified reviews.
4. Server-issued pickup tokens, pickup-window enforcement, cancellation policy, privacy/data controls and merchant allergen information.
5. Branded assets, device/accessibility testing, EAS app identifiers and signing, TestFlight/Play testing and store submissions.

The marketplace domain is in `src/marketplace.ts`, persistence in `src/store.tsx`, shared UI in `src/ui.tsx`, and file-based routes in `src/app/`.

Expo references: [SDK 57](https://docs.expo.dev/versions/v57.0.0/), [router setup](https://docs.expo.dev/router/installation/).
