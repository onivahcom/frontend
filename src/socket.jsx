import { io } from "socket.io-client";
import { apiUrl } from "./Api/Api";

const socket = io(`${apiUrl}`, {
    withCredentials: true,
});

export default socket;
