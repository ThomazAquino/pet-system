import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCreatorComponent } from './tutor-creator.component';

describe('TutorCreatorComponent', () => {
  let component: TutorCreatorComponent;
  let fixture: ComponentFixture<TutorCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
