import { Component } from '@angular/core';
import { Todo } from '../models/todo.model';
import { DummyApiService } from '../services/dummy-api.service';
import { NavController } from '@ionic/angular';
import { TodoShareService } from '../services/todo-share.service';

@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss'],
})
export class AddPage {
  todoText: string = '';
  completed: boolean = false;
  addId: number = 31;

  constructor(
    private dummyApiService: DummyApiService,
    private navController: NavController,
    private todoShareService: TodoShareService
    ) {}

  saveTodo() {
    if (!this.todoText) {
      // Do not save empty todos
      return;
    }

    const newTodo: Todo = {
      id: this.addId,
      todo: this.todoText,
      completed: false,
      userId: 1
    };

    this.dummyApiService.createTodoData(newTodo).subscribe({
      next: (response) => {
        // Handle successful save
        console.log('Todo saved:', response);
    
        // Clear the input fields
        this.todoText = '';
        this.completed = false;
    
        // Push the new todo to the sharedTodo array in the TodoShareService
        if (!this.todoShareService.sharedTodo) {
          this.todoShareService.sharedTodo = [];
        }
        this.todoShareService.sharedTodo.push(newTodo);
        this.addId++;
        console.log('addId', this.addId);
    
        // Redirect to tabs/todo
        this.navController.navigateForward('tabs/todo');
      },
      error: (error) => {
        // Handle error
        console.error('Failed to save todo:', error);
      }
    });
  }

  cancelTodo() {
    // Clear the input fields
    this.todoText = '';
    this.completed = false;
  }
}