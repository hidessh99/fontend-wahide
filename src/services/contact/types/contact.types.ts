export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContactInput {
  name: string;
  phone: string;
  tags?: string[];
}

export interface UpdateContactInput {
  id: string;
  name?: string;
  phone?: string;
  tags?: string[];
}

export interface ContactFilter {
  search?: string;
  tag?: string;
}
