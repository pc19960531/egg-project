'use strict';

module.exports = {
  // 数据库判断是否
  boolKey: {
    1: '是',
    0: '否',
  },
  // redis自动生成序列前缀
  prefixs: {
    tb_user: 'U',
  },
  // ['insert', 'insertList', 'delete', 'deleteList', 'update', 'updateList', 'get', 'selectList', 'getId'],
  tokenValidTime: 60 * 60 * 24 * 7, // token过期时间一周
  apiName: 'v1',

};
