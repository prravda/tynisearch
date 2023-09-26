export type TrampolineFunction<T> = (...args: any[]) => T | TrampolineFunction<T>;
export declare function trampoline<T>(fn: TrampolineFunction<T>): (...args: any[]) => T;
