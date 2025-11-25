import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.css'],
  standalone: true,
  imports: [CalendarModule, FormsModule],
})
export class CalendarDialogComponent {
  selectedDate: Date | null = null;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if (this.config.data && this.config.data.initialDate) {
      this.selectedDate = this.config.data.initialDate;
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close(this.selectedDate);
    }
  }
}