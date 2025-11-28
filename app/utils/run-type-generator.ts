export class RunTypeGenerator {
    static generateRunType(entity: string, action: string): string {// rt = "CREATE_RESELLER"
        return `${action.toUpperCase()}_${entity.toUpperCase()}`;
    }

    static parseRunType(runType: string): { entity: string; action: string } {// { action: "create", entity: "reseller" }
        const parts = runType.split('_');
        const action = parts.slice(0, -1).join('_');
        const entity = parts[parts.length - 1];
        return { action: action.toLowerCase(), entity: entity.toLowerCase(), };
    }

    static getActionFromRunType(runType: string): string {// "create"
        return runType.split('_').slice(0, -1).join('_').toLowerCase();
    }

    static getEntityFromRunType(runType: string): string {// "reseller"
        return runType.split('_').pop()!.toLowerCase();
    }
}