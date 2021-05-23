import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule } from '@angular/forms';
import { ChatTabComponent } from './chat-tab/chat-tab.component';
import { SharedModule } from '../../shared/shared.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CallComponent } from './call/call.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ChatComponent, ChatTabComponent, CallComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule,
    CoreModule,
    SharedModule,
    PickerModule,
    DragDropModule
  ],
  exports: [ChatComponent],
  entryComponents: [ChatTabComponent, CallComponent]
})
export class ChatModule { }
