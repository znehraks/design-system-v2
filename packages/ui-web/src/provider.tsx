import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { createThemeAttributes, type DesignCThemeId, type DesignCThemeMode } from "@designc/theme";

type PolymorphicProps<TElement extends ElementType> = {
  as?: TElement;
  theme: DesignCThemeId;
  mode?: DesignCThemeMode;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children">;

export type DesignCProviderProps<TElement extends ElementType = "div"> = PolymorphicProps<TElement>;

export function DesignCProvider<TElement extends ElementType = "div">({
  as,
  theme,
  mode = "light",
  children,
  ...props
}: DesignCProviderProps<TElement>) {
  const element = as ?? "div";

  return createElement(
    element,
    {
      ...props,
      ...createThemeAttributes(theme, mode)
    },
    children
  );
}
