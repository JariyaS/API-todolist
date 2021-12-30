const express = require("express");
const path = require("path");

const {
  createTodo,
  getTodo,
  getTodoID,
  updateTodo,
  deleteTodo,
} = require("./todoAction");

//ประกาศใช้งาน express
const app = express();

//เอา body มาใช้
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Resource : todo
// {
//   id(type: string, format: uuid): 'uuid',
//   title(type:string, required): 'Meting'},
//   completed (type: booleanม deafault: false) : true,
//   dueDate (type: string, format: date, default: null) : '2021-09-04T0:0:0'
// }

// Create
// POST /todos  ( path : /resource name )
// Input : ส่งข้อมูลเข้ามาเป็น body { title, completed, dueDate }
// response:
// 201 Created { todo: new todo object} => { todo: { id, title, completed, dueDate}}
// 400 Bad request { message: 'title is required'} (ใส่ error message ให้ตรงตามสิ่งที่ไม่ถูกต้อง เกิดจากอะไร)
// 500 Internal server error { message: 'Internal server error' }

app.post("/todos", createTodo);

// Read
// GET /todos  (find all todo)
// parameter: query { limit, offset, orderBy, field } orderBy=dueDate, desc (ขึ้นอยู่กับการ design หน้าตาว่าจะให้ข้อมูลออกมาหน้าตาแบบไหน)
// response:
//200 Ok { todos: [todo object] }
// 400 Bad request { message: 'limit must be a number'} (ใส่ error message ให้ตรงตามสิ่งที่ไม่ถูกต้อง เกิดจากอะไร)
// 500 Internal server error { message: 'Internal server error' }

app.get("/todos", getTodo);

// GET by id : /todos/:id
// parameter : path parametr { id }
// response:
// 200 Ok { todos: [todo object or null] }
// 500 Internal server error { message: 'Internal server error' }
app.get("/todos/:id", getTodoID);

// Update
// PUT /todos/:id
// parameter: body { title, completed, dueDate }, path parameter { id }
// response:
// 200 Ok { todos: updated todo object}
// 400 Bad request { message: 'title is required'}
// 500 Internal server error { message: 'Internal server error' } // มีโอกาสเกิดขึ้นตลอด
app.put("/todos/:id", updateTodo);

// Delete
// DELETE /todos/:todo
// parameter: path parameter { id }
// response:
// 204 No Content
// 400 Bad request { message: 'todo with this id not found'}
// 500 Internal server error { message: 'Internal server error' }
app.delete("/todos/:id", deleteTodo);

//Handle error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

app.listen(8888, () => console.log("Server is running on port 8888"));
