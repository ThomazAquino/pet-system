import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadAllTreatments } from '../../../core/treatments/treatments.actions';
import { selectAllTreatmentsForListComponent } from '../../../core/treatments/treatments.selectors';

@Component({
  selector: 'pet-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentListComponent implements OnInit {
  treatments$: Observable<any>;

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.store.dispatch(loadAllTreatments());
    this.treatments$ = this.store.select(selectAllTreatmentsForListComponent);
  }

  onPetListClick(treatment) {
    this.router.navigate(['treatment', treatment.id]);
  }

}
