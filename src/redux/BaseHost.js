import storage from "redux-persist/lib/storage";  

export const DEV_RUBY = 'http://192.168.0.99:81';
export const DEV_NODE = 'http://192.168.0.168:5000';
export const API_EPROC = 'http://192.168.0.99:3000';
export const STG = '';
export const PROD = '';
export const PERSIST_REDUCER = { storage, key: "geo-dipa-energi-persero", whitelist: ["user", "authToken"] };
export const MAIN_ROLES_AUTHORITY = 'Pusat';
export const UNIT_ROLES_AUTHORITY = 'Unit';