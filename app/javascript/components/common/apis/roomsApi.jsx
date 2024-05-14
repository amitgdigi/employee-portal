import axios from "../apiService";

const path = "/rooms";
const path1 = "/messages"

const get = async () => axios.get(path);
const create = async payload => axios.post(`${path}`, payload);
const show = async (id) => axios.get(`${path}/${id}`);
const getMessage = async (query = "") => axios.get(query ? `${path1}?${query}` : path1);

const roomsApi = { get, create, show, getMessage };

export default roomsApi;
