import { DatabaseService } from "../shared-library/DatabaseService.service";

export type Client = {
    client_id?: number;
    reseller_id?: number | null;
    client_name?: string | null;
    client_dealer_id?: string | null;
    client_inactive?: number;
    client_assets_deleted?: number;
    client_disable_process_flag?: number;
    client_createdate?: Date;
};

export class ClientAppService {
    constructor(private db = new DatabaseService()) { }

    async ClientList(): Promise<Client[]> {
        const clients = await this.db.query("clients", "select", {
            select: ["client_id", "client_name", "client_dealer_id", "client_inactive", "client_assets_deleted", "client_disable_process_flag"],
            orderBy: { column: "client_id", order: "asc" },
        });
        
        return clients;
    }
}
