import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrl: './website-detail.component.scss'
})

export class WebsiteDetailComponent implements OnInit {
  website: Website | undefined;
  pages: Page[] | undefined;
  pageData: Page | undefined;


  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.getWebsite();
    this.getPages();
  }

  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.websiteService.getWebsite(id)
        .subscribe((website: Website) => this.website = website);
    }
  }

  deleteWebsite(id: string): void {
    this.websiteService.deleteWebsite(id)
      .subscribe(
        () => {
          this.router.navigate(['/websites-table']);
        }
      );
    }

  getPages(): void {
    if (this.website && this.website.pages) {
      const pages = this.website.pages;
      
      for (const page of pages) {
        this.websiteService.getPage(page._id)
          .subscribe((pageData: Page) => {
            console.log('Página obtida:', pageData);
            pages.push(pageData); 
          });
      }
    }
  }

  startEvaluation(id:string):void{
    this.websiteService.startEvaluation(id);
    console.log("evaluation");
    this.reloadPage();
  }

  deletePage(id:string ):void{
    this.websiteService.deletePage(id).subscribe(
      () => {
          this.reloadPage();
      });
  }

  reloadPage() :void{
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
  
  goBack(): void {
    this.location.back();
  }
}
