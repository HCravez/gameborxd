import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';        
import { RouterModule } from '@angular/router';  
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { GameCardComponent } from '../../components/game-card/game-card.component';
  

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, GameCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  popularGames: Game[] = [];

  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadPopularGames();
  }

  loadPopularGames(): void {
    this.gameService.getPopularGames().subscribe(games => {
      this.popularGames = games;
    });
  }
}