export interface ISignUp {
  role: "employer" | "candidate";
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IResponse {
  ok: boolean;
  payload?: { token: string };
  code?: number;
  message?: string;
}

// export type SignupResponse =
//   | { ok: true; payload: string }
//   | { ok: false; code: number; message: string };

// export type AuthResponse =
//   | { ok: true; payload: string }
//   | { ok: false; code: number; message: string };

export type AuthResponse =
  | { ok: true; payload: string }
  | { ok: false; code: number; message: string };

export type ISignIn = Pick<ISignUp, "email" | "password">;
