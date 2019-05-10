'use strict';

const Controller = require('./base_controller');
const moment = require('moment');
const { ROLE } = require('../constants/constants');

class UserController extends Controller {

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
      this.error(e);
    }
  }

  async loginOut(ctx) {
    try {
      const token = this.getAuthorization(ctx);
      await this.service.user.delLoginUser(token);
      this.success('退出成功');
    } catch (e) {
      this.error(e);
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
      this.error(e);
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

  async addAccount(ctx) {
    try {
      const params = ctx.request.body;
      const JwtUser = await this.checkLogin(ctx, ROLE.SUPER_MANAGE, ROLE.COMMON_MANAGE);
      await this.service.user.registerByUserName(params.user_name, params.password);
      this.success('新增成功');
    } catch (err) {
      this.error(err);
    }
  }

  async getUser(ctx) {
    try {
      const JwtUser = await this.checkLogin(ctx, ROLE.SUPER_MANAGE, ROLE.COMMON_MANAGE);
      const { id, user_name, role_code, role_name } = JwtUser;
      this.success({
        id,
        user_name,
        permissions: {
          role: role_name,
          visit: [ 1, 2 ].map(_ => _.toString()),
        },
      });
    } catch (err) {
      this.error(err);
    }
  }


}

module.exports = UserController;
