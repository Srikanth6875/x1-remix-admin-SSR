export class FrameWorkApp {

    applyMultiInheritance(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== "constructor") {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
}