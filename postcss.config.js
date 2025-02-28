const autoprefixer = require('autoprefixer');                           // Подключение плагинов в файл
const cssnano = require('cssnano');

module.exports = {
  plugins: [                                                                // Подключение плагины к PostCSS
    autoprefixer,                                                           // Подключение autoprefixer
    // cssnano при подключении нужно передать объект опций
    // { preset: default } говорит о том, что нужно использовать
    // стандартные настройки минификации
    cssnano({ preset: 'default' })
  ]
};
