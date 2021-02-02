import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAllTutors } from '../../../core/tutors/tutors.reducer';

@Component({
  selector: 'pet-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['photo', 'name', 'cellPhone', 'cpf',];
  dataSource = new MatTableDataSource();
  subscriptions: Subscription[] = [];


  constructor(
    private store: Store, 
    private router: Router
    ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.pipe(select(selectAllTutors)).subscribe(tutors => {
      console.log('selectAllTutors', tutors);
      this.dataSource.data = tutors;
    }))
  }

  onTableClick(row) {
    this.router.navigate(['tutor/profile', row.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
