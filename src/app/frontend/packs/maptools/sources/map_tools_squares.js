import axios from 'axios/index';

const getSquare = (id) => {
    return axios.get(`/booth/maptools/squares/${id}`);
};

const getSquares = () => {
    return axios.get('/booth/maptools/squares');
};

const updateSquare = (id, params) => {
    return axios.put(`/booth/maptools/squares/${id}`, params);
};

export { getSquares, getSquare, updateSquare };
