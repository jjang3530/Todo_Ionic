import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { AddPage } from './add.page';
import { HttpClientModule } from '@angular/common/http';
import { DummyApiService } from '../services/dummy-api.service';
import { TodoShareService } from '../services/todo-share.service';
import { of } from 'rxjs';
import { Todo } from '../models/todo.model';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;
  let dummyApiService: DummyApiService;
  let navController: NavController;
  let todoShareService: TodoShareService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AddPage],
      imports: [IonicModule.forRoot(), HttpClientModule],
      providers: [DummyApiService, NavController, TodoShareService],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    dummyApiService = TestBed.inject(DummyApiService);
    navController = TestBed.inject(NavController);
    todoShareService = TestBed.inject(TodoShareService);
  
    spyOn(console, 'log');
  });  

  it('should create the AddPage', () => {
    expect(component).toBeTruthy();
  });

  it('should save a new todo', () => {
    const newTodo: Todo = {
      id: 31,
      todo: 'Test Todo',
      completed: false,
      userId: 1,
    };

    spyOn(dummyApiService, 'createTodoData').and.returnValue(of({}));
    spyOn(navController, 'navigateForward');

    component.todoText = 'Test Todo';
    component.saveTodo();

    expect(dummyApiService.createTodoData).toHaveBeenCalledWith(newTodo);
    expect(component.todoText).toEqual('');
    expect(component.completed).toEqual(false);
    expect(todoShareService.sharedTodo).toContain(newTodo);
    expect(navController.navigateForward).toHaveBeenCalledWith('tabs/todo');
  });

  it('should not save an empty todo', () => {
    spyOn(dummyApiService, 'createTodoData');
    spyOn(navController, 'navigateForward');

    component.saveTodo();

    expect(dummyApiService.createTodoData).not.toHaveBeenCalled();
    expect(navController.navigateForward).not.toHaveBeenCalled();
  });

  it('should cancel adding a todo', () => {
    component.todoText = 'Test Todo';
    component.completed = true;

    component.cancelTodo();

    expect(component.todoText).toEqual('');
    expect(component.completed).toEqual(false);
  });
});
