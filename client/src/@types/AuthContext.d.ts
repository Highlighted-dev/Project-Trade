import { AxiosError } from 'axios';

export type IAxiosErrorRestApi = AxiosError & {
  response: {
    data: {
      error: string;
      status: string;
      message: string;
    };
  };
};

export interface IUser {
  _id: string | null;
  username: string | null;
  email: string | null;
  birthdate: string | null;
  sex: string | null;
  role: string | null;
}

export type AuthContextType = {
  authState: IUser;
  register: (
    username: string,
    email: string,
    password: string,
    birthdate: string,
    sex: string,
  ) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
};
