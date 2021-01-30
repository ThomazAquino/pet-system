import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-owner-creator',
  templateUrl: './owner-creator.component.html',
  styleUrls: ['./owner-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerCreatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
