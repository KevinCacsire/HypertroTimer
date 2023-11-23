import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit {
  activeTabCalendar: boolean = false;
  activeTabWorkout: boolean = true;

  constructor(private router: Router, private popoverController: PopoverController) { }

  ngOnInit() {}

  async onCalendarClicked() {
    if (this.router.url.includes('workout')) {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          eventComponent: "tabbar",
        },
      });
      await popover.present();
    } else {
      this.activeTabCalendar = true;
      this.activeTabWorkout = false;
      this.router.navigate(['home', 'calendar'], { replaceUrl: true });
    }
  }

  async onWorkoutClicked() {
    if (this.router.url.includes('workout')) {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          eventComponent: "tabbar",
        },
      });
      await popover.present();
    } else {
      this.activeTabCalendar = false;
      this.activeTabWorkout = true;
      this.router.navigate(['home', 'splits'], { replaceUrl: true });
    }
  }
  
}
