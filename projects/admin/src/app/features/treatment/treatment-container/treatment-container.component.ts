import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pet-treatment-container',
  templateUrl: './treatment-container.component.html',
  styleUrls: ['./treatment-container.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
