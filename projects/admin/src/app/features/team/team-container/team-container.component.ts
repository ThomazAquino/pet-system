import { Component, OnInit } from '@angular/core';
import { routeAnimations } from '../../../core/core.module';

@Component({
  selector: 'pet-team-container',
  templateUrl: './team-container.component.html',
  styleUrls: ['./team-container.component.scss'],
  animations: [routeAnimations],
})
export class TeamContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
