'use strict';

const Service = require('./base_service');

class UserInfoService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_user_info';
    // sql.forEach(({ funcName, params }) => {
    //   this[funcName] = async (...p) => {
    //     return await this[`_${funcName}`].apply(this, p.slice(0, params.length));
    //   };
    // });
  }

  async getUserInfo(user_id) {
    // return await this.get({ user_id }, [ 'user_id', 'id' ]);
    return await this.get({ user_id }, [ 'user_id', 'id' ]);
  }
}

module.exports = UserInfoService;
