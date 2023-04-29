const { resolve } = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  localePath: resolve('apps/front/public/locales')
};
