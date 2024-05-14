import axios from "../apiService";

const path = "/messages";

const index = async (query = "") => axios.get(query ? `${path}?${query}` : path);
const create = async (payload) => axios.post(`${path}`, payload);

const messagesApi = { index, create };

export default messagesApi
