// default config
module.exports = {
  // 可以公开访问的Controller
  publicController: [
    // 格式为controller

  ],

  // 可以公开访问的Action
  publicAction: [
    // 格式为： controller+action
    '/admin/v1/auth/login',
    '/admin/v1/auth/logout',
    '/admin/v1/area/tree',
    '/admin/v1/area/townList',
    '/admin/v1/area/province',
    '/admin/v1/area/city',
    '/admin/v1/area/county',
    '/admin/v1/area/town',
  ]
};
