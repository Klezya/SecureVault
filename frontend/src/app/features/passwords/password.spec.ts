import { TestBed } from '@angular/core/testing';

import { Password } from './password';

describe('Password', () => {
  let service: Password;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Password);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
