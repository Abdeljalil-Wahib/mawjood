import { Text, View } from "react-native";
import { offers } from "../../marketplace";
import { useMarket } from "../../store";
import { colors, Heading, Icon, Page, s } from "../../ui";
export default function Profile() {
  const { state } = useMarket();
  const collected = state.orders.filter((o) => o.status === "collected");
  const count = collected.reduce((sum, o) => sum + o.quantity, 0);
  const savings = collected.reduce(
    (sum, o) =>
      sum +
      offers.find((f) => f.id === o.offerId)!.value * o.quantity -
      o.total,
    0,
  );
  return (
    <Page>
      <Heading
        eyebrow="MARHBA BIKOUM"
        title={"Un petit geste,\nun bel impact."}
      />
      <View style={s.panel}>
        <View style={s.row}>
          <Icon name="person-circle-outline" size={42} />
          <View>
            <Text style={s.title}>Explorateur Mawjood</Text>
            <Text style={s.small}>Profil local de démonstration</Text>
          </View>
        </View>
      </View>
      <View style={[s.panel, { backgroundColor: colors.pale }]}>
        <Text style={s.eyebrow}>VOTRE IMPACT SIMULÉ</Text>
        <View style={[s.row, { gap: 30 }]}>
          <View>
            <Text style={s.heading}>{count}</Text>
            <Text style={s.small}>paniers récupérés</Text>
          </View>
          <View>
            <Text style={s.heading}>
              {savings} <Text style={{ fontSize: 16 }}>DH</Text>
            </Text>
            <Text style={s.small}>économies simulées</Text>
          </View>
        </View>
      </View>
      <View style={s.panel}>
        <Text style={s.title}>Comment ça marche ?</Text>
        <Text style={s.body}>
          1. Trouvez un panier surprise près de chez vous.
        </Text>
        <Text style={s.body}>
          2. Réservez-le et notez le créneau de retrait.
        </Text>
        <Text style={s.body}>
          3. Présentez votre réservation au commerce et confirmez le retrait sur
          place.
        </Text>
      </View>
      <Text style={s.notice}>
        Cette version utilise des commerces fictifs. Aucun paiement n’est
        effectué et aucune commande n’est transmise. Les favoris et les
        réservations sont enregistrés uniquement sur cet appareil.
      </Text>
      <Text style={[s.small, { textAlign: "center" }]}>
        Mawjood · Fait pour les bonnes choses 🇲🇦
      </Text>
    </Page>
  );
}
