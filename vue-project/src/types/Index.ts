export interface UserForNews {
  login: string;
  roles: string[];
}

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  status: string;
  created_by_user_id: number;
  created_by: UserForNews | null;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  URL: string | null;
  author: string;
  views: number;
  tags: string[];
  category: string;
  can_publish: boolean;
  can_delete_update: boolean;
}

export interface NewsPayload {
  title: string;
  body: string;
  category: string | null;
  tags: string[];
}

export interface NewsUpdatePayload {
  title: string;
  body: string;
  category: string;
  tags: string[];
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  login: string;
  FIO: string | null;
  phone: string | null;
  email: string | null;
  in_ban: boolean;
  created: string;
  roles: Role[];
}

export interface UserUpdatePayload {
  login: string;
  FIO?: string;
  phone?: string;
  email?: string;
  in_ban?: boolean;
  role_ids?: number[];
}

export interface UserForm {
  login: string | null;
  FIO: string | null;
  phone: string | null;
  email: string | null;
  in_ban: boolean;
  roles: Role[];
}

export interface AuthStore {
  token: string | null;
  login: string | null;
  roles: string[];
  id: number | null;
}
