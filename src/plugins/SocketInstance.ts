import { Socket, io } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "../types/SocketEvents"

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_SERVER)

export { socket }
