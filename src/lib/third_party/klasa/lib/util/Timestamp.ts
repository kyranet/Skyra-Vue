// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { TIMES } from './constants';
const { SECOND, MINUTE, DAY, DAYS, MONTHS, TIMESTAMP: { TOKENS } } = TIMES;

/**
 * The internal timestamp object for the pattern
 */
interface TimestampObject {
	/**
	 * The type of this object, if any
	 */
	type: string;
	/**
	 * The content of this object
	 */
	content?: string | null;
}

export const timezoneOffset = new Date().getTimezoneOffset() * 60000;

export class Timestamp {

	/**
	 * The pattern used for this timestamp
	 */
	public pattern: string;

	/**
	 * The parsed pattern template
	 */
	private _template: TimestampObject[];

	/**
	 * Starts a new Timestamp and parses the pattern.
	 * @param pattern The pattern to parse
	 */
	public constructor(pattern: string) {
		this.pattern = pattern;
		this._template = Timestamp._patch(pattern);
	}

	/**
	 * Display the current date with the current pattern.
	 * @param time The time to display
	 */
	public display(time: Date | number | string = new Date()) {
		return Timestamp._display(this._template, time);
	}

	/**
	 * Display the current date utc with the current pattern.
	 * @param data The time to display in utc
	 */
	public displayUTC(time: Date | number | string = new Date()) {
		return Timestamp._display(this._template, Timestamp.utc(time));
	}

	/**
	 * Edits the current pattern.
	 * @param pattern The new pattern for this instance
	 * @chainable
	 */
	public edit(pattern: string) {
		this.pattern = pattern;
		this._template = Timestamp._patch(pattern);
		return this;
	}

	/**
	 * Defines the toString behavior of export const
	 */
	public toString() {
		return this.display();
	}

	/**
	 * Display the current date with the current pattern.
	 * @param pattern The pattern to parse
	 * @param time The time to display
	 */
	public static displayArbitrary(pattern: string, time: Date | number | string = new Date()) {
		return Timestamp._display(Timestamp._patch(pattern), time);
	}

	/**
	 * Creates a UTC Date object to work with.
	 * @param time The date to convert to utc
	 */
	public static utc(time: Date | number | string = new Date()) {
		time = Timestamp._resolveDate(time);
		return new Date(time.valueOf() + timezoneOffset);
	}

	/**
	 * Display the current date with the current pattern.
	 * @param template The pattern to parse
	 * @param time The time to display
	 */
	private static _display(template: TimestampObject[], time: Date | number | string) {
		let output = '';
		const parsedTime = Timestamp._resolveDate(time);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		for (const { content, type } of template) output += content || resolvers.get(type)!(parsedTime);
		return output;
	}

	/**
	 * Parses the pattern.
	 * @param pattern The pattern to parse
	 */
	private static _patch(pattern: string) {
		const template: TimestampObject[] = [];
		for (let i = 0; i < pattern.length; i++) {
			let current = '';
			const currentChar = pattern[i];
			if (currentChar in TOKENS) {
				current += currentChar;
				while (pattern[i + 1] === currentChar && current.length < TOKENS[currentChar]) current += pattern[++i];
				template.push({ type: current, content: null });
			} else if (currentChar === '[') {
				while (i + 1 < pattern.length && pattern[i + 1] !== ']') current += pattern[++i];
				i++;
				template.push({ type: 'literal', content: current });
			} else {
				current += currentChar;
				while (i + 1 < pattern.length && !(pattern[i + 1] in TOKENS) && pattern[i + 1] !== '[') current += pattern[++i];
				template.push({ type: 'literal', content: current });
			}
		}

		return template;
	}

	/**
	 * Resolves a date.
	 * @param time The time to parse
	 */
	private static _resolveDate(time: Date | number | string) {
		return time instanceof Date ? time : new Date(time);
	}

}

// Dates

