import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import eslintParserTypeScript from "@typescript-eslint/parser";
import eslintPluginReadableTailwind from "eslint-plugin-better-tailwindcss";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  eslintJs.configs.recommended,
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
  ...(Array.isArray(tseslint.configs.recommended)
    ? tseslint.configs.recommended
    : [tseslint.configs.recommended]),
  ...(Array.isArray(tseslint.configs.stylistic)
    ? tseslint.configs.stylistic
    : [tseslint.configs.stylistic]),
  { ignores: ["node_modules", ".next", "*.config.*"] },
  {
    files: ["**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-typescript"],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: true,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "readable-tailwind": eslintPluginReadableTailwind,
    },
    rules: {
      ...(eslintPluginReadableTailwind.configs?.warning?.rules || {}),
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
      "@eslint-react/no-array-index-key": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "no-useless-escape": "off",
    },
    settings: {
      "readable-tailwind": {
        entryPoint: "src/css/globals.css",
      },
    },
  },
];

export default eslintConfig;
