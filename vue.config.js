const theme = require("./theme.js");

module.exports = {
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
