import ConnectionSettingsData from './connection-settings-data';

export default class ConnectionData {
	public readonly me: ConnectionSettingsData;
	public readonly partner: ConnectionSettingsData;
	public readonly chatID: string;

	constructor(me: ConnectionSettingsData, partner: ConnectionSettingsData, chatID: string) {
		this.me = me;
		this.partner = partner;
		this.chatID = chatID;
	}
}
