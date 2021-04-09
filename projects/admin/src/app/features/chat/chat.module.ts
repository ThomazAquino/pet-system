import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule } from '@angular/forms';
import { ChatTabComponent } from './chat-tab/chat-tab.component';
import { SharedModule } from '../../shared/shared.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [ChatComponent, ChatTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule,
    CoreModule,
    SharedModule,
    PickerModule
  ],
  exports: [ChatComponent],
  entryComponents: [ChatTabComponent]
})
export class ChatModule { }
