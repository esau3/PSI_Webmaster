import { Component ,HostListener,Renderer2, ElementRef, OnInit} from '@angular/core';
import { arrowComponent } from './arrow.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
//export class AppComponent extends arrowComponent {
export class AppComponent {
  title = 'Webmaster';

  drawer = true;

  toggleDrawer() {
    this.drawer = !this.drawer; // Alterna entre aberto e fechado
  }

  getDrawerValue() {
    return this.drawer;
  }


 
  }
