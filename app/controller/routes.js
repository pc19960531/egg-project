'use strict';

const Controller = require('./base_controller');
const moment = require('moment');
const { ROLE } = require('../constants/constants');

class RoutesController extends Controller {
  async getAllRoutes(ctx) {
    try {
      const JwtUser = await this.checkLogin(ctx, ROLE.SUPER_MANAGE, ROLE.COMMON_MANAGE);
      const routes = await this.service.routes.queryList();
      this.success(routes.map(_ => ({ ..._, id: _.id.toString() })));
    } catch (err) {
      this.error(err);
    }
  }

  async getAllAuth(ctx) {
    try {
      const JwtUser = await this.checkLogin(ctx, ROLE.SUPER_MANAGE, ROLE.COMMON_MANAGE);
      const routes = await this.service.routesAuth.queryList();
      this.success(routes);
    } catch (err) {
      this.error(err);
    }
  }
}

module.exports = RoutesController;
