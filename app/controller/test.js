

'use strict';

const Controller = require('./base_controller');
const { checkParams, checkArrayParams } = require('../utils/rules');
const { concatSql } = require('../utils/query-strings');
class TestController extends Controller {

  async get(ctx) {
    try {
      const query = ctx.query;
      const queryForm = [
        { k: 'id', r: 'REQUIRE' },
        { k: 'user_name' },
      ];
      const _param = checkParams(query, queryForm);
      const result = await this.service.test.get(_param, queryForm.reduce((s, r) => s.concat(r.k), []));
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async select(ctx) {
    try {
      const query = ctx.query;
      const queryForm = [
        { k: 'password' },
      ];
      const _param = checkParams(query, queryForm);
      const result = await this.service.test.selectList(_param, queryForm.reduce((s, r) => s.concat(r.k), []));
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async querySql(ctx) {
    try {
      const query = ctx.query;
      const queryForm = [
        { k: 'user_name' },
        { k: 'phone_num' },
      ];
      const _param = checkParams(query, queryForm);
      console.log('concatSql(_param):' + concatSql(_param));
      // 当参数长度太长或者为以下时会报错
      // const result = await this.service.test.querySql('SELECT * FROM tb_user WHERE user_name = 123 AND phone_num = 111 ');
      const result = await this.service.test.querySql(`SELECT * FROM tb_user ${concatSql(_param)}`);
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async insert(ctx) {
    try {
      const body = ctx.request.body;
      const addForm = [
        { k: 'user_name', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      const _param = checkParams(body, addForm);
      const prefix = await this.service.test.getId();
      const result = await this.service.test.insert({ ..._param, id: prefix });
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async insertList(ctx) {
    try {
      const params = ctx.request.body;
      const { list } = params;
      const addForm = [
        { k: 'id', r: 'REQUIRE' },
        { k: 'user_name', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      const _param = checkArrayParams(list, addForm);
      const result = await this.service.test.insertList(_param);
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async delete(ctx) {
    try {
      const body = ctx.request.body;
      const deleteForm = [
        { k: 'id', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      const _param = checkParams(body, deleteForm);
      const result = await this.service.test.delete(_param, deleteForm.reduce((s, r) => s.concat(r.k), []));
      if (result) {
        this.success('成功');
      } else {
        this.error('失败');
      }
    } catch (err) {
      this.error(err);
    }
  }

  async update(ctx) {
    try {
      const params = ctx.request.body;
      const updateForm = [
        { k: 'id', r: 'REQUIRE' },
        { k: 'user_name', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      const _param = checkParams(params, updateForm);
      const result = await this.service.test.update(_param);
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async updateList(ctx) {
    try {
      const params = ctx.request.body;
      const { list } = params;
      const addForm = [
        { k: 'id', r: 'REQUIRE' },
        { k: 'user_name', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      const _param = checkArrayParams(list, addForm);
      const result = await this.service.test.updateList(_param);
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }

  async count(ctx) {
    try {
      const query = ctx.query;
      const countForm = [
        // { k: 'id', r: 'REQUIRE' },
        { k: 'user_name', r: 'REQUIRE' },
        { k: 'phone_num' },
      ];
      console.log('query:' + JSON.stringify(query));
      const _param = checkParams(query, countForm);
      const result = await this.service.test.count(_param, countForm.reduce((s, r) => s.concat(r.k), []));
      this.success(result);
    } catch (err) {
      this.error(err);
    }
  }


}

module.exports = TestController;
