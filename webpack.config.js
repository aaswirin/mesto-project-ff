const path = require('path');                    // Подключаем path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin');        // Плагин для HTML
const { CleanWebpackPlugin } = require('clean-webpack-plugin');  // Плагин для очистки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Плагин для объединения CSS

module.exports = {
  entry: { main: './src/scripts/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: ''
  },
  mode: 'development',                                           // Режим разработчика
  devtool: 'source-map',                                         // Что б исходники смотреть
  devServer: {
    static: path.resolve(__dirname, './dist'),                   // Путь, куда "смотрит" режим разработчика
    compress: true,                                              // Это ускорит загрузку в режиме разработки
    port: 8080,                                                  // Порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт
    open: true                                                   // Сайт будет открываться сам при запуске npm run dev
  },
  module: {
    rules: [                                                     // Rules — это массив правил
      {                                                          // Объект правил для бабеля
        test: /\.js$/,                                           // Регулярное выражение, которое ищет все js файлы
        use: 'babel-loader',                                     // При обработке этих файлов нужно использовать babel-loader
        exclude: /node_modules/,                                 // Исключает папку node_modules, файлы в ней обрабатывать не нужно
      },
      {                                                          // Объект правил для обработки файлов
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf|ico)$/,       // Регулярное выражение, которое ищет все файлы с такими расширениями
        type: 'asset/resource',
      },
      {
        test: /\.css$/,                                          // Применять это правило только к CSS-файлам
        use: [
          MiniCssExtractPlugin.loader, {                         // При обработке этих файлов нужно использовать MiniCssExtractPlugin.loader и css-loader
            loader: 'css-loader',
            options: { importLoaders: 1 },                       // Некоторые трансформации PostCSS нужно применить до css-loader.
          },
          'postcss-loader'                                       // Добавить postcss-loader
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'                                // Путь к файлу index.html
    }),
    new CleanWebpackPlugin(),                                     // Подключение плагина для очистки файлов
    new MiniCssExtractPlugin()                                    // Подключение плагина для объединения файлов
  ]
};
