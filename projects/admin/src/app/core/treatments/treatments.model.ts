export interface Treatment {
  id: string;
  status: string;
  enterDate: string;
  dischargeDate: string;
  medications: any[];
  food: string[];
  conclusiveReport: string;
  conclusiveReportShort?: string;
  dischargeCare: string;
  clinicEvo: any;
  clinicEvoResume: number;
  petId: string;
  petName: string;
  vetId: string;
  vetName: string;
}
