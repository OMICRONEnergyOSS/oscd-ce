import nodeResolve from "@rollup/plugin-node-resolve";
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import copy from "rollup-plugin-copy";
import { importMetaAssets } from "@web/rollup-plugin-import-meta-assets";
import { generateSW } from "rollup-plugin-workbox";
import path from "path";

import babel from "@rollup/plugin-babel";
import presetEnv from "@babel/preset-env";
import minifier from "babel-plugin-template-html-minifier";

export default [
  {
    input: "index.html",
    output: {
      entryFileNames: "[hash].js",
      chunkFileNames: "[hash].js",
      assetFileNames: "[hash][extname]",
      format: "es",
      dir: "dist",
    },
    preserveEntrySignatures: true,

    plugins: [
      copy({
        targets: [
          {
            src: ["favicon.ico", "fonts"],
            dest: "dist",
          },
        ],
      }),
      /** Enable using HTML as rollup entrypoint */
      html({
        minify: true,
        injectServiceWorker: true,
        serviceWorkerPath: "dist/sw.js",
      }),
      /** Resolve bare module imports */
      nodeResolve(),
      /** Bundle assets references via import.meta.url */
      importMetaAssets(),
      /** Compile JS to a lower language target */
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            presetEnv,
            {
              targets: [
                "last 3 Chrome major versions",
                "last 3 Firefox major versions",
                "last 3 Edge major versions",
                "last 3 Safari major versions",
              ],
              modules: false,
              bugfixes: true,
            },
          ],
        ],
        plugins: [
          [
            minifier,
            {
              modules: {
                lit: ["html", { name: "css", encapsulation: "style" }],
              },
              failOnError: false,
              strictCSS: false,
              htmlMinifier: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                caseSensitive: true,
                minifyCSS: true,
              },
            },
          ],
        ],
      }),
      /** Create and inject a service worker */
      generateSW({
        // where to output the generated sw
        swDest: path.join(".", "dist", "sw.js"),
        // directory to match patterns against to be precached
        globDirectory: "dist",
        // cache any html js and css by default
        globPatterns: [
          "index.*",
          "*.css",
          "**/*.{js,css,webmanifest,ico,woff,woff2}",
        ],
        skipWaiting: true,
        clientsClaim: true,
        // For reasons, which remain unexplained, the workbox plugin does not
        // automatically include the material symbols font, so we add it manually
        // to the precache manifest.
        additionalManifestEntries: [
          { url: "fonts/material-symbols-outlined.woff2", revision: null },
        ],
      }),
    ],
  },
];
