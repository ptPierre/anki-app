import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    console.log('Initializing WebSocket connection');
    const token = this.authService.getAuthToken();
    console.log('Token being sent to WebSocket:', token); // Detailed token log

    this.socket = io('http://localhost:3000', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error details:', error);
    });
  }

  exportPackages(): Observable<any> {
    return new Observable(observer => {
      console.log('Emitting export-packages event');
      this.socket.emit('export-packages');

      this.socket.on('export-complete', (data: { data: string, filename: string }) => {
        console.log('Received export-complete event:', data);
        const blob = new Blob([data.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        observer.next(data);
        observer.complete();
      });

      this.socket.on('export-error', (error) => {
        console.error('Export error:', error);
        observer.error(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
} 