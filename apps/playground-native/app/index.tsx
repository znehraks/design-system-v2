import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Alert, Button, Card, Checkbox, Input, Switch } from "@designc/ui-native";
import { designcThemes, themeNames, type DesignCThemeMode, type DesignCThemeName } from "@designc/theme";

const sliceCopy = {
  cosmetics: "Ingredient-led product surfaces with calm premium trust.",
  "group-dating": "Warm social cards for groups, safety, and quick intent.",
  muen: "Compact conversation states with luminous assistant signals.",
  "company-landing": "Credible proof rows and conversion-oriented hierarchy."
} satisfies Record<DesignCThemeName, string>;

export default function Index() {
  const [themeName, setThemeName] = useState<DesignCThemeName>("muen");
  const [mode, setMode] = useState<DesignCThemeMode>("dark");
  const theme = designcThemes[themeName];
  const colors = theme.modes[mode].colors;

  const swatches = useMemo(
    () => ["background", "foreground", "surface", "primary", "accent", "cta"].map((key) => [key, colors[key as keyof typeof colors]]),
    [colors]
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ gap: 18, padding: 20 }}
    >
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.foreground, fontSize: 34, fontWeight: "700", lineHeight: 39 }}>
          DesignC v2
        </Text>
        <Text selectable style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 23 }}>
          Native playground using DesignC wrapper imports over HeroUI Native.
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {themeNames.map((name) => (
          <Button key={name} variant={themeName === name ? "primary" : "outline"} onPress={() => setThemeName(name)}>
            {name}
          </Button>
        ))}
        <Button variant="secondary" onPress={() => setMode(mode === "light" ? "dark" : "light")}>
          {mode === "light" ? "Dark" : "Light"}
        </Button>
      </View>

      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}>
        <Card.Body style={{ gap: 14 }}>
          <Card.Title style={{ color: colors.foreground }}>{theme.name}</Card.Title>
          <Card.Description style={{ color: colors.mutedForeground }}>{theme.mood.join(" / ")}</Card.Description>
          <Text selectable style={{ color: colors.foreground, fontSize: 17, lineHeight: 25 }}>
            {sliceCopy[themeName]}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {swatches.map(([name, value]) => (
              <View key={name} style={{ width: 92, gap: 6 }}>
                <View style={{ height: 48, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: value }} />
                <Text selectable style={{ color: colors.mutedForeground, fontSize: 12 }}>
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Card.Body>
      </Card>

      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}>
        <Card.Body style={{ gap: 14 }}>
          <Card.Title style={{ color: colors.foreground }}>Component Catalog</Card.Title>
          <Input placeholder="Semantic search" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <Checkbox isSelected>Accessible state</Checkbox>
            <Switch isSelected />
          </View>
          <Alert status="success">
            <Alert.Content>
              <Alert.Title>Theme contract valid</Alert.Title>
              <Alert.Description>All starter packs pass WCAG AA contrast checks.</Alert.Description>
            </Alert.Content>
          </Alert>
        </Card.Body>
      </Card>
    </ScrollView>
  );
}
