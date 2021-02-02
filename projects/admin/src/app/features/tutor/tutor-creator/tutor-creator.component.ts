import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-tutor-creator',
  templateUrl: './tutor-creator.component.html',
  styleUrls: ['./tutor-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorCreatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
