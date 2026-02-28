import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: { js },
    extends: ["js/recommended"]
  }
]);