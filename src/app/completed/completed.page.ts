import { Component, OnInit } from '@angular/core';
import { DummyApiService } from '../services/dummy-api.service';
import { ActionSheetController } from '@ionic/angular';
import { Todo } from '../models/todo.model';
import { ModalController } from '@ionic/angular';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';
import { TodoShareService } from '../services/todo-share.service';

@Component({
  selector: 'app-completed',
  templateUrl: 'completed.page.html',
  styleUrls: ['completed.page.scss']
})
export class CompletedPage implements OnInit {
  completedTodos: Todo[] = [];
  constructor(
    private dummyApiService: DummyApiService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private todoShareService: TodoShareService
  ) {}
  
  ngOnInit() {
    this.fetchTodos();
  }

  ionViewDidEnter() {
    this.checkSharedTodo();
  }

  fetchTodos() {
    this.dummyApiService.getTodoData().subscribe(response => {
      this.completedTodos = response.filter(todo => todo.completed);
      this.checkSharedTodo();
    });
  }

  checkSharedTodo() {
    if (this.todoShareService.sharedTodo && this.completedTodos.length !== 0) {
      const sharedTodos: Todo[] = this.todoShareService.sharedTodo;
      this.completedTodos.unshift(...sharedTodos);
      this.todoShareService.sharedTodo = null;
    }
  }

  async openActionSheet(todo: Todo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Todo Actions',
      buttons: [
        {
          text: 'Mark as Incomplete',
          handler: () => this.toggleComplete(todo)
        },
        {
          text: 'Edit',
          handler: () => this.editTodo(todo)
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteTodo(todo)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  toggleComplete(todo: Todo) {
    todo.completed = false;
    this.dummyApiService.updateTodoData(todo).subscribe(() => {
      console.log("Todo marked as Incomplete:", todo);
      
      if (!this.todoShareService.sharedTodo) {
        this.todoShareService.sharedTodo = [];
      }
      this.todoShareService.sharedTodo.push(todo);
    });

    this.completedTodos = this.completedTodos.filter(item => item.id !== todo.id);
  }
  
  async editTodo(todo: Todo) {
    console.log('Edit:', todo);
    const modal = await this.modalController.create({
      component: EditTodoModalComponent,
      componentProps: {
        todo: { ...todo }
      }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.role === 'save' && result.data) {
        const updatedTodo: Todo = result.data;
        const index = this.completedTodos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.completedTodos[index] = { ...updatedTodo };
        }
      }
    });
  
    return await modal.present();
  }

  deleteTodo(todo: Todo) {
    console.log('Delete:', todo);
    if (todo.id) {
      this.dummyApiService.deleteTodoData(todo.id).subscribe(() => {
        console.log("Todo deleted:", todo);
      });
      this.completedTodos = this.completedTodos.filter(item => item.id !== todo.id);
    }
  }
}
