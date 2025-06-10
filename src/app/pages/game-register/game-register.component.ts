import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';        
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './game-register.component.html',
  styleUrls: ['./game-register.component.css']
})
export class GameRegisterComponent implements OnInit {
  game: Partial<Game> = {
    title: '',
    platform: 'PC',
    hoursPlayed: 0,
    totalDuration: 0,
    price: 0,
    rating: 0,
    status: 'Já joguei',
    userId: ''
  };
  
  editing = false;
  loading = false;
  error = '';

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.editing = true;
      this.loadGame(gameId);
    }
  }

  loadGame(id: string): void {
    this.gameService.getGameById(id).subscribe(game => {
      if (game) {
        this.game = game;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Usuário não autenticado. Por favor, faça login.';
      this.loading = false;
      return;
    } 
    if (!this.game.title || !this.game.platform) {
      this.error = 'Título e plataforma são obrigatórios.';
      this.loading = false;
      return;
    } 
    const gameToSave: Game = {
      id: this.editing && this.game.id ? this.game.id : uuidv4(),
      title: this.game.title || '',
      platform: this.game.platform || 'PC',
      hoursPlayed: this.game.hoursPlayed || 0,
      totalDuration: this.game.totalDuration || 0,
      price: this.game.price || 0,
      rating:  this.game.rating ? this.game.rating : 0,
      status: this.game.status || 'Já joguei',
      userId: currentUser ? currentUser.id : '',
      userName: currentUser ? currentUser.name : ''
    };

    const operation = this.editing 
      ? this.gameService.updateGame(gameToSave)
      : this.gameService.addGame(gameToSave);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/games/list']);
      },
      error: (err) => {
        this.error = 'Erro ao salvar o jogo. Tente novamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/games/list']);
  }
}