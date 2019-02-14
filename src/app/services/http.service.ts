import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TodoByDate, Todo } from "./../models/todo.model";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

Injectable({
  providedIn: "root"
});
export class HttpService {
  constructor(@Inject(HttpClient) private http: HttpClient) {}
  getTodos() {
    return this.http.get<Array<Todo>>("/api/get");
      
  }
  saveTodos(json) {
    return this.http
      .post("/api/save", json, httpOptions)
  }
}
