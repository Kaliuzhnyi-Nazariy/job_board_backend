interface ErrorReqResponse {
  ok: false;
  code: number;
  message?: string;
}

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

export type GetMe = ErrorReqResponse | { ok: true; user: IUser };

// job interfaces

export interface PostJob {
  title: string;
  location: string;
  position: string;
  salary: string;
  description: string;
  workTime: "full_time" | "part_time" | "internship" | "contract";
  owner: string;
}

export type UpdateJob = Omit<PostJob, "owner"> & {
  jobId: string;
  description: string;
};

export interface IJobData extends PostJob {
  createdAt: Date;
  [key: string]: unknown;
}

export type EmployerJobRes =
  | { ok: true; job: IJobData | IJobData[] }
  | ErrorReqResponse;
