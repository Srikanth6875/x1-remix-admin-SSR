import { reflectionRegistryClasses } from "../services/Index.server";

type AnyClass = new (...args: any[]) => any;

class ReflectionService {
    private dynamicReflectionClasses = new Map<string, AnyClass>();
    private instanceCache = new Map<string, any>();

    constructor() {
        this.registerAll();
    }

    private checkIsClass(value: unknown): value is AnyClass {
        if (typeof value !== "function") return false;

        const str = Function.prototype.toString.call(value);
        if (str.includes("=>") || str.startsWith("function (")) return false;
        if (/^class[\s{]/.test(str)) return true;

        // Additional fallback: has prototype with methods
        return !!(value.prototype && value.prototype.constructor === value && Object.getOwnPropertyNames(value.prototype).length > 1);
    }

    registerAll() {
        [...reflectionRegistryClasses].forEach((item) => {
            this.registerClass(item);
        });
    }

    private registerClass(target: unknown) {

        if (!this.checkIsClass(target)) {
            const name = (target as any)?.name || String(target);
            // console.warn(`[Reflection] Ignored — not a class: ${name}`);
            return;
        }

        const className = target.name;
        if (!className || className === "Object" || className === "Function") {
            console.warn("[Reflection] Skipped — invalid class name:", target);
            return;
        }

        if (this.dynamicReflectionClasses.has(className)) {
            console.warn(`[Reflection] Duplicate class "${className}" — skipped`);
            return;
        }

        this.dynamicReflectionClasses.set(className, target);
        // console.log("@@@@@@@@@@@@@@@@@@@",this.dynamicReflectionClasses);
    }

    getClassInstance<T = any>(name: string): T | null {
        if (this.instanceCache.has(name)) {
            // console.log(" from instanceCache", this.instanceCache);
            return this.instanceCache.get(name);
        }

        const ClassTarget = this.dynamicReflectionClasses.get(name);
        if (!ClassTarget) {
            console.warn(`[Reflection] Class not registered: ${name}`);
            return null;
        }

        try {
            const instance = new ClassTarget();
            this.instanceCache.set(name, instance);
            console.log(`[Reflection] Singleton instantiated: ${name}`);
            return instance;
        } catch (err: any) {
            console.error(`[Reflection] Failed to instantiate ${name}:`, err.message);
            return null;
        }
    }

    async executeReflectionEngine<T = any>(className: string, methodName: string, args: any[] = []): Promise<T | null> {
        const instance = this.getClassInstance(className);
        if (!instance) return null;

        const method = (instance as any)[methodName];

        if (typeof method !== "function") {
            console.warn(`[Reflection] Method "${methodName}" not found on ${className}`);
            return null;
        }

        try {
            return await method.apply(instance, args);
        } catch (error: any) {
            console.error(`[Reflection] Error in ${className}.${methodName}():`, error);
            throw error;
        }
    }

    listRegisterClassMethods(className: string): string[] {
        const ClassTarget = this.dynamicReflectionClasses.get(className);
        if (!ClassTarget?.prototype) return [];

        return Object.getOwnPropertyNames(ClassTarget.prototype)
            .filter((m) => m !== "constructor").filter((m) => typeof (ClassTarget.prototype as any)[m] === "function");
    }

    listClasses(): string[] {
        return [...this.dynamicReflectionClasses.keys()];
    }

    clearSingletonInstances() {
        this.instanceCache.clear();
        console.log("[Reflection] All singleton instances cleared");
    }

    reset() {
        this.dynamicReflectionClasses.clear();
        this.instanceCache.clear();
        this.registerAll();
        console.log("[Reflection] Registry reset and re-registered classes");
    }
}

// Global singleton (survives HMR in dev)
declare global {
    var __ReflectionRegistry__: ReflectionService | undefined;
}

export const ReflectionRegistry =
    global.__ReflectionRegistry__ ?? new ReflectionService();

if (!global.__ReflectionRegistry__) {
    global.__ReflectionRegistry__ = ReflectionRegistry;
}

console.log("[Reflection classes]", ReflectionRegistry.listClasses());