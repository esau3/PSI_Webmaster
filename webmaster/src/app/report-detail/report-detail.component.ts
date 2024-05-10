import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Page, Rule } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnInit{
    page: Page | undefined;
    rules: Rule[] |undefined;
    treeControl = new NestedTreeControl<RuleNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<RuleNode>();
  
    constructor(
      private route: ActivatedRoute,
      private websiteService: WebsiteService,
      private location: Location,
      private router: Router,
      public dialog: MatDialog
    ) {
        this.dataSource.data = TREE_DATA;
    }

    hasChild = (_: number, node: RuleNode) => !!node.children && node.children.length > 0;

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

    toggleNode(node: RuleNode): void {
      this.treeControl.toggle(node);
    }
  }



    const array = [
          {
            "code": "QW-ACT-R4",
            "name": "Meta-refresh no delay",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A",
              "AAA"
            ],
            "_id": "663de8b059fae477320c670c"
          },
          {
            "code": "QW-ACT-R71",
            "name": "`meta` element has no refresh delay (no exception)",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AAA"
            ],
            "_id": "663de8b059fae477320c670d"
          },
          {
            "code": "QW-ACT-R1",
            "name": "HTML Page has a title",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b059fae477320c670e"
          },
          {
            "code": "QW-ACT-R43",
            "name": "Scrollable element is keyboard accessible",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A",
              "AAA"
            ],
            "_id": "663de8b059fae477320c670f"
          },
          {
            "code": "QW-ACT-R2",
            "name": "HTML has lang attribute",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b059fae477320c6710"
          },
          {
            "code": "QW-ACT-R5",
            "name": "Validity of HTML Lang attribute",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b059fae477320c6711"
          },
          {
            "code": "QW-ACT-R63",
            "name": "Document has a landmark with non-repeated content",
            "passed": 0,
            "warning": 1,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [],
            "_id": "663de8b059fae477320c6712"
          },
          {
            "code": "QW-ACT-R64",
            "name": "Document has heading for non-repeated content",
            "passed": 0,
            "warning": 1,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [],
            "_id": "663de8b059fae477320c6713"
          },
          {
            "code": "QW-ACT-R73",
            "name": "Block of repeated content is collapsible",
            "passed": 0,
            "warning": 1,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [],
            "_id": "663de8b059fae477320c6714"
          },
          {
            "code": "QW-ACT-R74",
            "name": "Document has an instrument to move focus to non-repeated content",
            "passed": 0,
            "warning": 1,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [],
            "_id": "663de8b059fae477320c6715"
          },
          {
            "code": "QW-ACT-R6",
            "name": "Image button has accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b059fae477320c6716"
          },
          {
            "code": "QW-ACT-R11",
            "name": "Button has accessible name",
            "passed": 1,
            "warning": 0,
            "failed": 2,
            "inapplicable": 0,
            "outcome": "failed",
            "type": [
              "A"
            ],
            "_id": "663de8b059fae477320c6717"
          },
          {
            "code": "QW-ACT-R12",
            "name": "Link has accessible name",
            "passed": 4,
            "warning": 0,
            "failed": 1,
            "inapplicable": 0,
            "outcome": "failed",
            "type": [
              "A",
              "AAA"
            ],
            "_id": "663de8b159fae477320c6718"
          },
          {
            "code": "QW-ACT-R13",
            "name": "Element with `aria-hidden` has no focusable content",
            "passed": 17,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6719"
          },
          {
            "code": "QW-ACT-R14",
            "name": "meta viewport does not prevent zoom",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c671a"
          },
          {
            "code": "QW-ACT-R21",
            "name": "svg element with explicit role has accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c671b"
          },
          {
            "code": "QW-ACT-R22",
            "name": "Element within body has valid lang attribute",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c671c"
          },
          {
            "code": "QW-ACT-R38",
            "name": "ARIA required owned elements",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c671d"
          },
          {
            "code": "QW-ACT-R62",
            "name": "Element in sequential focus order has visible focus",
            "passed": 0,
            "warning": 27,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c671e"
          },
          {
            "code": "QW-ACT-R9",
            "name": "Links with identical accessible names have equivalent purpose",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AAA"
            ],
            "_id": "663de8b159fae477320c671f"
          },
          {
            "code": "QW-ACT-R10",
            "name": "`iframe` elements with identical accessible names have equivalent purpose",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6720"
          },
          {
            "code": "QW-ACT-R25",
            "name": "ARIA state or property is permitted",
            "passed": 7,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6721"
          },
          {
            "code": "QW-ACT-R27",
            "name": "aria-* attribute is defined in WAI-ARIA",
            "passed": 136,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6722"
          },
          {
            "code": "QW-ACT-R28",
            "name": "Element with role attribute has required states and properties",
            "passed": 3,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6723"
          },
          {
            "code": "QW-ACT-R34",
            "name": "ARIA state or property has valid value",
            "passed": 7,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6724"
          },
          {
            "code": "QW-ACT-R44",
            "name": "Links with identical accessible names and context serve equivalent purpose",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6725"
          },
          {
            "code": "QW-ACT-R16",
            "name": "Form control has accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6726"
          },
          {
            "code": "QW-ACT-R41",
            "name": "Error message describes invalid form field value",
            "passed": 0,
            "warning": 3,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6727"
          },
          {
            "code": "QW-ACT-R20",
            "name": "role attribute has valid value",
            "passed": 7,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6728"
          },
          {
            "code": "QW-ACT-R33",
            "name": "ARIA required context role",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6729"
          },
          {
            "code": "QW-ACT-R17",
            "name": "Image has accessible name",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c672a"
          },
          {
            "code": "QW-ACT-R19",
            "name": "iframe element has accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c672b"
          },
          {
            "code": "QW-ACT-R70",
            "name": "iframe with negative tabindex has no interactive elements",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c672c"
          },
          {
            "code": "QW-ACT-R58",
            "name": "audio element content has transcript",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c672d"
          },
          {
            "code": "QW-ACT-R59",
            "name": "audio element content is media alternative for text",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c672e"
          },
          {
            "code": "QW-ACT-R30",
            "name": "Visible label is part of accessible name",
            "passed": 4,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c672f"
          },
          {
            "code": "QW-ACT-R51",
            "name": "video element visual-only content is media alternative for text",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6730"
          },
          {
            "code": "QW-ACT-R53",
            "name": "video element visual-only content has transcript",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6731"
          },
          {
            "code": "QW-ACT-R54",
            "name": "video element visual-only content has audio track alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6732"
          },
          {
            "code": "QW-ACT-R55",
            "name": "video element visual content has audio description",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6733"
          },
          {
            "code": "QW-ACT-R56",
            "name": "video element content is media alternative for text",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6734"
          },
          {
            "code": "QW-ACT-R60",
            "name": "video element auditory content has captions",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6735"
          },
          {
            "code": "QW-ACT-R61",
            "name": "Audio and visuals of video element have transcript",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AAA"
            ],
            "_id": "663de8b159fae477320c6736"
          },
          {
            "code": "QW-ACT-R49",
            "name": "Audio or video that plays automatically has no audio that lasts more than 3 seconds",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6737"
          },
          {
            "code": "QW-ACT-R50",
            "name": "audio or video that plays automatically has a control mechanism",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6738"
          },
          {
            "code": "QW-ACT-R24",
            "name": "autocomplete attribute has valid value",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c6739"
          },
          {
            "code": "QW-ACT-R35",
            "name": "Heading has accessible name",
            "passed": 1,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c673a"
          },
          {
            "code": "QW-ACT-R36",
            "name": "Headers attribute specified on a cell refers to cells in the same table element",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c673b"
          },
          {
            "code": "QW-ACT-R39",
            "name": "All table header cells have assigned data cells",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c673c"
          },
          {
            "code": "QW-ACT-R42",
            "name": "Object element has non-empty accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c673d"
          },
          {
            "code": "QW-ACT-R67",
            "name": "Letter spacing in style attributes is not !important",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c673e"
          },
          {
            "code": "QW-ACT-R68",
            "name": "Line height in style attributes is not !important",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c673f"
          },
          {
            "code": "QW-ACT-R69",
            "name": "Word spacing in style attributes is not !important",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c6740"
          },
          {
            "code": "QW-ACT-R48",
            "name": "Element marked as decorative is not exposed",
            "passed": 43,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [],
            "_id": "663de8b159fae477320c6741"
          },
          {
            "code": "QW-ACT-R66",
            "name": "Menuitem has non-empty accessible name",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6742"
          },
          {
            "code": "QW-ACT-R77",
            "name": "ARIA required ID references exist",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [],
            "_id": "663de8b159fae477320c6743"
          },
          {
            "code": "QW-ACT-R7",
            "name": "Orientation of the page is not restricted using CSS transform property",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c6744"
          },
          {
            "code": "QW-ACT-R37",
            "name": "Text has minimum contrast",
            "passed": 28,
            "warning": 0,
            "failed": 3,
            "inapplicable": 0,
            "outcome": "failed",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c6745"
          },
          {
            "code": "QW-ACT-R65",
            "name": "Element with presentational children has no focusable content",
            "passed": 31,
            "warning": 0,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "passed",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6746"
          },
          {
            "code": "QW-ACT-R76",
            "name": "Text has enhanced contrast",
            "passed": 26,
            "warning": 0,
            "failed": 5,
            "inapplicable": 0,
            "outcome": "failed",
            "type": [
              "AAA"
            ],
            "_id": "663de8b159fae477320c6747"
          },
          {
            "code": "QW-ACT-R15",
            "name": "audio or video has no audio that plays automatically",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6748"
          },
          {
            "code": "QW-ACT-R23",
            "name": "video element visual content has accessible alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c6749"
          },
          {
            "code": "QW-ACT-R26",
            "name": "video element auditory content has accessible alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c674a"
          },
          {
            "code": "QW-ACT-R29",
            "name": "Audio element content has text alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c674b"
          },
          {
            "code": "QW-ACT-R31",
            "name": "Video element visual-only content has accessible alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c674c"
          },
          {
            "code": "QW-ACT-R32",
            "name": "video element visual content has strict accessible alternative",
            "passed": 0,
            "warning": 0,
            "failed": 0,
            "inapplicable": 1,
            "outcome": "inapplicable",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c674d"
          },
          {
            "code": "QW-ACT-R75",
            "name": "Bypass Blocks of Repeated Content",
            "passed": 0,
            "warning": 1,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [
              "A"
            ],
            "_id": "663de8b159fae477320c674e"
          },
          {
            "code": "QW-ACT-R40",
            "name": "Zoomed text node is not clipped with CSS overflow",
            "passed": 0,
            "warning": 22,
            "failed": 0,
            "inapplicable": 0,
            "outcome": "warning",
            "type": [
              "AA"
            ],
            "_id": "663de8b159fae477320c674f"
          }
        ]

      /**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface RuleNode {
  name: string;
  code?: string;
  value?: string;
  children?: RuleNode[];
}

const TREE_DATA: RuleNode[] = array.map((rule: any) => {
  const children = [
      rule.type.length > 0 ? { name: 'Type', value: rule.type.join(', ') } : null,
  ].filter(child => child !== null) as RuleNode[]; // Converte para RuleNode[]

  if (rule.passed > 0) {
      children.push({ name: "Passed", value: rule.passed.toString()});
  }

  if (rule.warning > 0) {
      children.push({ name: "Warning", value: rule.warning.toString() });
  }

  if (rule.failed > 0) {
      children.push({ name: "Failed", value: rule.failed.toString() });
  }

  if (rule.inapplicable > 0) {
      children.push({ name: "Inapplicable", value: rule.inapplicable.toString() });
  }

  return {
      name: rule.name,
      code: rule.code.replace('QW-', ''),
      children: children,
  };
});
