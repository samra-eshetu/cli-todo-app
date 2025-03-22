const fs = require('fs');
const readline = require('readline');

//Create an interface for reading input from the command line
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileName = 'task.json'; //File to store tasks

//Load tasks form the JSON file

function loadTasks() {
    try {
        const data = fs.readFileSync(fileName, 'utf8');//read the file
        return JSON.parse(data);//parse the JSON data
    } catch (err) {
        return []// Return an empty array if the file doesn't exist or is invalid
    }
}
// Save tasks to the JSON file
function saveTasks(tasks) {
    fs.writeFileSync(fileName, JSON.stringify(tasks, null, 2));//write tasks to the file
}
function displayTasks(tasks) {
    if (tasks.length === 0) {
        console.log('No tasks found');
    } else {
        console.log('Your tasks:');
        tasks.forEach(task => {
            const status = task.completed ? '[x]' : '[]';
            console.log(`${task.id}. ${status} ${task.description}`);
        });
    }
}
function getNewId(tasks) {
    if (tasks.length === 0) return 1;
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}
//Get command-line arguments
const command = process.argv[2]; //The command(eg. "add" or "list")
const taskName = process.argv[3]; // The task name (if adding a task)

if (command === 'add') {
    if (!taskName) {
        console.log('Please provide a task name.');
        r1.close();
        return;
    }
    const tasks = loadTasks(); //Load existing tasks
    const newTask = {
        id: getNewId(tasks),
        description: taskName,
        completed: false
    };
    tasks.push(newTask);// add the new task
    saveTasks(tasks); //save updated tasks
    console.log(`Tasks"${taskName}" added successfully.`);

} else if (command === 'list') {
    const tasks = loadTasks(); //Load existing tasks
    displayTasks(tasks);

} else if (command === 'delete') {
    const taskId = parseInt(taskName, 10);
    if (isNaN(taskId)) {
        console.log('Please provide a valid task ID.');
        r1.close();
        return;
    }
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        console.log('Task not found');
        r1.close();
        return;
    }
    // Remove the task at the given index
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    saveTasks(tasks);
    console.log(`Tasks "${deletedTask.description}" deleted successfully `);


} else if (command == 'complete') {
    const taskId = parseInt(taskName, 10);
    if (isNaN(taskId)) {
        console.log('Please provide a valid task ID');
        r1.close();
        return;
    }

    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.log('Task not found');
        r1.close();
        return;
    }

    task.completed = true;
    saveTasks(tasks);
    console.log(`Task "${task.description}" marked as completed.`);

} else if (command === 'help') {
    console.log(`
        Usage:
    node app.js add "Task Name"    - Add a new task.
    node app.js list               - List all tasks.
    node app.js delete <ID>        - Delete a task by ID.
    node app.js complete <ID>      - Mark a task as completed.
    node app.js help               - Show this help message.
        `);
} else {
    console.log('Invalid command. Use "help" for usage instructions.');

}
r1.close();// Close the readline interface