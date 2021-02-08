import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { selectOpenTreatmentsForHomeTable } from '../../../core/treatments/treatments.selectors';

@Component({
  selector: 'pet-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'photo',
    'name',
    'enterDate',
    'belongsToVet',
    'clinicEvoResume',
    'qrCode'
  ];
  dataSource = new MatTableDataSource();
  openTreatments: any[];
  subscriptions: Subscription[] = [];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store
        .pipe(select(selectOpenTreatmentsForHomeTable))
        .subscribe((openTreatmentsForTable) => {
          console.log('openTreatmentsForTable', openTreatmentsForTable);
          this.dataSource.data = openTreatmentsForTable;
        })
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onTutorAddButtonClick() {
    this.router.navigate(['tutor/profile']);
  }

  onPetAddButtonClick() {
    this.router.navigate(['pet/profile']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
