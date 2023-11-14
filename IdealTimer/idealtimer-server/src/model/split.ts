import { IsNotEmpty, IsNumber } from "class-validator";

export class Split {

    @IsNotEmpty()
    splitName: string = '';

    @IsNotEmpty()
    @IsNumber()
    sessionsAmount: string = '';

    @IsNotEmpty()
    splitId: string = '';
}