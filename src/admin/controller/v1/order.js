const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

  async getAction() {
    try {
      let data;
      let that = this;
      if (this.id) {
        data = await this.modelInstance.alias("c").field("c.*,p_address.name, p_address.mobile, p_address.mark, p_address.courier_num").join("p_address ON c.`order_id`=p_address.`id`").order(order).select();
        delete data.password;
        return this.success(data);
      }
      // 所有对象
      let order = this.get('order') || 'update_time ASC';
      let page = this.get('page');
      let order_id = this.get('order_id');
      let admin_id = this.get("admin_id");
      let start_time = this.get("start_time");
      let end_time = this.get("end_time");
      if (!page) {
        // 不传分页默认返回所有
        let where = {};
        if (think.isEmpty(order_id) && think.isEmpty(admin_id) && think.isEmpty(start_time) && think.isEmpty(end_time) ) {
          data = await this.modelInstance.alias("c").field("c.*,p_address.name, p_address.mobile, p_address.mark, p_address.courier_num").join("p_address ON c.`order_id`=p_address.`id`").order(order).select();
        } else {
          if (!think.isEmpty(order_id)) {
            where["c.order_id"] = order_id;
          }
          if (!think.isEmpty(admin_id)) {
            where["c.admin_id"] = admin_id;
          }
          if (!think.isEmpty(start_time) && !think.isEmpty(end_time)) {
            where["c.create_time"] = ['BETWEEN', start_time, end_time];
          }
          data = await this.modelInstance.alias("c").field("c.*,p_address.name, p_address.mobile, p_address.mark, p_address.courier_num").join("p_address ON c.`order_id`=p_address.`id`").order(order).select();

        }
        return this.success(data);
      } else {
        // 传了分页返回分页数据
        let pageSize = this.get('size') || 10;
        let where = {};
        if (think.isEmpty(order_id) && think.isEmpty(admin_id) && think.isEmpty(start_time) && think.isEmpty(end_time) ) {
          data = await this.modelInstance.alias("c").field("c.*,p_address.name, p_address.mobile, p_address.mark, p_address.courier_num").join("p_address ON c.`order_id`=p_address.`id`").page(page, pageSize).order(order).countSelect();
        } else {
          if (!think.isEmpty(order_id)) {
            where["c.order_id"] = order_id;
          }
          if (!think.isEmpty(admin_id)) {
            where["c.admin_id"] = admin_id;
          }
          if (!think.isEmpty(start_time) && !think.isEmpty(end_time)) {
            where["c.create_time"] = ['BETWEEN', start_time, end_time];
          }
          data = await this.modelInstance.alias("c").field("c.*,p_address.name, p_address.mobile, p_address.mark, p_address.courier_num").join("p_address ON c.`order_id`=p_address.`id`").where(where).page(page, pageSize).order(order).countSelect();

        }
        return this.success(data);
      }
    } catch (e) {
      think.logger.error(new Error(e));
      return this.fail(500, '接口异常！');
    }
  }

  async postAction() {
    let data = this.post(),
        insertId;
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    if (think.isEmpty(data.admin_id)) {
      return this.fail('请传入员工id');
    }
    if (think.isEmpty(data.order_ids)) {
      return this.fail('请传入订单');
    }

    think.logger.debug(typeof data.order_ids)
    try {
      await this.modelInstance.startTrans();
      let result = [],
          ids = [];
      data.order_ids.map((item) => {
        let obj = Object.assign({}, {
          admin_id: data.admin_id,
          order_id: item.id,
          mobile: item.mobile,
          create_time: getTime(),
          update_time: getTime(),
          status: 1,
        });
        result.push(obj);
        ids.push(item.id);
      })

      insertId = await this.modelInstance.addMany(result);
      // 更新order表
      // const addressModel = this.model("address");
      // const address_result = await addressModel.where({ id: ['IN', ids] }).update({
      //   status: 1
      // });
      // await addressModel.commit();
      await this.modelInstance.commit();

    } catch (e) {
      await this.modelInstance.rollback();
      think.logger.error(new Error(e));
      return this.fail(500, '接口异常！');
    }


    return this.success({id: 123});

  }

  async putAction() {
    try {
      if (!this.id) {
        return this.fail('params error');
      }
      const pk = this.modelInstance.pk;
      const data = this.post();
      data[pk] = this.id;
      if (think.isEmpty(data)) {
        return this.fail('data is empty');
      }
      data.update_time = getTime();
      const rows = await this.modelInstance.where({[pk]: this.id}).update(data);
      return this.success({affectedRows: rows});

    } catch (e) {
      think.logger.error(new Error(e));
      return this.fail(500, '接口异常！');
    }
  }

};
