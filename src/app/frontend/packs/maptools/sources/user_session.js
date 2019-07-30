import axios from 'axios/index';

const getUserSession = (id) => {
    return axios.get(`/booth/session`);
};

export { getUserSession };