import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { selectOpenTreatments, selectOpenTreatmentsForTable } from '../../../core/treatments/treatments.reducer';
import { selectPet } from '../../../core/pets/pets.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pet-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['photo', 'name', 'enterDate', 'belongsToVet', 'clinicEvoResume', 'qrCode'];
  dataSource = new MatTableDataSource();
  openTreatments: any[];
  subscriptions: Subscription[] = [];



  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.pipe(select(selectOpenTreatmentsForTable)).subscribe(openTreatmentsForTable => {
      console.log('openTreatmentsForTable', openTreatmentsForTable);
      this.dataSource.data = openTreatmentsForTable;

    }))
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
