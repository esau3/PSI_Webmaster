import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

import { Website, Page, Report, error } from '../types';
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
  error: error | undefined;

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
    /*
    this.website = websiteMock;
    this.pages = [pageMock1, pageMock2];
    this.reports = [reportMock1, reportMock2];
    this.calculateProb();*/
    this.getWebsite();
    this.getReports();
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
                } else if (rule.failed !== 0) {
                    hashMap.set(code, rule.failed);
                }
            }
        }
    }

    const mapEntries = Array.from(hashMap.entries());

    //console.log(mapEntries);
    // Ordenar o array com base nos valores
    mapEntries.sort((a, b) => b[1] - a[1]);

    if (this.reports) {
      //numero de rules avaliadas
        //const nRules = 68;
        this.error = {
            noError: noError,
            errors: pagesEvaluated - noError,
            errorA: errorAReport,
            errorAA: errorAAReport,
            errorAAA: errorAAAReport,
            commonErrors: mapEntries.slice(0, 10),
            pagesEvaluated: pagesEvaluated,
            nRules: 68
        };
    }
  }
}


const reportMock1: Report = {
  "total_passed": 30,
  "total_warning": 5,
  "total_failed": 5,
  "total_inapplicable": 65,
  "rules": [
    {
      "code": "QW-ACT-R4",
      "name": "Meta-refresh no delay",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe5590484"
    },
    {
      "code": "QW-ACT-R71",
      "name": "`meta` element has no refresh delay (no exception)",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe5590485"
    },
    {
      "code": "QW-ACT-R1",
      "name": "HTML Page has a title",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590486"
    },
    {
      "code": "QW-ACT-R43",
      "name": "Scrollable element is keyboard accessible",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe5590487"
    },
    {
      "code": "QW-ACT-R2",
      "name": "HTML has lang attribute",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590488"
    },
    {
      "code": "QW-ACT-R5",
      "name": "Validity of HTML Lang attribute",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590489"
    },
    {
      "code": "QW-ACT-R63",
      "name": "Document has a landmark with non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559048a"
    },
    {
      "code": "QW-ACT-R64",
      "name": "Document has heading for non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559048b"
    },
    {
      "code": "QW-ACT-R73",
      "name": "Block of repeated content is collapsible",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559048c"
    },
    {
      "code": "QW-ACT-R74",
      "name": "Document has an instrument to move focus to non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559048d"
    },
    {
      "code": "QW-ACT-R6",
      "name": "Image button has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe559048e"
    },
    {
      "code": "QW-ACT-R11",
      "name": "Button has accessible name",
      "passed": 3,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe559048f"
    },
    {
      "code": "QW-ACT-R12",
      "name": "Link has accessible name",
      "passed": 5,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe5590490"
    },
    {
      "code": "QW-ACT-R13",
      "name": "Element with `aria-hidden` has no focusable content",
      "passed": 15,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590491"
    },
    {
      "code": "QW-ACT-R14",
      "name": "meta viewport does not prevent zoom",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe5590492"
    },
    {
      "code": "QW-ACT-R21",
      "name": "svg element with explicit role has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590493"
    },
    {
      "code": "QW-ACT-R22",
      "name": "Element within body has valid lang attribute",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe5590494"
    },
    {
      "code": "QW-ACT-R38",
      "name": "ARIA required owned elements",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590495"
    },
    {
      "code": "QW-ACT-R62",
      "name": "Element in sequential focus order has visible focus",
      "passed": 0,
      "warning": 8,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "warning",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe5590496"
    },
    {
      "code": "QW-ACT-R9",
      "name": "Links with identical accessible names have equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe5590497"
    },
    {
      "code": "QW-ACT-R10",
      "name": "`iframe` elements with identical accessible names have equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe5590498"
    },
    {
      "code": "QW-ACT-R25",
      "name": "ARIA state or property is permitted",
      "passed": 5,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe5590499"
    },
    {
      "code": "QW-ACT-R27",
      "name": "aria-* attribute is defined in WAI-ARIA",
      "passed": 31,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559049a"
    },
    {
      "code": "QW-ACT-R28",
      "name": "Element with role attribute has required states and properties",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559049b"
    },
    {
      "code": "QW-ACT-R34",
      "name": "ARIA state or property has valid value",
      "passed": 5,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe559049c"
    },
    {
      "code": "QW-ACT-R44",
      "name": "Links with identical accessible names and context serve equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe559049d"
    },
    {
      "code": "QW-ACT-R16",
      "name": "Form control has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe559049e"
    },
    {
      "code": "QW-ACT-R41",
      "name": "Error message describes invalid form field value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe559049f"
    },
    {
      "code": "QW-ACT-R20",
      "name": "role attribute has valid value",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904a0"
    },
    {
      "code": "QW-ACT-R33",
      "name": "ARIA required context role",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904a1"
    },
    {
      "code": "QW-ACT-R17",
      "name": "Image has accessible name",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904a2"
    },
    {
      "code": "QW-ACT-R19",
      "name": "iframe element has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904a3"
    },
    {
      "code": "QW-ACT-R70",
      "name": "iframe with negative tabindex has no interactive elements",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904a4"
    },
    {
      "code": "QW-ACT-R58",
      "name": "audio element content has transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904a5"
    },
    {
      "code": "QW-ACT-R59",
      "name": "audio element content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904a6"
    },
    {
      "code": "QW-ACT-R30",
      "name": "Visible label is part of accessible name",
      "passed": 2,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904a7"
    },
    {
      "code": "QW-ACT-R51",
      "name": "video element visual-only content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904a8"
    },
    {
      "code": "QW-ACT-R53",
      "name": "video element visual-only content has transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904a9"
    },
    {
      "code": "QW-ACT-R54",
      "name": "video element visual-only content has audio track alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904aa"
    },
    {
      "code": "QW-ACT-R55",
      "name": "video element visual content has audio description",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904ab"
    },
    {
      "code": "QW-ACT-R56",
      "name": "video element content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904ac"
    },
    {
      "code": "QW-ACT-R60",
      "name": "video element auditory content has captions",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904ad"
    },
    {
      "code": "QW-ACT-R61",
      "name": "Audio and visuals of video element have transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe55904ae"
    },
    {
      "code": "QW-ACT-R49",
      "name": "Audio or video that plays automatically has no audio that lasts more than 3 seconds",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904af"
    },
    {
      "code": "QW-ACT-R50",
      "name": "audio or video that plays automatically has a control mechanism",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904b0"
    },
    {
      "code": "QW-ACT-R24",
      "name": "autocomplete attribute has valid value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904b1"
    },
    {
      "code": "QW-ACT-R35",
      "name": "Heading has accessible name",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904b2"
    },
    {
      "code": "QW-ACT-R36",
      "name": "Headers attribute specified on a cell refers to cells in the same table element",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904b3"
    },
    {
      "code": "QW-ACT-R39",
      "name": "All table header cells have assigned data cells",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904b4"
    },
    {
      "code": "QW-ACT-R42",
      "name": "Object element has non-empty accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904b5"
    },
    {
      "code": "QW-ACT-R67",
      "name": "Letter spacing in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904b6"
    },
    {
      "code": "QW-ACT-R68",
      "name": "Line height in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904b7"
    },
    {
      "code": "QW-ACT-R69",
      "name": "Word spacing in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904b8"
    },
    {
      "code": "QW-ACT-R48",
      "name": "Element marked as decorative is not exposed",
      "passed": 4,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904b9"
    },
    {
      "code": "QW-ACT-R66",
      "name": "Menuitem has non-empty accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904ba"
    },
    {
      "code": "QW-ACT-R77",
      "name": "ARIA required ID references exist",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "6640cfd50b988c7fe55904bb"
    },
    {
      "code": "QW-ACT-R7",
      "name": "Orientation of the page is not restricted using CSS transform property",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904bc"
    },
    {
      "code": "QW-ACT-R37",
      "name": "Text has minimum contrast",
      "passed": 11,
      "warning": 7,
      "failed": 3,
      "inapplicable": 0,
      "outcome": "failed",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904bd"
    },
    {
      "code": "QW-ACT-R65",
      "name": "Element with presentational children has no focusable content",
      "passed": 14,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904be"
    },
    {
      "code": "QW-ACT-R76",
      "name": "Text has enhanced contrast",
      "passed": 4,
      "warning": 7,
      "failed": 10,
      "inapplicable": 0,
      "outcome": "failed",
      "rule_type": [
        "AAA"
      ],
      "_id": "6640cfd50b988c7fe55904bf"
    },
    {
      "code": "QW-ACT-R15",
      "name": "audio or video has no audio that plays automatically",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c0"
    },
    {
      "code": "QW-ACT-R23",
      "name": "video element visual content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c1"
    },
    {
      "code": "QW-ACT-R26",
      "name": "video element auditory content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c2"
    },
    {
      "code": "QW-ACT-R29",
      "name": "Audio element content has text alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c3"
    },
    {
      "code": "QW-ACT-R31",
      "name": "Video element visual-only content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c4"
    },
    {
      "code": "QW-ACT-R32",
      "name": "video element visual content has strict accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904c5"
    },
    {
      "code": "QW-ACT-R75",
      "name": "Bypass Blocks of Repeated Content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "6640cfd50b988c7fe55904c6"
    },
    {
      "code": "QW-ACT-R40",
      "name": "Zoomed text node is not clipped with CSS overflow",
      "passed": 0,
      "warning": 18,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "warning",
      "rule_type": [
        "AA"
      ],
      "_id": "6640cfd50b988c7fe55904c7"
    }
  ],
  "_id": "6640cfd50b988c7fe55904c8"
}

