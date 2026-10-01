export type Category = "Tout" | "Boulangerie" | "Repas" | "Épicerie";
export type Offer = {
  id: string;
  merchant: string;
  title: string;
  category: Category;
  neighborhood: string;
  address: string;
  price: number;
  value: number;
  stock: number;
  rating: string;
  distance: string;
  pickup: string;
  image: string;
  description: string;
  allergens: string;
};
export type Order = {
  id: string;
  offerId: string;
  quantity: number;
  total: number;
  status: "reserved" | "collected" | "cancelled";
  createdAt: string;
};
export type MarketState = { orders: Order[]; favorites: string[] };
export const initialState: MarketState = { orders: [], favorites: [] };
export const offers: Offer[] = [
  {
    id: "four",
    merchant: "Le Four du Quartier",
    title: "Le panier du boulanger",
    category: "Boulangerie",
    neighborhood: "Gauthier",
    address: "12, rue Jean Jaurès, Gauthier, Casablanca",
    price: 29,
    value: 90,
    stock: 5,
    rating: "4.9",
    distance: "0,8 km",
    pickup: "18:00 – 19:30",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=85",
    description:
      "Une sélection surprise de pains artisanaux et de viennoiseries du jour. Le contenu dépend des invendus : chaque panier est une petite découverte.",
    allergens:
      "Peut contenir du gluten, du lait, des œufs et des fruits à coque.",
  },
  {
    id: "table",
    merchant: "La Table Verte",
    title: "Un bon dîner à sauver",
    category: "Repas",
    neighborhood: "Maârif",
    address: "24, rue du Jura, Maârif, Casablanca",
    price: 39,
    value: 120,
    stock: 3,
    rating: "4.8",
    distance: "1,2 km",
    pickup: "20:00 – 21:00",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&auto=format&fit=crop&q=85",
    description:
      "Un repas généreux préparé aujourd’hui, composé selon les disponibilités du restaurant. Apportez votre sac et repartez avec une belle surprise.",
    allergens:
      "Ingrédients variables. Demandez la liste des allergènes au commerçant avant de réserver.",
  },
  {
    id: "souk",
    merchant: "Le Petit Marché",
    title: "Le plein de fraîcheur",
    category: "Épicerie",
    neighborhood: "Bourgogne",
    address: "8, rue de Bouarfa, Bourgogne, Casablanca",
    price: 25,
    value: 75,
    stock: 7,
    rating: "4.7",
    distance: "2,1 km",
    pickup: "17:30 – 19:00",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=85",
    description:
      "Des fruits et légumes qui méritent une seconde chance. De quoi cuisiner avec les produits disponibles en fin de journée.",
    allergens:
      "Le contenu varie chaque jour. Vérifiez les produits lors du retrait.",
  },
  {
    id: "pause",
    merchant: "Pause & Msemen",
    title: "Le goûter à partager",
    category: "Boulangerie",
    neighborhood: "Racine",
    address: "19, rue Molière, Racine, Casablanca",
    price: 19,
    value: 60,
    stock: 2,
    rating: "4.9",
    distance: "1,6 km",
    pickup: "16:00 – 17:30",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000&auto=format&fit=crop&q=85",
    description:
      "Un assortiment surprise de douceurs et de produits de boulangerie du jour, à partager autour d’un bon thé.",
    allergens:
      "Peut contenir du gluten, du lait, des œufs, du sésame et des fruits à coque.",
  },
];
export function remaining(offer: Offer, orders: Order[]): number {
  return (
    offer.stock -
    orders
      .filter((o) => o.offerId === offer.id && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.quantity, 0)
  );
}
export function reserve(
  state: MarketState,
  offer: Offer,
  quantity: number,
  id: string,
  now: string,
): MarketState {
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > remaining(offer, state.orders)
  )
    throw new Error("Cette quantité n’est plus disponible.");
  if (state.orders.some((o) => o.id === id))
    throw new Error("Cette réservation existe déjà.");
  return {
    ...state,
    orders: [
      {
        id,
        offerId: offer.id,
        quantity,
        total: quantity * offer.price,
        status: "reserved",
        createdAt: now,
      },
      ...state.orders,
    ],
  };
}
export function transition(
  state: MarketState,
  id: string,
  status: "cancelled" | "collected",
): MarketState {
  const order = state.orders.find((o) => o.id === id);
  if (!order || order.status !== "reserved")
    throw new Error("Cette réservation ne peut plus être modifiée.");
  return {
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
  };
}
export function isMarketState(value: unknown): value is MarketState {
  if (!value || typeof value !== "object") return false;
  const s = value as MarketState;
  if (
    !Array.isArray(s.favorites) ||
    !s.favorites.every(
      (id) => typeof id === "string" && offers.some((o) => o.id === id),
    ) ||
    !Array.isArray(s.orders)
  )
    return false;
  const validOrders = s.orders.every((o) => {
    if (!o || typeof o.id !== "string" || !o.id) return false;
    const offer = offers.find((f) => f.id === o.offerId);
    return (
      offer &&
      Number.isInteger(o.quantity) &&
      o.quantity > 0 &&
      o.total === o.quantity * offer.price &&
      ["reserved", "collected", "cancelled"].includes(o.status) &&
      typeof o.createdAt === "string" &&
      Number.isFinite(Date.parse(o.createdAt))
    );
  });
  return (
    Boolean(validOrders) &&
    new Set(s.orders.map((o) => o.id)).size === s.orders.length &&
    offers.every((o) => remaining(o, s.orders) >= 0)
  );
}
