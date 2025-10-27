import { ServiceSchema } from "moleculer";
import DbService from "moleculer-db";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mydb", "root", "mysql", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const CustomerDbService: ServiceSchema = {
	name: "customerdb",
	mixins: [DbService],
	actions: {
		getUser: {
			params: {
				custCode: { type: "string", empty: true },
				tradingAccId: { type: "string", empty: true },
				subacid: { type: "string", empty: true },
				portCode: { type: "string", empty: true },
				fundType: { type: "number", convert: true, integer: true },
				custdianName: { type: "string", empty: true },
				aoId: { type: "number", convert: true, nullable: true, integer: true }
			},
			async handler(ctx: any) {
				let sql = `SELECT * FROM customerinfo WHERE`;
				if (ctx.params.custCode) sql += ` customerCode LIKE '%${ctx.params.custCode}%' AND`;
				if (ctx.params.tradingAccId) sql += ` tradingAccId LIKE '%${ctx.params.tradingAccId}%' AND`;
				if (ctx.params.subacid) sql += ` subacid LIKE '%${ctx.params.subacid}%' AND`;
				if (ctx.params.portCode) sql += ` portCode LIKE '%${ctx.params.portCode}%' AND`;
				if (ctx.params.custdianName) sql += ` custdianName LIKE '%${ctx.params.custdianName}%' AND`;
				if (ctx.params.aoId != 0) sql += ` ao LIKE '%${ctx.params.aoId}%' AND`;
				if (ctx.params.fundType == 0) {
					sql = sql.slice(0, -4);
				} else {
					sql += ` fundType = ${ctx.params.fundType}`;
				}
				try {
					const [rows] = await sequelize.query(sql);
					return rows
				} catch (err) {
					this.logger?.error("getUser error:", err);
					throw err;
				}
			},
		},
	},
};

export default CustomerDbService;
