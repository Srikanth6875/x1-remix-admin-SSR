import { DatabaseService } from "../shared-library/DatabaseService.service";
export type Reseller = {
    id: number;
    name: string;
    email: string | null;
    companyName: string | null;
    resellerType: string | null;
    status: string;
    address?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ResellerAppService {
    constructor(public db = new DatabaseService()) { }

    async ResellerList(): Promise<Reseller[]> {
        const resellers = await this.db.query("reseller", "select", {
            select: ["id", "name", "email", "companyName", "resellerType", "status", "address"],
            orderBy: { column: "id", order: "asc" },
        });
        return resellers;
    }

    async CreateReseller(data: Omit<Reseller, "id" | "createdAt" | "updatedAt">) {
        const payload = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const ids = (await this.db.queryWrite("reseller", "insert", { data: payload })) as unknown as number[];
        const id = ids[0];
        return { success: true, message: "Reseller created", reseller_id: id };
    }

    async UpdateReseller(data: Reseller) {
        const updated = await this.db.queryWrite("reseller", "update", {
            where: { id: data.id },
            data: { ...data, updatedAt: new Date() },
        });

        return updated ? { success: true, message: "Reseller updated" } : { success: false, message: "Reseller not found" };
    }

    async DeleteReseller(id: number) {
        const deleted = await this.db.queryWrite("reseller", "delete", { where: { id } });
        return deleted ? { success: true, message: "Reseller deleted" } : { success: false, message: "Not found" };
    }


    async GetResellerById(id: number): Promise<Reseller | null> {
        const resellers = await this.db.query("reseller", "select", {
            where: { id }, limit: 1,
            select: ["id", "name", "email", "companyName", "resellerType", "status", "address", "createdAt", "updatedAt"],
        });
        return resellers.length ? resellers[0] : null;
    }
}
