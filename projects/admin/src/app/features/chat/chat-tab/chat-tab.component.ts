import { Component, Input, OnInit, OnChanges, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tutor } from '../../../core/tutors/tutors.model';
import { Message, MessagePosition, MessageGroup } from '../chat.component';

@Component({
  selector: 'pet-chat-tab',
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.scss']
})
export class ChatTabComponent implements OnInit, OnDestroy {
  @Output() sendMessage = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Input() user: Tutor;
  @Input() messageGroups: MessageGroup[];
  @Input() gotMessages$ = new Subject();
  @ViewChild('chatBody') private chatBody: ElementRef;

  eMessagePosition = MessagePosition;
  messageContent;

  constructor() { }

  ngOnInit() {
    this.gotMessages$.subscribe(behavior => this.chatBody.nativeElement.scroll({
      top: 99999999999,
      behavior: behavior
    }));
  }

  onSendMessage(): void {

    // Check if message is componed only by empty string.
    if (!this.messageContent.replace(/\s/g, '').length) return;
    this.sendMessage.emit(this.messageContent);
    this.onClearMessage();
  } 

  onClearMessage(): void {
    this.messageContent = '';
  }

  ngOnDestroy() {

  }

}
