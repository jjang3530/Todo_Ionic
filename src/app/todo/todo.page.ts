
import { Component, OnInit  } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { DummyApiService } from '../services/dummy-api.service';
import { Todo } from '../models/todo.model';
import { ModalController } from '@ionic/angular';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';
import { TodoShareService } from '../services/todo-share.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.page.html',
  styleUrls: ['todo.page.scss']
})
export class TodoPage implements OnInit {
  todos: Todo[] = [];

  dumyUpdate = {
    id: "17",
    todo: "Update Message",
    completed: false,
    userId: "1"
  }

  dumyAdd = {
    id: "1",
    todo: "Update Message",
    completed: false,
    userId: "1"
  }

  constructor(
    private dummyApiService: DummyApiService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private todoShareService: TodoShareService
  ) {}

  ionViewDidEnter() {
    console.log('ionViewDidEnter1111');
    if (this.todoShareService.sharedTodo) {
      console.log('shared todo 1111111111');
      const sharedTodos: Todo[] = this.todoShareService.sharedTodo;
        this.todos.unshift(...sharedTodos);
      this.todoShareService.sharedTodo = null; // Reset the shared todo
      console.log('++++++added todo list', this.todos);
    }
  }

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.dummyApiService.getTodoData().subscribe(response => {
      this.todos = response.filter(todo => todo.completed === false);
      console.log('todos init', this.todos);
    });
  }

  async openActionSheet(todo: Todo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Todo Actions',
      buttons: [
        {
          // text: todo.completed ? 'Mark as Incomplete' : 'Mark as Complete',
          text: 'Mark as Completed',
          handler: () => {
            this.toggleComplete(todo);
          }
        },
        {
          text: 'Edit',
          handler: () => {
            this.editTodo(todo);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteTodo(todo);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async toggleComplete(todo: Todo) {
    todo.completed = true;
  
    // Call the service method to update the todo with the new completed status
    this.dummyApiService.updateTodoData(todo).subscribe(() => {
      // Handle successful update
      console.log("Todo marked as complete:", todo);
      // Update the shared todo in the TodoShareService
      if (!this.todoShareService.sharedTodo) {
        this.todoShareService.sharedTodo = [];
      }
      this.todoShareService.sharedTodo.push(todo);
    });

    // Remove the completed todo from the todos list
    this.todos = this.todos.filter(item => item.id !== todo.id);
  }
  
  async editTodo(todo: Todo) {
    console.log('Edit:', todo);
    // Implement your edit logic here
    const modal = await this.modalController.create({
      component: EditTodoModalComponent,
      componentProps: {
        todo: { ...todo } // Create a shallow copy of the todo object to avoid modifying the original object
      }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.role === 'save' && result.data) {
        const updatedTodo: Todo = result.data;
        // Update the todo in the current list
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = { ...updatedTodo }; // Update the todo with the edited values
        }
      }
    });
  
    return await modal.present();
  }
  
  deleteTodo(todo: Todo) {
    console.log('Delete:', todo);
    // Implement your delete logic here
    if (todo.id) {
      this.dummyApiService.deleteTodoData(todo.id).subscribe(() => {
        // Handle successful deletion
        console.log("Todo deleted:", todo);
      });
      // Remove the todo from the todos list
      this.todos = this.todos.filter(item => item.id !== todo.id);
    }
  }
}
