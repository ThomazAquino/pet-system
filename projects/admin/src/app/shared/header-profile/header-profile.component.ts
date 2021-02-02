import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Tutor } from '../../core/tutors/tutors.model';
import { Pet } from '../../core/pets/pets.model';

// Data receive from parent component
interface HeaderData {
  tutor?: Tutor;
  pet?: Pet;
}

// Data
interface LeftSideHeader {
    image: string;
    title: string;
    subTitle?: string;
    btnIcon: string;
}

interface RightSideHeader {
    image: string;
    title: string;
    subTitle?: string;
    btnIcon: string;
}


@Component({
  selector: 'pet-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderProfileComponent implements OnInit {
  @Input()
  headerData: HeaderData;
  leftPart: any;
  rightPart: any;
  isTutor: boolean;


  constructor() { }

  ngOnInit() {
    this.isTutor = this.headerData.pet ? false : true;
  }

}
