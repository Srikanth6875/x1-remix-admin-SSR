import type { Knex } from "knex";
import { getDb } from "./db.server";

export class DatabaseService {
    public knex: Knex;

    constructor() {
        this.knex = getDb();
    }

    async query(table: string, type: "select", options: any = {}) {
        let knexBuilder = this.knex(table);

        if (options.joins) {
            for (const j of options.joins) {
                const typeJoin = j.type || "inner";
                if (typeJoin === "inner") knexBuilder.join(j.table, j.first, j.operator, j.second);
                if (typeJoin === "left") knexBuilder.leftJoin(j.table, j.first, j.operator, j.second);
            }
        }

        if (options.where) knexBuilder.where(options.where);
        if (options.orderBy) knexBuilder.orderBy(options.orderBy.column, options.orderBy.order || "asc");
        if (options.limit) knexBuilder.limit(options.limit);
        if (options.select) knexBuilder.select(options.select);

        return await knexBuilder;
    }

    async queryWrite(table: string, type: "insert" | "update" | "delete", options: any = {}) {
        let knexBuilder = this.knex(table);

        if (options.where) {
            const sanitizedWhere: Record<string, string | number | boolean> = {};
            Object.entries(options.where).forEach(([key, value]) => {
                if (value === undefined) return; // skip undefined
                if (typeof value === "object") {
                    throw new Error(`Invalid value for where clause: ${key} = ${JSON.stringify(value)}`);
                }
                sanitizedWhere[key] = value as string | number | boolean;
            });
            knexBuilder = knexBuilder.where(sanitizedWhere);
        }

        if (type === "insert") {
            knexBuilder = knexBuilder.insert(options.data);
            console.log("[Knex SQL]", knexBuilder.toSQL().sql, knexBuilder.toSQL().bindings);
            const [id] = await knexBuilder;
            return id;
        }

        if (type === "update") {
            knexBuilder = knexBuilder.update(options.data);
            console.log("[Knex SQL]", knexBuilder.toSQL().sql, knexBuilder.toSQL().bindings);
            return await knexBuilder;
        }

        if (type === "delete") {
            knexBuilder = knexBuilder.del();
            console.log("[Knex SQL]", knexBuilder.toSQL().sql, knexBuilder.toSQL().bindings);
            return await knexBuilder;
        }
    }
}
