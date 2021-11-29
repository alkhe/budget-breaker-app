import { Configuration, EnvironmentPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config: Configuration = {
  entry: './client/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new EnvironmentPlugin(['CONTROLLER_ADDRESS', 'DEFAULT_ERC20_ADDRESS', 'MULTICALL_ADDRESS'])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}

export default config
