export interface Flight {
  id: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
    code: string;
  };
  arrival: {
    airport: string;
    time: string;
    code: string;
  };
  price: number;
  duration: string;
  stops: number;
  locale?: string;
}
