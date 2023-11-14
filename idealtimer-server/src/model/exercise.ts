import { IsNotEmpty } from "class-validator";

export class Exercise {

    @IsNotEmpty()
    exerciseName: string = '';

    @IsNotEmpty()
    exerciseId: string = '';

    @IsNotEmpty()
    indexOrder: number = 0;

    @IsNotEmpty()
    reps?: number;

    @IsNotEmpty()
    weight?: number;
}