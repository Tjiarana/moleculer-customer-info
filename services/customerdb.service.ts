import { ServiceSchema } from "moleculer";
import { KnDBConnections, KnSQL } from "@willsofts/will-sql";
import { append } from "nats/lib/nats-base-client/denobuffer";

async function getCustomer(queryParams: any) {
    const db = KnDBConnections.getDBConnector({
        schema: "MYSQL2",
        alias: "mysql2",
        dialect: "mysql",
        database: "mydb",
        port: 3306,
        url: "",
        user: "root",
        password: "mysql"
    })
    const knsql = new KnSQL();
    knsql.append("SELECT * FROM customerinfo");
    const p = queryParams ?? {};
    const whereParts: string[] = [];

    if (p.custCode) {
        whereParts.push("customerCode LIKE ?custCode");
        knsql.set('custCode', `%${p.custCode}%`)
    }
    if (p.tradingAccId) {
        whereParts.push("tradingAccId LIKE ?tradingAccId");
        knsql.set('tradingAccId', `%${p.tradingAccId}%`)
    }
    if (p.subacid) {
        whereParts.push("subacid LIKE ?subacid");
        knsql.set('subacid', `%${p.subacid}%`)
    }
    if (p.portCode) {
        whereParts.push("portCode LIKE ?portCode");
        knsql.set('portCode', `%${p.portCode}%`)
    }
    if (p.custdianName) {
        whereParts.push("custdianName LIKE ?custdianName");
        knsql.set('custdianName', `%${p.custdianName}%`)
    }
    if (p.aoId !== null && p.aoId !== 0) {
        whereParts.push("ao = ?aoId");
        knsql.set('aoId', p.aoId)
    }
    if (p.fundType !== 0) {
        whereParts.push("fundType = ?fundType");
        knsql.set('fundType', p.fundType)
    }

    const whereClause = whereParts.length ? ` WHERE ${whereParts.join(" AND ")}` : "";
    knsql.append(whereClause)
    let rs = await db.executeQuery(knsql);
    return rs.rows
}

const CustomerDbService: ServiceSchema = {
    name: "customerdb",
    actions: {
        getUser: {
            params: {
                custCode: { type: "string", empty: true, optional: true },
                tradingAccId: { type: "string", empty: true, optional: true },
                subacid: { type: "string", empty: true, optional: true },
                portCode: { type: "string", empty: true, optional: true },
                fundType: { type: "number", convert: true, integer: true, optional: true },
                custdianName: { type: "string", empty: true, optional: true },
                aoId: { type: "number", convert: true, nullable: true, integer: true, optional: true }
            },
            async handler(ctx: any) {
                try {
                    const rows = await getCustomer(ctx.params);
                    return rows;
                } catch (err) {
                    this.logger?.error("getCustomer error:", err);
                    throw err;
                }
            }
        },
    },
};

export default CustomerDbService;