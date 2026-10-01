import { useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { offers } from "../../marketplace";
import { useMarket } from "../../store";
import { Button, colors, Heading, Icon, Page, s } from "../../ui";
export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateOrder } = useMarket();
  const [confirm, setConfirm] = useState<"collected" | "cancelled" | null>(
    null,
  );
  const [error, setError] = useState("");
  const order = state.orders.find((o) => o.id === id);
  if (!order)
    return (
      <Page>
        <Heading eyebrow="OUPS" title="Réservation introuvable" />
        <Button title="Mes paniers" onPress={() => router.replace("/orders")} />
      </Page>
    );
  const offer = offers.find((o) => o.id === order.offerId)!;
  function finish() {
    try {
      updateOrder(id, confirm!);
      setConfirm(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  }
  return (
    <Page>
      <View
        style={{
          alignSelf: "flex-start",
          padding: 18,
          borderRadius: 24,
          backgroundColor: colors.pale,
          marginBottom: 24,
        }}
      >
        <Icon
          name={
            order.status === "cancelled" ? "close-outline" : "checkmark-outline"
          }
          size={34}
        />
      </View>
      <Heading
        eyebrow="RÉSERVATION DE DÉMONSTRATION"
        title={
          order.status === "reserved"
            ? "Votre panier vous attend."
            : order.status === "collected"
              ? "Bien joué, et bon appétit !"
              : "Réservation annulée."
        }
        subtitle={
          order.status === "reserved"
            ? "Un petit geste qui a du goût."
            : "Retrouvez toutes vos réservations dans Mes paniers."
        }
      />
      <View style={s.panel}>
        <Text style={s.title}>{offer.merchant}</Text>
        <Text style={s.body}>
          {order.quantity} × {offer.title}
        </Text>
        <View style={s.row}>
          <Icon name="time-outline" />
          <Text style={s.body}>{offer.pickup} · Créneau démo</Text>
        </View>
        <Text style={s.body}>{offer.address}</Text>
        <Text style={s.price}>
          {order.total} DH{" "}
          <Text style={s.small}>· Aucun paiement effectué</Text>
        </Text>
      </View>
      {order.status === "reserved" && (
        <View
          style={[
            s.panel,
            {
              backgroundColor: colors.pale,
              alignItems: "center",
              borderStyle: "dashed",
            },
          ]}
        >
          <Text style={s.eyebrow}>CODE DE RETRAIT · DÉMO</Text>
          <Text selectable style={[s.title, { letterSpacing: 1 }]}>
            {order.id}
          </Text>
          <Text style={[s.small, { textAlign: "center" }]}>
            Dans la version réelle, présentez ce code au commerçant avant de
            confirmer le retrait.
          </Text>
        </View>
      )}
      <Text style={s.notice}>
        Commerce et adresse fictifs. Cette réservation reste sur votre appareil
        ; ne vous déplacez pas.
      </Text>
      {error && (
        <Text accessibilityRole="alert" style={s.notice}>
          {error}
        </Text>
      )}
      {order.status === "reserved" &&
        (confirm ? (
          <View style={s.panel}>
            <Text style={s.title}>
              {confirm === "collected"
                ? "Confirmer le retrait simulé ?"
                : "Annuler ce panier ?"}
            </Text>
            <Text style={s.body}>
              {confirm === "collected"
                ? "Cette étape termine la réservation et ne peut pas être annulée."
                : "Les paniers seront remis à disposition dans la démo."}
            </Text>
            <Button title="Confirmer" onPress={finish} />
            <Button
              secondary
              title="Revenir"
              onPress={() => setConfirm(null)}
            />
          </View>
        ) : (
          <View style={{ gap: 12, marginBottom: 20 }}>
            <Button
              title="Simuler le retrait"
              onPress={() => setConfirm("collected")}
            />
            <Button
              secondary
              title="Annuler la réservation"
              onPress={() => setConfirm("cancelled")}
            />
          </View>
        ))}
      <Button
        secondary
        title="Voir mes paniers"
        onPress={() => router.replace("/orders")}
      />
    </Page>
  );
}
