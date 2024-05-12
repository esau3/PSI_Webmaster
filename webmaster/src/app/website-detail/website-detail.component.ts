import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page, Report, errorProb } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrl: './website-detail.component.scss'
})

export class WebsiteDetailComponent implements OnInit {
  website: Website | undefined;
  //page: Page | undefined;
  pages: Page[] | undefined;
  pageData: Page | undefined;
  form: FormGroup;
  
  reports:Report[] | undefined;
  errorProb: errorProb|undefined;

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.form = this.fb.group({
      pageUrl: ['', [Validators.required, Validators.pattern(reg)]]
    });
  }
  
  ngOnInit(): void {
    this.getWebsite();
    this.calculateProb();
  }

  //o this.website apenas funciona aqui dentro, parece que nao propaga
  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.websiteService.getWebsite(id)
        .subscribe((website: Website) => {
          this.website = website;
          this.getPages();
        });
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

    //este metodo ainda tem problemas, o this.website é sempre un.defined...
  getPages(): void {
    //console.log(this.website?.pages);
    if (this.website) {
      
      for (const page of this.website.pages) {
        this.websiteService.getPage(page._id)
          .subscribe((pageData: Page) => {
            //console.log('Página obtida:', pageData);
            //quando this.pages é undefined o push n e chamado
            if (this.pages === undefined) {
              this.pages = [];
            }
            this.pages.push(pageData);
            //console.log("get pages", this.pages);
            //console.log("id do report?", pageData.report);
            //this.getReport(String(pageData.report)); 
          });
      }
      
    }
  }

  updatePages() {
    const id = this.route.snapshot.paramMap.get('id');
    const urlValue: string = this.form.get('pageUrl')?.value;
    const page = {
      url: urlValue,
      eval_date: new Date(0),
      monitor_state: "Por avaliar"
    };
    if (id) {
      this.websiteService.putPage(page, id).subscribe({
        next: (res) => {
          console.log("Page updated successfully:", res);
        },
        error: (err) => {
          console.error("Error updating page:", err);
        }
      });
    }
    //isto e bem perigoso, causa duplicacoes dentro do subscribe
    location.reload();
  }

  startEvaluation(id:string):void{
    this.websiteService.startEvaluation(id).subscribe({
      next: () => {
        // Avaliação concluída com sucesso
        // Chame o método openSnackBar() para exibir a notificação
        this.openSnackBar("Evaluation of the page has started!");
      },
      error: (error) => {
        // Tratar erros, se necessário
        console.error("Error during page evaluation:", error);
      }
    });
    location.reload();
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
  
  goBack(): void {
    this.location.back();
  }

  submitForm() {
    if (this.form.valid) {
      this.updatePages();
      //console.log(this.form.value);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {duration: 5000});
  }

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: string): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'true') {
      this.deleteWebsite(id);
    }
  });
  }

  getReport(id: string): void {
    console.log(id);
    if (id) {
        this.websiteService.getReport(id)
          .subscribe((report: Report) => {
            if (this.reports === undefined) {
              this.reports = []; 
            }
            this.reports.push(report);
            console.log(this.reports);
          });
    }
}

  calculateProb():void{

    var presentAError;
    var presentAAError;
    var presentAAAError;
    var noError=0;
    var errorAReport=0;
    var errorAAReport=0;
    var errorAAAReport=0;
    let hashMap = new Map<string, number>();

    console.log(this.reports);

    if(this.reports)
    for(const report of this.reports){

      console.log(report);

      presentAError=true;
      presentAAError=true;
      presentAAAError=true;

      for(const rule of report.rules){

        console.log(rule.rule_type);

        if(rule.rule_type==='A'&&rule.outcome==='Failed'&&presentAError){
          presentAError=false;
          errorAReport++;
        }else if(rule.rule_type==='AA'&&rule.outcome==='Failed'&&presentAAError){
          presentAAError=false;
          errorAAReport++;
        }else if(rule.rule_type==='AAA'&&rule.outcome==='Failed'&&presentAAAError){
          presentAAAError=false;
          errorAAAReport++;
        }

        if(presentAError&&presentAAError&&presentAAAError){
          noError++;
        }

        if(hashMap.has(rule.code)){
          const value=hashMap.get(rule.code)
          if(value)
          hashMap.set(rule.code,rule.failed+value);

        }else{
          hashMap.set(rule.code,rule.failed);
        }
      }

    }

    const mapEntries = Array.from(hashMap.entries());

// Sort the array based on values
    mapEntries.sort((a, b) => a[1] - b[1]);

    if(this.reports && this.errorProb)
    this.errorProb={errorNoProb:(this.reports.length-noError)/this.reports.length,
      errorProb:noError/this.reports.length,
      errorAProb:errorAReport/this.reports.length,
      errorAAProb:errorAAReport/this.reports.length,
      errorAAAProb:errorAAAReport/this.reports.length,
      commonError:mapEntries.slice(0,10)
  };

  console.log(this.errorProb);

    
  }
}


