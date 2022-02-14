import storage from "redux-persist/lib/storage";
import io from "socket.io-client";

// export const DEV_RUBY = "http://api2-eproc.geodipa.co.id:81";
// export const DEV_NODE = "http://192.168.0.168:5000";
// export const API_EPROC = "http://api2-eproc.geodipa.co.id:3000";
// export const SOCKET = io.connect("http://192.168.0.168:5001");
// export const SOCKET_DM = io.connect("http://192.168.0.168:8084");
// export const DEV_NODE2 = "http://192.168.0.168:8083";
export const DEV_RUBY = process.env.REACT_APP_DEV_RUBY;
export const DEV_NODE = process.env.REACT_APP_DEV_NODE;
export const API_EPROC = process.env.REACT_APP_API_EPROC;
export const SOCKET = io.connect(process.env.REACT_APP_API_SOCKET);
export const SOCKET_DM = io.connect(process.env.REACT_APP_API_SOCKET2);
export const DEV_NODE2 = process.env.REACT_APP_DEV_NODE2;

export const STG = "";
export const PROD = "";
export const PERSIST_REDUCER = {
  storage,
  key: "geo-dipa-energi-persero",
  whitelist: ["user", "authToken"],
};
export const MAIN_ROLES_AUTHORITY = "Pusat";
export const UNIT_ROLES_AUTHORITY = "Unit";
