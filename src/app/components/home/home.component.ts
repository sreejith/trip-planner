import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Station } from 'src/app/interfaces/station';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { TimeTable } from 'src/app/interfaces/time-table';
import { MatTableDataSource } from '@angular/material/table';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

const ELEMENT_DATA: TimeTable[] = [
  {slNo: 1, departureDate: '09/09/2021',
   fromStation: 'Central', toStation: 'Redfern',
   depTime: ['11', '11:10', '11:20', '11:30']
  },{slNo: 2, departureDate: '09/09/2021',
    fromStation: 'Central', toStation: 'Circular Quay',
    depTime: ['11', '11:05', '11:10', '11:15']
 },{slNo: 3, departureDate: '10/09/2021',
    fromStation: 'Central', toStation: 'Redfern',
    depTime: ['12', '12:10', '12:20', '12:30']
  },{slNo: 4, departureDate: '10/09/2021',
     fromStation: 'Central', toStation: 'Circular Quay',
     depTime: ['12', '12:05', '12:10', '12:15']
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  optionArr: Station[] = [
    {station: 'Central'},
    {station: 'Redfern'},
    {station: 'Circular Quay'}
  ];
  fromStationFilteredOptions: any;
  toStationFilteredOptions: any;

  fromStationVal: any;
  toStationVal: any;
  dateVal: any;

  filterObj: any;

  timetableData = new MatTableDataSource(ELEMENT_DATA);

  displayedColumns: string[] = ['slNo', 'departureDate', 'from', 'to', 'departureTime'];

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    fromStationFilteredOptions: new Observable<Station[]>();
    toStationFilteredOptions: new Observable<Station[]>();
    this.form = this.fb.group({
      fromStation: [''],
      toStation: [''],
      departureDate: ['']
    });
  }

  ngOnInit() {
    this.fromStationFilteredOptions = this.form.get('fromStation')?.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.station),
        map(station => station ? this._filter(station) : this.optionArr.slice())
      );
    this.toStationFilteredOptions = this.form.get('toStation')?.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.station),
        map(station => station ? this._filter(station) : this.optionArr.slice())
      );

    this.timetableData.filterPredicate = (data: any, filter: any) => {
      if(data[this.filterObj['key']] && this.filterObj['key']) {
          if(this.fromStationVal != undefined && this.toStationVal != undefined && this.dateVal != undefined) {
            return data['fromStation'].toLowerCase().includes(this.fromStationVal) &&
                   data['toStation'].toLowerCase().includes(this.toStationVal) &&
                   data['departureDate'].toLowerCase().includes(this.dateVal);
          } else {
            return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
          }
      }
      return false;
    }

  }

  displayFn(station: Station): string {
    return station && station.station ? station.station : '';
  }

  private _filter(station: string): Station[] {
    const filterValue = station.toLowerCase();

    return this.optionArr.filter(option => option.station.toLowerCase().includes(filterValue));
  }

  onSelectionChange(value: any, eventFrom: string) {

    if(eventFrom === 'fromStation') {
      this.fromStationVal = this.form.get('fromStation')?.value.station.trim().toLowerCase();
      this.filterObj = {
        value: value.station.trim().toLowerCase(),
        key: 'fromStation'
      }
      this.timetableData.filter = value.station.trim().toLowerCase();
    } else if(eventFrom === 'toStation') {
      this.toStationVal = this.form.get('toStation')?.value.station.trim().toLowerCase();
      this.filterObj = {
        value: value.station.trim().toLowerCase(),
        key: 'toStation'
      }
      this.timetableData.filter = value.station.trim().toLowerCase();
    } else if(eventFrom === 'depDate') {
      this.dateVal = (this.datePipe.transform(value, 'dd/MM/yyyy'))?.trim().toLowerCase();
      let date = this.datePipe.transform(value, 'dd/MM/yyyy');
      if(date != null) {
        this.filterObj = {
          value: date.trim().toLowerCase(),
          key: 'departureDate'
        }
        this.timetableData.filter = date.trim().toLowerCase();
      }
    }

  }

  clearFilters(){
    this.timetableData.filter = '';
    this.form.get('fromStation')?.setValue('');
    this.form.get('toStation')?.setValue('');
    this.form.get('departureDate')?.setValue('');
  }

}
