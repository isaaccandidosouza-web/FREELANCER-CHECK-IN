
export interface Role {
  title: string;
  vacancies: number;
  value?: string; // Compensation amount e.g. "R$ 150,00"
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  roles: Role[];
  imageUrl?: string;
}

export interface Freelancer {
  fullName: string;
  cpf: string;
  rg: string;
  phone: string;
  address: string;
  selectedRole: string;
}

export interface Registration extends Freelancer {
  id: string;
  eventId: string;
  timestamp: string;
}
