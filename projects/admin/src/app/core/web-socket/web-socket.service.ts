import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {io} from 'socket.io-client';
import { AuthService } from '../auth/auth.service';



export enum SocketConnectionStatus {
  initial = 'INITIAL',
  connected = 'CONNECTED',
  rejected = 'REJECTED',
}

@Injectable({
  providedIn: 'root'
})

// TODO: retry every 5 minutes
// TODO: retry on login
// TODO: dont call without login
// TODO: kill all connections on logout


export class WebSocketService {

  socket: any;
  windowsApp = false;
  urlConnection = '/';
  connectionStatus = new BehaviorSubject<SocketConnectionStatus>(SocketConnectionStatus.initial);
  rooms;
  userName;
  isEnabled = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.auth.subscribe(auth => {
      if (auth) {
        this.initializeConnection();
      } else {
        if (this.connectionStatus.value === SocketConnectionStatus.connected) {
          console.log('closing connection')
          this.closeConnection();
        }
      }
    })
   } 

  initializeConnection(namespace?: string) {
    /**
     * Test the connection with the API works before connect to the socket.
     */
    this.http.get('/api' + '/test')
    .pipe().subscribe(result => {
      const user = JSON.stringify({
        id: this.authService.authValue.id,
        firstName: this.authService.authValue.firstName
      });

      this.socket = io(`${this.urlConnection}`, {query: {user: user, jwtToken: this.authService.authValue.jwtToken}});

      this.socket.on('connect', () => {
        console.log('connect', this.socket.connected); // true
        this.connectionStatus.next(SocketConnectionStatus.connected);
      });

      this.socket.on('usersOnline', (usersOnline) => {
        console.log('Users online now:', usersOnline);
      });
    
      this.socket.on('user connected', (userConnected) => {
        console.log('A user just connected:', userConnected);
      });
    
      this.socket.on('user disconnected', (userDisconnected) => {
        console.log('A user just Disconnect:', userDisconnected);
      });

      this.socket.on('connect_error', (err) => {
        console.log('ERR::', err.message);
      });

    }, error => console.error('Socket.io is not running on ' + this.urlConnection));
  }

  closeConnection() {
    this.socket.close();
  }

  listen(eventName: string) {
    console.log('listen to: ', eventName);
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
