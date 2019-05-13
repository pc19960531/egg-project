## 快速开始

<!-- add docs here for user -->

使用前请先熟悉egg文档 [egg docs][egg]

### 详情介绍

本项目采用MVC开发模式，针对Service层进行了封装，具体扩展的时候相当方便，将面向对象的开发思想贯彻到底。
```javascript
最上层定义：
// app/service/base_service.js
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
}

使用：
// app/service/user.js
class UserService extends Service {
  constructor(props) {
    super(props);
    this.table = 'tb_user';
  }
}

module.exports = TestService;

```

使用时需要在在Map文件中定义ORM,用来过滤属性名
```javascript
'use strict';

// app/maps/maps.js
const tableMaps = {
  tb_user: [ 'id', 'user_name', 'password', 'phone_num', 'add_time', 'update_time', 'role_code' ],
  tb_user_info: [ 'id', 'user_id', 'name' ],
};

module.exports = tableMaps;


```


为了接口格式所以重写了一个Error类，只需要定义code值，即可在Controller层中捕获异常然后返回对应的异常message和code，方便前端做判断

```javascript
// app/error/appliction_error.js
'use strict';

class ApplicationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = ApplicationError;

// app/controller/base_controller.js
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

}
module.exports = BaseController;

```

目前还在改进并且准备接入MQ,RPC等框架，有问题欢迎一起讨论~~~

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 线上部署

```bash
$ npm start
$ npm stop
```

### 其他命令

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org