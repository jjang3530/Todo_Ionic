import { TestBed } from '@angular/core/testing';

import { TodoShareService } from './todo-share.service';

describe('TodoShareService', () => {
  let service: TodoShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
