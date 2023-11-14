import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class ExercisesPageAddingForm {

    private formBuilder: FormBuilder;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            exercise: ['', [Validators.required]]
        });
    }
}