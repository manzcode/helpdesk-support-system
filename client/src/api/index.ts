import axiosInstance from "./config";

const axios = axiosInstance;

export const auth = (data: any, type: string) =>
  axios.post(`/auth/${type}`, data);

export const getUser = (userId: string) => axios.get(`/auth/user?id=${userId}`);

export const getAllTicket = () => axios.get("/user/all/tickets");

export const closeTicket = (ticketId: string) =>
  axios.get(`/user/close/ticket?id=${ticketId}`);

export const getaticket = (userId: string) =>
  axios.get(`/user/a/ticket?id=${userId}`);

export const showAticket = (ticketId: string) =>
  axios.get(`/user/show/ticket?id=${ticketId}`);

export const showReplies = (ticketId: string) =>
  axios.get(`/user/a/reply?ticketid=${ticketId}`);

export const postticket = (userId: string, formeData: any) =>
  axios.post(`/user/ticket?id=${userId}`, formeData);

export const replyticket = (userId: string, formeData: any) =>
  axios.post(`/user/reply?id=${userId}`, formeData);

export const getFiles = ({
  type,
  id,
}: {
  id: string;
  type: "ticketid" | "replyid";
}) => {
  if (type === "replyid") {
    return axios.get(`/user/files?replyid=${id}`);
  }
  return axios.get(`/user/files?ticketid=${id}`);
};
