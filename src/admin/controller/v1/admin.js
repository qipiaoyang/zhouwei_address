const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

    async getAction() {
        try {
            let data;
            if (this.id) {
                const pk = this.modelInstance.pk;
                data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").where({[`c.${pk}`]: this.id}).join("p_dept ON c.`dept_id`=p_dept.`id`").find();
                delete data.password;
                return this.success(data);
            }
            // 所有对象
            let order = this.get('order') || 'update_time ASC';
            let page = this.get('page');
            let dept_id = this.get('dept_id');
            let name = this.get('name') || "";
            if (!page) {
                // 不传分页默认返回所有
                if(think.isEmpty(name) && think.isEmpty(dept_id)) {
                    data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").join("p_dept ON c.`dept_id`=p_dept.`id`").order(order).select();
                } else {
                    let where = {};
                    if(!think.isEmpty(name)) {
                        where['c.username'] = ['like', `%${name}%`];
                    }
                    if(!think.isEmpty(dept_id)) {
                        where['c.dept_id'] = dept_id;
                    }
                    data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").where(where).join("p_dept ON c.`dept_id`=p_dept.`id`").order(order).select();
                }
                return this.success(data);
            } else {
                // 传了分页返回分页数据
                let pageSize = this.get('size') || 10;
                if(think.isEmpty(name)) {
                    data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").page(page, pageSize).order(order).join("p_dept ON c.`dept_id`=p_dept.`id`").countSelect();

                } else {
                    data = await this.modelInstance.alias("c").field("c.*,p_dept.name as dept_name").where({
                        'c.username': ['like', `%${name}%`]
                    }).join("p_dept ON c.`dept_id`=p_dept.`id`").page(page, pageSize).order(order).countSelect();

                }
                return this.success(data);
            }
        } catch (e) {
            think.logger.error(new Error(e));
            return this.fail(500, "接口异常！");
        }
    }

    async postAction() {
        try {
            let data = this.post();
            if (think.isEmpty(data)) {
                return this.fail('data is empty');
            }
            if (think.isEmpty(data.mobile)) {
                return this.fail("请传入手机号");
            }
            if (think.isEmpty(data.password)) {
                return this.fail("请传入密码");
            }
            if (think.isEmpty(data.dept_id)) {
                return this.fail("请传入小组名称");
            }
            if (data.password) {
                data.password = encryptPassword(data.password);
                const hasUser = await this.modelInstance.where({mobile: data.mobile}).find();
                if (!think.isEmpty(hasUser)) {
                    return this.fail("该用户已存在～");
                }
            }
            data.create_time = getTime();
            data.update_time = getTime();
            const insertId = await this.modelInstance.add(data);
            return this.success({id: insertId});
        } catch (e) {
            think.logger.error(new Error(e));
            return this.fail(500, "接口异常！");
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
            if (!think.isEmpty(data.mobile)) {
                const hasUser = await this.modelInstance.where({mobile: data.mobile, id: ['!=', this.id]}).find();
                if (!think.isEmpty(hasUser)) {
                    return this.fail("该手机号已存在～")
                }
            }

            data.password = encryptPassword(data.password);
            data.update_time = getTime();
            const rows = await this.modelInstance.where({[pk]: this.id}).update(data);
            return this.success({affectedRows: rows});

        } catch (e) {
            think.logger.error(new Error(e));
            return this.fail(500, "接口异常！");
        }
    }


};
