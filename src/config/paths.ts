import path from "node:path";

/** Folder for saved login sessions. Gitignored: it contains session cookies. */
export const AUTH_DIR = path.resolve(process.cwd(), "playwright/.auth");

export const STANDARD_USER_STATE = path.join(AUTH_DIR, "standard-user.json");
