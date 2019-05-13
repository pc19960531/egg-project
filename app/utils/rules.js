'use strict';

const { filterParams } = require('./query-strings');

const isArray = data => {
  if (!data) {
    return false;
  }
  return Array.isArray(data);
};

const isObject = data => {
  if (!data) {
    return false;
  }
  return data instanceof Object;
};

const isNum = data => {
  if (!data) {
    return false;
  }
  return !Number.isNaN(data) && typeof data === 'number';
};

const isRequire = data => {
  return !!data;
};

const RULE_MAP = new Map([
  [ 'ARRAY', isArray ],
  [ 'NUM', isNum ],
  [ 'OBJECT', isObject ],
  [ 'REQUIRE', isRequire ],
]
);

/**
 *
 * @param {Object} params
 * @param {Array} condition [{k:'',r:''}]
 */
const checkParams = (params, condition) => {
  if (!isArray(condition)) {
    throw new Error('param_filter is Error');
  }
  const filterData = filterParams(condition.reduce((s, r) => s.concat(r.k), []), params);
  for (const _ in condition) {
    if (condition[_].r) {
      if (!RULE_MAP.get(condition[_].r).call(this, filterData[condition[_].k])) {
        throw new Error(`${condition[_].k} should be ${condition[_].r}`);
      }
    }
  }
  return filterData;
};

/**
 *
 * @param {Object} params
 * @param {Array} condition [{k:'',r:''}]
 */
const checkArrayParams = (arrayParams, condition) => {
  if (!isArray(condition) || !isArray(arrayParams)) {
    throw new Error('array_param_filter is Error');
  }
  const returnList = [];
  for (const _ in arrayParams) {
    returnList.push(checkParams(arrayParams[_], condition));
  }
  return returnList;
};


module.exports = {
  checkParams,
  checkArrayParams,
};
