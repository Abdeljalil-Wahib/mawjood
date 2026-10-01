import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { offers } from "../../marketplace";
import { useMarket } from "../../store";
import { colors, Empty, Heading, Icon, Page, s } from "../../ui";
export default function Orders() {
  const { state } = useMarket();
  return (
    <Page>
      <Heading
        eyebrow="LES BONNES CHOSES VOUS ATTENDENT"
        title="Mes paniers."
        subtitle="Vos réservations et vos petites victoires."
      />
      {!state.orders.length ? (
        <Empty
          title="Votre premier panier vous attend"
          body="Découvrez une bonne adresse et réservez votre panier surprise."
        />
      ) : (
        state.orders.map((order) => {
          const offer = offers.find((o) => o.id === order.offerId)!;
          return (
            <Pressable
              key={order.id}
              accessibilityRole="button"
              onPress={() => router.push(`/order/${order.id}`)}
              style={s.panel}
            >
              <View style={s.row}>
                <Icon name="bag-handle-outline" />
                <Text style={[s.eyebrow, { flex: 1, color: colors.green }]}>
                  {order.status === "reserved"
                    ? "À RÉCUPÉRER · DÉMO"
                    : order.status === "collected"
                      ? "RÉCUPÉRÉ · DÉMO"
                      : "ANNULÉ · DÉMO"}
                </Text>
                <Icon name="chevron-forward" size={16} />
              </View>
              <Text style={s.title}>{offer.merchant}</Text>
              <Text style={s.body}>
                {order.quantity} × {offer.title}
              </Text>
              <View style={s.row}>
                <Text style={[s.small, { flex: 1 }]}>{offer.pickup}</Text>
                <Text style={s.price}>{order.total} DH</Text>
              </View>
            </Pressable>
          );
        })
      )}
    </Page>
  );
}
