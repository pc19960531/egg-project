'use strict';
const { apiName } = require('../constants/constants');

module.exports = app => {
  app.router.get(`/${apiName}/routes/getAllRoutes`, app.controller.routes.getAllRoutes);
  app.router.get(`/${apiName}/routes/getAllAuth`, app.controller.routes.getAllAuth);
};
