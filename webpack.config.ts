/*
 * Copyright (c) 2017-2019 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import * as path from "path"
import {
  Configuration,
  NoEmitOnErrorsPlugin,
  ProvidePlugin
} from "webpack"

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

/**
 * Webpack configuration
 *
 * @param env - Webpack environment arguments
 * @param args - Command-line arguments
 *
 * @return Webpack configuration
 */
export default (_env: never, args: Configuration) => {
  const config: Configuration = {
    mode: args.mode,

    /* Entrypoint */
    entry: ["src/adapter"],

    /* Loaders */
    module: {
      rules: [

        /* TypeScript */
        {
          test: /\.ts$/,
          use: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  declaration: true,
                  noUnusedLocals: args.mode === "production",
                  noUnusedParameters: args.mode === "production",
                  removeComments: false,
                  target: "es2015"     /* Use ES modules for tree-shaking */
                }
              }
            }
          ],
          exclude: /\/node_modules\//
        }
      ]
    },

    /* Export class constructor as entrypoint */
    output: {
      path: path.resolve(__dirname, "dist/adapter"),
      pathinfo: false,
      filename: "index.js",
      libraryTarget: "window"
    },

    /* Plugins */
    plugins: [

      /* Don't emit assets if there were errors */
      new NoEmitOnErrorsPlugin(),

      /* Polyfills */
      new ProvidePlugin({
        Promise: "es6-promise"
      })
    ],

    /* Module resolver */
    resolve: {
      modules: [
        __dirname,
        path.resolve(__dirname, "node_modules")
      ],
      extensions: [".ts", ".js", ".json"]
    },

    /* Sourcemaps */
    devtool: "source-map"
  }

  /* We're good to go */
  return config
}
