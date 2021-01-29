import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

const ELEMENT_DATA: any[] = [
  {image: '', name: 'Ikki', identData: 'Gato SRD Cinza', enterDate: '12/11/2020', vetName: 'Dr. Luiz', clinicEvo: 4, qrCode: 'qr-string'},
  {image: '', name: 'Mia', identData: 'Gato Perça branco', enterDate: '11/11/2021', vetName: 'Dr. Luiz', clinicEvo: 2, qrCode: 'qr-string'},
  {image: '', name: 'Lecy', identData: 'Gato SRD Cinza', enterDate: '04/11/2020', vetName: 'Dr. Fábio', clinicEvo: 5, qrCode: 'qr-string'},
  {image: '', name: 'boby', identData: 'Gato SRD Cinza', enterDate: '01/11/2020', vetName: 'Dr. Luiz', clinicEvo: 1, qrCode: 'qr-string'},
  {image: '', name: 'Rufus', identData: 'Gato SRD Cinza', enterDate: '21/01/2019', vetName: 'Dr. Luiz', clinicEvo: 3, qrCode: 'qr-string'},
];

// image, name, ident data, enter date, veterinario, clinic evo media, qrCode.

@Component({
  selector: 'pet-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['image', 'name', 'enterDate', 'vetName', 'clinicEvo', 'qrCode'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);



  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
