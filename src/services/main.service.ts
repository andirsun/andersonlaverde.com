import api from '../config/api';
import IContact from "../interfaces/contact";
import { IPost } from "../interfaces/blogPost.interface";

const send = async (data: IContact) => {
  try {
    const response = await api.post(`slinqer/landing/contact`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

const fetctPosts = async () => {
  interface IResponse {
    feed: object,
    items: IPost[],
    status: string
  }
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@andirsun');
    const data = await response.json() as IResponse;
    return data;  
  } catch (error) {
    throw new Error("error");
  }
}
const exportObject = {
  send,
  fetctPosts
};

export default exportObject;
