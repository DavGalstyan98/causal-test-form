import axios from "axios";

const API_URL = "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete";

export const fetchSuggestions = async (search: string) => {
  const res = await axios.get(`${API_URL}?search=${search}`);
  return res.data;
};
