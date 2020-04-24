const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

    async getAction() {
        try {
            let data;
            if (this.id) {
                const pk = this.modelInstance.pk;
                data = await this.modelInstance.where({[pk]: this.id}).find();
                delete data.password;
                return this.success(data);
            }
            // 所有对象
            let order = this.get('order') || 'update_time ASC';
            let page = this.get('page');
            let name = this.get('name') || "";
            let mobile = this.get('mobile') || "";
            if (!page) {
                // 不传分页默认返回所有
                let where = {};
                if(think.isEmpty(name) && think.isEmpty(mobile)) {
                    data = await this.modelInstance.order(order).select();
                } else {
                    if(!think.isEmpty(name)) {
                        where.name = ['like', `%${name}%`];
                    }
                    if(!think.isEmpty(mobile)) {
                        where.mobile = ['like', `%${mobile}%`];
                    }
                    data = await this.modelInstance.where(where).order(order).select();
                }
                return this.success(data);
            } else {
                // 传了分页返回分页数据
                let pageSize = this.get('size') || 10;
                let where = {};
                if(think.isEmpty(name)  && think.isEmpty(mobile)) {
                    data = await this.modelInstance.page(page, pageSize).order(order).countSelect();
                } else {
                    if(!think.isEmpty(name)) {
                        where.name = ['like', `%${name}%`];
                    }
                    if(!think.isEmpty(mobile)) {
                        where.mobile = ['like', `%${mobile}%`];
                    }
                    data = await this.modelInstance.where(where).page(page, pageSize).order(order).countSelect();

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
            if (think.isEmpty(data.admin_id)) {
                return this.fail("请传入员工id");
            }
            if (think.isEmpty(data.address)) {
                return this.fail("请传入客户地址");
            }
            if (think.isEmpty(data.address_desc)) {
                return this.fail("请传入客户详细地址");
            }
            let result = Object.assign({}, {
                admin_id: data.admin_id,
                name: data.name,
                mobile: data.mobile,
                province: data.address[0],
                city: data.address[1],
                county: data.address[2],
                addr: data.address_desc
            });

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
            data.update_time = getTime();
            const rows = await this.modelInstance.where({[pk]: this.id}).update(data);
            return this.success({affectedRows: rows});

        } catch (e) {
            think.logger.error(new Error(e));
            return this.fail(500, "接口异常！");
        }
    }


};