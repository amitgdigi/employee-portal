import axios from "../apiService";

const path = "/rooms";

const create = async (roomId, payload) => axios.post(`${path}/${roomId}/messages`, payload);

const messagesApi = { create };

export default messagesApi
