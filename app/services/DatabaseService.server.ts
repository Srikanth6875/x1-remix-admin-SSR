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

        if (options.where) knexBuilder.where(options.where);
        if (type === "insert") {
            const [id] = await knexBuilder.insert(options.data);
            return id;
        }
        if (type === "update") return await knexBuilder.update(options.data);
        if (type === "delete") return await knexBuilder.del();
    }
}
