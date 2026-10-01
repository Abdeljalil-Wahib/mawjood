import React from "react";
import {
  ColorValue,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Offer, remaining } from "./marketplace";
import { useMarket } from "./store";
import { foodImages } from "./images";

export const colors = {
  cream: "#FAF7F0",
  green: "#244D3E",
  ink: "#233E33",
  muted: "#777B70",
  orange: "#C46642",
  line: "#E6E7DC",
  pale: "#EAF0E3",
};
export type IconName = React.ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  color = colors.green,
  size = 22,
}: {
  name: IconName;
  color?: ColorValue;
  size?: number;
}) {
  return <Ionicons name={name} color={color} size={size} />;
}
export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (pressed || disabled) && { opacity: 0.5 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.green }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Page({ children }: { children: React.ReactNode }) {
  const { error } = useMarket();
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.page}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <Text accessibilityRole="alert" style={s.notice}>
            {error}
          </Text>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ gap: 10, marginBottom: 24 }}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.heading}>{title}</Text>
      {subtitle && <Text style={s.body}>{subtitle}</Text>}
    </View>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <View style={s.empty}>
      <Icon name="bag-handle-outline" size={42} />
      <Text style={s.title}>{title}</Text>
      <Text style={[s.body, { textAlign: "center" }]}>{body}</Text>
      <Button
        title="Découvrir les paniers"
        onPress={() => router.navigate("/")}
      />
    </View>
  );
}
export function OfferCard({ offer }: { offer: Offer }) {
  const { state, toggleFavorite } = useMarket();
  const stock = remaining(offer, state.orders);
  const favorite = state.favorites.includes(offer.id);
  return (
    <View style={s.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Voir ${offer.title}, ${offer.price} dirhams`}
        onPress={() => router.push(`/offer/${offer.id}`)}
      >
        <View>
          <Image
            source={foodImages[offer.id]}
            accessibilityLabel={offer.title}
            style={s.cardImage}
          />
          <View style={s.stock}>
            <Text style={s.stockText}>
              {stock ? `${stock} paniers à sauver` : "Victime de son succès"}
            </Text>
          </View>
        </View>
        <View style={s.cardBody}>
          <View style={s.row}>
            <Text style={[s.title, { flex: 1 }]}>{offer.merchant}</Text>
            <Text style={s.rating}>★ {offer.rating}</Text>
          </View>
          <Text style={s.body}>{offer.title}</Text>
          <View style={[s.row, { marginTop: 12 }]}>
            <Icon name="time-outline" size={15} />
            <Text style={[s.small, { flex: 1 }]}>Retrait · {offer.pickup}</Text>
          </View>
          <View style={[s.row, { marginTop: 12 }]}>
            <Text style={[s.small, { flex: 1 }]}>
              {offer.neighborhood} · {offer.distance}
            </Text>
            <Text style={s.oldPrice}>{offer.value} DH</Text>
            <Text style={s.price}>
              {offer.price} <Text style={{ fontSize: 13 }}>DH</Text>
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          favorite
            ? `Retirer ${offer.merchant} des favoris`
            : `Ajouter ${offer.merchant} aux favoris`
        }
        accessibilityState={{ selected: favorite }}
        onPress={() => toggleFavorite(offer.id)}
        style={s.heart}
      >
        <Icon
          name={favorite ? "heart" : "heart-outline"}
          color={favorite ? colors.orange : colors.green}
        />
      </Pressable>
    </View>
  );
}
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  content: {
    padding: 24,
    paddingBottom: 36,
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  eyebrow: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -1.2,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.ink },
  body: { fontSize: 14, lineHeight: 22, color: colors.muted },
  small: { fontSize: 12, color: colors.muted, lineHeight: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardImage: { height: 175, width: "100%", backgroundColor: "#DAD8C7" },
  cardBody: { padding: 17, gap: 5 },
  stock: {
    position: "absolute",
    left: 14,
    top: 14,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  stockText: { fontSize: 11, fontWeight: "700", color: colors.green },
  heart: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#FFFFFFF0",
  },
  price: { fontSize: 23, fontWeight: "800", color: colors.green },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: colors.muted,
  },
  rating: { color: colors.green, fontSize: 12, fontWeight: "700" },
  button: {
    backgroundColor: colors.green,
    minHeight: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  secondary: { backgroundColor: colors.pale },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  empty: { paddingVertical: 38, gap: 20, alignItems: "center" },
  notice: {
    backgroundColor: "#F5E5D7",
    padding: 14,
    borderRadius: 12,
    fontSize: 12,
    lineHeight: 19,
    color: "#805033",
    marginBottom: 20,
  },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 14,
    marginBottom: 20,
  },
});
