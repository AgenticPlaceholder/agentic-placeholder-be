import logger from '../../config/logger';
import { Operator, IOperator } from '../../models/operator';

export const getOperatorDetailsbyWalletAddress = async (walletAddress: string): Promise<IOperator | null> => {
    try {
        const operator = await Operator.findOne({ 
            walletAddress 
        });
        return operator;
    } catch (error) {
        logger.error('Error fetching operator:', error);
        throw error;
    }
}