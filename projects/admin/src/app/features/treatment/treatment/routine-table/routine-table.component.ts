import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';
import { InputData } from '../treatment.component';
import { FrequencyPipe } from './frequency.pipe';
import { v4 as uuid } from 'uuid';


// > var now = new Date();
// > Mon May 26 2014 10:55:34 GMT+0300 (Kaliningrad Standard Time)

// > now.toUTCString();
// > Mon, 26 May 2014 07:55:34 GMT

// > new Date(now.toUTCString())
// > Mon May 26 2014 10:55:34 GMT+0300 (Kaliningrad Standard Time)





export interface MedicationRoutine {
  id: string;
  name: string;
  frequency: number;
  frequencyFormat: string;
  firstDose: string;
  lastDose: string;
}

const fakeData: MedicationRoutine[] = [
  { id: '123', name: 'Paracetamol', frequency: 360, frequencyFormat: 'h', firstDose: 'Sun, 14 Feb 2021 19:16:50 GMT', lastDose: 'Sun, 14 Feb 2021 19:16:50 GMT' },
  { id: '456', name: 'Tetracetamol', frequency: 720, frequencyFormat: 'h', firstDose: 'Sun, 14 Feb 2021 19:16:50 GMT', lastDose: 'Sun, 14 Feb 2021 19:16:50 GMT' },
]

@Component({
  selector: 'pet-routine-table',
  templateUrl: './routine-table.component.html',
  styleUrls: ['./routine-table.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutineTableComponent implements OnInit {
  @Output() valueChange = new EventEmitter<any>();
  @Input() data: InputData;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  routineForm: FormGroup;
  // data = fakeData;
  isEdit$: Observable<{ value: boolean }>;
  currentDate = new Date as any;
  minDate = new Date(2021, 0, 1);
  maxDate = new Date(2025, 0, 1);


  formatFrequencySelect = 'm';
  selectedHour: any;



  // Time picker
  @ViewChild('clock') clock: any;
  isClockOpened = false;
  timepicker = '';


  constructor(
    private fb: FormBuilder,
    private frequency: FrequencyPipe,
    ) { }

  ngOnInit() {
    this.currentDate.toUTCString();
    console.log(this.currentDate)
    this.routineForm = this.fb.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(2)]],
      frequency: ['', [Validators.required]],
      frequencyFormat: ['m', [Validators.required]],
      firstDose: ['', [Validators.required]],
      lastDose: [''],
      endDose: [''],

    });

    this.isEdit$ = this.routineForm.get('id').valueChanges.pipe(
      startWith(''),
      map((id) => ({ value: (id || '').length > 0 }))
    );
  }

  removeRoutine(id: string) {
    // this.userService.removeUser(id);
  }

  editRoutine(routine: MedicationRoutine) {
    this.routineForm.patchValue({ ...routine });

    const formatedFrequency = (this.frequency.transform(this.routineForm.controls.frequency.value) as string).split(' '); 

    this.routineForm.controls.frequency.setValue(formatedFrequency[0]);
    this.routineForm.controls.frequencyFormat.setValue(formatedFrequency[1]);

    this.routineForm.controls.firstDose.setValue(new Date(this.routineForm.controls.firstDose.value));
    const hourAndMinute = `${this.routineForm.controls.firstDose.value.getHours()}:${this.routineForm.controls.firstDose.value.getHours()}`
    this.selectedHour = hourAndMinute;
  }

  onSubmit(routineFormRef: FormGroupDirective) {
    if (this.routineForm.valid) {
      const data = this.routineForm.getRawValue();

      // Parse frequency to minutes
      data.frequency = this.parseToMinutes(data.frequency, data.frequencyFormat);

      // Parse firstDose to UTC
      data.firstDose = data.firstDose.toUTCString();

      if (data.id && data.id.length) {
        // this.userService.updateUser(data);
        // const objIndex = this.data.findIndex((obj => obj.id === data.id));
        // this.data[objIndex] = data;
        this.valueChange.emit({
          propertyName: this.data.propertyName,
          label: this.data.label,
          value: data,
          action: 'update'
        });
      } else {
        // this.userService.addUser({ ...data });
        // this.data.push(data);

        // give an new ID
        data.id = uuid();

        this.valueChange.emit({
          propertyName: this.data.propertyName,
          label: this.data.label,
          value: data,
          action: 'add'
        });
      }
      routineFormRef.resetForm();
      this.routineForm.reset();
      this.selectedHour = null
    }
  }

  trackByUserId(index: number, routine: MedicationRoutine): string {
    return routine.id;
  }

  getNextDose(medication: MedicationRoutine) {
    if (medication.lastDose) {
      const lastDose = new Date(medication.lastDose);
      return lastDose.setMinutes(lastDose.getMinutes() + medication.frequency);
    } else {
      return new Date(medication.firstDose).getTime();
    }
    
  }

  parseToMinutes(amount: number, currentFormat: string): number {
    switch (currentFormat) {
      case 'm':
        return amount;
        break;
      case 'h':
        return amount * 60;
        break;
    
      default:
        return amount;
        break;
    }

    
  }

  onRowClick() {

  }

  openClock() {
    if (this.isClockOpened) { return; }
    if (this.routineForm.controls.firstDose.status === 'VALID') {
      this.clock.open();
    }
  }

  toggleClock(state) {
    this.isClockOpened = state;
  }

  getTimePickerValue(value, field) {
    const time = value.split(':');
    const hours = parseInt(time[0], 10) || 0;
    const minutes = parseInt(time[1], 10) || 0;

    // Local time zone
    console.log(this.routineForm.controls[field].value)
    this.routineForm.controls[field].value.setHours(hours, minutes);
    console.log(this.routineForm.controls[field].value)

    // this.routineForm.controls[field].setValue(this.routineForm.controls[field].value.toUTCString());
    // console.log(this.routineForm.controls[field].value)
  }

}
