import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.expo/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/generated/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly"
      }
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["@heroui/react", "@heroui/react/*"],
              "message": "Import HeroUI React only inside packages/ui-web. Apps must consume @designc/ui-web."
            },
            {
              "group": ["heroui-native", "heroui-native/*"],
              "message": "Import HeroUI Native only inside packages/ui-native. Apps must consume @designc/ui-native."
            }
          ]
        }
      ]
    }
  },
  {
    files: ["packages/ui-web/**/*.{ts,tsx}", "packages/ui-native/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off"
    }
  },
  {
    files: ["**/*.config.js", "**/*.config.cjs", "**/metro.config.js", "**/babel.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
);
