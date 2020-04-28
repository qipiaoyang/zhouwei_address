module.exports = class extends think.Model {
    async getName(option) {
        const data = await this.model("area").where(option).find();
        return data;
    }

};
