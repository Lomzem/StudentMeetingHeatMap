import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /* Don't want to go into Vercel limits for <Link> */
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    ignores: [".next/", "node_modules/"],
  },
];

export default eslintConfig;
