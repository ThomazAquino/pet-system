import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
