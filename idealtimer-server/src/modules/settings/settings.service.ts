import { Injectable } from '@nestjs/common';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../app.module';
import { Settings } from '../../model/settings';

@Injectable()
export class SettingsService {

  async getSettings(userId: string): Promise<Settings> {
    const userDocRef = doc(firestore, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    const userData = userDocSnapshot.data();
    const settings: Settings = {
      audioOn: userData.audioOn,
      darkmode: userData.darkmode,
      volume: userData.volume,
      selectedAudioFile: userData.selectedAudioFile,
    };

    return settings;
  }

  async postSettings(userId: string, darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string): Promise<void> {
    const userDocRef = doc(firestore, 'users', userId);
    await setDoc(userDocRef, {
      darkmode,
      audioOn,
      volume,
      selectedAudioFile
    });
  }

  async updateSettings(userId: string, darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string): Promise<void> {
    const userDocRef = doc(firestore, 'users', userId);

    await updateDoc(userDocRef, {
      darkmode,
      audioOn,
      volume,
      selectedAudioFile
    });
  }
}
