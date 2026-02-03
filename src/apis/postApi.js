import { AxiosIntance } from "../config/Axios.Intance";

// POST /api/post/creat-post
// images: File[] (from file input)
// tags: array of user IDs
export const createPostApi = async ({ caption, location, tags, images }) => {
  const formData = new FormData();
  if (caption) formData.append("caption", caption);
  if (location) formData.append("location", location);
  if (tags && tags.length) {
    formData.append("tags", JSON.stringify(tags));
  }
  images.forEach((file) => {
    formData.append("images", file);
  });

  const res = await AxiosIntance.post("/post/creat-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { msg, post }
};

// GET /api/post/allposts
export const getAllPostsApi = async () => {
  const res = await AxiosIntance.get("/post/allposts");
  return res.data; // { message, posts }
};

// GET /api/post/user-posts
export const getMyPostsApi = async () => {
  const res = await AxiosIntance.get("/post/user-posts");
  return res.data; // { msg, userPosts }
};

// GET /api/post/delete/:postId
export const deletePostApi = async (postId) => {
  const res = await AxiosIntance.get(`/post/delete/${postId}`);
  return res.data; // { msg }
};

// GET /api/post/like/:postId
export const likePostApi = async (postId) => {
  const res = await AxiosIntance.get(`/post/like/${postId}`);
  return res.data; // { msg }
};

// GET /api/post/unlike/:postId
export const unlikePostApi = async (postId) => {
  const res = await AxiosIntance.get(`/post/unlike/${postId}`);
  return res.data; // { msg }
};