const reportMock2: Report = {
  "total_passed": 14,
  "total_warning": 1,
  "total_failed": 5,
  "total_inapplicable": 85,
  "rules": [
    {
      "code": "QW-ACT-R4",
      "name": "Meta-refresh no delay",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "664091cca48c9e3172558fc1"
    },
    {
      "code": "QW-ACT-R71",
      "name": "`meta` element has no refresh delay (no exception)",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "664091cca48c9e3172558fc2"
    },
    {
      "code": "QW-ACT-R1",
      "name": "HTML Page has a title",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fc3"
    },
    {
      "code": "QW-ACT-R43",
      "name": "Scrollable element is keyboard accessible",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "664091cca48c9e3172558fc4"
    },
    {
      "code": "QW-ACT-R2",
      "name": "HTML has lang attribute",
      "passed": 0,
      "warning": 0,
      "failed": 1,
      "inapplicable": 0,
      "outcome": "failed",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fc5"
    },
    {
      "code": "QW-ACT-R5",
      "name": "Validity of HTML Lang attribute",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fc6"
    },
    {
      "code": "QW-ACT-R63",
      "name": "Document has a landmark with non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fc7"
    },
    {
      "code": "QW-ACT-R64",
      "name": "Document has heading for non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fc8"
    },
    {
      "code": "QW-ACT-R73",
      "name": "Block of repeated content is collapsible",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fc9"
    },
    {
      "code": "QW-ACT-R74",
      "name": "Document has an instrument to move focus to non-repeated content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fca"
    },
    {
      "code": "QW-ACT-R6",
      "name": "Image button has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fcb"
    },
    {
      "code": "QW-ACT-R11",
      "name": "Button has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fcc"
    },
    {
      "code": "QW-ACT-R12",
      "name": "Link has accessible name",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A",
        "AAA"
      ],
      "_id": "664091cca48c9e3172558fcd"
    },
    {
      "code": "QW-ACT-R13",
      "name": "Element with `aria-hidden` has no focusable content",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fce"
    },
    {
      "code": "QW-ACT-R14",
      "name": "meta viewport does not prevent zoom",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558fcf"
    },
    {
      "code": "QW-ACT-R21",
      "name": "svg element with explicit role has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fd0"
    },
    {
      "code": "QW-ACT-R22",
      "name": "Element within body has valid lang attribute",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558fd1"
    },
    {
      "code": "QW-ACT-R38",
      "name": "ARIA required owned elements",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fd2"
    },
    {
      "code": "QW-ACT-R62",
      "name": "Element in sequential focus order has visible focus",
      "passed": 0,
      "warning": 1,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "warning",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558fd3"
    },
    {
      "code": "QW-ACT-R9",
      "name": "Links with identical accessible names have equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "664091cca48c9e3172558fd4"
    },
    {
      "code": "QW-ACT-R10",
      "name": "`iframe` elements with identical accessible names have equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fd5"
    },
    {
      "code": "QW-ACT-R25",
      "name": "ARIA state or property is permitted",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fd6"
    },
    {
      "code": "QW-ACT-R27",
      "name": "aria-* attribute is defined in WAI-ARIA",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fd7"
    },
    {
      "code": "QW-ACT-R28",
      "name": "Element with role attribute has required states and properties",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fd8"
    },
    {
      "code": "QW-ACT-R34",
      "name": "ARIA state or property has valid value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fd9"
    },
    {
      "code": "QW-ACT-R44",
      "name": "Links with identical accessible names and context serve equivalent purpose",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fda"
    },
    {
      "code": "QW-ACT-R16",
      "name": "Form control has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fdb"
    },
    {
      "code": "QW-ACT-R41",
      "name": "Error message describes invalid form field value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fdc"
    },
    {
      "code": "QW-ACT-R20",
      "name": "role attribute has valid value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fdd"
    },
    {
      "code": "QW-ACT-R33",
      "name": "ARIA required context role",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fde"
    },
    {
      "code": "QW-ACT-R17",
      "name": "Image has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 1,
      "inapplicable": 0,
      "outcome": "failed",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fdf"
    },
    {
      "code": "QW-ACT-R19",
      "name": "iframe element has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fe0"
    },
    {
      "code": "QW-ACT-R70",
      "name": "iframe with negative tabindex has no interactive elements",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fe1"
    },
    {
      "code": "QW-ACT-R58",
      "name": "audio element content has transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe2"
    },
    {
      "code": "QW-ACT-R59",
      "name": "audio element content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe3"
    },
    {
      "code": "QW-ACT-R30",
      "name": "Visible label is part of accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fe4"
    },
    {
      "code": "QW-ACT-R51",
      "name": "video element visual-only content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe5"
    },
    {
      "code": "QW-ACT-R53",
      "name": "video element visual-only content has transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe6"
    },
    {
      "code": "QW-ACT-R54",
      "name": "video element visual-only content has audio track alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe7"
    },
    {
      "code": "QW-ACT-R55",
      "name": "video element visual content has audio description",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe8"
    },
    {
      "code": "QW-ACT-R56",
      "name": "video element content is media alternative for text",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fe9"
    },
    {
      "code": "QW-ACT-R60",
      "name": "video element auditory content has captions",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fea"
    },
    {
      "code": "QW-ACT-R61",
      "name": "Audio and visuals of video element have transcript",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AAA"
      ],
      "_id": "664091cca48c9e3172558feb"
    },
    {
      "code": "QW-ACT-R49",
      "name": "Audio or video that plays automatically has no audio that lasts more than 3 seconds",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fec"
    },
    {
      "code": "QW-ACT-R50",
      "name": "audio or video that plays automatically has a control mechanism",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fed"
    },
    {
      "code": "QW-ACT-R24",
      "name": "autocomplete attribute has valid value",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558fee"
    },
    {
      "code": "QW-ACT-R35",
      "name": "Heading has accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558fef"
    },
    {
      "code": "QW-ACT-R36",
      "name": "Headers attribute specified on a cell refers to cells in the same table element",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ff0"
    },
    {
      "code": "QW-ACT-R39",
      "name": "All table header cells have assigned data cells",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ff1"
    },
    {
      "code": "QW-ACT-R42",
      "name": "Object element has non-empty accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ff2"
    },
    {
      "code": "QW-ACT-R67",
      "name": "Letter spacing in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558ff3"
    },
    {
      "code": "QW-ACT-R68",
      "name": "Line height in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558ff4"
    },
    {
      "code": "QW-ACT-R69",
      "name": "Word spacing in style attributes is not !important",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558ff5"
    },
    {
      "code": "QW-ACT-R48",
      "name": "Element marked as decorative is not exposed",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558ff6"
    },
    {
      "code": "QW-ACT-R66",
      "name": "Menuitem has non-empty accessible name",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ff7"
    },
    {
      "code": "QW-ACT-R77",
      "name": "ARIA required ID references exist",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [],
      "_id": "664091cca48c9e3172558ff8"
    },
    {
      "code": "QW-ACT-R7",
      "name": "Orientation of the page is not restricted using CSS transform property",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558ff9"
    },
    {
      "code": "QW-ACT-R37",
      "name": "Text has minimum contrast",
      "passed": 3,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172558ffa"
    },
    {
      "code": "QW-ACT-R65",
      "name": "Element with presentational children has no focusable content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ffb"
    },
    {
      "code": "QW-ACT-R76",
      "name": "Text has enhanced contrast",
      "passed": 0,
      "warning": 0,
      "failed": 3,
      "inapplicable": 0,
      "outcome": "failed",
      "rule_type": [
        "AAA"
      ],
      "_id": "664091cca48c9e3172558ffc"
    },
    {
      "code": "QW-ACT-R15",
      "name": "audio or video has no audio that plays automatically",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ffd"
    },
    {
      "code": "QW-ACT-R23",
      "name": "video element visual content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558ffe"
    },
    {
      "code": "QW-ACT-R26",
      "name": "video element auditory content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172558fff"
    },
    {
      "code": "QW-ACT-R29",
      "name": "Audio element content has text alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172559000"
    },
    {
      "code": "QW-ACT-R31",
      "name": "Video element visual-only content has accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172559001"
    },
    {
      "code": "QW-ACT-R32",
      "name": "video element visual content has strict accessible alternative",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172559002"
    },
    {
      "code": "QW-ACT-R75",
      "name": "Bypass Blocks of Repeated Content",
      "passed": 1,
      "warning": 0,
      "failed": 0,
      "inapplicable": 0,
      "outcome": "passed",
      "rule_type": [
        "A"
      ],
      "_id": "664091cca48c9e3172559003"
    },
    {
      "code": "QW-ACT-R40",
      "name": "Zoomed text node is not clipped with CSS overflow",
      "passed": 0,
      "warning": 0,
      "failed": 0,
      "inapplicable": 1,
      "outcome": "inapplicable",
      "rule_type": [
        "AA"
      ],
      "_id": "664091cca48c9e3172559004"
    }
  ],
  "_id": "664091cca48c9e3172559005"
}

const pageMock1: Page = {
  _id: "1",
  page_URL: "https://www.example.com/page1",
  eval_date: new Date(),
  monitor_state: "Active",
  report: reportMock1
};

const pageMock2: Page = {
  _id: "2",
  page_URL: "https://www.example2.com/page2",
  eval_date: new Date(),
  monitor_state: "Active",
  report: reportMock2
};

// Mock de um website
const websiteMock: Website = {
  _id: "1",
  name: "Example Website",
  URL: "https://www.example.com",
  pages: [pageMock1, pageMock2],
  register_date: new Date(),
  eval_date: new Date(),
  monitor_state: "Em avaliação"
};