import { Component } from '@angular/core';

import { Website } from '../types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent {


  form: FormGroup;

  constructor(private fb: FormBuilder) {

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.form = this.fb.group({
      nome: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(reg)]], //validaçao com ReGex
      importancia: ['', Validators.required] //exemplo
    });
  }

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

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      //fazer o tratamento?
    }
  }
}
