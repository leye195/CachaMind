import { socketController } from "./socketController";

//let users = [];
const socket = io => {
  io.on("connection", socket => socketController(socket, io));
};
export default socket;
