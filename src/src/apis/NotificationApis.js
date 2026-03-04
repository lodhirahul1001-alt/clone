import { AxiosIntance } from "../config/Axios.Intance";

// NOTE: Backend should implement these routes.
// GET /api/notifications?limit=&cursor=&unread=
export const getMyNotificationsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/notifications", { params });
  return res.data;
};

// PATCH /api/notifications/:id/read
export const markNotificationReadApi = async (id) => {
  const res = await AxiosIntance.patch(`/notifications/${id}/read`);
  return res.data;
};

// PATCH /api/notifications/read-all
export const markAllNotificationsReadApi = async () => {
  const res = await AxiosIntance.patch("/notifications/read-all");
  return res.data;
};
