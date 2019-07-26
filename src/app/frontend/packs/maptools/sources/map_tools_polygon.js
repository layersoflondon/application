import axios from 'axios/index';

const getPolygons = (id) => {
    return axios.get(`/booth/maptools/squares/${id}/polygons`);
};

const getAllPolygons = () => {
    return axios.get('/booth/maptools/squares/polygons');
};

const createPolygon = (square_id, params) => {
    const data = {feature: params};
    return axios.post(`/booth/maptools/squares/${square_id}/polygons`, data);
};

const updatePolygon = (square_id, id, params) => {
    const data = {feature: params};
    return axios.put(`/booth/maptools/squares/${square_id}/polygons/${id}`, data);
};

const deletePolygon = (square_id, id) => {
    return axios.delete(`/booth/maptools/squares/${square_id}/polygons/${id}`);
};

export { getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon };