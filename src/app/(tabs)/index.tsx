import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Category, offers } from "../../marketplace";
import { colors, Icon, OfferCard, Page, s } from "../../ui";

const categories: Category[] = ["Tout", "Boulangerie", "Repas", "Épicerie"];
export default function Discover() {
  const [category, setCategory] = useState<Category>("Tout");
  const [query, setQuery] = useState("");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = offers.filter(
    (o) =>
      (category === "Tout" || category === o.category) &&
      normalize(`${o.merchant} ${o.title} ${o.neighborhood}`).includes(
        normalize(query.trim()),
      ),
  );
  return (
    <Page>
      <View
        style={[s.row, { justifyContent: "space-between", marginBottom: 28 }]}
      >
        <View style={s.row}>
          <View style={styles.brand}>
            <Icon name="leaf" color={colors.cream} size={20} />
          </View>
          <Text style={styles.wordmark}>
            mawjood<Text style={{ color: colors.orange }}>.</Text>
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 3 }}>
          <Text style={s.eyebrow}>VOTRE VILLE</Text>
          <View style={s.row}>
            <Icon name="location-outline" size={14} />
            <Text
              style={{ fontSize: 12, color: colors.green, fontWeight: "600" }}
            >
              Casablanca
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.hero}>
        <Text style={[s.eyebrow, { color: "#DCCBA5" }]}>
          BON POUR VOUS. BON POUR DEMAIN.
        </Text>
        <Text style={styles.heroTitle}>Trop bon pour{"\n"}être gaspillé.</Text>
        <Text style={styles.heroBody}>
          Les bonnes choses du quartier,{"\n"}à prix tout doux.
        </Text>
        <View style={styles.heroBottom}>
          <Text style={styles.heroPill}>Des paniers dès 19 DH</Text>
          <Icon name="flower-outline" color="#DCCBA5" size={48} />
        </View>
      </View>
      <View style={styles.search}>
        <Icon name="search-outline" size={20} />
        <TextInput
          accessibilityLabel="Rechercher un commerce ou un quartier"
          value={query}
          onChangeText={setQuery}
          placeholder="Un commerce, un quartier…"
          placeholderTextColor="#858A7E"
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 14,
            color: colors.ink,
          }}
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
            onPress={() => setQuery("")}
            style={{ padding: 10 }}
          >
            <Icon name="close" size={18} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
      >
        {categories.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityState={{ selected: c === category }}
            onPress={() => setCategory(c)}
            style={[
              styles.chip,
              c === category && {
                backgroundColor: colors.green,
                borderColor: colors.green,
              },
            ]}
          >
            <Text
              style={{
                color: c === category ? "#fff" : colors.green,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={[s.row, { justifyContent: "space-between", marginBottom: 8 }]}
      >
        <Text style={[s.title, { fontSize: 23 }]}>À sauver près de vous</Text>
        <Text style={s.small}>{filtered.length} adresses</Text>
      </View>
      <Text style={[s.body, { marginBottom: 20 }]}>
        Une petite surprise. Un beau geste.
      </Text>
      {filtered.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
      {!filtered.length && (
        <View style={s.panel}>
          <Text style={s.title}>Aucun panier trouvé</Text>
          <Text style={s.body}>
            Essayez un autre quartier ou une autre catégorie.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setQuery("");
              setCategory("Tout");
            }}
          >
            <Text style={{ color: colors.orange, paddingVertical: 12 }}>
              Réinitialiser les filtres
            </Text>
          </Pressable>
        </View>
      )}
      <View style={styles.footer}>
        <Icon name="leaf-outline" size={24} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Chaque panier compte.</Text>
          <Text style={s.small}>
            Moins de gaspillage, plus de bonnes choses.
          </Text>
        </View>
      </View>
      <Text style={[s.small, { textAlign: "center", marginTop: 20 }]}>
        Version démo · Commerces, notes et distances fictifs
      </Text>
    </Page>
  );
}
const styles = StyleSheet.create({
  brand: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -1.5,
    color: colors.green,
  },
  hero: {
    backgroundColor: colors.green,
    borderRadius: 25,
    padding: 25,
    marginBottom: 24,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 37,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1.3,
    color: colors.cream,
    marginTop: 18,
  },
  heroBody: { fontSize: 14, lineHeight: 22, color: "#D8E0CE", marginTop: 14 },
  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  heroPill: {
    backgroundColor: "#DCE6CA",
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  footer: {
    backgroundColor: colors.pale,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
});
