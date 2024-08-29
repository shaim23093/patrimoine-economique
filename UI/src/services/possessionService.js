import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getPossessions = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createPossession = (possession) => {
    return axios.post(API_URL, possession);
};

export const updatePossession = (libelle, possession) => {
    return axios.put(`${API_URL}/${libelle}`, possession);
};

export const closePossession = (libelle) => {
    return axios.post(`${API_URL}/${libelle}/close`);
};
