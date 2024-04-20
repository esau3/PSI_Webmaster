import { Component } from '@angular/core';

import { Website } from '../website';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent {

  website: Website = { // Declare a propriedade 'website' e inicialize-a com um objeto vazio ou com dados iniciais
    id: 0,
    name: "moodle_FCUL",
    URL: 'https://moodle.ciencias.ulisboa.pt/mod/page/view.php?id=247639',
    pages: []
  };

  selectedWebsite?: Website;

  onSelect(website: Website): void {
    this.selectedWebsite = website;
  }
}
