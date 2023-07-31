import * as HtmlWebpackPlugin from "html-webpack-plugin"
import * as webpack from "webpack"
import {merge} from "webpack-merge"

import common from "./config.common"

const lastUpdated = Date.now()

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{loader: "style-loader"}, {loader: "css-loader"}],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        LAST_UPDATED: lastUpdated,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: false,
      templateParameters: {
        production: false,
        lastUpdated,
      },
    }),
  ],
})
