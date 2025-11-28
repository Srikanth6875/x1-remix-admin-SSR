import * as serviceFiles from "../services/Index.services";
type AnyClass = new (...args: any[]) => any;

class ReflectionService {
    private dynamicReflectionClasses = new Map<string, AnyClass>();
    private instanceCache = new Map<string, any>();

    constructor() {
        try {
            this.autoRegisterClasses();
        } catch (err) {
            console.error("[Reflection] Fatal error during initialization:", err);
        }
    }

    /* Automatically registers all ES6 class exports from ../services/Index.server */
    private autoRegisterClasses() {
        for (const exportKey of Object.keys(serviceFiles)) {
            const exported = (serviceFiles as any)[exportKey];
            this.registerClass(exported);
        }
    }

    private registerClass(target: unknown) {
        if (!this.isES6Class(target)) return;// ignore non-classes 

        const className = (target as AnyClass).name;
        if (!className) return;

        if (this.dynamicReflectionClasses.has(className)) return;
        this.dynamicReflectionClasses.set(className, target as AnyClass);
    }

    isES6Class(value: unknown): boolean {
        if (typeof value !== "function") return false;

        const str = Function.prototype.toString.call(value);
        if (str.startsWith("class ")) return true;

        const proto = (value as any).prototype;
        return !!proto && Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor === value;
    }

    /* Instantiate (singleton cached) */
    getClassInstance<T = any>(name: string): T | null {
        try {
            if (this.instanceCache.has(name)) {
                return this.instanceCache.get(name);
            }
            const ClassRef = this.dynamicReflectionClasses.get(name);

            if (!ClassRef) {
                console.warn(`[Reflection] Class not registered: ${name}`);
                return null;
            }

            const instance = new ClassRef();
            this.instanceCache.set(name, instance);
            return instance;
        } catch (err: any) {
            console.error(`[Reflection] Failed to instantiate "${name}":`, err);
            return null;
        }
    }

    /* Execute a method safely */
    async executeReflectionEngine<T = any>(className: string, methodName: string, args: any[] = []): Promise<T | null> {
        const instance = this.getClassInstance(className);
        if (!instance) return null;

        const method = (instance as any)[methodName];
        if (typeof method !== "function") {
            console.warn(`[Reflection] Method not found: ${className}.${methodName}()`);
            return null;
        }

        try {
            const safeArgs = Array.isArray(args) ? args : [args];
            return await method.apply(instance, safeArgs);
        } catch (err: any) {
            console.error(`[Reflection] Error in ${className}.${methodName}()`, err);
            return null;
        }
    }

    /* List instance methods */
    listRegisterClassMethods(className: string): string[] {
        const ClassRef = this.dynamicReflectionClasses.get(className);
        if (!ClassRef) return [];

        return Object.getOwnPropertyNames(ClassRef.prototype)
            .filter(m => m !== "constructor")
            .filter(m => typeof (ClassRef.prototype as any)[m] === "function");
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
        this.autoRegisterClasses();
        console.log("[Reflection] Reinitialized registry");
    }
}

// ---------- GLOBAL SINGLETON (HMR) ----------
declare global {
    var __ReflectionRegistry__: ReflectionService | undefined;
}

export const ReflectionRegistry =
    global.__ReflectionRegistry__ ?? new ReflectionService();

if (!global.__ReflectionRegistry__) {
    global.__ReflectionRegistry__ = ReflectionRegistry;
}

console.log("[Reflection] Registered Classes:", ReflectionRegistry.listClasses());
