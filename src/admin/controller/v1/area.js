const Base = require('./base.js');
// const BaseRest = require('./rest.js');

module.exports = class extends Base {
    async batchDeleteAction() {
        const data = this.post();
        if (think.isEmpty(data.ids)) {
            return this.fail("请输入id")
        }
        let arr = data.ids.split(",");
        let result = arr.map((item) => {
          let obj = Object.assign({}, {
            id: item,
            visible: 0
          });
          return obj
        })
        let affectedRows = await this.model("address").updateMany(result);
        return this.success(affectedRows)
    }


    async treeAction() {
        const area_list = await this.model("area").field("id,name as label,pid,sort").where({
            type: ["in", [1, 2, 3]]
        }).select();
        const result = arrayToTree(area_list, 0);
        return this.success(result);
    }


    async deptListAction() {
        const data = await this.model('dept').select();
        return this.success(data);
    }

    async townListAction() {
        const type = this.post("type");
        const pid = this.post("pid");
        let where = {};
        if (think.isEmpty(type)) {
            return this.fail("请传入有效的type");
        }
        where.type = type;
        if (think.isEmpty(pid)) {
            return this.fail("请传入有效的pid");
        }
        where.pid = pid;
        const area_list = await this.model("area").field("id,name as label,pid,sort").where(where).select();
        return this.success(area_list);

    }


    // async provinceAction() {
    //     const province = await this.model('province').select();
    //     const data = province.map((item) => {
    //         let obj = Object.assign({pid: 0, type: 1}, {
    //             id: item.province_id,
    //             name: item.name,
    //             sort: item.id
    //         });
    //         return obj
    //     })
    //     const result = await this.model("area").addMany(data);
    //     return this.success(result)
    // }

    async cityAction() {
        const city = await this.model('city').select();
        let data = []
       city.map((item) => {
           const obj = Object.assign({type: 2}, {
               id: item.city_id,
               pid: item.province_id,
               name: item.name,
               sort: item.id
           });
           data.push(obj);
            return item
        })

        const result = await this.model("area").addMany(data);
        return this.success(result)
    }

    async countyAction() {
        const county = await this.model('county').select();
        let data = []
        county.map((item) => {
            const obj = Object.assign({type: 3}, {
                id: item.county_id,
                pid: item.city_id,
                name: item.name,
                sort: item.id
            });
            data.push(obj);
            return item
        })

        const result = await this.model("area").addMany(data);
        return this.success(result)
    }

    async townAction() {
        const town = await this.model('town').select();
        let data = []
        town.map((item) => {
            const obj = Object.assign({type: 4}, {
                id: item.town_id,
                pid: item.county_id,
                name: item.name,
                sort: item.id
            });
            data.push(obj);
            return item
        })
        const result = await this.model("area").addMany(data);
        return this.success(result)
    }

};
