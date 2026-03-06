import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordView } from './password-view';

describe('PasswordView', () => {
  let component: PasswordView;
  let fixture: ComponentFixture<PasswordView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordView],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
