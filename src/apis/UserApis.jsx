import { AxiosIntance } from "../config/Axios.Intance";

// GET /api/user
export const getAllUsersApi = async () => {
  const res = await AxiosIntance.get("/user");
  return res.data; // { msg, allUsers }
};

// GET /api/user/follow/:user_id
export const followUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/follow/${userId}`);
  return res.data; // { message: "Followed" }
};

// GET /api/user/unfollow/:user_id
export const unfollowUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/unfollow/${userId}`);
  return res.data; // { msg: "Unfollowed" }
};

// GET /api/user/block/:user_id
export const blockUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/block/${userId}`);
  return res.data; // { msg: "usr blocked" }
};

// NEW: get logged-in user's profile
export const getProfileApi = async () => {
    const res = await AxiosIntance.get("/user/profile");
    return res.data; // { msg, user }
  };
  
  // NEW: update personal profile
  export const updatePersonalProfileApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile", data);
    return res.data; // { msg, user }
  };
  
  // NEW: update bank details
  export const updateBankDetailsApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/bank", data);
    return res.data; // { msg, user }
  };
  
  // NEW: update PAN details
  export const updatePanDetailsApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/pan", data);
    return res.data; // { msg, user }
  };
  
  // NEW: change password
  export const changePasswordApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/password", data);
    return res.data; // { msg }
  };

// POST /api/user/profile-picture (multipart)
export const uploadProfilePictureApi = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await AxiosIntance.post("/user/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { msg, dp }
};
