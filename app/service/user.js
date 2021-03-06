'use strict';

const Service = require('./base_service');
const moment = require('moment');
const md5 = require('../utils/md5');
const { tokenValidTime, CODE } = require('../constants/constants');
const ApplicationError = require('../error/application_error');

class UserService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_user';
  }

  async checkPwd(user_name, password) {
    const user = await this.get({ user_name }, [ 'user_name' ]);
    if (!user || user.password !== md5.hex_md5(password)) throw new Error('密码错误');
    return user;
  }

  async checkUserName(user_name) {
    const user = await this.get({ user_name }, [ 'user_name' ]);
    if (user) throw new Error('用户名已存在');
    return true;
  }

  async registerByUserName(user_name, password) {
    if (await this.checkUserName(user_name)) {
      const user_id = await this.getId();
      await this.insert({ id: user_id, user_name, password: md5.hex_md5(password), add_time: this.app.mysql.literals.now, update_time: this.app.mysql.literals.now });
    }
    return true;
  }

  async createJwt(user_id) {
    const { user_name, role_code, role_name } = await this.get({ id: user_id });
    const token = this.app.jwt.sign({ id: user_id, user_name, role_code, role_name }, this.app.config.jwt.secret, { expiresIn: tokenValidTime });
    this.saveLoginUser(token);
    return token;
  }

  async saveLoginUser(token) {
    await this.app.redis.sadd('userInfoToken', token);
  }

  async delLoginUser(token) {
    await this.app.redis.srem('userInfoToken', token);
  }

  // 检查Redis中的token是否过期
  async checkAuthValid(token, expTime) {
    if (expTime < Math.round(new Date() / 1000)) {
      await this.app.redis.srem('userInfoToken', token);
      return false;
    }
    return true;
  }

  // 检查用户主要信息是否改变
  async checkUserIsChange(user, token) {
    const queryUser = await this.get({ id: user.id });
    if (queryUser.role_code !== user.role_code) {
      await this.app.redis.srem('userInfoToken', token);
      throw new ApplicationError(CODE.UN_LOGIN, '请重新登录');
    }
    return true;
  }
}

module.exports = UserService;
