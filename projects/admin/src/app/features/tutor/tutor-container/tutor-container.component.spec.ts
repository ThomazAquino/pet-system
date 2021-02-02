import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorContainerComponent } from './tutor-container.component';

describe('TutorContainerComponent', () => {
  let component: TutorContainerComponent;
  let fixture: ComponentFixture<TutorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
