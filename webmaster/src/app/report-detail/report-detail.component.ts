import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

import { Page, Rule, Report } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { arrowComponent } from '../arrow.component';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
// extends arrowComponent
export class ReportDetailComponent implements OnInit {
    page: Page | undefined;
    report: Report | undefined;
    rules: Rule[] |undefined;
    treeControl = new NestedTreeControl<RuleNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<RuleNode>();
    filteredDataSource = new MatTreeNestedDataSource<RuleNode>();
    reports: Report[] | undefined;
  
    constructor(
      private renderer2: Renderer2, private elRef2: ElementRef,
      private route: ActivatedRoute,
      private websiteService: WebsiteService,
      private location: Location,
      public dialog: MatDialog
    ) {
      //super(renderer2,elRef2);
    }

    buildTree(): void {
      if (this.page && this.report) {

        const rules = this.report.rules;

          const TREE_DATA: RuleNode[] = rules.map((rule: any) => {
              const children = [].filter(child => child !== null) as RuleNode[]; // Converte para RuleNode[]
            
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

              if (rule.rule_type && rule.rule_type.length > 0) {
                children.push({ name: 'Type', value: rule.rule_type});
              }
            
              const code = rule.code ? rule.code.replace('QW-', '') : '';
              return {
                  name: rule.name,
                  code: code,
                  children: children,
              };
          });

          this.dataSource.data = TREE_DATA;
          this.filteredDataSource.data = TREE_DATA;
      }
  }

  hasChild = (_: number, node: RuleNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    //super.ngOnInit();
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
      this.location.back();
    }

    toggleNode(node: RuleNode): void {
      this.treeControl.toggle(node);
    }





      // Lógica de filtragem
    filterRecursive(filterText: string, array: any[], property: string) {
      let filteredData;

      function copy(o: any) {
        return Object.assign({}, o);
      }

      if (filterText) {
        filterText = filterText.toLowerCase();
        filteredData = array.map(copy).filter(function x(y) {
          if (y[property].toLowerCase().includes(filterText)) {
            return true;
          }
          if (y.children) {
            return (y.children = y.children.map(copy).filter(x)).length;
          }
        });
      } else {
        filteredData = array;
      }

      return filteredData;
    }

    filterTree(filterText: string) {
      this.filteredDataSource.data = this.filterRecursive(filterText, this.dataSource.data, 'name');
    }

    applyFilter(event: KeyboardEvent) {
      const inputElement = event.target as HTMLInputElement;
      const filterText = inputElement.value;
      this.filterTree(filterText);
      if (filterText) {
        this.treeControl.expandAll();
      } else {
        this.treeControl.collapseAll();
      }
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