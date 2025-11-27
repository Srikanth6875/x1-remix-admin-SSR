// import "reflect-metadata";
// import { container, injectable } from "tsyringe";
// import * as serviceFiles from "../services/Index.services";

// type AnyClass = new (...args: any[]) => any;

// class ReflectionService {
//   private registeredClasses: string[] = [];

//   constructor() {
//     try {
//       this.autoRegisterExportedClasses();
//     } catch (err) {
//       console.error("[Reflection] Fatal error:", err);
//     }
//   }

//   /** Auto-scan ../services and register classes as SINGLETONS */
//   private autoRegisterExportedClasses() {
//     for (const exportKey of Object.keys(serviceFiles)) {
//       const exported = (serviceFiles as any)[exportKey];

//       if (this.isClass(exported)) {
//         this.registerClass(exported);
//       }
//     }
//   }

//   private registerClass(ClassRef: AnyClass) {
//     const className = ClassRef.name;
//     if (!className) return;

//     // ====== DEBUG METADATA ======
//     const paramTypes = Reflect.getMetadata("design:paramtypes", ClassRef);
//     console.log(
//       `[Reflection][DEBUG] Class="${className}" paramtypes BEFORE injectable():`,
//       paramTypes ? paramTypes.map((p: any) => p?.name) : paramTypes
//     );
//     // ============================

//     injectable()(ClassRef);

//     // ====== DEBUG METADATA AFTER ======
//     const paramTypesAfter = Reflect.getMetadata("design:paramtypes", ClassRef);
//     console.log(
//       `[Reflection][DEBUG] Class="${className}" paramtypes AFTER injectable():`,
//       paramTypesAfter ? paramTypesAfter.map((p: any) => p?.name) : paramTypesAfter
//     );
//     // ==================================

//     // Register using STRING token
//     if (!container.isRegistered(className)) {
//       container.registerSingleton(className, ClassRef);
//     }

//     // Register using CLASS token
//     if (!container.isRegistered(ClassRef)) {
//       container.registerSingleton(ClassRef, ClassRef);
//     }

//     this.registeredClasses.push(className);
//   }


//   /* private registerClass(ClassRef: AnyClass) {
//      const className = ClassRef.name;
//      if (!className) return;
 
//      // Make class DI-ready (auto @injectable)
//      if (!Reflect.hasMetadata("design:paramtypes", ClassRef)) {
//        injectable()(ClassRef);
//      }
 
//      if (!container.isRegistered(className)) {
//        container.register(className, { useClass: ClassRef });
//        this.registeredClasses.push(className); 
//      }
//    }*/

//   private isClass(value: unknown): value is AnyClass {
//     return (typeof value === "function" && value.prototype && value.prototype.constructor === value);
//   }

//   /* Resolve singleton instance */
//   getClassInstance<T = any>(name: string): T | null {
//     try {
//       if (!container.isRegistered(name)) {
//         console.warn(`[Reflection] Not registered: ${name}`);
//         return null;
//       }
//       return container.resolve(name);
//     } catch (err) {
//       console.error(`[Reflection] Failed to resolve "${name}":`, err);
//       return null;
//     }
//   }

//   /** Execute method on DI singletons */
//   async executeReflectionEngine<T = any>(className: string, methodName: string, args: any[] = []): Promise<T | null> {
//     const instance = this.getClassInstance<any>(className);
//     if (!instance) return null;

//     const method = instance[methodName];
//     if (typeof method !== "function") {
//       console.warn(`[Reflection] Missing method: ${className}.${methodName}()`);
//       return null;
//     }

//     try {
//       const safeArgs = Array.isArray(args) ? args : [args];
//       return await method.apply(instance, safeArgs);
//     } catch (err) {
//       console.error(`[Reflection] Error in ${className}.${methodName}()`, err);
//       return null;
//     }
//   }

//   listRegisterClassMethods(className: string): string[] {
//     const ClassRef = container.resolve<any>(className).constructor;

//     return Object.getOwnPropertyNames(ClassRef.prototype)
//       .filter(m => m !== "constructor")
//       .filter(m => typeof ClassRef.prototype[m] === "function");
//   }

//   listRegisterClassMethodsDeep(className: string): string[] {
//     const ClassRef = container.resolve<any>(className).constructor;

//     let proto = ClassRef.prototype;
//     const methods = new Set<string>();

//     while (proto && proto !== Object.prototype) {
//       for (const name of Object.getOwnPropertyNames(proto)) {
//         if (name !== "constructor" && typeof proto[name] === "function") {
//           methods.add(name);
//         }
//       }
//       proto = Object.getPrototypeOf(proto);
//     }
//     return [...methods];
//   }

//   listClasses(): string[] {
//     return [...this.registeredClasses];
//   }
// }

// // -------- GLOBAL SINGLETON (HMR) ----------
// declare global {
//   var __ReflectionRegistry__: ReflectionService | undefined;
// }

// export const ReflectionRegistry =
//   global.__ReflectionRegistry__ ?? new ReflectionService();

// if (!global.__ReflectionRegistry__) {
//   global.__ReflectionRegistry__ = ReflectionRegistry;
// }

// console.log("[Reflection] Ready. Classes:", ReflectionRegistry.listClasses());

