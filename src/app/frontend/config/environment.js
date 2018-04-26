let frontEndHost;
const hostname = window && window.location && window.location.hostname;

if (hostname === 'localhost') {
    frontEndHost = `http://${hostname}:3000`;
}

export const ConfigEnv = frontEndHost;