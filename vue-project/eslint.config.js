import { fileURLToPath } from "node:url";
import path from "node:path";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser"; // 👈 нужен отдельный импорт парсера Vue
import tsParser from "@typescript-eslint/parser"; // 👈 для <script lang="ts">

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // JS правила
  pluginJs.configs.recommended,

  // TS правила
  ...tseslint.configs.recommended,

  // Vue правила
  ...pluginVue.configs["flat/recommended"],

  // Настройки для Vue файлов
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser, // 👈 используем vue-eslint-parser
      parserOptions: {
        parser: tsParser, // 👈 внутри <script> использовать TS-парсер
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  },
];
