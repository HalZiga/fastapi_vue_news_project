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
