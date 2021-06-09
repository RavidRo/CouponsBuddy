import ConnectionSettingsData from './connection-settings-data';

export default class ConnectionData {
	public readonly me: ConnectionSettingsData;
	public readonly partner: ConnectionSettingsData;

	constructor(me: ConnectionSettingsData, partner: ConnectionSettingsData) {
		this.me = me;
		this.partner = partner;
	}
}
