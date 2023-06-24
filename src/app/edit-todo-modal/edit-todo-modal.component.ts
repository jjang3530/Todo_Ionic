import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-edit-todo-modal',
  templateUrl: './edit-todo-modal.component.html',
  styleUrls: ['./edit-todo-modal.component.scss']
})
export class EditTodoModalComponent implements OnInit {
  @Input() todo!: Todo | undefined; // Input property to receive the todo object

  todoMessage!: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.todoMessage = this.todo?.todo ?? ''; // Set the initial value of todoMessage
  }

  save() {
    if (this.todo) {
      this.todo.todo = this.todoMessage;
      this.modalController.dismiss(this.todo, 'save');
    }
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
