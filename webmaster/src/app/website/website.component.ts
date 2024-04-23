import { Component, booleanAttribute } from '@angular/core';

import { Website } from '../types';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent {

  form: FormGroup;

  addForm: boolean = false;

  constructor(private fb: FormBuilder) {

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required, Validators.pattern(reg)]], //validaçao com ReGex
      page: ['', [Validators.required, Validators.pattern(reg)]],
      importancia: ['', Validators.required] //exemplo
    });
  }


  website: Website = { // Declare a propriedade 'website' e inicialize-a com um objeto vazio ou com dados iniciais
    id: 0,
    name: "moodle_FCUL",
    URL: 'https://moodle.ciencias.ulisboa.pt',
    pages: []
  };

  selectedWebsite?: Website;

  onSelect(website: Website): void {
    this.selectedWebsite = website;
  }

  //o url tem de ser valido senao da barraca
  removeUrlPrefix(url: string | null): string {
    // Remove 'https://' ou 'http://'
    if (url == null) {
      url = '';
    }
    url = url.replace(/^https?:\/\//, '');
    // Remove o www.
    url = url.replace(/^www./, '');
    // Corta tudo após a barra (/)
    const idx = url.indexOf('/');
    if (idx !== -1) {
        url = url.substring(0, idx);
    }
    return url;
  }

  checkDomains() {
    const urlValue: string = this.form.get('url')?.value;
    const pageValue: string = this.form.get('page')?.value;

    // Verifica se ambos os valores não são null
    if (urlValue !== null && pageValue !== null) {
        const urlWithoutPrefix = this.removeUrlPrefix(urlValue);
        const pageWithoutPrefix = this.removeUrlPrefix(pageValue);
        return urlWithoutPrefix === pageWithoutPrefix;
    }

    // Retorna true se ambos os valores forem null
    return urlValue === pageValue;
  }





  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      //fazer o tratamento?
    }
  }

}
