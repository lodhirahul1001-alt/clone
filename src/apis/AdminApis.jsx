import { AxiosIntance } from "../config/Axios.Intance";

export const adminGetUsersApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/users", { params });
  return res.data;
};

export const adminUpdateUserRoleApi = async (userId, role) => {
  const res = await AxiosIntance.patch(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const adminDeleteUserApi = async (userId) => {
  const res = await AxiosIntance.delete(`/admin/users/${userId}`);
  return res.data;
};

export const adminGetTracksApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/tracks", { params });
  return res.data;
};

export const adminUpdateTrackStatusApi = async (trackId, payload) => {
  const res = await AxiosIntance.patch(`/admin/tracks/${trackId}/status`, payload);
  return res.data;
};
