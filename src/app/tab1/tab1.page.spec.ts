import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tab1Page } from './tab1.page';
import { DummyApiService } from './../services/dummy-api.service';
import { Todo } from '../models/todo.model';
import { TodoShareService } from '../services/todo-share.service';
import { of } from 'rxjs';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let dummyApiService: DummyApiService;
  let httpMock: HttpTestingController;
  let todoShareService: TodoShareService;
  let modalController: ModalController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [DummyApiService, TodoShareService, ModalController]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
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

  it('should create the Tab1Page', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch todos on initialization', () => {
    const mockResponse: Todo[] = [
      { id: 1, todo: 'Test Todo 1', completed: false, userId: 1 },
      { id: 2, todo: 'Test Todo 2', completed: false, userId: 1 }
    ];

    spyOn(dummyApiService, 'getTodoData').and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(component.todos).toEqual(mockResponse);
    expect(dummyApiService.getTodoData).toHaveBeenCalled();
  });

  it('should mark a todo as completed', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };

    spyOn(dummyApiService, 'updateTodoData').and.returnValue(of({}));

    component.todos = [mockTodo];

    await component.toggleComplete(mockTodo);

    expect(dummyApiService.updateTodoData).toHaveBeenCalledWith(mockTodo);
    expect(component.todos).toEqual([]);
  });

  it('should edit a todo', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };
    const updatedTodo: Todo = { id: 1, todo: 'Updated Todo', completed: false, userId: 1 };
  
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
    expect(component.todos[0]).toEqual(updatedTodo);
  });
  

  it('should delete a todo', async () => {
    const mockTodo: Todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };

    spyOn(dummyApiService, 'deleteTodoData').and.returnValue(of({}));

    component.todos = [mockTodo];

    await component.deleteTodo(mockTodo);

    expect(dummyApiService.deleteTodoData).toHaveBeenCalledWith(Number(mockTodo.id));
    expect(component.todos).toEqual([]);
  });
});
