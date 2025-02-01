const chalk = require('chalk');

const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.cyan(`[${timestamp}] INFO: ${message}`));
    },
    
    error: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.red(`[${timestamp}] ERROR: ${message}`));
    },
    
    success: (message) => {
        const timestamp = new Date().toISOString();
        console.log(chalk.green(`[${timestamp}] SUCCESS: ${message}`));
    },

    request: (method, path, status, duration) => {
        const timestamp = new Date().toISOString();
        const statusColor = status < 400 ? chalk.green : chalk.red;
        console.log(
            chalk.gray(`[${timestamp}]`),
            chalk.yellow(method),
            chalk.white(path),
            statusColor(status),
            chalk.blue(`${duration} ms`)
        );
    }
};

module.exports = logger;