import type { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";

interface GetCustomerQuery {
    custCode: string,
    year: number
}

const CustomerService: ServiceSchema<ServiceSettingSchema> = {
    name: 'customer',
    actions: {
        getCustomer: {
            rest: {
                method: 'GET',
                path: '/getCustomer'
            },
            params: {
                custCode: 'string',
                year: { type: 'number', convert: true }
            },
            handler(ctx: Context<GetCustomerQuery>): Object {
                return { customerCode: ctx.params.custCode, year: ctx.params.year }
            }
        }
    }
}

export default CustomerService