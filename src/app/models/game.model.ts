export interface Game {
  id: string;
  title: string;
  platform: string;
  hoursPlayed: number;
  totalDuration: number;
  price: number;
  rating: number;
  status: 'jogado' | 'querojogar' | 'abandonado' | 'completo'| 'emandamento'| 'finalizado';
  userId: string;
  userName?: string;
}