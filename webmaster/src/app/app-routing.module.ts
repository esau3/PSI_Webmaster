import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website/website.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WebsitesTableComponent } from './websites-table/websites-table.component';
import { WebsiteDetailComponent } from './website-detail/website-detail.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';

const routes: Routes = [
  { path: 'website', component: WebsiteComponent },
  { path: 'side-nav', component: SideNavComponent },
  { path: 'websites-table', component: WebsitesTableComponent },
  { path: 'website-detail/:id', component: WebsiteDetailComponent },
  { path: 'report-detail/:id', component: ReportDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }