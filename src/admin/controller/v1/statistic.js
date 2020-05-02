const Base = require('./base.js');
// const BaseRest = require('./rest.js');

module.exports = class extends Base {


  async orderStatisticAction() {
    const start_time = this.post("start_time");
    const end_time = this.post("end_time");
    const data = await this.model("address").where({
      create_time: ['BETWEEN', start_time, end_time]
    }).count("id");
  }

};
