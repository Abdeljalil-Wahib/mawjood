import { Tabs } from "expo-router";
import { colors, Icon, IconName } from "../../ui";
const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: "index", title: "Découvrir", icon: "compass-outline" },
  { name: "favorites", title: "Favoris", icon: "heart-outline" },
  { name: "orders", title: "Mes paniers", icon: "bag-handle-outline" },
  { name: "profile", title: "Profil", icon: "person-outline" },
];
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: "#8B9086",
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <Icon name={tab.icon} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
