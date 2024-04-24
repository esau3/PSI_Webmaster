import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { WEBSITES } from '../mock-websites';


@Component({
  selector: 'app-websites-table',
  templateUrl: './websites-table.component.html',
  styleUrl: './websites-table.component.scss'
})

export class WebsitesTableComponent {
  
  displayedColumns: string[] = ['id', 'name', 'URL', 'pages', 'register_date', 'eval_date', 'monitor_state'];
  dataSource = new MatTableDataSource(WEBSITES);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
