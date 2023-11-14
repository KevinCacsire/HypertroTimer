import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class SplitsPageEditingForm {

    private formBuilder: FormBuilder;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            splitName: ['', [Validators.required]],
            sessionsAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
        });
    }
}