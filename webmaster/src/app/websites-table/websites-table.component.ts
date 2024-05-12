import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { WEBSITES } from '../mock-websites';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Website } from '../types';
import { WebsiteService } from '../services/websites.service';
import { Router } from '@angular/router';
import { arrowComponent } from '../arrow.component';


@Component({
  selector: 'app-websites-table',
  templateUrl: './websites-table.component.html',
  styleUrl: './websites-table.component.scss'
})

export class WebsitesTableComponent extends arrowComponent {
  
  displayedColumns: string[] = ['id', 'name', 'URL', 'register_date', 'eval_date', 'monitor_state', 'actions'];
  dataSource!: MatTableDataSource<Website>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private renderer2: Renderer2, private elRef2: ElementRef,private websiteService: WebsiteService, private router: Router) {
    super(renderer2,elRef2)
    this.websiteService.getWebsites().subscribe(websites => {
      this.dataSource = new MatTableDataSource(websites);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteWebsite(id: string): void {
    this.websiteService.deleteWebsite(id)
      .subscribe(
        () => {
          location.reload();
          this.router.navigate(['/websites-table']);
        }
      );
    }

}
