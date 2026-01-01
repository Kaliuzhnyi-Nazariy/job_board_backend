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
  payload?: string;
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

export interface IChangePassword {
  password: string;
  confirmPassword: string;
  token: string;
}

// user interfaces

export interface IUser {
  role: string;
  username: string;
  fullname: string;
  email: string;
}

export type GetMe =
  | { ok: false; code: number; message?: string }
  | { ok: true; user: IUser };
