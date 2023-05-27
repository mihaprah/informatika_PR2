interface Measurement {
  id: number;
  date: string;
  filledWithZeros: boolean;
  modifiedWithEvenDatesStrategy: boolean;
  invalidFlag: boolean;
  onlyMeasuredValue: boolean;
  highUsage: number;
  lowUsage: number;
  usage: number;
  measuredValue: number;
  register: string;
}
