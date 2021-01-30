import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {
  routeAnimations
} from '../../../core/core.module';

@Component({
  selector: 'pet-owner-container',
  templateUrl: './owner-container.component.html',
  styleUrls: ['./owner-container.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
