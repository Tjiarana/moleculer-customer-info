import type { ServiceSchema, Context } from "moleculer";
import { createPool, Pool } from "mysql2/promise";

interface DbServiceSchema extends ServiceSchema {
    _pool?: Pool | null;
}

const DbService: DbServiceSchema = {
    name: "mysql",

    created() {
        const host = process.env.DB_HOST ?? "localhost";
        const user = process.env.DB_USER ?? "root";
        const password = process.env.DB_PASSWORD ?? "mysql";
        const database = process.env.DB_NAME ?? "mydb";
        const port = Number(process.env.DB_PORT ?? 3306);

        this._pool = createPool({
            host,
            user,
            password,
            database,
            port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        this.logger.info("MySQL pool created");
    },

    async stopped() {
        if (this._pool) {
            await this._pool.end();
            this.logger.info("MySQL pool closed");
        }
    },

    actions: {
        getCustomer: {
            params: {
                custCode: {
                    type: "string",
                    optional: true,
                    default: ""
                }
            },
            async handler() {
                if (!this._pool) throw new Error("DB pool is not initialized");

                let sql = `SELECT * FROM customerinfo`;
                if (this.params.custCode) sql += ` WHERE customerCode like '%${this.params.custCode}%'`

                const [rows] = await this._pool.query(sql);
                return rows;
            },
        },
    },
};

export default DbService;