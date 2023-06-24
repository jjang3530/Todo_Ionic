import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { EditTodoModalComponent } from './edit-todo-modal.component';

describe('EditTodoModalComponent', () => {
  let component: EditTodoModalComponent;
  let fixture: ComponentFixture<EditTodoModalComponent>;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTodoModalComponent],
      imports: [IonicModule.forRoot()],
      providers: [ModalController]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTodoModalComponent);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todoMessage with todo.todo', () => {
    const todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };
    component.todo = todo;
    component.ngOnInit();
    expect(component.todoMessage).toEqual(todo.todo);
  });

  it('should update todo.todo when save() is called', () => {
    const todo = { id: 1, todo: 'Test Todo', completed: false, userId: 1 };
    const newTodoMessage = 'Updated Todo';
    component.todo = todo;
    component.todoMessage = newTodoMessage;
    spyOn(modalController, 'dismiss');

    component.save();

    expect(component.todo.todo).toEqual(newTodoMessage);
    expect(modalController.dismiss).toHaveBeenCalledWith(todo, 'save');
  });

  it('should dismiss the modal with cancel action when cancel() is called', () => {
    spyOn(modalController, 'dismiss');

    component.cancel();

    expect(modalController.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });
});
