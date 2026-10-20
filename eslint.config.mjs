import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The design supplies explicit width/height/loading on every image, and
      // most of its imagery is a CSS background that next/image cannot serve.
      "@next/next/no-img-element": "off",
      // App Router: a <link> in app/layout.tsx head does apply site-wide.
      // This rule only makes sense for the Pages Router.
      "@next/next/no-page-custom-font": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
