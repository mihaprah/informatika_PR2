interface Measurement {
    id: number;
    date: string;
    filledWithZeros: boolean;
    modifiedWithEvenDatesStrategy: boolean;
    invalidFlag: boolean;
    highUsage: number;
    lowUsage: number;
    usage: number;
    measuredValue: number;
    register: string;
}