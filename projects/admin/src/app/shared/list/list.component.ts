import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OnChanges } from '@angular/core';
import { environment as env } from '../../../environments/environment';


export interface ListComponent {
  data?: ListComponentDataItem[];
  info?: { [key: string]: ListListComponentItemInfo }
}

export interface ListComponentDataItem {
  id?: string;
  row1?: string | number;
  row2?: string | number;
  row3?: string | number;
  row4?: string | number;
  row5?: string | number;
  row6?: string | number;
  row7?: string | number;
  row8?: string | number;
  row9?: string | number;
  row10?: string | number;
}

export interface ListListComponentItemInfo {
  included: boolean;
  label: string;
  sort: boolean;
  type: string;
  width: string;
}
@Component({
  selector: 'pet-general-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @Input() list?: any;
  @Output() rowClick = new EventEmitter<any>();
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();

  apiPrefix = env.apiPrefix;

  constructor() {}

  ngOnInit() {
    this.displayedColumns = Object.keys(this.list?.info).filter(
      (item) => this.list.info[item].included
    );
    // console.log('list',this.list)

    // console.log(this.displayedColumns);
    this.dataSource.data = this.list.data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.list.firstChange) {
      this.dataSource.data = changes.list.currentValue.data;
    }
  }

  onTableClick(row) {
    this.rowClick.emit(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
