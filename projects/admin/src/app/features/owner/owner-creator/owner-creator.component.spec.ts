import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreatorComponent } from './owner-creator.component';

describe('OwnerCreatorComponent', () => {
  let component: OwnerCreatorComponent;
  let fixture: ComponentFixture<OwnerCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
