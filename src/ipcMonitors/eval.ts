import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public run(payload: string): any {
		if (!payload) throw 'MISSING_PAYLOAD';
		return eval(payload);
	}

}
