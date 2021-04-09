import { Component, Input, OnInit, OnChanges, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tutor } from '../../../core/tutors/tutors.model';
import { MessagePosition, MessageGroup } from '../chat.component';
import { environment as env } from '../../../../environments/environment';

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

  public isEmojiPickerVisible: boolean;

  eMessagePosition = MessagePosition;
  messageContent = '';

  apiPrefix = env.apiPrefix;

  emojiTexts = {
    search: 'Procurar',
    emojilist: 'Lista de emojis',
    notfound: 'Nenhum emoji encontrado :(',
    clear: 'Limpar',
    categories: {
      search: 'Resultados de busca',
      recent: 'Recentes',
      people: 'Rostinhos',
      nature: 'Animais & Natureza',
      objects: 'Objetos',
    },
  }

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

  public addEmoji(event) {
    this.messageContent = `${this.messageContent}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
 }

  ngOnDestroy() {

  }

}
