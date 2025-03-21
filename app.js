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
    tasks.push(taskName);// add the new task
    saveTasks(tasks); //save updated tasks
    console.log(`Tasks"${taskName}" added successfully.`);

} else if (command === 'list') {
    const tasks = loadTasks(); //Load existing tasks
    if (tasks.length === 0) {
        console.log('No tasks found');
    } else {
        console.log('Your tasks:');
        tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`)); //List all tasks
    }
} else {
    console.log('Invalid command. Use "add" or "list"');

}
r1.close();// Close the readline interface