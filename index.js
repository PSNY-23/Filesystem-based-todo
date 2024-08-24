const fs = require("fs");
const path = require("path");
const { program } = require("commander");

const todosFilePath = path.join(__dirname, "todos.json");

function readTodos() {
  try {
    const data = fs.readFileSync(todosFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTodos(todos) {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
}

program
  .command("add <todo>")
  .description("Add a new todo")
  .action((todo) => {
    const todos = readTodos();
    todos.push({ text: todo, done: false });
    saveTodos(todos);
    console.log(`Added todo: "${todo}"`);
  });

program
  .command("delete <index>")
  .description("Delete a todo by index")
  .action((index) => {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
      console.error("Invalid todo index.");
      return;
    }
    const deleted = todos.splice(index - 1, 1);
    saveTodos(todos);
    console.log(`Deleted todo: "${deleted[0].text}"`);
  });

program
  .command("done <index>")
  .description("Mark a todo as done by index")
  .action((index) => {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
      console.error("Invalid todo index.");
      return;
    }
    todos[index - 1].done = true;
    saveTodos(todos);
    console.log(`Marked todo as done: "${todos[index - 1].text}"`);
  });

program
  .command("list")
  .description("List all todos")
  .action(() => {
    const todos = readTodos();
    if (todos.length === 0) {
      console.log("No todos found.");
    } else {
      todos.forEach((todo, i) => {
        console.log(
          `${i + 1}. [${todo.done ? "x" : " "}] ${todo.text}`
        );
      });
    }
  });

program.parse(process.argv);
