import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompletedPage } from './completed.page';
import { DummyApiService } from '../services/dummy-api.service';
import { Todo } from '../models/todo.model';
import { TodoShareService } from '../services/todo-share.service';
import { of } from 'rxjs';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';

describe('CompletedPage', () => {
  let component: CompletedPage;
  let fixture: ComponentFixture<CompletedPage>;
  let dummyApiService: DummyApiService;
  let httpMock: HttpTestingController;
  let todoShareService: TodoShareService;
  let modalController: ModalController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [DummyApiService, TodoShareService, ModalController]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedPage);
    component = fixture.componentInstance;
    dummyApiService = TestBed.inject(DummyApiService);
    httpMock = TestBed.inject(HttpTestingController);
    todoShareService = TestBed.inject(TodoShareService);
    modalController = TestBed.inject(ModalController);

    spyOn(console, 'log'); // Mock console.log calls
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the CompletedPage', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch todos on initialization', () => {
    const mockResponse: Todo[] = [
      { id: 1, todo: 'Test Todo 1', completed: true, userId: 1 },
      { id: 2, todo: 'Test Todo 2', completed: true, userId: 1 }
    ];

    spyOn(dummyApiService, 'getTodoData').and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(component.completedTodos).toEqual(mockResponse);
    expect(dummyApiService.getTodoData).toHaveBeenCalled();
  });

  it('should mark a todo as incompleted', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: true, userId: 1 };

    spyOn(dummyApiService, 'updateTodoData').and.returnValue(of({}));

    component.completedTodos = [mockTodo];

    await component.toggleComplete(mockTodo);

    expect(dummyApiService.updateTodoData).toHaveBeenCalledWith(mockTodo);
    expect(component.completedTodos).toEqual([]);
  });

  it('should edit a todo', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: true, userId: 1 };
    const updatedTodo: Todo = { id: 1, todo: 'Updated Todo', completed: true, userId: 1 };
  
    // Mock the modal controller create method
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({ role: 'save', data: updatedTodo })
    } as any));
  
    // Mock the HTTP request
    spyOn(dummyApiService, 'getTodoData').and.returnValue(of([mockTodo]));
  
    fixture.detectChanges();
  
    await component.editTodo(mockTodo);
  
    expect(modalController.create).toHaveBeenCalledWith({
      component: EditTodoModalComponent,
      componentProps: { todo: { ...mockTodo } }
    });
    expect(component.completedTodos[0]).toEqual(updatedTodo);
  });
  

  it('should delete a todo', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: true, userId: 1 };

    spyOn(dummyApiService, 'deleteTodoData').and.returnValue(of({}));

    component.completedTodos = [mockTodo];

    await component.deleteTodo(mockTodo);

    expect(dummyApiService.deleteTodoData).toHaveBeenCalledWith(Number(mockTodo.id));
    expect(component.completedTodos).toEqual([]);
  });
});
