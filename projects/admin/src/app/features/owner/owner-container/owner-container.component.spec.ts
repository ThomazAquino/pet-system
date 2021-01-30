import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerContainerComponent } from './owner-container.component';

describe('OwnerContainerComponent', () => {
  let component: OwnerContainerComponent;
  let fixture: ComponentFixture<OwnerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
