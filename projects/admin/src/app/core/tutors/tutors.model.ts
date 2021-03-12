export interface Tutor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cellphone: string;
  telephone: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  birthday: string;
  cpf: string;
  pets: any[];
  jwtToken?: string;
  role?: string;
  status?: Status; 
}

export enum Role {
  Admin = 'Admin',
  Vet = 'Vet',
  Nurse = 'Nurse',
  User = 'User',
}

export enum Status {
  online = 'online',
  offline = 'offline'
}
