import { io, Socket } from "socket.io-client";

// Define events
interface ServerToClientEvents {
    message: (msg: string) => void;
}
interface ClientToServerEvents {
    sendMessage: (msg: string) => void;
}

// Create socket
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    "http://localhost:3000", // 👈 because of adb reverse
    { transports: ["polling"] } // 👈 allow polling + websocket fallback
);

export default socket;
