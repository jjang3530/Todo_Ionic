import { TestBed } from '@angular/core/testing';
import { TodoShareService } from './todo-share.service';
import { Todo } from '../models/todo.model';

describe('TodoShareService', () => {
  let service: TodoShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get sharedTodo', () => {
    const mockTodo: Todo[] = [
      { id: 1, todo: 'Test Todo 1', completed: false, userId: 1 },
      { id: 2, todo: 'Test Todo 2', completed: true, userId: 1 }
    ];

    service.sharedTodo = mockTodo;

    expect(service.sharedTodo).toEqual(mockTodo);
  });
});
