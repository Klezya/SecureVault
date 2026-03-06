import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesView } from './notes-view';

describe('NotesView', () => {
  let component: NotesView;
  let fixture: ComponentFixture<NotesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesView],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
