import { Injectable } from '@angular/core';
import { AudioFile } from '../model/AudioFile';


@Injectable({
  providedIn: 'root'
})
export class SoundService {

    allSoundOptions!: AudioFile[];

    constructor() {}

    fetchSoundOptions(): AudioFile[] {
        const audioFile1 : AudioFile = { name: 'bikebell-ding.wav', audio : new Audio('assets/sound-effects/bikebell-ding.wav')};
        const audioFile2 : AudioFile = { name: 'correct.wav', audio : new Audio('assets/sound-effects/correct.wav')};
        const audioFile3 : AudioFile = { name: 'elevator-ding.wav', audio : new Audio('assets/sound-effects/elevator-ding.wav')};
        const audioFile4 : AudioFile = { name: 'bubble-trouble.wav', audio : new Audio('assets/sound-effects/bubble-trouble.wav')};
        const audioFile5 : AudioFile = { name: 'race-start.wav', audio : new Audio('assets/sound-effects/race-start.wav')};
        const audioFile6 : AudioFile = { name: 'cow-bells.wav', audio : new Audio('assets/sound-effects/cow-bells.wav')};
        const audioFile7 : AudioFile = { name: 'doin-it-right.wav', audio : new Audio('assets/sound-effects/doin-it-right.wav')};
        const audioFile8 : AudioFile = { name: 'do-it-now.wav', audio : new Audio('assets/sound-effects/do-it-now.wav')};
        const audioFile9 : AudioFile = { name: 'male-go.wav', audio : new Audio('assets/sound-effects/male-go.wav')};
        const audioFile10 : AudioFile = { name: 'male-lets-go.wav' , audio : new Audio('assets/sound-effects/male-lets-go.wav')};
        const audioFile11 : AudioFile = { name: 'female-lets-go-1.wav', audio : new Audio('assets/sound-effects/female-lets-go-1.wav')};
        const audioFile12 : AudioFile = { name: 'female-lets-go-2.wav', audio : new Audio('assets/sound-effects/female-lets-go-2.wav')};
        const audioFile13 : AudioFile = { name: 'cow-moo.wav', audio : new Audio('assets/sound-effects/cow-moo.wav')};
        const audioFile14 : AudioFile = { name: 'dog-bark.wav', audio : new Audio('assets/sound-effects/dog-bark.wav')};
        const audioFile15 : AudioFile = { name: 'cat-screaming.wav', audio : new Audio('assets/sound-effects/cat-screaming.wav')};

        this.allSoundOptions = [
            audioFile1, audioFile2, audioFile3, audioFile4, audioFile5,
            audioFile6, audioFile7, audioFile8, audioFile9, audioFile10,
            audioFile11, audioFile12, audioFile13, audioFile14, audioFile15
        ];
    
        return this.allSoundOptions;
    }

    fetchCurrentSound(): AudioFile {
        // make call to backened
        return { name: 'cat-screaming', audio : new Audio('assets/sound-effects/cat-screaming.wav')};
    }
}

