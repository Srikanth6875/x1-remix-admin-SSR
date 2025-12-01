import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";

export class FrameworkAppService {

    async loadTable<T>(className: string, methodName: string, columns: any[]) {
        const rows = await ReflectionRegistry.executeReflectionEngine(className, methodName, []);
        return { columns, rows: rows as T[] };
    }
}
