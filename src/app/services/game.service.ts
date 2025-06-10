import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000'; // URL do JSON Server
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  addGame(game: Game): Observable<Game> {
    if (this.isBrowser) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      game.userId = currentUser.id;
      game.userName = currentUser.name; 
    }
    
    return this.http.post<Game>(`${this.apiUrl}/games`, game).pipe(
      tap(newGame => {
        console.log('Jogo adicionado com sucesso:', newGame);
      }),
      catchError(error => {
        console.error('Erro ao adicionar jogo:', error);
        throw error;
      })
    );
  }


  getGamesWithUsers(): Observable<Game[]> {
    return this.http.get<any>(`${this.apiUrl}/games?_expand=user`).pipe(
      map(response => {
        return response.map((item: any) => ({
          ...item,
          userName: item.user?.name || 'Anônimo'
        }));
      }),
      catchError(error => {
        console.error('Erro ao buscar jogos:', error);
        return of([]);
      })
    );
  }

  getGameById(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar jogo com ID ${id}:`, error);
        throw error;
      })
    );
  }


  getGamesByUser(userId: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games?userId=${userId}&_sort=title`).pipe(
      map(games => games.map(game => ({
        ...game,
        userName: game.userName
      })),
      catchError(error => {
        console.error(`Erro ao buscar jogos do usuário ${userId}:`, error);
        return of([]);
      })
    ))
  }

  
getPopularGames(limit: number = 8): Observable<Game[]> {
  return this.http.get<Game[]>(`${this.apiUrl}/games`).pipe(
    map(games =>
      games
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating; // rating decrescente
          }
          return a.title.localeCompare(b.title); // título crescente
        })
        .slice(0, limit)
        .map(game => ({
          ...game,
          userName: game.userName
        }))
    ),
    catchError(error => {
      console.error('Erro ao buscar jogos populares:', error);
      return of([]);
    })
  );
}




  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/games/${game.id}`, game).pipe(
      tap(updatedGame => {
        console.log('Jogo atualizado com sucesso:', updatedGame);
      }),
      catchError(error => {
        console.error(`Erro ao atualizar jogo ${game.id}:`, error);
        throw error;
      })
    );
  }

  deleteGame(gameId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/games/${gameId}`).pipe(
      tap(() => {
        console.log(`Jogo ${gameId} removido com sucesso`);
      }),
      catchError(error => {
        console.error(`Erro ao remover jogo ${gameId}:`, error);
        throw error;
      })
    );
  }


  private getCurrentUserName(): string {
    if (!this.isBrowser) return 'Anônimo';
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || 'Você';
  }

  searchGames(term: string): Observable<Game[]> {
    if (!term.trim()) return of([]);
    
    return this.http.get<Game[]>(
      `${this.apiUrl}/games?q=${term}&_sort=title`
    ).pipe(
      catchError(error => {
        console.error(`Erro na busca por "${term}":`, error);
        return of([]);
      })
    );
  }
}