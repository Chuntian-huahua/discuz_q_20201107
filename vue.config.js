const theme = require("./theme.js");

module.exports = {
  productionSourceMap:false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: theme,
          javascriptEnabled: true,
        },
      },
    },
  },
};
