import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";

const CustomerService: ServiceSchema = {
	name: "customer",
	settings: {
		defaultName: "Moleculer",
	},
	actions: {
		getCustomer: {
			rest: {
				method: "GET",
				path: "/getCustomer",
			},
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
				const queryParams = {
					custCode: ctx.params.custCode,
					tradingAccId: ctx.params.tradingAccId,
					subacid: ctx.params.subacid,
					portCode: ctx.params.portCode,
					fundType: ctx.params.fundType,
					custdianName: ctx.params.custdianName,
					aoId: ctx.params.aoId,
				}
				const result = await this.broker.call("customerdb.getUser", queryParams);
				return { success: true, message: "success", resultCode: 0, data: result }
			}
		}
	},
	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {},
};

export default CustomerService;
