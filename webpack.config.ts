import { Configuration, EnvironmentPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config: Configuration = {
  entry: './client/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new EnvironmentPlugin(['DEFAULT_ERC20_ADDRESS', 'MULTICALL_ADDRESS'])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}

export default config
