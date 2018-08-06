class IPCMonitorStore extends Map {

	constructor(client) {
		super();
		this.client = client;
	}

	async run(message) {
		if (!message.data.route) return message.reply({ success: false, message: 'UNKNOWN_ROUTE' });
		if (!message.data.payload) return message.reply({ success: false, message: 'MISSING_PAYLOAD' });

		const monitor = this.get(message.data.route);
		return message.reply(monitor
			? monitor.run(message.data.payload).then(result => ({ success: true, message: clean(result) }), error => ({ success: false, message: error }))
			: { success: false, message: 'UNKNOWN_ROUTE' });
	}

	set(piece) {
		super.set(piece.name, piece);
		return piece;
	}

}

const { inspect } = require('util');

function clean(result) {
	switch (typeof result) {
		case 'number':
		case 'string': return result;
		case 'undefined': return 'undefined';
		case 'function': return result.toString();
		default: return inspect(result, { depth: 0 });
	}
}

module.exports = IPCMonitorStore;
