import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';



@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent {
    page: Page | undefined;
    pageData: Page | undefined;
  
    constructor(
      private route: ActivatedRoute,
      private websiteService: WebsiteService,
      private location: Location,
      private router: Router,
      public dialog: MatDialog
    ) {
    }
    
    ngOnInit(): void {
      this.getPage();
    }

    getPage(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== null) {
        this.websiteService.getPage(id)
          .subscribe((page: Page) => {
            this.page = page;
          });
      }
    }
}
