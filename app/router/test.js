'use strict';
const { apiName } = require('../constants/constants');

module.exports = app => {
  app.router.get(`/${apiName}/test/get`, app.controller.test.get);
  app.router.get(`/${apiName}/test/select`, app.controller.test.select);
  app.router.get(`/${apiName}/test/querySql`, app.controller.test.querySql);
  app.router.post(`/${apiName}/test/insert`, app.controller.test.insert);
  app.router.post(`/${apiName}/test/insertList`, app.controller.test.insertList);
  app.router.post(`/${apiName}/test/delete`, app.controller.test.delete);
  app.router.post(`/${apiName}/test/update`, app.controller.test.update);
  app.router.post(`/${apiName}/test/updateList`, app.controller.test.updateList);
  app.router.get(`/${apiName}/test/count`, app.controller.test.count);


};
