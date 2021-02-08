import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pet-pet-container',
  templateUrl: './pet-container.component.html',
  styleUrls: ['./pet-container.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
