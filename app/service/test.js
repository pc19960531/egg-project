'use strict';

const Service = require('./base_service');

class TestService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_user';
  }
}

module.exports = TestService;
