import { ethers } from "ethers";
import { WebSocketService } from '../websocket/websocket.service';
import * as dotenv from "dotenv";

dotenv.config();

export class EventService {
    private provider!: ethers.providers.WebSocketProvider;
    private contract!: ethers.Contract;
    private operatorWallet!: ethers.Wallet;
    private wsService: WebSocketService;
    private pollInterval: NodeJS.Timer | null = null;
    private readonly POLL_INTERVAL = 10 * 1000; // 10 seconds

    // Contract constants
    private readonly PROVIDER_WS: string = process.env.PROVIDER_WS || "";
    private readonly PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";
    private readonly CONTRACT_ADDRESS: string = process.env.CONTRACT_ADDRESS || "";

    private readonly CONTRACT_ABI = [
        "event AuctionStarted(uint256 startPrice, uint256 endPrice, uint256 startTime, uint256 duration)",
        "function getAuctionState() external view returns (uint256 currentPrice, bool isActive, uint256 timeRemaining)",
        "event BidPlaced(address bidder, uint256 bidAmount, uint256 tokenId)",
    ];

    constructor(wsService: WebSocketService) {
        this.wsService = wsService;
        this.initialize();
    }

    private initialize() {
        try {
            this.provider = new ethers.providers.WebSocketProvider(this.PROVIDER_WS);
            this.operatorWallet = new ethers.Wallet(this.PRIVATE_KEY, this.provider);
            this.contract = new ethers.Contract(
                this.CONTRACT_ADDRESS,
                this.CONTRACT_ABI,
                this.operatorWallet
            );
            console.log('Contract service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize contract service:', error);
            throw error;
        }
    }

    public async start() {
        console.log('Starting contract service...');
        this.setupAuctionStartedListener();
        this.setupBidPlacedListener();
        await this.checkAndBroadcastAuctionStatus();
        this.startPolling();
    }

    public stop() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval as NodeJS.Timeout);
            this.pollInterval = null;
        }
        this.provider.removeAllListeners();
    }

    private setupAuctionStartedListener() {
        this.contract.on(
            "AuctionStarted",
            (startPrice, endPrice, startTime, duration, event) => {
                const eventData = {
                    type: 'AuctionStarted',
                    data: {
                        startPrice: ethers.utils.formatUnits(startPrice, 18),
                        endPrice: ethers.utils.formatUnits(endPrice, 18),
                        startTime: new Date(startTime.toNumber() * 1000).toLocaleString(),
                        duration: duration.toNumber(),
                        transactionHash: event.transactionHash
                    }
                };
                console.log('AuctionStarted event:', eventData);
                this.wsService.publishAuctionStarted(eventData);
            }
        );
    }

    private async checkAndBroadcastAuctionStatus() {
        try {
            const [currentPrice, isActive, timeRemaining] = await this.contract.getAuctionState();
            
            if (isActive) {
                const statusData = {
                    type: 'AuctionStatus',
                    data: {
                        currentPrice: ethers.utils.formatUnits(currentPrice, 18),
                        isActive: isActive,
                        timeRemaining: timeRemaining.toString(),
                        timestamp: new Date().toLocaleString()
                    }
                };
    
                console.log(`Auction status - Price: ${statusData.data.currentPrice}, Time remaining: ${statusData.data.timeRemaining} seconds`);
                this.wsService.publishAuctionStatus(statusData);
            }

        } catch (error) {
            console.error('Error checking auction status:', error);
        }
    }

    private setupBidPlacedListener() {
        this.contract.on(
            "BidPlaced",
            (bidder, bidAmount, tokenId, event) => {
                const bidData = {
                    type: 'BidPlaced',
                    data: {
                        bidder: bidder,
                        bidAmount: ethers.utils.formatUnits(bidAmount, 18),
                        tokenId: tokenId.toString(),
                        transactionHash: event.transactionHash,
                        timestamp: new Date().toLocaleString()
                    }
                };
                console.log('BidPlaced event:', bidData);
                this.wsService.publishBidPlaced(bidData);
            }
        );
    }

    private startPolling() {
        console.log("Starting auction status polling...");
        this.pollInterval = setInterval(() => {
            this.checkAndBroadcastAuctionStatus().catch(error => {
                console.error('Error in polling interval:', error);
            });
        }, this.POLL_INTERVAL);
    }
}