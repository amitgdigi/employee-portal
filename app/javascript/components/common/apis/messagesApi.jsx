import axios from "../apiService";

const path = "/messages";

const create = async (payload) => axios.post(`${path}`, payload);

const messagesApi = { create };

export default messagesApi
