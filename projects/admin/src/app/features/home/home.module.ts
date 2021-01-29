import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule, HomeRoutingModule, SharedModule, FontAwesomeModule, MatTableModule, MatSortModule]
})
export class HomeModule { }
