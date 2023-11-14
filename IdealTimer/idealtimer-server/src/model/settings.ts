import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class Settings {

    @IsBoolean()
    darkmode: boolean;

    @IsBoolean()
    audioOn: boolean;

    @IsNumber()
    volume: number;

    @IsNotEmpty()
    selectedAudioFile: string
}