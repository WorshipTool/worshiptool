export const BACKEND_URL =
    process.env.NODE_ENV !== "production"
        ? "http://localhost:3300"
        : "https://chvalotce.cz/api";
export const POSTPARSEIMAGE_URL = "/song/parse";
