import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page, Report, errorProb } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { arrowComponent } from '../arrow.component';


@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrl: './website-detail.component.scss'
})

export class WebsiteDetailComponent extends arrowComponent implements OnInit {
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
    private _snackBar: MatSnackBar,private renderer2: Renderer2, 
    private elRef2: ElementRef
    
  ) {
    super(renderer2,elRef2);

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.form = this.fb.group({
      pageUrl: ['', [Validators.required, Validators.pattern(reg)]]
    });
  }
  
  override ngOnInit(): void {
    super.ngOnInit();
    this.getWebsite();
    //this.getReports();
    //this.calculateProb();
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
      if (this.website) {
        const pageObservables = this.website.pages.map(page =>
          this.websiteService.getPage(page._id)
        );
    
        forkJoin(pageObservables).subscribe((pagesData: Page[]) => {
          this.pages = pagesData;
          //console.log("get pages", this.pages);
          this.getReports(); 
        });
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
    if (id !== null) {
      this.websiteService.getReport(id)
        .subscribe((report: Report) => {
          if (this.reports === undefined) {
            this.reports = []; 
          }
          this.reports.push(report);
          this.calculateProb();
        });
    }
  }
  
  getReports(): void {
    this.reports = [];
    //console.log(this.pages);
    if (this.pages) {
      this.pages.forEach(page => {
        //console.log(page._id);
        this.getReport(page._id);
      });
    }
  }

/*
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
}*/

  calculateProb(): void {

    let presentAError = true;
    let presentAAError = true;
    let presentAAAError = true;
    let noError = 0;
    let errorAReport = 0;
    let errorAAReport = 0;
    let errorAAAReport = 0;
    let pagesEvaluated = 0;
    const hashMap = new Map<string, number>();

    //demora mas chega
    //console.log("Probabilidades", this.reports);

    if (this.reports) {
        for (const report of this.reports) {
            //console.log(report);
            pagesEvaluated++;

            for (const rule of report.rules) {

              presentAError = true;
              presentAAError = true;
              presentAAAError = true;
            
                if (rule.rule_type.includes('A') && rule.outcome === 'failed' && presentAError) {
                    presentAError = false;
                    errorAReport++;
                }

                if (rule.rule_type.includes('AA') && rule.outcome === 'failed' && presentAAError) {
                    presentAAError = false;
                    errorAAReport++;
                }

                if (rule.rule_type.includes('AAA') && rule.outcome === 'failed' && presentAAAError) {
                    presentAAAError = false;
                    errorAAAReport++;
                }

                if (presentAError && presentAAError && presentAAAError) {
                    noError++;
                }

                //tirar o QW- de antes da string, pode-se tira o ACT- tb
                const code = rule.code.slice(7);
                const value = hashMap.get(code);
                if (value !== undefined) {
                    hashMap.set(code, rule.failed + value);
                } else {
                    hashMap.set(code, rule.failed);
                }
            }
        }
    }

    const mapEntries = Array.from(hashMap.entries());

    //console.log(mapEntries);
    // Ordenar o array com base nos valores
    mapEntries.sort((a, b) => b[1] - a[1]);

    console.log(errorAAAReport);
    console.log(errorAAReport);
    console.log(errorAReport);
    console.log(noError);

    if (this.reports) {
      //numero de rules avaliadas
        const nRules = 68;
        this.errorProb = {
            errorNoProb: ((nRules - noError) / nRules) * 100,
            errorProb: (noError / nRules) * 100,
            errorAProb: (errorAReport / nRules) * 100,
            errorAAProb: (errorAAReport / nRules) * 100,
            errorAAAProb: (errorAAAReport / nRules) * 100,
            commonError: mapEntries.slice(0, 10),
            pagesEvaluated: pagesEvaluated
        };
    }
    console.log(pagesEvaluated);
    console.log(this.errorProb);
  }
}



