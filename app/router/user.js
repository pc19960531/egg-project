'use strict';
const { apiName } = require('../constants/constants');

module.exports = app => {
  app.router.post(`/${apiName}/user/login`, app.controller.user.login);
  app.router.post(`/${apiName}/user/register`, app.controller.user.register);
  // app.router.post(`/${apiName}/user/updateUser`, app.controller.user.updateUser);
  // app.router.get(`/${apiName}/user/getUser`, app.controller.user.getUser);
  // app.router.get(`/${apiName}/user/getUserInfo`, app.controller.user.getUserInfo);
};
