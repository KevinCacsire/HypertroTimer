import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from 'src/app/model/Session';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
})
export class SessionItemComponent  implements OnInit {

  @Input() session!: Session;
  @Input() exercisesAmount: number = 0;
  @Input() estimatedTime: string = '';

  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() editClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onItemClick() {
    this.itemClick.emit();
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.editClick.emit();
  }
}