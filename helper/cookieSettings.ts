// export const cookieSettings = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   maxAge: 3 * 24 * 60 * 60 * 1000,
//   sameSite: "none" as "none",
//   // sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
//   //   | "none"
//   // | "lax",
//   path: "/",
// };

import { CookieOptions } from "express";

export const cookieSettings: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 86400000,
};
