import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class SessionsPageEditingForm {

    private formBuilder: FormBuilder;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            sessionName: ['', [Validators.required]],
            weekday: ['', [Validators.required]]
        });
    }
}