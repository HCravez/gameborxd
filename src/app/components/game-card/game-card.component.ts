import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../models/game.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  imports: [CommonModule, RouterModule, FormsModule, RatingStarsComponent],
  standalone: true, 
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  @Input() game!: Game;
  @Input() showActions = true;
  @Input() gamelistpage = true;
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
}