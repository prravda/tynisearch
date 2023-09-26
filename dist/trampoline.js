"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trampoline = void 0;
function trampoline(fn) {
    return function (...args) {
        let result = fn(...args);
        while (typeof result === "function") {
            result = result(...args);
        }
        return result;
    };
}
exports.trampoline = trampoline;
