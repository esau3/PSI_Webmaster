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
  }



    const array = [
      {
        "code": "QW-ACT-R4",
        "name": "Meta-refresh no delay",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "A",
          "AAA"
        ],
        "_id": "663ba22d870788fa149838a6"
      },
      {
        "code": "QW-ACT-R71",
        "name": "`meta` element has no refresh delay (no exception)",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "AAA"
        ],
        "_id": "663ba22d870788fa149838a7"
      },
      {
        "code": "QW-ACT-R1",
        "name": "HTML Page has a title",
        "passed": 1,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838a8"
      },
      {
        "code": "QW-ACT-R43",
        "name": "Scrollable element is keyboard accessible",
        "passed": 3,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A",
          "AAA"
        ],
        "_id": "663ba22d870788fa149838a9"
      },
      {
        "code": "QW-ACT-R2",
        "name": "HTML has lang attribute",
        "passed": 1,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838aa"
      },
      {
        "code": "QW-ACT-R5",
        "name": "Validity of HTML Lang attribute",
        "passed": 1,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838ab"
      },
      {
        "code": "QW-ACT-R63",
        "name": "Document has a landmark with non-repeated content",
        "passed": 0,
        "warning": 1,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838ac"
      },
      {
        "code": "QW-ACT-R64",
        "name": "Document has heading for non-repeated content",
        "passed": 0,
        "warning": 1,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838ad"
      },
      {
        "code": "QW-ACT-R73",
        "name": "Block of repeated content is collapsible",
        "passed": 0,
        "warning": 1,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838ae"
      },
      {
        "code": "QW-ACT-R74",
        "name": "Document has an instrument to move focus to non-repeated content",
        "passed": 0,
        "warning": 1,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838af"
      },
      {
        "code": "QW-ACT-R6",
        "name": "Image button has accessible name",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838b0"
      },
      {
        "code": "QW-ACT-R11",
        "name": "Button has accessible name",
        "passed": 53,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838b1"
      },
      {
        "code": "QW-ACT-R12",
        "name": "Link has accessible name",
        "passed": 161,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A",
          "AAA"
        ],
        "_id": "663ba22d870788fa149838b2"
      },
      {
        "code": "QW-ACT-R13",
        "name": "Element with `aria-hidden` has no focusable content",
        "passed": 161,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838b3"
      },
      {
        "code": "QW-ACT-R14",
        "name": "meta viewport does not prevent zoom",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "AA"
        ],
        "_id": "663ba22d870788fa149838b4"
      },
      {
        "code": "QW-ACT-R21",
        "name": "svg element with explicit role has accessible name",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838b5"
      },
      {
        "code": "QW-ACT-R22",
        "name": "Element within body has valid lang attribute",
        "passed": 1,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "AA"
        ],
        "_id": "663ba22d870788fa149838b6"
      },
      {
        "code": "QW-ACT-R38",
        "name": "ARIA required owned elements",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838b7"
      },
      {
        "code": "QW-ACT-R62",
        "name": "Element in sequential focus order has visible focus",
        "passed": 0,
        "warning": 217,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "AA"
        ],
        "_id": "663ba22d870788fa149838b8"
      },
      {
        "code": "QW-ACT-R9",
        "name": "Links with identical accessible names have equivalent purpose",
        "passed": 0,
        "warning": 4,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "AAA"
        ],
        "_id": "663ba22d870788fa149838b9"
      },
      {
        "code": "QW-ACT-R10",
        "name": "`iframe` elements with identical accessible names have equivalent purpose",
        "passed": 0,
        "warning": 0,
        "failed": 0,
        "inapplicable": 1,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838ba"
      },
      {
        "code": "QW-ACT-R25",
        "name": "ARIA state or property is permitted",
        "passed": 95,
        "warning": 0,
        "failed": 51,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838bb"
      },
      {
        "code": "QW-ACT-R27",
        "name": "aria-* attribute is defined in WAI-ARIA",
        "passed": 411,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838bc"
      },
      {
        "code": "QW-ACT-R28",
        "name": "Element with role attribute has required states and properties",
        "passed": 57,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838bd"
      },
      {
        "code": "QW-ACT-R34",
        "name": "ARIA state or property has valid value",
        "passed": 146,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [],
        "_id": "663ba22d870788fa149838be"
      },
      {
        "code": "QW-ACT-R44",
        "name": "Links with identical accessible names and context serve equivalent purpose",
        "passed": 0,
        "warning": 2,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838bf"
      },
      {
        "code": "QW-ACT-R16",
        "name": "Form control has accessible name",
        "passed": 2,
        "warning": 0,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838c0"
      },
      {
        "code": "QW-ACT-R41",
        "name": "Error message describes invalid form field value",
        "passed": 0,
        "warning": 14,
        "failed": 0,
        "inapplicable": 0,
        "type": [
          "A"
        ],
        "_id": "663ba22d870788fa149838c1"
      },]

      /**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface RuleNode {
  name: string;
  children?: RuleNode[];
}

const TREE_DATA: RuleNode[] = 
  array.map((rule: { code: string; name: string; type: string[]; _id: string; }) => ({
  name: rule.code,
  children: [
      { name: 'Name', value: rule.name },
      { name: 'Type', value: rule.type },
      { name: '_id', value: rule._id }
  ]
}));