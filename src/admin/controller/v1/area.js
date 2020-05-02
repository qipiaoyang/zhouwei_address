const Base = require('./base.js');
// const BaseRest = require('./rest.js');

module.exports = class extends Base {


  async treeAction() {
    const area_list = await this.model("area").field("id,name as label,pid,sort").where({
      type: ["in", [1, 2,3]]
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
    if(think.isEmpty(type)) {
      return this.fail("请传入有效的type");
    }
    where.type = type;
    if(think.isEmpty(pid)) {
      return this.fail("请传入有效的pid");
    }
    where.pid = pid;
    const area_list = await this.model("area").field("id,name as label,pid,sort").where(where).select();
    return this.success(area_list);

  }


  async provinceAction() {
    const data = province.map((item,index) => {
      let obj = Object.assign({ pid: 0, type: 1 }, {
        id: item.id,
        name: item.name,
        sort: index + 1
      });
      return obj
    })
    const result = await this.model("area").addMany(data);
    return this.success(result)
  }

  async cityAction() {
    let data = []
    Object.keys(city).map((item) => {
      city[item].map((itemChild,indexChild) => {
        const obj = Object.assign({ type: 2 }, {
          id: itemChild.id,
          pid: item,
          name: itemChild.name,
          sort: indexChild + 1
        });
        data.push(obj);
        return itemChild
      })
      return item
    })

    const result = await this.model("area").addMany(data);
    return this.success(result)
  }

  async countyAction() {
    let data = []
    Object.keys(county).map((item) => {
      county[item].map((itemChild,indexChild) => {
        const obj = Object.assign({ type: 3 }, {
          id: itemChild.id,
          pid: item,
          name: itemChild.name,
          sort: indexChild + 1
        });
        data.push(obj);
        return itemChild
      })
      return item
    })

    const result = await this.model("area").addMany(data);
    return this.success(result)
  }

  async townAction() {
    let data = []
    Object.keys(town).map((item) => {
      town[item].map((itemChild,indexChild) => {
        const obj = Object.assign({ type: 4 }, {
          id: itemChild.id,
          pid: item,
          name: itemChild.name,
          sort: indexChild + 1
        });
        data.push(obj);
        return itemChild
      })
      return item
    })
    const result = await this.model("area").addMany(data);
    return this.success(result)
  }

};
