import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Page, Rule, Report } from '../types';
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
    report: Report | undefined;
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
    }

    buildTree(): void {
      if (this.page) {
          const TREE_DATA: RuleNode[] = this.page. report.rules.map((rule: any) => {
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

          this.dataSource.data = TREE_DATA;
      }
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
          console.log(this.page);
          this.buildTree();
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
