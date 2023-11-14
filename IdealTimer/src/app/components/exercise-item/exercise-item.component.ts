import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/model/Exercise';

@Component({
  selector: 'app-exercise-item',
  templateUrl: './exercise-item.component.html',
  styleUrls: ['./exercise-item.component.scss'],
})
export class ExerciseItemComponent  implements OnInit {

  @Input() exercise!: Exercise;
  @Input() repsAndWeight!: Exercise[] | undefined;
  
  @Output() editClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onEditClick(event: Event) {
    event.stopPropagation();
    this.editClick.emit();
  }
}
