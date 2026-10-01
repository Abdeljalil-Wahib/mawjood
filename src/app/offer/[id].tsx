import { useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { offers, remaining } from "../../marketplace";
import { useMarket } from "../../store";
import { foodImages } from "../../images";
import { Button, colors, Heading, Icon, Page, s } from "../../ui";
export default function OfferDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = offers.find((o) => o.id === id);
  const { state, book } = useMarket();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const booking = useRef(false);
  if (!offer)
    return (
      <Page>
        <Heading eyebrow="OUPS" title="Panier introuvable" />
        <Button
          title="Revenir aux paniers"
          onPress={() => router.replace("/")}
        />
      </Page>
    );
  const stock = remaining(offer, state.orders);
  function checkout() {
    if (booking.current) return;
    booking.current = true;
    try {
      const orderId = book(offer!, quantity);
      router.replace(`/order/${orderId}`);
    } catch (e) {
      booking.current = false;
      setError(e instanceof Error ? e.message : "Réservation impossible.");
    }
  }
  return (
    <Page>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        style={[s.row, { paddingVertical: 10, marginBottom: 14 }]}
      >
        <Icon name="arrow-back" />
        <Text style={s.body}>Les paniers du quartier</Text>
      </Pressable>
      <Image
        source={foodImages[offer.id]}
        style={{
          width: "100%",
          height: 240,
          borderRadius: 24,
          marginBottom: 24,
          backgroundColor: colors.pale,
        }}
      />
      <Heading
        eyebrow={`${offer.category.toUpperCase()} · ${offer.neighborhood.toUpperCase()}`}
        title={offer.merchant}
        subtitle={offer.title}
      />
      <View style={[s.row, { marginBottom: 24 }]}>
        <Text style={s.price}>{offer.price} DH</Text>
        <Text style={s.oldPrice}>{offer.value} DH</Text>
        <Text style={[s.small, { flex: 1, textAlign: "right" }]}>
          ★ {offer.rating} · Note fictive
        </Text>
      </View>
      <View style={s.panel}>
        <View style={s.row}>
          <Icon name="time-outline" />
          <Text style={s.title}>Retrait · {offer.pickup}</Text>
        </View>
        <Text style={s.body}>
          Créneau de démonstration, heure de Casablanca.
        </Text>
        <View style={s.row}>
          <Icon name="location-outline" />
          <Text style={[s.body, { flex: 1 }]}>{offer.address}</Text>
        </View>
        <Text style={s.small}>
          Adresse fictive · Ne vous déplacez pas pour cette démo.
        </Text>
      </View>
      <View style={s.panel}>
        <Text style={s.title}>La surprise du jour</Text>
        <Text style={s.body}>{offer.description}</Text>
        <Text style={[s.small, { color: colors.orange }]}>
          {offer.allergens}
        </Text>
      </View>
      <View style={[s.row, { marginBottom: 24 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Combien de paniers ?</Text>
          <Text style={s.small}>{stock} disponibles</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retirer un panier"
          disabled={quantity <= 1}
          onPress={() => setQuantity((q) => q - 1)}
          style={{ padding: 12, opacity: quantity <= 1 ? 0.3 : 1 }}
        >
          <Icon name="remove-circle-outline" size={30} />
        </Pressable>
        <Text style={s.title}>{quantity}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajouter un panier"
          disabled={quantity >= stock}
          onPress={() => setQuantity((q) => q + 1)}
          style={{ padding: 12, opacity: quantity >= stock ? 0.3 : 1 }}
        >
          <Icon name="add-circle-outline" size={30} />
        </Pressable>
      </View>
      <Text style={s.notice}>
        Réservation de démonstration. Aucun débit ni commande réelle.
      </Text>
      {error && (
        <Text accessibilityRole="alert" style={s.notice}>
          {error}
        </Text>
      )}
      <Button
        title={
          stock
            ? `Réserver en démo · ${quantity * offer.price} DH`
            : "Tous les paniers ont été sauvés"
        }
        disabled={!stock || quantity > stock}
        onPress={checkout}
      />
    </Page>
  );
}
