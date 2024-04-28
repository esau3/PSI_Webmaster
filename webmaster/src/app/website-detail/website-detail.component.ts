import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Website } from '../types';
import { WebsiteService } from '../services/websites.service';
//import { WebsiteService } from '../services/websites.service'
import { ActivatedRoute } from '@angular/router';
//import { WEBSITES } from '../mock-websites';

@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrl: './website-detail.component.scss'
})

export class WebsiteDetailComponent implements OnInit {
  website: Website | undefined;

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getWebsite();
  }

  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.websiteService.getWebsite(id)
        .subscribe((website: Website) => this.website = website);
    } else {
    }
  }

  goBack(): void {
    this.location.back();
  }
}
