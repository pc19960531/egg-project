'use strict';

const { Controller } = require('egg');
const ApplictionError = require('../error/application_error');
const { CODE } = require('../constants/constants');

class BaseController extends Controller {

  success(data) {
    this.ctx.body = {
      result: 'ok',
      message: '成功',
      code: '200',
      data,
    };
  }

  error({ message, code }) {
    let returnBody = {
      result: 'fail',
      code: '201',
      message,
    };
    if (code === 202) {
      returnBody = { ...returnBody, code: '202', message: message || '未登录' };
    }
    if (code === 403) {
      returnBody = { ...returnBody, code: '403', message: message || '无权限' };
    }
    this.ctx.body = returnBody;
  }

  async getJwtUser(token) {
    if (!token) {
      return null;
    }
    const user = this.app.jwt.verify(token, this.app.config.jwt.secret);
    if (user === null) {
      return null;
    }
    if (await this.service.user.checkAuthValid(token, user.exp) && await this.service.user.checkUserIsChange(user, token)) {
      return user;
    }
  }

  async checkLogin(ctx, ...roleList) {
    const user = await this.getJwtUser(this.getAuthorization(ctx));
    if (user === null) {
      throw new ApplictionError(CODE.UN_LOGIN);
    }
    const { role_code } = user;
    for (const key in roleList) {
      if (role_code === roleList[key].role_code) {
        return user;
      }
    }
    throw new ApplictionError(CODE.ERROR_AUTH);

  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  getAuthorization(ctx) {
    return ctx.request.header.authorization || '';
  }

  checkRequireRule(data, role) {
    // if (!Array.isArray(role))
    //   return true;
  }


}
module.exports = BaseController;
