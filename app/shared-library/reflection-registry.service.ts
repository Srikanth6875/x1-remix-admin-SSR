import { reflectionRegistryClasses } from "../services/Index.server";
type AnyClass = new (...args: any[]) => any;

class ReflectionService {
    private dynamicReflectionClasses = new Map<string, AnyClass>();
    private instanceCache = new Map<string, any>();

    constructor() {
        try {
            this.registerAll();
        } catch (err) {
            console.error("[Reflection] Fatal error during registry initialization:", err);
        }
    }

    registerAll() {
        for (const item of reflectionRegistryClasses) {
            try {
                this.registerClass(item);
            } catch (err) {
                console.error(`[Reflection] Failed to register class "${(item as any)?.name}":`, err);
            }
        }
    }

    private registerClass(target: unknown) {
        if (!this.checkIsClass(target)) {
            const name = (target as any)?.name || String(target);
            console.warn(`[Reflection] Ignored — not a valid ES6 class: ${name}`);
            return;
        }

        const className = (target as AnyClass).name;
        if (!className) {
            console.warn("[Reflection] Skipped — unnamed class:", target);
            return;
        }

        if (this.dynamicReflectionClasses.has(className)) {
            console.warn(`[Reflection] Duplicate class "${className}" — skipped`);
            return;
        }

        this.dynamicReflectionClasses.set(className, target as AnyClass);
        // console.log(`[Reflection] Registered: ${className}`);
    }

    /**
     * Detect ONLY ES6 classes.
     * No fallback for old function-based prototypes.
     */
    private checkIsClass(value: unknown): value is AnyClass {
        if (typeof value !== "function") return false;
        const source = Function.prototype.toString.call(value);
        if (source.includes("=>") || source.startsWith("function (")) return false;

        return /^class[\s{]/.test(source);
    }

    /**
     * Instance creator with built-in caching (per class).
     */
    getClassInstance<T = any>(name: string): T | null {
        try {
            if (this.instanceCache.has(name)) {
                return this.instanceCache.get(name);
            }

            const ClassTarget = this.dynamicReflectionClasses.get(name);
            if (!ClassTarget) {
                console.warn(`[Reflection] Class not registered: ${name}`);
                return null;
            }

            const instance = new ClassTarget();
            this.instanceCache.set(name, instance);
            // console.log(`[Reflection] Singleton created: ${name}`);

            return instance;
        } catch (err: any) {
            console.error(`[Reflection] Failed to instantiate ${name}:`, err?.message || err);
            return null;
        }
    }

    /**
     * Execute a method safely with proper argument handling.
     */
    async executeReflectionEngine<T = any>(className: string, methodName: string, args: any[] = []): Promise<T | null> {
        const instance = this.getClassInstance(className);
        if (!instance) return null;
        const method = (instance as any)[methodName];

        if (typeof method !== "function") {
            console.warn(`[Reflection] Method "${methodName}" not found on ${className}`);
            return null;
        }

        try {
            const safeArgs = Array.isArray(args) ? args : [args];
            return await method.apply(instance, safeArgs);
        } catch (err: any) {
            console.error(`[Reflection] Error executing ${className}.${methodName}():`, err?.message || err);
            return null;
        }
    }

    /**
     * List methods declared on a registered class.
     */
    listRegisterClassMethods(className: string): string[] {
        try {
            const ClassTarget = this.dynamicReflectionClasses.get(className);
            if (!ClassTarget?.prototype) return [];

            return Object.getOwnPropertyNames(ClassTarget.prototype)
                .filter(m => m !== "constructor")
                .filter(m => typeof (ClassTarget.prototype as any)[m] === "function");
        } catch (err) {
            console.error(`[Reflection] Failed to inspect class ${className}`, err);
            return [];
        }
    }

    listClasses(): string[] {
        return [...this.dynamicReflectionClasses.keys()];
    }

    clearSingletonInstances() {
        this.instanceCache.clear();
        console.log("[Reflection] Instance cache cleared");
    }

    resetReflectionSession() {
        this.dynamicReflectionClasses.clear();
        this.instanceCache.clear();

        try {
            this.registerAll();
            console.log("[Reflection] Reinitialized registry");
        } catch (err) {
            console.error("[Reflection] Error reinitializing registry:", err);
        }
    }
}

// ------------------ GLOBAL SINGLETON (For HMR) ------------------
declare global {
    var __ReflectionRegistry__: ReflectionService | undefined;
}

export const ReflectionRegistry =
    global.__ReflectionRegistry__ ?? new ReflectionService();

if (!global.__ReflectionRegistry__) {
    global.__ReflectionRegistry__ = ReflectionRegistry;
}

console.log("[Reflection Classes Registered]", ReflectionRegistry.listClasses());
