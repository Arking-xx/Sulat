import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export async function checkUsernameAvailibity(username: string) {
  try {
    const response = await axios.get(`${API_URL}/api/users?username=${username}`);
    const data = response.data;
    return data.available;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to fetch username');
    throw error;
  }
}
