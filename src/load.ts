import axios from 'axios';

export const loadSmartStorePage = async (url: string): Promise<string> => {
  const resp = await axios.get(url)
  return resp.data
}