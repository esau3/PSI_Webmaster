import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { WEBSITES } from '../mock-websites';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website } from '../types';
import { WebsiteService } from '../services/websites.service';


@Component({
  selector: 'app-websites-table',
  templateUrl: './websites-table.component.html',
  styleUrl: './websites-table.component.scss'
})

export class WebsitesTableComponent {
  
  displayedColumns: string[] = ['id', 'name', 'URL', 'register_date', 'eval_date', 'monitor_state', 'actions'];
  dataSource: MatTableDataSource<Website>;
  websitesArray: Website[] | undefined;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private websiteService: WebsiteService) {
    this.websiteService.getWebsites().subscribe(websites => {
      this.dataSource = new MatTableDataSource(websites);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    
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
