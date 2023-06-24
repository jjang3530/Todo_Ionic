import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DummyApiService } from './dummy-api.service';
import { Todo } from '../models/todo.model';

describe('DummyApiService', () => {
  let service: DummyApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DummyApiService]
    });
    service = TestBed.inject(DummyApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch todo data', () => {
    const mockResponse: Todo[] = [
      { id: 1, todo: 'Test Todo', completed: false, userId: 1 }
    ];

    service.getTodoData().subscribe((todos) => {
      expect(todos).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(service.apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush({ todos: mockResponse });
  });

  it('should create todo data', () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };
  
    service.createTodoData(mockTodo).subscribe((response) => {
      expect(response).toBeDefined();
      // Add additional assertions if needed
    });
  
    const request = httpMock.expectOne(`${service.apiUrl}/add`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeDefined;
    request.flush({}); // Pass the expected mock response here
  });
  
  it('should update todo data', () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: true, userId: 1 };
  
    service.updateTodoData(mockTodo).subscribe((response) => {
      expect(response).toBeDefined();
      // Add additional assertions if needed
    });
  
    const request = httpMock.expectOne(`${service.apiUrl}/${mockTodo.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBeDefined;
    request.flush({}); // Pass the expected mock response here
  });

  it('should delete todo data', () => {
    const todoId = 1;

    service.deleteTodoData(todoId).subscribe((response) => {
      expect(response).toBeDefined();
      // Add additional assertions if needed
    });

    const request = httpMock.expectOne(`${service.apiUrl}/${todoId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({}); // You can pass a mock response if needed
  });
});