export const Y = (time: Date) => String(time.getFullYear()).slice(0, 2);
export const YY = Y;
export const YYY = (time: Date) => String(time.getFullYear());
export const YYYY = YYY;
export const Q = (time: Date) => String((time.getMonth() + 1) / 3);
export const M = (time: Date) => String(time.getMonth() + 1);
export const MM = (time: Date) => String(time.getMonth() + 1).padStart(2, '0');
export const MMM = (time: Date) => MONTHS[time.getMonth()];
export const MMMM = MMM;
export const D = (time: Date) => String(time.getDate());
export const DD = (time: Date) => String(time.getDate()).padStart(2, '0');
export const DDD = (time: Date) => {
	const start = new Date(time.getFullYear(), 0, 0);
	const diff = ((time.getMilliseconds() - start.getMilliseconds()) + (start.getTimezoneOffset() - time.getTimezoneOffset())) * MINUTE;
	return String(Math.floor(diff / DAY));
};
export const DDDD = DDD;
export const d = (time: Date) => {
	const day = String(time.getDate());
	if (day !== '11' && day.endsWith('1')) return `${day}st`;
	if (day !== '12' && day.endsWith('2')) return `${day}nd`;
	if (day !== '13' && day.endsWith('3')) return `${day}rd`;
	return `${day}th`;
};
export const dd = (time: Date) => DAYS[time.getDay()].slice(0, 2);
export const ddd = (time: Date) => DAYS[time.getDay()].slice(0, 3);
export const dddd = (time: Date) => DAYS[time.getDay()];
export const X = (time: Date) => String(time.valueOf() / SECOND);
export const x = (time: Date) => String(time.valueOf());

// Times

export const H = (time: Date) => String(time.getHours());
export const HH = (time: Date) => String(time.getHours()).padStart(2, '0');
export const h = (time: Date) => String(time.getHours() % 12);
export const hh = (time: Date) => String(time.getHours() % 12).padStart(2, '0');
export const a = (time: Date) => time.getHours() < 12 ? 'am' : 'pm';
export const A = (time: Date) => time.getHours() < 12 ? 'AM' : 'PM';
export const m = (time: Date) => String(time.getMinutes());
export const mm = (time: Date) => String(time.getMinutes()).padStart(2, '0');
export const s = (time: Date) => String(time.getSeconds());
export const ss = (time: Date) => String(time.getSeconds()).padStart(2, '0');
export const S = (time: Date) => String(time.getMilliseconds());
export const SS = (time: Date) => String(time.getMilliseconds()).padStart(2, '0');
export const SSS = (time: Date) => String(time.getMilliseconds()).padStart(3, '0');

// Locales

/* eslint max-len:0 new-cap:0 */

export const T = (time: Date) => `${h(time)}:${mm(time)} ${A(time)}`;
export const t = (time: Date) => `${h(time)}:${mm(time)}:${ss(time)} ${A(time)}`;
export const L = (time: Date) => `${MM(time)}/${DD(time)}/${YYYY(time)}`;
export const l = (time: Date) => `${M(time)}/${DD(time)}/${YYYY(time)}`;
export const LL = (time: Date) => `${MMMM(time)} ${DD(time)}, ${YYYY(time)}`;
export const ll = (time: Date) => `${MMMM(time).slice(0, 3)} ${DD(time)}, ${YYYY(time)}`;
export const LLL = (time: Date) => `${LL(time)} ${T(time)}`;
export const lll = (time: Date) => `${ll(time)} ${T(time)}`;
export const LLLL = (time: Date) => `${dddd(time)}, ${LLL(time)}`;
export const llll = (time: Date) => `${ddd(time)} ${lll(time)}`;
export const Z = (time: Date) => {
	const offset = time.getTimezoneOffset();
	return `${offset >= 0 ? '+' : '-'}${String(offset / -60).padStart(2, '0')}:${String(offset % 60).padStart(2, '0')}`;
};
export const ZZ = Z;

const resolvers: Map<string, (time: Date) => string> = new Map()
	// Dates
	.set('Y', Y)
	.set('YY', YY)
	.set('YYY', YYY)
	.set('YYYY', YYYY)
	.set('Q', Q)
	.set('M', M)
	.set('MM', MM)
	.set('MMM', MMM)
	.set('MMMM', MMMM)
	.set('D', D)
	.set('DD', DD)
	.set('DDD', DDD)
	.set('DDDD', DDDD)
	.set('d', d)
	.set('dd', dd)
	.set('ddd', ddd)
	.set('dddd', dddd)
	.set('X', X)
	.set('x', x)

	// Times
	.set('H', H)
	.set('HH', HH)
	.set('h', h)
	.set('hh', hh)
	.set('a', a)
	.set('A', A)
	.set('m', m)
	.set('mm', mm)
	.set('s', s)
	.set('ss', ss)
	.set('S', S)
	.set('SS', SS)
	.set('SSS', SSS)

	// Locales
	.set('t', t)
	.set('T', T)
	.set('l', l)
	.set('ll', ll)
	.set('lll', lll)
	.set('llll', llll)
	.set('L', L)
	.set('LL', LL)
	.set('LLL', LLL)
	.set('LLLL', LLLL)
	.set('Z', Z);
