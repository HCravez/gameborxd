import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';        
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { GameCardComponent } from '../../components/game-card/game-card.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GameCardComponent],
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  loading = true;
  statusFilter = 'all';
  searchTerm = '';

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.gameService.getGamesByUser(currentUser.id).subscribe(games => {
        this.games = games;
        this.filterGames();
        this.loading = false;
      });
    }
  }

  filterGames(): void {
    this.filteredGames = this.games.filter(game => {
      const matchesStatus = this.statusFilter === 'all' ||  game.status.toLowerCase() === this.statusFilter.toLowerCase();
      const matchesSearch = game.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  calculateProgress(game: Game): number {
    if (game.totalDuration > 0) {
      return Math.round((game.hoursPlayed / game.totalDuration) * 100);
    }
    return 0;
  }

  editGame(id: string): void {
    this.router.navigate(['/games/register', id]);
  }

  deleteGame(id: string): void {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
      this.gameService.deleteGame(id).subscribe(() => {
        this.loadGames();
      });
    }
  }
}