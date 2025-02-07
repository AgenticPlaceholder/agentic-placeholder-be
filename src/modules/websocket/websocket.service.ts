import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { EventEmitter } from 'events';

export class WebSocketService {
    private wss: WebSocketServer;
    private clients: Set<WebSocket>;
    private eventEmitter: EventEmitter;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.clients = new Set();
        this.eventEmitter = new EventEmitter();
        this.initialize();
        console.log('WebSocket Server initialized');
    }

    private initialize() {
        this.wss.on('connection', (ws, req) => {
            console.log(`New client connected from ${req.socket.remoteAddress}`);
            this.clients.add(ws);
            console.log(`Total connected clients: ${this.clients.size}`);

            ws.on('close', () => {
                console.log('Client disconnected');
                this.clients.delete(ws);
                console.log(`Remaining clients: ${this.clients.size}`);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.clients.delete(ws);
            });
        });

        // Listen for both ad and auction events
        this.eventEmitter.on('adPublished', (adData) => {
            console.log('Broadcasting ad update:', adData);
            this.broadcastUpdate('AD_PUBLISHED', adData);
        });

        this.eventEmitter.on('auctionStarted', (auctionData) => {
            console.log('Broadcasting auction started:', auctionData);
            this.broadcastUpdate('AUCTION_STARTED', auctionData);
        });

        this.eventEmitter.on('auctionStatus', (statusData) => {
            console.log('Broadcasting auction status:', statusData);
            this.broadcastUpdate('AUCTION_STATUS', statusData);
        });

        this.eventEmitter.on('bidPlaced', (bidData) => {
            console.log('Broadcasting bid placed:', bidData);
            this.broadcastUpdate('BID_PLACED', bidData);
        });
    }

    private broadcastUpdate(type: string, data: any) {
        const message = JSON.stringify({
            type: type,
            data: data
        });

        let successCount = 0;
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                successCount++;
            }
        });
        console.log(`Successfully broadcast to ${successCount} clients`);
    }

    public publishAd(adData: any) {
        this.eventEmitter.emit('adPublished', adData);
    }

    public publishAuctionStarted(auctionData: any) {
        this.eventEmitter.emit('auctionStarted', auctionData);
    }


    public publishAuctionStatus(statusData: any) {
        this.eventEmitter.emit('auctionStatus', statusData);
    }

    public publishBidPlaced(bidData: any) {
        this.eventEmitter.emit('bidPlaced', bidData);
    }

    public getClientCount(): number {
        return this.clients.size;
    }
}