import axios from 'axios/index';

const getPolygons = (id) => {
    return axios.get(`/booth/maptools/squares/${id}/polygons`);
};

const createPolygon = (params) => {
    return axios.post(`/booth/maptools/squares/1234/polygons`, {params: params});
};

const deletePolygon = (id) => {
    return axios.delete(`/booth/maptools/${id}`);
};

export { getPolygons, createPolygon, deletePolygon };