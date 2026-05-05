"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, Checkbox, DesignCProvider, Input, Switch, Tabs } from "@designc/ui-web";
import { designcThemes, themeNames, type DesignCThemeMode, type DesignCThemeName } from "@designc/theme";

const slices = {
  cosmetics: "Product detail, ingredient trust, soft premium surfaces.",
  "group-dating": "Group cards, safe social actions, high-affordance controls.",
  muen: "Conversation cockpit, compact states, luminous agent signals.",
  "company-landing": "Conversion page, proof rows, restrained executive tone."
} satisfies Record<DesignCThemeName, string>;

export function PlaygroundShell() {
  const [themeName, setThemeName] = useState<DesignCThemeName>("cosmetics");
  const [mode, setMode] = useState<DesignCThemeMode>("light");
  const theme = designcThemes[themeName];
  const colors = theme.modes[mode].colors;

  const swatches = useMemo(
    () =>
      ["background", "foreground", "surface", "primary", "accent", "cta", "success", "warning", "danger"].map(
        (key) => [key, colors[key as keyof typeof colors]]
      ),
    [colors]
  );

  return (
    <DesignCProvider
      as="main"
      theme={themeName}
      mode={mode}
      className="min-h-screen bg-[var(--dc-color-background)] text-[var(--dc-color-foreground)]"
    >
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-[var(--dc-color-border)] pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h1 className="m-0 text-4xl font-semibold tracking-normal md:text-5xl">DesignC v2 Playground</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--dc-color-muted-foreground)]">
              Common UI structure stays shared. Color, mood, and product emotion come from brand-owned theme packs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-[var(--dc-radius-md,8px)] border border-[var(--dc-color-border)] bg-[var(--dc-color-surface)] p-1">
              {themeNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={themeName === name}
                  onClick={() => setThemeName(name)}
                  className="rounded-[6px] px-3 py-2 text-sm text-[var(--dc-color-foreground)] data-[active=true]:bg-[var(--dc-color-cta)] data-[active=true]:text-[var(--dc-color-on-cta)]"
                  data-active={themeName === name}
                >
                  {name}
                </button>
              ))}
            </div>
            <Button onPress={() => setMode(mode === "light" ? "dark" : "light")} variant="primary">
              {mode === "light" ? "Dark" : "Light"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="rounded-[8px] border border-[var(--dc-color-border)] bg-[var(--dc-color-surface)]">
            <Card.Header>
              <Card.Title>{theme.name}</Card.Title>
              <Card.Description>{theme.mood.join(" / ")}</Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-5">
              <p className="m-0 text-lg leading-8">{slices[themeName]}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Density" value={theme.density} />
                <Metric label="Display" value={theme.typography.display ?? "system display"} />
                <Metric label="Body" value={theme.typography.body ?? "system body"} />
              </div>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                {swatches.map(([name, value]) => (
                  <div key={name} className="min-w-0">
                    <div className="h-14 rounded-[8px] border border-[var(--dc-color-border)]" style={{ background: value }} />
                    <div className="mt-2 truncate text-xs text-[var(--dc-color-muted-foreground)]">{name}</div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card className="rounded-[8px] border border-[var(--dc-color-border)] bg-[var(--dc-color-surface)]">
            <Card.Header>
              <Card.Title>Component Catalog</Card.Title>
              <Card.Description>HeroUI via @designc/ui-web</Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <Input placeholder="Semantic search" aria-label="Semantic search" />
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary action</Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="ghost">Inbox</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Checkbox defaultSelected>Accessible state</Checkbox>
                <Switch defaultSelected aria-label="Preview toggle" />
              </div>
              <Tabs defaultSelectedKey="slice">
                <Tabs.List>
                  <Tabs.Tab id="slice">Slice</Tabs.Tab>
                  <Tabs.Tab id="contract">Contract</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel id="slice">Service slice previews use the same structure with different theme packs.</Tabs.Panel>
                <Tabs.Panel id="contract">Apps import DesignC wrappers only; direct HeroUI imports are blocked.</Tabs.Panel>
              </Tabs>
              <Alert status="success">
                <Alert.Content>
                  <Alert.Title>Theme contract valid</Alert.Title>
                  <Alert.Description>All starter packs pass WCAG AA contrast checks.</Alert.Description>
                </Alert.Content>
              </Alert>
            </Card.Content>
          </Card>
        </div>
      </section>
    </DesignCProvider>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[var(--dc-color-border)] bg-[var(--dc-color-surface-alt)] p-4">
      <div className="text-xs uppercase text-[var(--dc-color-muted-foreground)]">{label}</div>
      <div className="mt-2 text-sm font-semibold">{value}</div>
    </div>
  );
}
