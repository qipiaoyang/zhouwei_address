const Base = require('./base.js');
// const BaseRest = require('./rest.js');

module.exports = class extends Base {


  /**
   * @api {post} /admin/auth/login 管理后台登陆接口
   * @apiName 用户登陆
   * @apiGroup 用户模块
   *
   * @apiParam {String} mobile 用户手机号
   * @apiParam {String} password 用户密码
   *
   * @apiSuccess {String} token 用户token
   */
  async treeAction() {
    const area_list = await this.model("area").field("id,name as label,pid,sort").select();
    const result = arrayToTree(area_list, 0);

    return this.success(result);
  }



};
