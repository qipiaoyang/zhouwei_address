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
            if (!page) {
                // 不传分页默认返回所有
                if(think.isEmpty(name)) {
                    data = await this.modelInstance.order(order).select();
                } else {
                    data = await this.modelInstance.where({
                        name: ['like', `%${name}%`]
                    }).order(order).select();
                }
                return this.success(data);
            } else {
                // 传了分页返回分页数据
                let pageSize = this.get('size') || 10;
                if(think.isEmpty(name)) {
                    data = await this.modelInstance.page(page, pageSize).order(order).countSelect();

                } else {
                    data = await this.modelInstance.where({
                        name: ['like', `%${name}%`]
                    }).page(page, pageSize).order(order).countSelect();

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
            if (think.isEmpty(data.name)) {
                return this.fail("请传入name");
            }
            data.pid = 1;
            if (data.name) {
                const hasUser = await this.modelInstance.where({name: data.name}).find();
                if (!think.isEmpty(hasUser)) {
                    return this.fail("该部门已存在～");
                }
            }
            data.create_time = getTime();
            data.update_time = getTime();
            data.sort = data.sort ? data.sort : 0;
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
