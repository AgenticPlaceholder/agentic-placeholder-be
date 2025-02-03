import chalk from 'chalk';

interface Logger {
    info: (message: string) => void;
    error: (message: string, error?: unknown) => void;
    success: (message: string) => void;
    request: (method: string, path: string, status: number, duration: number) => void;
}

const logger: Logger = {
    info: (message: string): void => {
        const timestamp = new Date().toISOString();
        console.log(chalk.cyan(`[${timestamp}] INFO: ${message}`));
    },
    
    error: (message: string, error?: unknown): void => {
        const timestamp = new Date().toISOString();
        console.log(chalk.red(`[${timestamp}] ERROR: ${message}`));
        if (error) {
            console.error(chalk.red(error instanceof Error ? error.stack : String(error)));
        }
    },
    
    success: (message: string): void => {
        const timestamp = new Date().toISOString();
        console.log(chalk.green(`[${timestamp}] SUCCESS: ${message}`));
    },

    request: (method: string, path: string, status: number, duration: number): void => {
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

export default logger;