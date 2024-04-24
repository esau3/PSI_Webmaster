import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website/website.component';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WebsitesTableComponent } from './websites-table/websites-table.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'website', component: WebsiteComponent },
  { path: 'side-nav', component: SideNavComponent },
  { path: 'websites-table', component: WebsitesTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }