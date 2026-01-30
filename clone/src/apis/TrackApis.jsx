import { AxiosIntance } from "../config/Axios.Intance";

// CREATE
export const uploadTrackApi = async (data) => {
  const formData = new FormData();

  const sanitize = (value) =>
    typeof value === "string" ? value.trim() : value;

  // Text fields
  formData.append("title", sanitize(data.title));
  formData.append("label", sanitize(data.label));
  if (data.upcEan) formData.append("upcEan", sanitize(data.upcEan));
  formData.append("primaryArtist", sanitize(data.primaryArtist));
  if (data.featuring) formData.append("featuring", sanitize(data.featuring));
  formData.append("lyricist", sanitize(data.lyricist));
  formData.append("composer", sanitize(data.composer));
  if (data.arranger) formData.append("arranger", sanitize(data.arranger));
  if (data.producer) formData.append("producer", sanitize(data.producer));
  formData.append("genre", sanitize(data.genre));
  formData.append("lyricsLanguage", sanitize(data.lyricsLanguage));
  formData.append("pLine", sanitize(data.pLine));
  formData.append("cLine", sanitize(data.cLine));
  formData.append("titleLanguage", sanitize(data.titleLanguage));
  formData.append("productionYear", sanitize(data.productionYear));
  formData.append("releaseDate", sanitize(data.releaseDate));

  formData.append("instrumental", data.instrumental ? "true" : "false");
  formData.append(
    "parentalAdvisory",
    data.parentalAdvisory ? "true" : "false"
  );
  formData.append("isrcGeneration", data.isrcGeneration ? "true" : "false");
  formData.append("crbtCut", data.crbtCut ? "true" : "false");

  if (data.audioFile) {
    formData.append("audioFile", data.audioFile);
  }
  if (data.coverArt) {
    formData.append("coverArt", data.coverArt);
  }

  const res = await AxiosIntance.post("/tracks", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { msg, track }
};

// LIST with filter, sort, search, pagination
export const fetchTracksApi = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "all",
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (search) params.set("search", search);
  console.log(params.toString())
  if (status && status !== "all") params.set("status", status);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const res = await AxiosIntance.get(`/tracks?${params.toString()}`);
  return res.data; // { msg, tracks, pagination }
};

// GET one
export const getTrackApi = async (id) => {
  const res = await AxiosIntance.get(`/tracks/${id}`);
  return res.data; // { msg, track }
};

// UPDATE (no audio, optional coverArt)
export const updateTrackApi = async (id, data) => {
  const formData = new FormData();

  const sanitize = (value) =>
    typeof value === "string" ? value.trim() : value;

  const fields = [
    "title",
    "label",
    "upcEan",
    "primaryArtist",
    "featuring",
    "lyricist",
    "composer",
    "arranger",
    "producer",
    "genre",
    "lyricsLanguage",
    "pLine",
    "cLine",
    "titleLanguage",
    "productionYear",
    "releaseDate",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      formData.append(field, sanitize(data[field]));
    }
  });

  formData.append("instrumental", data.instrumental ? "true" : "false");
  formData.append(
    "parentalAdvisory",
    data.parentalAdvisory ? "true" : "false"
  );
  formData.append("isrcGeneration", data.isrcGeneration ? "true" : "false");
  formData.append("crbtCut", data.crbtCut ? "true" : "false");

  if (data.coverArt instanceof File) {
    formData.append("coverArt", data.coverArt);
  }

  const res = await AxiosIntance.put(`/tracks/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { msg, track }
};
