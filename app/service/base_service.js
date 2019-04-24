'use strict';

const Service = require('egg').Service;
const tableMaps = require('../maps/maps');
const { prefixs } = require('../constants/constants');
const { filterParams } = require('../utils/query-strings');
const moment = require('moment');

class BaseService extends Service {
  async insert(data) {
    if (!data instanceof Object) {
      throw new Error(`${this.table} insert data is not Object`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const result = await this.app.mysql.insert(this.table, filterData);
    return result.affectedRows === 1;
  }

  async insertList(data) {
    if (!data instanceof Array) {
      throw new Error(`${this.table} insertList data is not List`);
    }
    const filterData = data.map(i => filterParams(tableMaps[this.table], i));
    const result = await this.app.mysql.insert(this.table, filterData);
    return result.affectedRows === data.length;
  }

  async delete() {
    return;
  }

  async deleteSelect() {
    return;
  }

  async update(data, condition = [ 'id' ]) {
    if (!data instanceof Object) {
      throw new Error(`${this.table} update data is not Object`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const whereCondition = filterParams(condition, filterData);
    if (Object.keys(whereCondition).length === 0) {
      throw new Error(`${this.table} update condition is error`);
    }
    const result = await this.app.mysql.update(this.table, filterData, {
      where: whereCondition,
      columns: Object.keys(filterData).filter(i => !condition.includes(i)),
    });
    return result.affectedRows === 1;
  }

  async updateSelect(data, condition = [ 'id' ]) {
    if (!data instanceof Object) {
      throw new Error(`${this.table} update data is not Object`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const whereCondition = filterParams(condition, filterData);
    if (Object.keys(whereCondition).length === 0) {
      throw new Error(`${this.table} update condition is error`);
    }
    const result = await this.app.mysql.update(this.table, filterData, {
      where: whereCondition,
      columns: Object.keys(filterData).filter(i => !condition.includes(i)),
    });
    return result.affectedRows === 1;
  }

  async selectList() {
    return;
  }

  async get(data, condition = [ 'id' ]) {
    const filterData = filterParams(tableMaps[this.table], data);
    const whereCondition = filterParams(condition, filterData);
    if (Object.keys(whereCondition).length === 0) {
      throw new Error(`${this.table} get condition is error`);
    }
    const result = await this.app.mysql.get(this.table, whereCondition);
    return result || '';
  }

  async getId() {
    const time_prefix = moment().format('YYYYMMDD');
    const _prefix = await this.app.redis.incr(`${this.table}_prefix`);
    const str = prefixs[this.table] + time_prefix + '000000'.slice(_prefix.toString().length) + _prefix;
    return str;
  }

}

module.exports = BaseService;
