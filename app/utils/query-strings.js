'use strict';

const excludeArgumentValue = new Set([ null, 0, '0', undefined, '', '全部' ]);

// const toQueryString = (keys, paramObject, ary) => keys
//   .filter(key => !(ary || excludeArgumentValue).has(paramObject[key]))
//   .map(key => `${key}=${getRawValue(paramObject[key])}`)
//   .join('&');

const filterParams = (keys, paramObject, ary) => keys
  .filter(key => !(ary || excludeArgumentValue).has(paramObject[key]))
  .reduce((p, v) => ({ ...p, [v]: paramObject[v] }), {});

module.exports = {
  filterParams,
};
