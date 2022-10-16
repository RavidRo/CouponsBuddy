import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter } from "./router";
import { createContext } from "./router/context";

import fetch from "node-fetch";
if (!global.fetch) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).fetch = fetch;
}

const port = 3001;
const wss = new ws.Server({ port });
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
	console.log(`➕➕ Connection (${wss.clients.size})`);
	ws.once("close", () => {
		console.log(`➖➖ Connection (${wss.clients.size})`);
	});
});
console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);

process.on("SIGTERM", () => {
	console.log("SIGTERM");
	handler.broadcastReconnectNotification();
	wss.close();
});
