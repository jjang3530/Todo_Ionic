import { Component } from '@angular/core';
import { DummyApiService } from './../services/dummy-api.service';
import { ActionSheetController } from '@ionic/angular';
import { Todo } from '../models/todo.model';
import { ModalController } from '@ionic/angular';
import { EditTodoModalComponent } from '../edit-todo-modal/edit-todo-modal.component';
import { TodoShareService } from '../services/todo-share.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  completedTodos: Todo[] = [];

  dumyUpdate = {
    id: "17",
    todo: "Update Message",
    completed: false,
    userId: "1"
  }

  dumyAdd = {
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
  
  ngOnInit() {
    this.fetchTodos();
  }

  ionViewDidEnter() {
    this.checkShredTodo();
  }



  fetchTodos() {
    this.dummyApiService.getTodoData().subscribe(response => {
      this.completedTodos = response.filter(todo => todo.completed === true);
      console.log('completedTodos init', this.completedTodos);
      this.checkShredTodo();
    });
  }

  checkShredTodo() {
    console.log('ionViewDidEnter3333', this.completedTodos.length);
    if (this.todoShareService.sharedTodo && this.completedTodos.length !== 0) {
      console.log('shared todo 3333333333');
      const sharedTodos: Todo[] = this.todoShareService.sharedTodo;
      this.completedTodos.unshift(...sharedTodos);
      this.todoShareService.sharedTodo = null; // Reset the shared todo
    }
  }

  async openActionSheet(todo: Todo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Todo Actions',
      buttons: [
        {
          // text: todo.completed ? 'Mark as Incomplete' : 'Mark as Complete',
          text: 'Mark as Incompleted',
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
    todo.completed = false;
  
    // Call the service method to update the todo with the new completed status
    this.dummyApiService.updateTodoData(todo).subscribe(() => {
      // Handle successful update
      console.log("Todo marked as Incomplete:", todo);
      
      // Update the shared todo in the TodoShareService
      if (!this.todoShareService.sharedTodo) {
        this.todoShareService.sharedTodo = [];
      }
      this.todoShareService.sharedTodo.push(todo);
    });

    // Remove the Incompleted todo from the completedTodos list
    this.completedTodos = this.completedTodos.filter(item => item.id !== todo.id);
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
        const index = this.completedTodos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.completedTodos[index] = { ...updatedTodo }; // Update the todo with the edited values
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
    // Remove the todo from the completedTodos list
    this.completedTodos = this.completedTodos.filter(item => item.id !== todo.id);
    }
  }
}
