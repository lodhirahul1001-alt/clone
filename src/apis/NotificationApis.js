import { AxiosIntance } from "../config/Axios.Intance";

// NOTE: Backend should implement these routes.
// GET /api/notifications?limit=&cursor=&unread=
export const getMyNotificationsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/notifications", { params });
  const data = res.data || {};
  const list = data?.items || data?.notifications || data?.data || [];
  const normalized = (Array.isArray(list) ? list : []).map((n) => ({
    ...n,
    id: n?.id || n?._id,
    read: n?.read ?? n?.isRead ?? false,
    desc: n?.desc || n?.message || "",
    time: n?.time || n?.createdAt,
  }));

  return {
    ...data,
    items: normalized,
    notifications: normalized,
  };
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

// GET /api/notification/active
// Active admin notice shown to all logged-in dashboard users
export const getActiveDashboardNoticeApi = async () => {
  const res = await AxiosIntance.get("/notification/active");
  return res.data;
};
