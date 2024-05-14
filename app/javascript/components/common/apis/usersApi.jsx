import axios from "../apiService";

const path = "/users";
const path1 = "/messages"

const get = async () => axios.get(path);
const show = async (id) => axios.get(`${path}/${id}`);
const getMessage = async (query = "") => axios.get(query ? `${path1}?${query}` : path1);

const usersApi = { get, show, getMessage };

export default usersApi;
