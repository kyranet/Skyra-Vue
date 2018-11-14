import { ServerResponse } from 'http';
import { APIClient, Sockets } from '../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/users/:user' });
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (!request.query.user) {
			response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));
		} else {
			const user = await this.client.ipcRequest(Sockets.Skyra, { route: 'user', userID: request.query.user });
			response.end(JSON.stringify({ success: true, message: user }));
		}
	}

}
