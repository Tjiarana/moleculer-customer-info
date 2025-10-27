import { ServiceSchema } from "moleculer";
import DbService from "moleculer-db";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mydb", "root", "mysql", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const CustomerService: ServiceSchema = {
	name: "customerinfo",
	mixins: [DbService],
	actions: {
		getUser: {
			params: {
				custCode: { type: "string", empty: true },
			},
			async handler(ctx: any) {
				const tableName = this.name;
				let sql = `SELECT * FROM ${tableName}`;
				if (ctx.params.custCode != "") sql += ` WHERE`;
				if (ctx.params.custCode != "")
					sql += ` customerCode like '%${ctx.params.custCode}%'`;
				try {
					const [rows] = await sequelize.query(sql);
					return rows;
				} catch (err) {
					this.logger?.error("getUser error:", err);
					throw err;
				}
			},
		},
	},
};

export default CustomerService;
