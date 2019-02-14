import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { Todo, TodoByDate } from "./models/todo.model";
import { MAT_DATE_FORMATS } from "@angular/material";
import { FormControl } from '@angular/forms';
import { HttpService } from './services/http.service';
export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "LL",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [HttpService, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class AppComponent implements OnInit, AfterViewInit {
  eventName: string;
  date: Date = new Date();
  today = this.date;
  todos: Array<Todo> = new Array<Todo>();
  todoByDate: Array<TodoByDate> = new Array<TodoByDate>();
  pastTodoByDate: Array<TodoByDate> = new Array<TodoByDate>();
  numberOfDays: Array<number>;
  nameControl = new FormControl('');
  @ViewChild("calenderbody")
  calenderBody: ElementRef;
  hasDataArrived: boolean = true;
  constructor(private http: HttpService){

  }
  ngOnInit() {
    console.log("on init ");
    this.http.getTodos().subscribe((response)=>{
      this.todos = response;
      this.rearrangeDate();
      this.hasDataArrived = false;
    },(error)=>{
      this.hasDataArrived = false;
      console.log("Error while fetching", error);
    })
  }
  ngAfterViewInit() {
    // this.showCalendar(this.date.getMonth(), this.date.getFullYear());
  }
  formatDate(date): string {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }
  addEvent() {
    if(this.eventName == undefined || this.eventName == ""){
      // this.nameControl.markAsTouched();
      return;
    }
    let todo = new Todo();
    todo.name = this.eventName;
    todo.id = Math.random() * 10000000;
    todo.eventTime = this.formatDate(this.date);
    this.todos.push(todo);
    this.rearrangeDate();
    this.eventName = "";
    this.date = new Date();
    this.http.saveTodos(this.todos).subscribe((response)=>{
      console.log("response ", response);
    }, (error)=>{
      console.log("Error ", error);
    });
  }
  rearrangeDate() {
    this.todoByDate.length = 0;
    let currentDate = new Date();
    let currentTodo = new Array<Todo>();
    let pastTodo = new Array<Todo>();
    this.todos.forEach((todo)=>{
      if(currentDate > new Date(todo.eventTime)){
        pastTodo.push(todo);
      }
      else{
        currentTodo.push(todo);
      }
    });
    this.todoByDate = this.getGroupedTodo(currentTodo);
    this.pastTodoByDate = this.getGroupedTodo(pastTodo);
  }
  getGroupedTodo(todo: Array<Todo>): Array<TodoByDate>{
    const groups = todo.reduce((groups, todo) => {
      const date = todo.eventTime;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(todo);
      return groups;
    }, {})
    return Object.keys(groups).map((date) => {
      let tdb = new TodoByDate();
      tdb.date = new Date(date);
      tdb.formattedDate = date;
      tdb.data = groups[date]; 
      return tdb;
    });
  }
  showCalendar(month, year) {
    let firstDay = new Date(year, month).getDay();
    let tbl = this.calenderBody.nativeElement;
    tbl.innerHTML = "";
    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          let cell = document.createElement("td");
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > this.daysInMonth(month, year)) {
          break;
        } else {
          let cell = document.createElement("td");
          let cellText = document.createTextNode(date + "");
          cell.appendChild(cellText);
          row.appendChild(cell);
          date++;
        }
      }
      tbl.appendChild(row);
    }
  }
  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }
}
