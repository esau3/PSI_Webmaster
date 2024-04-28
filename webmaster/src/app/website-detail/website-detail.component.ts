import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute } from '@angular/router';
import { ConsoleReporter } from 'jasmine';

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
    private location: Location
  ) {}
  
  ngOnInit(): void {
    console.log(this.website);
    console.log(this.pages);
    this.getWebsite();
    this.getPages();
  }

  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.websiteService.getWebsite(id)
        .subscribe((website: Website) => this.website = website);
    } else {
    }
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
  
  
  

  goBack(): void {
    this.location.back();
  }
}
