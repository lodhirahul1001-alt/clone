import { AxiosIntance } from "../../config/Axios.Intance";
import { addUser, removeUser } from "../reducers/AuthSlice";
import { getProfileApi } from "../../apis/UserApis";

// REGISTER
export const fetchRegisterApi = (data) => async (dispatch) => {
  try {
    const res = await AxiosIntance.post("/auth/register", data);
    // registration ke baad direct login nahi kar rahe
    return { success: true, user: res?.data?.user };
  } catch (error) {
    console.log("error in register", error);
    throw error;
  }
};

// LOGIN
export const loginUserApi = (data) => async (dispatch) => {
  try {
    const res = await AxiosIntance.post("/auth/login", data);
    if (res?.data?.user) {
      dispatch(addUser(res.data.user));
      return { success: true, user: res.data.user };
    }
    return { success: false };
  } catch (error) {
    console.log("error in login", error);
    throw error;
  }
};

// LOGOUT
export const logOutUserApi = () => async (dispatch) => {
  try {
    await AxiosIntance.post("/auth/logout");
     dispatch(removeUser(null));



  } catch (error) {
    console.log("error in logout user", error);
    // error hone par bhi local se logout kar denge
  }  
};

// INIT AUTH (on refresh / return) => profile API
export const initAuth = () => async (dispatch) => {
  try {
    const res = await getProfileApi(); // GET /user/profile (authMiddleware protected)
    if (res?.user) {
      dispatch(addUser(res.user));
    } else {
      dispatch(removeUser(null));
    }
  } catch (error) {
    // token invalid/expired => 401 interceptor already redirect karega if needed
    dispatch(removeUser(null));
  }
};
