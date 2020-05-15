// default config
const isDev = think.env === 'development';
module.exports = {
  workers: 1,
  port: isDev ? 8360 : 8361
};
