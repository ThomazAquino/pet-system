import { selectTutorById } from './../../core/tutors/tutors.selectors';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { SocketConnectionStatus, WebSocketService } from '../../core/web-socket/web-socket.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectTutorsByRole } from '../../core/tutors/tutors.selectors';
import { Role, Tutor } from '../../core/tutors/tutors.model';
import { AuthService } from '../../core/auth/auth.service';
import { loadAllTutors } from '../../core/tutors/tutors.actions';
import { environment as env } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { CallComponent, CallPosition } from './call/call.component';


export enum MessagePosition {
  incoming = 'incoming',
  outgoing = 'outgoing',
}
export interface Message {
  /* Date in UTC. */
  time: string,
  /* Content of the message. */
  content: string
}

export interface MessageGroup {
  /* income or outgoing. */
  position: MessagePosition,
  messages: Message[];
}

export interface CallData {
  incomingUser?: Tutor,
  callState?: CallPosition,
  remoteSessionDescription?: RTCSessionDescription,
  haveVideo?: boolean,
}

@Component({
  selector: 'pet-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('factory', { read: ViewContainerRef }) factory: ViewContainerRef;

  rooms = [];
  subscriptions: Subscription[] = [];

  tutors$: Observable<Tutor[]>;
  team$: Observable<Tutor[]>;
  gotMessages$ = new Subject();

  apiPrefix = env.apiPrefix;

  openedChats = {};

  openedChatTabs: { [key: string]: Tutor } = {}
  history: { [key: string]: MessageGroup[] } = {}
  maximumChatTab = 2;

  callData: CallData = {};

  private onCall = false;

  constructor(
    private webSocketService: WebSocketService,
    private store: Store,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {

    this.webSocketService.connectionStatus.pipe(
      filter(status => status === SocketConnectionStatus.connected || status === SocketConnectionStatus.rejected),
    ).subscribe(status => {
      if (status === SocketConnectionStatus.connected) {
        this.webSocketService.emit('messageToServer', {data: 'This is ANGULAR!'});

        this.subscriptions.push(
          this.webSocketService.listen('messageFromServer').subscribe((message: any) => {
          console.log(message)
        }));

        this.setupChatListeners();
        this.setupCallListeners();
      }
    });

    this.fetchTutors();
    this.fetchTeam();
  
  }

  fetchTutors() {
    this.store.dispatch(loadAllTutors())
    this.tutors$ = this.store.select(selectTutorsByRole, Role.User);
  }

  fetchTeam() {
    this.team$ = this.store.select(selectTutorsByRole, 'all-team');
  }

  setupChatListeners() {
    this.subscriptions.push(
      this.webSocketService.listen('private message').subscribe((message: any) => {
        console.log(`New Private message from ${message.from} at: ${message.time}: "${message.content}"`);
        this.pushMessageToHistory(message);
        this.cdr.detectChanges();

        if (!this.openedChatTabs[message.from]) {
          this.closeTab(Object.keys(this.openedChatTabs)[0]);

          this.store.pipe(first(), select(selectTutorById, message.from)).subscribe(tutor => {
            if (!tutor) {
              console.error('tutor not found');
            }
            this.onContactClick(tutor);
          });

        }
        this.gotMessages$.next();
      }),
      this.webSocketService.listen('fetch history').subscribe((history: any) => {
        this.history[history.id] = [];
        if (history?.history?.messages?.length > 0) {
          history.history.messages.forEach(element => {
            this.pushMessageToHistory(element);
          });
          this.cdr.detectChanges();
          this.gotMessages$.next();
        }


      })
    
    );
  }

  onContactClick(tutor: Tutor) {
    if (Object.keys(this.openedChatTabs).length < 2) {
      this.openedChatTabs[tutor.id] = tutor;
    } else {

    } 
    
    // const childComponent = this.chatTabComponent;
    // const componentFactory = this.compiler.resolveComponentFactory(childComponent);
    // this.componentRef = this.factory.createComponent(componentFactory);
    // this.componentRef.instance.user = tutor;
    // this.componentRef.instance.close.subscribe(_=> this.componentRef.destroy());
    // this.componentRef.instance.sendMessage.subscribe(message => {
    //   const newMessage = { content: message, from: this.authService.authValue.id, to: tutor.id};
    //   this.sendPrivateMessage(newMessage);
    // });

    this.webSocketService.emit('open chat tab', {id:  tutor.id});
  }

  closeTab(id) {
    delete this.openedChatTabs[id];
  }

  closeConnection() {
    this.webSocketService.closeConnection();
  }

  openConnection() {
    this.webSocketService.initializeConnection();
  }

  sendPrivateMessage(message: string, to: string ) {
    const newMessage = { content: message, from: this.authService.authValue.id, to: to};
    this.webSocketService.emit('private message', newMessage);
    this.pushMessageToHistory(newMessage);
    setTimeout(() => this.gotMessages$.next('smooth'), 1);
  }

  pushMessageToHistory(message) {
    const messagePosition = message.from === this.authService.authValue.id ? MessagePosition.outgoing : MessagePosition.incoming;
    const historyId = message.from === this.authService.authValue.id ? message.to : message.from;
    if (!this.history[historyId]) {
      this.history[historyId] = [];
    }
    const messageGroup = this.history[historyId] || [];

    if (messageGroup[messageGroup.length - 1]?.position === messagePosition) {
      messageGroup[messageGroup.length - 1].messages.push({time: message.time, content: message.content});
    } else {
      messageGroup.push({
        position: messagePosition,
        messages: [message]
      });
    }

    // this.componentRef.instance.messageGroups = messageGroup;
  }

  openCallDialog() {
    this.onCall = true;
    const dialogRef = this.dialog.open(CallComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'call-wrapper',
      data: this.callData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.onCall = false;
    });
  }

  setupCallListeners() {
    this.webSocketService.listen('messageResponse').subscribe((message: any) => {
      switch (message.message.type) {
        case 'offer':
          console.log('offer coming', message);
          if (this.onCall) {
            return;
          }
          
          this.store.select(selectTutorById, message.from).pipe(first()).subscribe(user => this.callData.incomingUser = user);
          if (!this.callData.incomingUser) {
            console.log(`User ${message.from} not found.`);
            return;
          }
          this.callData.callState = CallPosition.receiving;
          this.callData.remoteSessionDescription = message.message.data;
          this.openCallDialog();
          break;
      
        case 'answer':
          console.log('answer', message.message.data);
          break;
      
        case 'ice-candidate':
          // console.log('FATHER COMPONENT: ice-candidate', message.message.data);
          break;

        case 'hangup':
          // no data here
          console.log('hangup', message.message);
          break;
      
        default:
          console.error('Unknown message type', message.message);
          break;
      }
    })

  }

  ngOnDestroy() {
    this.rooms.forEach(room => {
      this.webSocketService.emit('unsubscribe', room);
    });
  }

}
