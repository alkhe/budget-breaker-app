import config from './webpack.config'
import path from 'path'

export default {
  ...config,
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist/static'),
    filename: 'bundle.js'
  }
}
