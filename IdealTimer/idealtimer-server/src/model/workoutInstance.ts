import { IsNotEmpty } from "class-validator";
import { Exercise } from "./exercise";

export class WorkoutInstance {

    @IsNotEmpty()
    exercisesVolumes: Exercise[] = [];

    @IsNotEmpty()
    workoutId: string = '';

    @IsNotEmpty()
    startingDate: Date = new Date;

    @IsNotEmpty()
    endingDate: Date = new Date;

    @IsNotEmpty()
    splitId: string = '';

    @IsNotEmpty()
    splitName: string = '';

    @IsNotEmpty()
    sessionId: string = '';

    @IsNotEmpty()
    sessionName: string = '';
}