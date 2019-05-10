'use strict';

const Service = require('./base_service');

class RoutesAuthService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_routes_auth';
  }
}

module.exports = RoutesAuthService;
