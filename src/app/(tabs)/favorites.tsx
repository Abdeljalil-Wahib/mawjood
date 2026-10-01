import { offers } from "../../marketplace";
import { useMarket } from "../../store";
import { Empty, Heading, OfferCard, Page } from "../../ui";
export default function Favorites() {
  const { state } = useMarket();
  const saved = offers.filter((o) => state.favorites.includes(o.id));
  return (
    <Page>
      <Heading
        eyebrow="VOS BONNES ADRESSES"
        title="Les coups de cœur."
        subtitle="Retrouvez les commerces que vous aimez."
      />
      {saved.length ? (
        saved.map((o) => <OfferCard key={o.id} offer={o} />)
      ) : (
        <Empty
          title="Un peu d’amour par ici ?"
          body="Touchez le cœur d’un panier pour retrouver votre adresse préférée ici."
        />
      )}
    </Page>
  );
}
