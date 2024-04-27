import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
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