import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WEBSITES } from '../mock-websites';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website } from '../types';


@Component({
  selector: 'app-websites-table',
  templateUrl: './websites-table.component.html',
  styleUrl: './websites-table.component.scss'
})

export class WebsitesTableComponent {
  
  displayedColumns: string[] = ['id', 'name', 'URL', 'pages', 'register_date', 'eval_date', 'monitor_state'];
  dataSource: MatTableDataSource<Website>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(WEBSITES);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
