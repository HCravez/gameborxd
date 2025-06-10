export interface Game {
  id: string;
  title: string;
  platform: string;
  hoursPlayed: number;
  totalDuration: number;
  price: number;
  rating: number;
  status: 'Já joguei' | 'Quero jogar' | 'Abandonei' | '100% fiz tudo!'| 'Jogando'| 'Finalizado';
  userId: string;
  userName?: string;
}