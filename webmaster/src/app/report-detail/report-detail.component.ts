import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Page, Rule, Report } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnInit{
    page: Page | undefined;
    report: Report | undefined;
    rules: Rule[] |undefined;
    treeControl = new FlatTreeControl<RuleNode>(
      node => node.level,
      node => node.expandable,
    );
    TREE_DATA: RuleNode[] = []; // Declaração de TREE_DATA
    dataSource = new ArrayDataSource(this.TREE_DATA);
    reports: Report[] | undefined;
  
    constructor(
      private route: ActivatedRoute,
      private websiteService: WebsiteService,
      private location: Location,
      public dialog: MatDialog
    ) {}

    buildTree(): void {
      if (this.page && this.report) {
        const rules = this.report?.rules;

        for (const rule of rules) {
            const root: any = {
                name: rule.name,
                code: rule.code,
                expandable: true,
                level: 0,
            };

            const data: RuleNode = {
                expandable: false,
                level: 1,
                passed: rule.passed,
                warning: rule.warning,
                failed: rule.failed,
                inapplicable: rule.inapplicable,
                outcome: rule.outcome,
                rule_type: rule.rule_type,
            };

          this.TREE_DATA.push(root, data);
          console.log(this.TREE_DATA);
        }
      }
    }

  hasChild = (_: number, node: RuleNode) => node.expandable;


  getParentNode(node: RuleNode) {
    const nodeIndex = this.TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.TREE_DATA[i].level === node.level - 1) {
        console.log("dentro do get node");
        return this.TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: RuleNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        console.log("dentro do while do render");
        return false;
      }
      parent = this.getParentNode(parent);
    }
    console.log("dentro do render");
    return true;
  }

  ngOnInit(): void {
      this.getPage();
      this.getReport();
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

    getReport(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== null) {
        this.websiteService.getReport(id)
          .subscribe((report: Report) => {
            this.report = report;
            this.buildTree();
          });
      }
    }

    getReports(): void {
      this.websiteService.getReports().subscribe(reports => {
        this.reports = reports;
      });
    }

    goBack(): void {
      console.log(this.dataSource);
      this.location.back();
    }

    toggleNode(node: RuleNode): void {
      this.treeControl.toggle(node);
    }
  }
      /**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface RuleNode {
  expandable: boolean;
  level: number;
  isExpanded?: boolean;
  passed: number,
  warning: number,
  failed: number,
  inapplicable: number,
  outcome: string,
  rule_type: [string],
}