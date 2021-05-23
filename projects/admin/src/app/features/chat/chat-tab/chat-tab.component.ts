import { Component, Input, OnInit, OnChanges, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tutor } from '../../../core/tutors/tutors.model';
import { MessagePosition, MessageGroup, CallData } from '../chat.component';
import { environment as env } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { CallComponent, CallPosition } from '../call/call.component';

import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

export interface DialogData {
  animal: string;
  name: string;
}


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

  animal: string;
  name: string;

  // temp

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;

  constructor(
    public dialog: MatDialog,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
    ) { }

  openDialog(video?: boolean): void {
    const data: CallData = {
      incomingUser: this.user,
      callState: CallPosition.calling,
      haveVideo: video,
    }

    const dialogRef = this.dialog.open(CallComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'call-wrapper',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  ngAfterViewInit() {
    this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  openDialog2() {
    debugger
    this._overlayRef.attach(this._portal);
  }


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
