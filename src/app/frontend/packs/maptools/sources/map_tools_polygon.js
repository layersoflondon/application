import axios from 'axios/index';

const getPolygons = (id) => {
    return axios.get(`/booth/maptools/squares/${id}/polygons`);
};

const getAllPolygons = () => {
    return axios.get('/booth/maptools/squares');
};

const createPolygon = (square_id, params) => {
    const data = {feature: params};
    return axios.post(`/booth/maptools/squares/${square_id}/polygons`, data);
};

const deletePolygon = (id) => {
    return axios.delete(`/booth/maptools/${id}`);
};

export { getPolygons, getAllPolygons, createPolygon, deletePolygon };