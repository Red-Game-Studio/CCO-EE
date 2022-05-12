interface Action {
    type: string; // Action type. For example, "purchaseUpgrade".

    // Powerups
    endTimestamp: number; // e.g. endTimestamp: epoch + 60s
    powerupID: string; // e.g. powerupID: goldenCookie_multiplier
    multiplier: number; // e.g. multiplier: 7 (7x)
}

interface Data {
    action: Action;
    timestamp: number; // To make sure powerup timer is correct. (e.g. on powerup collect -> timestamp = epoch)
}

interface ServerData extends Data {}

interface ServerResponse {
    body: ServerData;
    failCode: number;
}

// ----------

interface NetworkInterface {
    send(data: Data): Promise<ServerResponse>;
    wait(): Promise<ServerResponse>;
    socket: WebSocket;
}

// @ts-ignore
class Network implements NetworkInterface {
    socket: WebSocket;

    async init() {
        this.socket = new WebSocket("wss://cco-server.glitch.me");

        this.socket.addEventListener("open", () => {
            return true;
        });

        this.socket.addEventListener("error", () => {
            return false;
        });
    }

    send(data: Data): Promise<ServerResponse> {
        return new Promise((success, fail) => {
            this.socket.send(JSON.stringify(data));
            this.wait().then((x)=>success(x));
        });
    }

    wait(): Promise<ServerResponse> {
        return new Promise((success, fail) => {
            let h = {}

            h["handler"] = (evt) => {
                this.socket.removeEventListener("message", h["handler"]);

                let msg = evt.data;
                let data: ServerResponse = JSON.parse(msg);

                success(data);
            }

            this.socket.addEventListener("message", h["handler"])
        });
    }
}