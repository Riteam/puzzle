module.exports = {
  publicPath: '/games/puzzle/',

  // eslint-disable-next-line no-unused-vars
  chainWebpack: config => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = '成语字谜 Vue3';
        return args;
      })
  },
}