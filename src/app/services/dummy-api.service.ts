import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class DummyApiService {
  
  // https://dummyjson.com API Endpoint
  apiUrl = 'https://dummyjson.com/todos';

  constructor(public http: HttpClient) { }

  getTodoData(): Observable<Todo[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.todos)
    );
  }

  createTodoData(todo: Todo): Observable<any> {
    const url = `${this.apiUrl}/add`;
    const body = JSON.stringify({
      todo: todo.todo,
      completed: todo.completed,
      userId: todo.userId
    });
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(url, body, { headers });
  }

  updateTodoData(todo: Todo): Observable<any> {
    const url = `${this.apiUrl}/${todo.id}`;
    const body = JSON.stringify({
      completed: todo.completed
    });
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<any>(url, body, { headers });
  }
  

  deleteTodoData(todoId: string): Observable<any> {
    const url = `${this.apiUrl}/${todoId}`;
    return this.http.delete<any>(url);
  }
}
