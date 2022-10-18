import { createContext } from "react";

export const ActiveFriendContext = createContext<string | null>(null);
export const SetActiveFriendContext = createContext<(id: string) => void>(
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	() => {}
);
