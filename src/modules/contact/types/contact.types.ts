export interface Tag {
  id: string;
  name: string;
  tenant_id?: string;
  createdAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags?: (Tag | string)[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContactInput {
  name: string;
  phone: string;
  tags?: string[];
  tag_ids?: string[];
}

export interface UpdateContactInput {
  id: string;
  name?: string;
  phone?: string;
  tags?: string[];
  tag_ids?: string[];
}

export interface ContactFilter {
  search?: string;
  tag?: string;
}

export interface GetContactsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
}
