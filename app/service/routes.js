'use strict';

const Service = require('./base_service');

class RoutesService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_routes';
  }
}

module.exports = RoutesService;
