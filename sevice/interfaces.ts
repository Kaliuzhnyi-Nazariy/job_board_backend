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
  data?: { data: { role: "employer" | "candidate" } } | string;
  code?: number;
  message?: string;
}

// export interface ISigninResponse extends IResponse {
//   ok: boolean;
//   payload: { data: { role: "employer" | "candidate" } } | string;
// }

// export type SignupResponse =
//   | { ok: true; payload: string }
//   | { ok: false; code: number; message: string };

// export type AuthResponse =
//   | { ok: true; payload: string }
//   | { ok: false; code: number; message: string };

export type AuthResponse =
  | { ok: true; payload: string }
  | { ok: false; code: number; message: string };

export type AuthSigninResponse =
  | {
      ok: true;
      payload: {
        token: string;
        role: "employer" | "candidate";
      };
    }
  | { ok: false; code: number; message: string };

export type ISignIn = Pick<ISignUp, "email" | "password">;

export interface IChangePassword {
  password: string;
  confirmPassword: string;
  token: string;
}

// user interfaces

export interface IUser {
  id: string;
  role: string;
  username: string;
  full_name: string;
  email: string;
}

export type GetMe = ErrorReqResponse | { ok: true; user: IUser };

// job interfaces

export interface PostJob {
  title: string;
  location: string;
  position: string;
  salary: string;
  education?: string;
  experience?: string;
  description: string;
  responsobilities?: string;
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

export type CandidateJobRes =
  | {
      ok: true;
      data: {
        jobs: IJobData | IJobData[];
        meta: {
          page: number;
          limit: 12 | 16;
          total: number;
        };
      };
    }
  | ErrorReqResponse;

// candidates

export type FullDataCandidate = Omit<IUser, "role"> & {
  id: string;
  biography: string;
  speciality?: string;
  date_of_birth?: Date;
  gender?: "Mr" | "Ms" | "Mx";
  experience?: string;
  education?: string;
  website?: string;
  location?: string;
  phone?: string;
  [key: string]: unknown;
};

// date_of_birth DATE,
// 	gender genders,
// 	experience VARCHAR(64),
// 	education VARCHAR(128),

// 	website VARCHAR(256),
// 	location VARCHAR(256),
// 	phone VARCHAR(32),

// 	created_at TIMESTAMP DEFAULT NOW(),
// 	updated_at TIMESTAMP DEFAULT NOW()

export type Candidates =
  | {
      ok: true;
      data?: IUser | IUser[] | FullDataCandidate;
    }
  | ErrorReqResponse;

export interface UpdateCandidateProfile {
  id: string;
  full_name: string;
  speciality: string;
  experience: string;
  education: string;
  website: string;
}

export type UpdatePortfolio = Pick<
  FullDataCandidate,
  "biogrpahy" | "date_of_birth" | "gender" | "experience" | "education"
> & {
  id: string;
};
