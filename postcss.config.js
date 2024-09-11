const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      // Другие плагины
    ],
  });