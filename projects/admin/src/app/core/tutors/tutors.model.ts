export interface Tutor {
  id: string;
  name: string;
  lastName: string;
  avatar: string;
  cellPhone: string;
  tel: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  birthday: string;
  cpf: string;
  pets: any[];
  jwtToken?: string;
  role?: string;
}

export enum Role {
  User = 'User',
  Admin = 'Admin'
}
