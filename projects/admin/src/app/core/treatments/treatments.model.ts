export interface Treatment {
  id: string;
  status: string;
  enterDate: string;
  dischargeDate: string;
  medications: string[];
  food: string[];
  conclusiveReport: string;
  dischargeCare: string;
  clinicEvo: any;
  clinicEvoResume: number;
  petId: string;
  belongsToVet: string;
}
