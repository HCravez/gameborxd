import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html', 
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true, 
  styleUrls: ['./rating-stars.component.css']
})
export class RatingStarsComponent {
  @Input() rating = 0;
  @Input() showText = false;
  @Input() editable = false;
  @Output() ratingChange = new EventEmitter<number>();

  starsArray = [1, 2, 3, 4, 5];

  get ratingText(): string {
    const texts = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];
    return texts[this.rating - 1] || '';
  }

  onRate(star: number): void {
    if (this.editable) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }
}