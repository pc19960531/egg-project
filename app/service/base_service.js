'use strict';

const Service = require('egg').Service;
const tableMaps = require('../maps/maps');
const { PREFIXS } = require('../constants/constants');
const { filterParams } = require('../utils/query-strings');
const moment = require('moment');

class BaseService extends Service {
  /**
   * 新增单条数据，返回值为Boolen
   * @param {Object} data
   */
  async insert(data) {
    if (!data instanceof Object) {
      throw new Error(`${this.table} insert data is not Object`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const result = await this.app.mysql.insert(this.table, filterData);
    return result.affectedRows === 1;
  }

  /**
   * 新增多条数据,返回值为Boolen
   * @param {Array} data
   * 注意：会根据data[0]的数据结构新增数据，只会insert data[0]拥有的属性
   */
  async insertList(data) {
    if (!data instanceof Array) {
      throw new Error(`${this.table} insertList data is not List`);
    }
    const filterData = data.map(i => filterParams(tableMaps[this.table], i));
    const result = await this.app.mysql.insert(this.table, filterData);
    return result.affectedRows === data.length;
  }

  async delete(data, condition = [ 'id' ]) {
    if (!data instanceof Object || !condition instanceof Array) {
      throw new Error(`${this.table} delete data or condition dataType is Error`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const whereCondition = filterParams(condition, filterData);
    if (Object.keys(whereCondition).length === 0) {
      throw new Error(`${this.table} delete condition is error`);
    }
    const result = await this.app.mysql.delete(this.table, whereCondition);
    console.log('result:' + JSON.stringify(result));
    if (result.affectedRows === 0) {
      throw new Error('该条件下无数据');
    }
    return result.affectedRows !== 0;
  }

  /**
   * 修改单条数据,返回值为Boolen
   * @param {Object} data
   * @param {Array} condition
   */
  async update(data, condition = [ 'id' ]) {
    if (!data instanceof Object || !condition instanceof Array) {
      throw new Error(`${this.table} update data or condition dataType is Error`);
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
    if (result.affectedRows !== 1) {
      throw new Error('更新出错！');
    }
    return result.affectedRows === 1;
  }

  /**
   * 批量修改同一条件下的数据，返回值为Boolen
   * @param {Array} data
   * @param {Array} condition
   */
  async updateList(data, condition = [ 'id' ]) {
    if (!data instanceof Array || !condition instanceof Array) {
      throw new Error(`${this.table} updateList data or condition dataType is Error`);
    }
    const options = [];
    for (const _ in data) {
      const filterData = filterParams(tableMaps[this.table], data[_]);
      const whereCondition = filterParams(condition, filterData);
      if (Object.keys(whereCondition).length === 0) {
        throw new Error(`${this.table} updateList condition is error`);
      }
      options.push({
        row: filterData,
        where: whereCondition,
      });
    }
    const result = await this.app.mysql.updateRows(this.table, options);
    return result.affectedRows === data.length;
  }

  /**
   * 根据条件查询列表数据,返回值为Array
   * @param {Object} data
   * @param {Array} condition
   */
  async selectList(data, condition = [ 'id' ]) {
    if ((data && !data instanceof Object) || (condition && !condition instanceof Array)) {
      throw new Error(`${this.table} selectList data or condition dataType is Error`);
    }
    let result = [];
    if (!condition && !data) {
      result = await this.app.mysql.select(this.table);
    } else {
      const filterData = filterParams(tableMaps[this.table], data);
      const whereCondition = filterParams(condition, filterData);
      if (Object.keys(whereCondition).length === 0) {
        throw new Error(`${this.table} select condition is error`);
      }
      result = await this.app.mysql.select(this.table, { where: whereCondition });
    }
    return result || [];
  }
  /**
   * 根据条件查询单条数据，返回值为Object
   * @param {Object} data
   * @param {Array} condition
   */
  async get(data, condition = [ 'id' ]) {
    if ((data && !data instanceof Object) || (condition && !condition instanceof Array)) {
      throw new Error(`${this.table} get data or condition dataType is Error`);
    }
    const filterData = filterParams(tableMaps[this.table], data);
    const whereCondition = filterParams(condition, filterData);
    if (Object.keys(whereCondition).length === 0) {
      throw new Error(`${this.table} get condition is error`);
    }
    const result = await this.app.mysql.get(this.table, whereCondition);
    return result || '';
  }

  /**
   * 通过Redis取序列,返回值为String
   */
  async getId() {
    const time_prefix = moment().format('YYYYMMDD');
    const _prefix = await this.app.redis.incr(`${this.table}_prefix`);
    const str = PREFIXS[this.table] + time_prefix + '000000'.slice(_prefix.toString().length) + _prefix;
    return str;
  }

  /**
   * 根据条件查询数量，返回值为Number
   * @param {Object} data
   * @param {Array} condition
   */
  async count(data, condition) {
    if ((data && !data instanceof Object) || (condition && !condition instanceof Array)) {
      throw new Error(`${this.table} count data or condition dataType is Error`);
    }
    let result = 0;
    if (!condition && !data) {
      result = await this.app.mysql.count(this.table);
    } else {
      if (!condition || !data) {
        throw new Error(`${this.table} count data or condition data is Miss`);
      }
      const filterData = filterParams(tableMaps[this.table], data);
      const whereCondition = filterParams(condition, filterData);
      if (Object.keys(whereCondition).length === 0) {
        throw new Error(`${this.table} get condition is error`);
      }
      result = await this.app.mysql.count(this.table, whereCondition);
    }
    return result || 0;
  }

  /**
   * 自定义查询语句
   * @param {String} sql
   */
  async querySql(sql) {
    if (!sql) {
      return '';
    }
    return await this.app.mysql.query(sql);
  }

}

module.exports = BaseService;
