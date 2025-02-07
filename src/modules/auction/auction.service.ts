import { log } from 'console';
import { ethers } from 'ethers';
 // Configuration
 const PROVIDER_WS = process.env.PROVIDER_WS || 'wss://your.websocket.provider';
 const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
 const PUBLISHER_PRIVATE_KEY = process.env.PUBLISHER_PRIVATE_KEY || '';
 const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

 // Contract ABI (only the functions we need)
 const CONTRACT_ABI = [
     "function startAuction(uint256 _startPrice, uint256 _endPrice, uint256 _duration) external",
     "function getAuctionState() external view returns (uint256 currentPrice, bool isActive, uint256 timeRemaining)",
     "function endAuctionNoBids() external",
     "function placeBid(uint256 _tokenId, uint256 _bidAmount) external",
     "function getCurrentPrice() external view returns (uint256)",
 ];

 // Setup provider and contract
 const provider = new ethers.providers.WebSocketProvider(PROVIDER_WS);
 const operatorWallet = new ethers.Wallet(PRIVATE_KEY, provider);
 const publisherWallet = new ethers.Wallet(PUBLISHER_PRIVATE_KEY, provider);

 const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, operatorWallet);
 const publisherContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, publisherWallet);

export const auctionService = {    
    startAuction: async function() {
        try {
            let duration = 1 * 60; // 1 minute
            let startPrice = ethers.utils.parseUnits('10', 18);
            let endPrice = ethers.utils.parseUnits('1', 18);

            // Start the auction
            const tx = await contract.startAuction(startPrice, endPrice, duration);
            const receipt = await tx.wait();
            return receipt.transactionHash;

        } catch (error) {
            return (error as any).error.reason;
        }
    },

    async placeBid(tokenId: number, bidAmount: number) {
        try {
            const bidAmountWei = ethers.utils.parseUnits("100", 18);
            const currentPrice = await contract.getCurrentPrice();
            console.log('Placing bid for token', tokenId, 'with amount', bidAmountWei.toString());
            
            // Place bid
            const tx = await publisherContract.placeBid(tokenId, bidAmountWei)

            const receipt = await tx.wait();
            return receipt.transactionHash;
            
        } catch (error) {
            return (error as any).error.reason;
        }
    },

    endAuctionNoBids: async function() {
        try {
            const tx = await contract.endAuctionNoBids();
            const receipt = await tx.wait();
            return receipt.transactionHash;

        } catch (error) {
            console.error('Error in endAuctionNoBids', error);
            throw error;
        }
    },
   
    
};


