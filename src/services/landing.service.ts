import api from '../config/api';
import IContact from "../interfaces/contact";

const send = async (data: IContact) => {
  try {
    const response = await api.post(`slinqer/landing/contact`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

const exportObject = {
  send,
};

export default exportObject;
