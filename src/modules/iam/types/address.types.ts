export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  province_id: string;
}

export interface District {
  id: string;
  name: string;
  regency_id: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertAddressInput {
  address: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface AddressFormState {
  address: string;
  state: string; // Province Name
  city: string; // City/Regency Name
  district: string; // District Name (UI helper)
  postal_code: string;
  country: string;
}
