import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Split } from 'src/app/model/Split';

@Component({
  selector: 'app-split-item',
  templateUrl: './split-item.component.html',
  styleUrls: ['./split-item.component.scss'],
})
export class SplitItemComponent implements OnInit {

  @Input() split!: Split;

  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() editClick: EventEmitter<void> = new EventEmitter<void>();

  isStarred: boolean = false;

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
