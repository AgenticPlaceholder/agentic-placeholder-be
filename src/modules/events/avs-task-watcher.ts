import { createPublicClient, createWalletClient, http, parseAbi, encodePacked, keccak256, parseAbiItem, AbiEvent, encodeAbiParameters } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { CommentRatingAnalyzer } from '../avs-agent/sentiment';
import 'dotenv/config';

interface Task {
  comment: string;
  rating: number;
  taskCreatedBlock: number;
}

const abi = parseAbi([
    'function respondToTask((string comment, uint8 rating, uint32 taskCreatedBlock) task, uint32 referenceTaskIndex, string sentiment, bytes memory signature) external',
    'event NewTaskCreated(uint32 indexed taskIndex, (string comment, uint8 rating, uint32 taskCreatedBlock) task)',
    'function createNewTask(string memory comment, uint8 rating) external returns ((string comment, uint8 rating, uint32 taskCreatedBlock))',
]);

class TaskWatcherService {
  private isRunning: boolean = false;
  private analyzer = new CommentRatingAnalyzer();

  // private validateUint8(value: number): void {
  //   if (!Number.isInteger(value) || value < 0 || value > 255) {
  //     throw new Error('Rating must be an integer between 0 and 255 (uint8)');
  //   }
  // }

  async startWatching() {
    if (this.isRunning) return;
    
    const contractAddress = '0xe3EF345391654121f385679613Cea79A692C2Dd8';
    const account = privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY as `0x${string}`);

    const publicClient = createPublicClient({
      chain: anvil,
      transport: http('http://127.0.0.1:8545'),
    });

    const walletClient = createWalletClient({
      chain: anvil,
      transport: http('http://127.0.0.1:8545'),
      account,
    });

    const unwatch = publicClient.watchEvent({
      address: contractAddress,
      event: parseAbiItem('event NewTaskCreated(uint32 indexed taskIndex, (string comment, uint8 rating, uint32 taskCreatedBlock) task)') as AbiEvent,
      onLogs: async (logs) => {
        for (const log of logs) {
          const { args } = log;
          if (!args) continue;

          const taskIndex = Number((args as any).taskIndex);
          const task = (args as { task: Task }).task;
          console.log('New task detected:', {
            taskIndex,
            task
          });
          await this.respondToTask(walletClient, publicClient, contractAddress, account, task, taskIndex);
        }
      },
    });

    this.isRunning = true;
    return unwatch;
  }

  private async createSignature(account: any, sentiment: string, comment: string, rating: number) {
    // this.validateUint8(rating);
    
    const messageHash = keccak256(
        encodePacked(
            ['string', 'string', 'uint8'],
            [sentiment, comment, rating]
        )
    );
    
    const signature = await account.signMessage({
        message: { raw: messageHash }
    });
    
    return  signature ;  
  }

  private async respondToTask(
    walletClient: any,
    publicClient: any,
    contractAddress: string,
    account: any,
    task: Task,
    taskIndex: number
  ) {
    try {
        // this.validateUint8(task.rating);
        const result = await this.analyzer.analyzeSentiment(task.comment, task.rating);
        const { sentiment } = result;
        const signature = await this.createSignature(account, sentiment, task.comment, task.rating);

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi,
            functionName: 'respondToTask',
            args: [task, taskIndex, result.sentiment, signature],
            account: account.address,
        });

        const hash = await walletClient.writeContract(request);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log('Responded to task:', {
          taskIndex,
          task,
          sentiment,
          transactionHash: hash
        });
    } catch (error) {
        console.error('Error responding to task:', error);
    }
  }
}

export const taskWatcherService = new TaskWatcherService();