import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DummyApiService } from '../services/dummy-api.service';
import { Todo } from '../models/todo.model';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';
import { TodoShareService } from '../services/todo-share.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.page.html',
  styleUrls: ['todo.page.scss']
})
export class TodoPage implements OnInit {
  todos: Todo[] = [];

  constructor(
    private dummyApiService: DummyApiService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private todoShareService: TodoShareService
  ) {}

  ionViewDidEnter() {
    if (this.todoShareService.sharedTodo) {
      const sharedTodos: Todo[] = this.todoShareService.sharedTodo;
      this.todos.unshift(...sharedTodos);
      this.todoShareService.sharedTodo = null;
    }
  }

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.dummyApiService.getTodoData().subscribe((response) => {
      this.todos = response.filter((todo) => !todo.completed);
    });
  }

  async openActionSheet(todo: Todo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Todo Actions',
      buttons: [
        {
          text: 'Mark as Completed',
          handler: () => {
            this.toggleComplete(todo);
          },
        },
        {
          text: 'Edit',
          handler: () => {
            this.editTodo(todo);
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteTodo(todo);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async toggleComplete(todo: Todo) {
    todo.completed = true;

    this.dummyApiService.updateTodoData(todo).subscribe(() => {
      console.log('Todo marked as complete:', todo);
      if (!this.todoShareService.sharedTodo) {
        this.todoShareService.sharedTodo = [];
      }
      this.todoShareService.sharedTodo.push(todo);
    });

    this.todos = this.todos.filter((item) => item.id !== todo.id);
  }

  async editTodo(todo: Todo) {
    const modal = await this.modalController.create({
      component: EditTodoModalComponent,
      componentProps: {
        todo: { ...todo },
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'save' && result.data) {
        const updatedTodo: Todo = result.data;
        const index = this.todos.findIndex((t) => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = { ...updatedTodo };
        }
      }
    });

    await modal.present();
  }

  deleteTodo(todo: Todo) {
    if (todo.id) {
      this.dummyApiService.deleteTodoData(todo.id).subscribe(() => {
        console.log('Todo deleted:', todo);
      });
      this.todos = this.todos.filter((item) => item.id !== todo.id);
    }
  }
}
