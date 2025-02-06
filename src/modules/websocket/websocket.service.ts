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

        this.eventEmitter.on('adPublished', (adData) => {
            console.log('Broadcasting ad update:', adData);
            this.broadcastAdUpdate(adData);
        });
    }

    private broadcastAdUpdate(adData: any) {
        const message = JSON.stringify({
            type: 'AD_PUBLISHED',
            data: adData
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

    public getClientCount(): number {
        return this.clients.size;
    }
}