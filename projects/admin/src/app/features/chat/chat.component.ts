import { selectTutorById } from './../../core/tutors/tutors.selectors';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { SocketConnectionStatus, WebSocketService } from '../../core/web-socket/web-socket.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectAllTutors, selectTutorsByRole } from '../../core/tutors/tutors.selectors';
import { Role, Tutor } from '../../core/tutors/tutors.model';
import { ChatTabComponent } from './chat-tab/chat-tab.component';
import { AuthService } from '../../core/auth/auth.service';

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

  openedChats = {};

  openedChatTabs: { [key: string]: Tutor } = {}
  history: { [key: string]: MessageGroup[] } = {}
  maximumChatTab = 2;

  constructor(
    private webSocketService: WebSocketService,
    private store: Store,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.webSocketService.connectionStatus.pipe(
      filter(status => status === SocketConnectionStatus.connected || status === SocketConnectionStatus.rejected),
    ).subscribe(status => {
      if (status === SocketConnectionStatus.connected) {
        this.webSocketService.emit('messageToServer', {data: 'This is ANGULAR!'});

        this.subscriptions.push(this.webSocketService.listen('messageFromServer').subscribe((message: any) => {
          console.log(message)
        }));
        this.setupChatListeners();
      }
    });

    this.fetchTutors();
    this.fetchTeam();
  
  }

  fetchTutors() {
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

  ngOnDestroy() {
    this.rooms.forEach(room => {
      this.webSocketService.emit('unsubscribe', room);
    });
  }

}
