export class Todo{
    name: string;
    eventTime: string;
    id: number;
}
export class TodoByDate{
    date: Date;
    formattedDate: string;
    data: Array<Todo>;
}