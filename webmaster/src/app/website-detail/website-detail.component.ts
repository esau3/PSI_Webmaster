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
    const _id = String(this.route.snapshot.paramMap.get('_id'));
    this.websiteService.getWebsite(_id)
      .subscribe((website: any) => this.website = website);
  }

  goBack(): void {
    this.location.back();
  }
}
