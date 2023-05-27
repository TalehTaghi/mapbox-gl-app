import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
const BEARER_TOKEN = import.meta.env.VITE_APP_BEARER_TOKEN;

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
    },
});