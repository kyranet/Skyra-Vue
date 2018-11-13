// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Piece, PieceOptions } from '../../../klasa/lib/structures/base/Piece';
import { DashboardClient } from '../DashboardClient';
import { parse, ParsedPart } from '../util/Util';
import { RouteStore } from './RouteStore';

export type ParsedRoute = ParsedPart[];
export type RouteOptions = {
	route?: string;
	authenticated?: boolean;
} & PieceOptions;

export class Route extends Piece {

	/**
	 * Stored bound run method, so it can be properly disabled and reloaded later
	 */
	public route: string;

	/**
	 * If the route is authenticated
	 */
	public authenticated: boolean;

	/**
	 * Stored parsed route
	 */
	public parsed: ParsedRoute;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string, options: RouteOptions = {}) {
		super(client, store, file, directory, options);
		this.route = client.options.dashboardHooks.apiPrefix + options.route;
		this.authenticated = options.authenticated;
		this.parsed = parse(this.route);
	}

	/**
	 * If this route matches a provided url
	 * @param split the url to check
	 */
	public matches(split: string[]): boolean {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
		return true;
	}

	/**
	 * Extracts the params from a provided url
	 * @param split the url
	 */
	public execute(split: string[]): Record<string, any> {
		const params = {};
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
		return params;
	}

}

module.exports = Route;