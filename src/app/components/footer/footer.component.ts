import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true, 
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

}