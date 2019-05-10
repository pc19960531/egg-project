'use strict';

module.exports = {
  // 数据库判断是否
  boolKey: {
    1: '是',
    0: '否',
  },
  // redis自动生成序列前缀
  PREFIXS: {
    tb_user: 'U',
  },
  // ['insert', 'insertList', 'delete', 'deleteList', 'update', 'updateList', 'get', 'selectList', 'getId'],
  tokenValidTime: 60 * 60 * 24 * 7, // token过期时间一周
  apiName: 'v1',
  ROLE: {
    SUPER_MANAGE: { role_code: '1', role_name: '超级管理员' },
    COMMON_MANAGE: { role_code: '2', role_name: '管理员' },
  },
  CODE: {
    UN_LOGIN: 202, // 未登录
    ERROR_AUTH: 403, // 无权限
  },
};
