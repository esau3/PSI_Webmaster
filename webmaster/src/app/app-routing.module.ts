import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website/website.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'website', component: WebsiteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }