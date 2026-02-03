import { AxiosIntance } from "../config/Axios.Intance";

// GET /api/chats/all-followings
export const getChatFollowingsApi = async () => {
  const res = await AxiosIntance.get("/chats/all-followings");
  return res.data; // { msg, allFollowing }
};
