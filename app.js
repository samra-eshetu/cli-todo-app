const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileName = 'task.json';

// Load tasks from JSON file
function loadTasks() {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(fileName, JSON.stringify(tasks, null, 2));
}

// Display tasks with color coding
function displayTasks(tasks) {
    if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found.'));
        return;
    }

    console.log(chalk.bold('\nYour tasks:'));
    tasks.forEach(task => {
        const status = task.completed
            ? chalk.green('[x]')
            : chalk.red('[ ]');
        console.log(`${task.id}. ${status} ${task.description}`);
    });
}

// Generate new task ID
function getNewId(tasks) {
    return tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;
}

// Handle user commands
function handleCommand(input) {
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();
    const restArgs = args.slice(1).join(' ');

    switch (command) {
        case 'add': {
            if (!restArgs) {
                console.log(chalk.red('Error: Please provide a task description.'));
                break;
            }
            const tasks = loadTasks();
            const newTask = {
                id: getNewId(tasks),
                description: restArgs,
                completed: false
            };
            tasks.push(newTask);
            saveTasks(tasks);
            console.log(chalk.green(`✓ Task "${restArgs}" added!`));
            break;
        }

        case 'list': {
            const tasks = loadTasks();
            displayTasks(tasks);
            break;
        }

        case 'delete': {
            const taskId = parseInt(args[1], 10);
            if (isNaN(taskId)) {
                console.log(chalk.red('Error: Invalid task ID.'));
                break;
            }
            const tasks = loadTasks();
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) {
                console.log(chalk.red('Error: Task not found.'));
                break;
            }
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            saveTasks(tasks);
            console.log(chalk.green(`✓ Task "${deletedTask.description}" deleted.`));
            break;
        }

        case 'complete': {
            const taskId = parseInt(args[1], 10);
            if (isNaN(taskId)) {
                console.log(chalk.red('Error: Invalid task ID.'));
                break;
            }
            const tasks = loadTasks();
            const task = tasks.find(t => t.id === taskId);
            if (!task) {
                console.log(chalk.red('Error: Task not found.'));
                break;
            }
            task.completed = true;
            saveTasks(tasks);
            console.log(chalk.green(`✓ Task "${task.description}" marked as completed.`));
            break;
        }

        case 'help':
            console.log(`
${chalk.bold('Commands:')}
add "Task Name"    → Add a new task
list               → List all tasks
delete <ID>        → Delete a task by ID
complete <ID>      → Mark a task as completed
help               → Show this help
exit               → Quit the app
      `);
            break;

        case 'exit':
            rl.close();
            break;

        default:
            console.log(chalk.red(`Error: Unknown command "${command}". Type "help" for options.`));
    }
}

// Start the interactive CLI
console.log(chalk.blue.bold('\nWelcome to the CLI To-Do App!'));
console.log(chalk.blue('Type "help" to see available commands.\n'));

rl.setPrompt(chalk.blue('todo> '));
rl.prompt();

rl.on('line', (input) => {
    handleCommand(input);
    rl.prompt();
}).on('close', () => {
    console.log(chalk.blue('\nGoodbye!'));
    process.exit(0);
});