const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

  async getAction() {
    try {
      let data;
      let that = this;
      if (this.id) {
        data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").where({"c.id": this.id}).join("p_dept ON c.`dept_id`=p_dept.`id`").find();
        delete data.password;
        return this.success(data);
      }
      // 所有对象
      let order = this.get('order') || 'update_time ASC';
      let page = this.get('page');
      let name = this.get('name') || '';
      let mobile = this.get('mobile') || '';
      let dept_id = this.get("dept_id");
      let start_time = this.get("start_time");
      let end_time = this.get("end_time");
      if (!page) {
        // 不传分页默认返回所有
        let where = {};
        if (think.isEmpty(name) && think.isEmpty(mobile) && think.isEmpty(dept_id) && think.isEmpty(start_time) && think.isEmpty(end_time) ) {
          data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").join("p_dept ON c.`dept_id`=p_dept.`id`").order(order).select();
        } else {
          if (!think.isEmpty(name)) {
            where["c.name"] = ['like', `%${name}%`];
          }
          if (!think.isEmpty(mobile)) {
            where["c.mobile"] = ['like', `%${mobile}%`];
          }
          if (!think.isEmpty(dept_id)) {
            where["c.dept_id"] = dept_id;
          }
          if (!think.isEmpty(start_time) && !think.isEmpty(end_time)) {
            where["c.create_time"] = ['BETWEEN', start_time, end_time];
          }
          data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").where(where).join("p_dept ON c.`dept_id`=p_dept.`id`").order(order).select();

        }
        for (const val of data.data) {
          val.province_num = val.province;
          val.city_num = val.city;
          val.county_num = val.county;
          val.town_num = val.town;
          val.province = await this.model('area').where({id: val.province}).getField('name', true);
          val.city = await this.model('area').where({id: val.city}).getField('name', true);
          val.county = await this.model('area').where({id: val.county}).getField('name', true);
          val.town = await this.model('area').where({id: val.town}).getField('name', true);
        }
        return this.success(data);
      } else {
        // 传了分页返回分页数据
        let pageSize = this.get('size') || 10;
        let where = {};
        if (think.isEmpty(name) && think.isEmpty(mobile) && think.isEmpty(dept_id) && think.isEmpty(start_time) && think.isEmpty(end_time) ) {

          data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").join("p_dept ON c.`dept_id`=p_dept.`id`").page(page, pageSize).order(order).countSelect();

        } else {
          if (!think.isEmpty(name)) {
            where["c.name"] = ['like', `%${name}%`];
          }
          if (!think.isEmpty(mobile)) {
            where["c.mobile"] = ['like', `%${mobile}%`];
          }
          if (!think.isEmpty(dept_id)) {
            where["c.dept_id"] = dept_id;
          }
          if (!think.isEmpty(start_time) && !think.isEmpty(end_time)) {
            where["c.create_time"] = ['BETWEEN', start_time, end_time];
          }
          console.log(where,"123123")
          data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").join("p_dept ON c.`dept_id`=p_dept.`id`").where(where).page(page, pageSize).order(order).countSelect();

        }
        for (const val of data.data) {
          val.province_num = val.province;
          val.city_num = val.city;
          val.county_num = val.county;
          val.town_num = val.town;
          val.province = await this.model('area').where({id: val.province}).getField('name', true);
          val.city = await this.model('area').where({id: val.city}).getField('name', true);
          val.county = await this.model('area').where({id: val.county}).getField('name', true);
          val.town = await this.model('area').where({id: val.town}).getField('name', true);
        }

        return this.success(data);
      }
    } catch (e) {
      think.logger.error(new Error(e));
      return this.fail(500, '接口异常！');
    }
  }

  async postAction() {
    try {
      let data = this.post();
      if (think.isEmpty(data)) {
        return this.fail('data is empty');
      }
      if (think.isEmpty(data.mobile)) {
        return this.fail('请传入手机号');
      }
      if (think.isEmpty(data.admin_id)) {
        return this.fail('请传入员工id');
      }
      if (think.isEmpty(data.address)) {
        return this.fail('请传入客户地址');
      }
      if (think.isEmpty(data.address_desc)) {
        return this.fail('请传入客户详细地址');
      }
      let result = Object.assign({}, {
        admin_id: data.admin_id,
        dept_id: data.dept_id,
        name: data.name,
        mobile: data.mobile,
        province: data.address[0],
        town: data.town,
        city: data.address[1],
        county: data.address[2],
        addr: data.address_desc,
        create_time: getTime(),
        update_time: getTime(),
        status: 1
      });

      const insertId = await this.modelInstance.add(result);
      return this.success({id: insertId});
    } catch (e) {
      think.logger.error(new Error(e));
      return this.fail(500, '接口异常！');
    }

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
