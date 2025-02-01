import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,     // Add Node.js globals
        ...globals.commonjs  // Add CommonJS globals
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-useless-catch': 'warn'  // Downgrade to warning or remove if you want to disable
    }
  }
];