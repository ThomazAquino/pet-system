import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectOpenTreatmentsForListComponent } from '../../../core/treatments/treatments.selectors';

@Component({
  selector: 'pet-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  openTreatments$ = this.store.select(selectOpenTreatmentsForListComponent);

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
  }

  onTutorAddButtonClick() {
    this.router.navigate(['tutor/profile/add']);
  }

  onPetAddButtonClick() {
    this.router.navigate(['pet/profile']);
  }

  onTreatmentListClick(treatment) {
    this.router.navigate(['treatment', treatment.id]);
  }

  ngOnDestroy() {
  }
}
