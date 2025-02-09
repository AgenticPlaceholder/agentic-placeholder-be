// avs-agent.service.ts
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import 'dotenv/config';

const abi = parseAbi([
    'function createNewTask(string memory comment, uint8 rating) external returns ((string comment, uint32 taskCreatedBlock))'
]);

const contractAddress = '0xe3EF345391654121f385679613Cea79A692C2Dd8';

// Create account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY_DEPLOYER as `0x${string}`);

const publicClient = createPublicClient({
    chain: anvil,
    transport: http('http://127.0.0.1:8545'),
});

const walletClient = createWalletClient({
    chain: anvil,
    transport: http('http://127.0.0.1:8545'),
    account,
});

export const avsService = {
    createTask: async function(comment: string, rating: number) {
        try {
            const { request } = await publicClient.simulateContract({
                address: contractAddress,
                abi,
                functionName: 'createNewTask',
                args: [comment, rating],
                account: account.address,
            });

            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log('Transaction hash:', hash);
            // console.log('Transaction receipt:', receipt);
            // return receipt;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }
};