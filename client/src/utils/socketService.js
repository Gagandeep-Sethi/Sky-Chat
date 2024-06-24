// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
// });

// socket.on("connect", () => {
//   console.log("Connected to the server with socket ID:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from the server");
// });

// export default socket;
import { io } from "socket.io-client";

class SocketService {
  socket;

  connect() {
    this.socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }
}

const socketService = new SocketService();
export default socketService;
