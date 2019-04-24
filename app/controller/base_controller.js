'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {

  success(data) {
    this.ctx.body = {
      result: 'ok',
      message: '成功',
      code: '200',
      data,
    };
  }

  error(msg) {
    this.ctx.body = {
      result: 'fail',
      message: msg,
      code: '201',
      data: {},
    };
  }

  authError(msg) {
    this.ctx.body = {
      result: 'fail',
      message: msg,
      code: '403',
      data: {},
    };
  }

  async transformToken(token) {
    const user = this.app.jwt.verify(token, this.app.config.jwt.secret);
    if (user.exp < Math.round(new Date() / 1000)) {
      await this.app.redis.srem('userInfoToken', token);
      throw new Error('token过期');
    }
    return user;
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
