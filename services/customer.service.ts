import type { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";

interface GetCustomerQuery {
	custCode: string;
	year: number;
}

const CustomerService: ServiceSchema<ServiceSettingSchema> = {
	name: "customer",
	actions: {
		getCustomer: {
			rest: {
				method: "GET",
				path: "/getCustomer",
			},
			params: {
				custCode: "string",
				year: { type: "number", convert: true },
			},
			async handler(ctx: Context<GetCustomerQuery>): Promise<Object> {
				const data = await ctx.call<Object[]>('mysql.getCustomer', { custCode: ctx.params.custCode });
				return { customerCode: ctx.params.custCode, year: ctx.params.year, data: data };
			},
		},
	},
};

export default CustomerService;
