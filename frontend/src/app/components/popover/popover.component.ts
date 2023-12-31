import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: 'popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  @Input() eventComponent!: string;

  constructor() {}

}