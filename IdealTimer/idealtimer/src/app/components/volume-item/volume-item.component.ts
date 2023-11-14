import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Exercise } from 'src/app/model/Exercise';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-volume-item',
  templateUrl: './volume-item.component.html',
  styleUrls: ['./volume-item.component.scss'],
})
export class VolumeItemComponent implements OnInit {

  @Input() groupedExercises: Exercise[] = [];
  exerciseForms: any[] = [];
  visibleCheckButtonIndex: number = 0;
  @Output() moveCheckButtonToNextExercise: EventEmitter<void> = new EventEmitter<void>();
  @Input() showCheckButton: boolean = false;
  @Output() nextSet: EventEmitter<void> = new EventEmitter<void>();
  @Output() addedNewSet: EventEmitter<number> = new EventEmitter<number>();
  @Output() currentSetWithinGroupedExercise: EventEmitter<number> = new EventEmitter<number>();
  showDeleteMessage: boolean = false;

  constructor( private popoverController: PopoverController) { }

  ngOnInit() {
    this.exerciseForms = this.groupedExercises.map(exercise => ({
      weight: exercise.weight !== undefined ? exercise.weight : 0,
      repetitions: exercise.reps !== undefined ? exercise.reps : 0
    }));
    this.currentSetWithinGroupedExercise.emit(this.visibleCheckButtonIndex);
  }

  finishedSet() {
    this.visibleCheckButtonIndex++;
    this.nextSet.emit();
    if (this.visibleCheckButtonIndex >= this.exerciseForms.length) {
      this.moveCheckButtonToNextExercise.emit();
      this.currentSetWithinGroupedExercise.emit(0);
    } else {
      this.currentSetWithinGroupedExercise.emit(this.visibleCheckButtonIndex);
    }
  }

  addExerciseForm() {
    const lastForm = this.exerciseForms[this.exerciseForms.length - 1];
    const newForm = { ...lastForm };
    this.exerciseForms.push(newForm);
    //this.currentSetWithinGroupedExercise.emit(this.visibleCheckButtonIndex);
    this.addedNewSet.emit(this.visibleCheckButtonIndex);
  }

  async deleteExerciseForm() {
    console.log(this.visibleCheckButtonIndex);
    if (this.exerciseForms.length > 1) {
      this.exerciseForms.pop();
    } else {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          eventComponent: "deleteButton",
        },
      });
      await popover.present();
      return;
    }
    if (this.exerciseForms.length >= 1 && !this.showCheckButton && this.visibleCheckButtonIndex > 0) {
      this.visibleCheckButtonIndex--;
    }
    if (this.visibleCheckButtonIndex >= this.exerciseForms.length) {
      console.log(this.visibleCheckButtonIndex);
      console.log(this.visibleCheckButtonIndex);

      this.moveCheckButtonToNextExercise.emit();
      //this.currentSetWithinGroupedExercise.emit(0);
    }
  }

  getRepsWeightsNameAndId() {
    return this.exerciseForms.map(form => ({
      exerciseId: this.groupedExercises[0].exerciseId!,
      exerciseName: this.groupedExercises[0].exerciseName!,
      weight: form.weight,
      reps: form.repetitions
    }));
  }
}
