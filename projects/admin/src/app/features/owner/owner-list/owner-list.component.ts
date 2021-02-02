import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAllOwners } from '../../../core/owners/owners.reducer';

@Component({
  selector: 'pet-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['photo', 'name', 'cellPhone', 'cpf',];
  dataSource = new MatTableDataSource();
  subscriptions: Subscription[] = [];


  constructor(
    private store: Store, 
    private router: Router
    ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.pipe(select(selectAllOwners)).subscribe(owners => {
      console.log('selectAllOwners', owners);
      this.dataSource.data = owners;
    }))
  }

  onTableClick(row) {
    this.router.navigate(['owner/profile', row.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
