'use strict';

const Controller = require('./base_controller');
const moment = require('moment');

class UserController extends Controller {
  // async register(ctx) {
  //   try {
  //     this.success('123');
  //   } catch (e) {
  //     this.error(e.message);
  //   }
  // }

  // async updateUser(ctx) {
  //   try {
  //     const params = ctx.request.body;
  //     await this.service.user.updateUser(params.user_name, params.password);
  //   } catch (e) {
  //     this.error(e.message);
  //   }
  // }

  async login(ctx) {
    try {
      const params = ctx.request.body;
      const { id } = await this.service.user.checkPwd(params.user_name, params.password);
      const token = await this.service.user.createJwt(id);
      this.success({
        user_id: id,
        user_name: params.user_name,
        token,
      });
    } catch (e) {
      this.error(e.message);
    }
  }

  async register(ctx) {
    try {
      const params = ctx.request.body;
      if (await this.service.user.registerByUserName(params.user_name, params.password)) {
        this.success('注册成功');
      }
      this.error('注册失败');
    } catch (e) {
      this.error(e.message);
    }
  }

  async checkToken(ctx) {
    try {
      const token = ctx.request.header.authorization;
      const tokenInfo = this.transformToken(token);
      if (tokenInfo && this.service.user.checkAuthValid(token, tokenInfo.exp)) {
        this.success({ username: tokenInfo.username });
      } else {
        throw new Error('请重新登录');
      }
    } catch (err) {
      if (err.message === '请重新登录') {
        this.error(err.message);
      } else {
        this.error('token非法');
      }
    }
  }
}

module.exports = UserController;
