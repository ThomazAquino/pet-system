import { Component, OnInit, ChangeDetectionStrategy, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { InputData } from '../treatment.component';



@Component({
  selector: 'pet-treatment-text-area',
  templateUrl: './treatment-text-area.component.html',
  styleUrls: ['./treatment-text-area.component.scss'],
  host: { class: 'section' },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TreatmentTextAreaComponent implements OnInit, OnChanges {
  @Input() data: InputData;
  @Output() valueChange = new EventEmitter<any>();

  originalValue: string;
  value: string;

  constructor() { }

  ngOnInit() {
    this.populateInputValue(this.data.value);
  }

  get isValid() {
    return this.value.length > 4;
  }

  populateInputValue(value) {
    console.log(this.data)
    this.originalValue = value;
    this.value = value;
  }

  onInputChange(newValue) {
    this.value = newValue;
    if (this.data.options?.autoSave) {
      this.onSave();
    } else {
      
    }
  }

  onSave() {
    this.valueChange.emit({
      propertyName: this.data.propertyName,
      label: this.data.label,
      value: this.value
    })
  }

  onClear() {
    this.value = this.originalValue;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.populateInputValue(changes.data.currentValue.value);
  }
}
