'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');

  require('./router/user')(app);
  require('./router/test')(app);
};
