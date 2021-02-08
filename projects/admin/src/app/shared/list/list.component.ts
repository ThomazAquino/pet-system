import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'pet-general-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() list?: any;
  @Output() rowClick = new EventEmitter<any>();
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();

  // fakeData = [
  //   {
  //     id: 'ID-PET-1',
  //     column1: { label: 'Image', data: 'ImagePath'},
  //     column2: { label: 'Name',  data: 'Lecy'},
  //     column3: { label: 'Informações',  data: 'dog Buldog yellow'},
  //     column4: { label: 'Status',  data: 'interned'     },
  //   },
  //   {
  //     id: 'ID-PET-2',
  //     column1: { label: 'Image', data: 'ImagePath'},
  //     column2: { label: 'Name',  data: 'Bobby'},
  //     column3: { label: 'Informações',  data: 'Cat white'},
  //     column4: { label: 'Status',  data: 'in home'     },
  //   },
  //]

  // fakeData =  {
  //   data : [
  //     {
  //       id: 'ID-PET-1',
  //       column1: 'ImagePath',
  //       column2: 'Lecy',
  //       column3: 'dog Buldog yellow',
  //       column4: 'interned'
  //     },
  //     {
  //       id: 'ID-PET-2',
  //       column1: 'ImagePath2',
  //       column2: 'Lecy2',
  //       column3: 'dog Buldog yellow2',
  //       column4: 'interned2'
  //     },
  //   ],
  //   info : {
  //     id: {included: false, label: '', sort: false, onlyQuery: false, width: ''},
  //     column1: {included: true, label: '', sort: false, onlyQuery: false, width: '50px'},
  //     column2: {included: true, label: 'Name', sort: true, onlyQuery: false, width: ''},
  //     column3: {included: true, label: 'Informações', sort: true, onlyQuery: false, width: ''},
  //     column4: {included: true, label: 'Status', sort: true, onlyQuery: false, width: ''}
  //   }
  // }

  constructor() {}

  ngOnInit() {
    // this.displayedColumns = Object.keys(this.list[0]).filter(item => item !== 'id')
    // this.dataSource.data = this.list;

    console.log('List component: ', this.list)

    this.displayedColumns = Object.keys(this.list.info).filter(
      (item) => this.list.info[item].included
    );
    // this.displayedColumns = ['column1', 'column2', 'column3'];
    console.log(this.displayedColumns);
    this.dataSource.data = this.list.data;

    // this.displayedColumns = ['column1']
    // this.dataSource.data = [{column1: 'A'}, {column1: 'B'}];

    // console.log(this.fakeData);
    // console.log(this.list);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onTableClick(row) {
    this.rowClick.emit(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
