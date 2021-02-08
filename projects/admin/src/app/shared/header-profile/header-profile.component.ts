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
  headerData?: HeaderData;
  @Output()
  imageUploaded = new EventEmitter<any>();
  @ViewChild('imageInput') imageInput;

  leftPart: any;
  rightPart: any;
  isTutor: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isTutor = this.headerData.pet ? false : true;
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
}
