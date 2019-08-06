import axios from 'axios/index';

const getSquare = (id) => {
    return axios.get(`/booth/maptools/squares/${id}`);
};

const getSquares = () => {
    return axios.get('/booth/maptools/squares');
};

const getSquareCoordinates = () => {
    return axios.get('/booth/maptools/squares/coordinates')
};

const getSquareGrid = () => {
    return axios.get('/booth/maptools/squares/grid')
};

const updateSquare = (id, params) => {
    return axios.put(`/booth/maptools/squares/${id}`, params);
};

export { getSquares, getSquare, updateSquare, getSquareCoordinates, getSquareGrid };
