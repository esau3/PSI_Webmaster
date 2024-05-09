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
export class ReportDetailComponent implements OnInit{
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

    deletePage(id:string ):void{
      this.websiteService.deletePage(id).subscribe({
        next: (res) => {
          console.log("Page deleted successfully:", res);
        },
        error: (err) => {
          console.error("Error deleting page:", err);
        }
      });
      location.reload();
    }

    openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: string): void {
      let dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.deletePage(id);
      }
    });
    }

    goBack(): void {
      this.location.back();
    }
}
