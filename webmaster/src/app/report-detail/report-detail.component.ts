import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { Page, Report, Rule } from '../types';
import { WebsiteService } from '../services/websites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit, OnDestroy {
  page: Page | undefined;
  report: Report | undefined;
  treeControl = new NestedTreeControl<RuleNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<RuleNode>();
  reports: Report[] | undefined;
  private dataSourceSubject = new BehaviorSubject<RuleNode[]>([]);

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPage();
    this.getReport();
    this.dataSourceSubject.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnDestroy(): void {
    this.dataSourceSubject.complete();
  }

  buildTree(): void {
    if (this.page && this.report) {
      const TREE_DATA: RuleNode[] = this.report.rules.map((rule: any) => {
        const children: RuleNode[] = [];

        if (rule.passed > 0) {
          children.push({ name: 'Passed', value: rule.passed.toString() });
        }

        if (rule.warning > 0) {
          children.push({ name: 'Warning', value: rule.warning.toString() });
        }

        if (rule.failed > 0) {
          children.push({ name: 'Failed', value: rule.failed.toString() });
        }

        if (rule.inapplicable > 0) {
          children.push({ name: 'Inapplicable', value: rule.inapplicable.toString() });
        }

        if (rule.rule_type && rule.rule_type.length > 0) {
          children.push({ name: 'Type', value: rule.rule_type.join(', ') });
        }

        const code = rule.code ? rule.code.replace('QW-', '') : '';
        return {
          name: rule.name,
          code: code,
          children: children.length ? children : []
        };
      });

      this.dataSourceSubject.next(TREE_DATA);
    }
  }

  hasChild = (_: number, node: RuleNode) => !!node.children && node.children.length > 0;

  getPage(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.websiteService.getPage(id).subscribe((page: Page) => {
        this.page = page;
      });
    }
  }

  deletePage(id: string): void {
    this.websiteService.deletePage(id).subscribe({
      next: (res) => {
        console.log('Page deleted successfully:', res);
      },
      error: (err) => {
        console.error('Error deleting page:', err);
      }
    });
    location.reload();
  }

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: string): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration
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
      this.websiteService.getReport(id).subscribe((report: Report) => {
        this.report = report;
        this.buildTree();
      });
    }
  }

  getReports(): void {
    this.websiteService.getReports().subscribe((reports) => {
      this.reports = reports;
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
 * RuleNode interface with nested structure.
 */
interface RuleNode {
  name: string;
  code?: string;
  value?: string;
  children?: RuleNode[];
}
