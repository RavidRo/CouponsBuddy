export type ActionMeta = {
	reward: number;
	disabled: boolean;
};

type ActionsData = Readonly<{
	lastAction: number;
	timer: number;
	metaData: { [actionName: string]: ActionMeta };
}>;

export default ActionsData;
