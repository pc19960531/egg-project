'use strict';

module.exports = () => {
  const config = exports = {};

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'pc',
      // 密码
      password: 'pengcheng1996',
      // 数据库名
      database: 'jsb',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {
    secret: 'user_center_prod_0531',
  };

  return config;
};
