// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
export function isClass(input: any): boolean {
	return typeof input === 'function' &&
		typeof input.prototype === 'object' &&
		input.toString().substring(0, 5) === 'class';
}

export function isObject(input: any): boolean {
	return input && input.constructor === Object;
}

export function isPrimitive(value: any): boolean {
	return PRIMITIVE_TYPES.includes(typeof value);
}

export const PRIMITIVE_TYPES = ['string', 'bigint', 'number', 'boolean'];

export function mergeDefault<T = Record<string, any>, S = Record<string, any>>(def: T, given?: S): T & S {
	if (!given) return deepClone(<T & S> def);
	const keys = Object.keys(def);
	if (!keys.length) return deepClone(<T & S> def);

	for (const key in def) {
		const value = (<T & S> given)[key];
		if (typeof value === 'undefined') (<T & S> given)[key] = deepClone((<T & S> def)[key]);
		else if (isObject(value)) mergeDefault(def[key], value);
	}

	return given as T & S;
}

export function deepClone<T>(source: T): T {
	// Check if it's a primitive (with exception of function and null, which is typeof object)
	if (source === null || isPrimitive(source)) return source;
	if (Array.isArray(source)) {
		const output = [];
		for (const value of source) output.push(deepClone(value));
		// @ts-ignore
		return output;
	}
	if (isObject(source)) {
		const output = {};
		for (const [key, value] of Object.entries(source)) output[key] = deepClone(value);
		// @ts-ignore
		return output;
	}
	if (source instanceof Map) {
		// @ts-ignore
		const output = new source.constructor();
		for (const [key, value] of source.entries()) output.set(key, deepClone(value));
		return output;
	}
	if (source instanceof Set) {
		// @ts-ignore
		const output = new source.constructor();
		for (const value of source.values()) output.add(deepClone(value));
		return output;
	}
	return source;
}
