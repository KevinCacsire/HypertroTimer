import { IsNotEmpty } from "class-validator";

export class Session {

    @IsNotEmpty()
    sessionName: string = '';

    @IsNotEmpty()
    weekday: string = '';

    @IsNotEmpty()
    sessionId: string = '';

    exerciseCount = 0;
}