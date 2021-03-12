import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Tutor } from '../../core/tutors/tutors.model';
import { Pet } from '../../core/pets/pets.model';
import { Router } from '@angular/router';
import { SimpleChanges, OnChanges } from '@angular/core';

// Data receive from parent component
interface HeaderData {
  tutor?: Tutor;
  pet?: Pet;
  options?: {
    showPetProfileButton: boolean;
    typeOfHeader?: TypeOfHeader
  };
}

export enum TypeOfHeader {
  tutorProfile = 'tutorProfile',
  petProfile = 'petProfile',
  treatment = 'treatment',
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
  headerData?: HeaderData;
  @Output()
  imageUploaded = new EventEmitter<any>();
  @ViewChild('imageInput') imageInput;
  eTypeOfHeader = TypeOfHeader;

  leftPart: any;
  rightPart: any;
  isTutor: boolean;

  constructor(private router: Router) {}

  ngOnInit() { 
    console.log(this.headerData?.options?.typeOfHeader);
  }

  processFile(event): void {
    if (event.value) {
      this.imageUploaded.emit(event);
    }
  }

  onImageClick(): void {
    this.imageInput.nativeElement.click();
  }

  openTutorProfile() {
    this.router.navigate(['tutor/profile', this.headerData.tutor?.id]);
  }

  openPetProfile() {
    this.router.navigate(['pet/profile', this.headerData.pet?.id]);
  }
}
