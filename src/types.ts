export type Grave = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // za brzu pretragu
  birthDate?: string; // npr. "1950-01-09" ili "09.01.1950"
  deathDate?: string;
  section?: string;
  row?: string;
  plotNumber?: string;
  notes?: string;
  lat: number;
  lng: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};
