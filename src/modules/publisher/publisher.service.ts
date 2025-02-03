import logger from '../../config/logger';
import { Publisher, IPublisher } from '../../models/publisher';

export const getPublisherDetailsbyWalletAddress = async (walletAddress: string): Promise<IPublisher | null> => {
    try {
        const operator = await Publisher.findOne({ 
            walletAddress 
        });
        return operator;
    } catch (error) {
        logger.error('Error fetching operator:', error);
        throw error;
    }
}