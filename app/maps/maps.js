'use strict';

const tableMaps = {
  tb_user: [ 'id', 'user_name', 'password', 'phone_num', 'add_time', 'update_time', 'role_code' ],
  tb_user_info: [ 'id', 'user_id', 'name' ],
  tb_routes: [ 'id', 'name', 'route', 'breadcrumbParentId', 'menuParentId' ],
  tb_routes_auth: [ 'id', 'role_code', 'role_name', 'route_ids' ],
};

module.exports = tableMaps;

