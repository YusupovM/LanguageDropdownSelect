import {Component, OnInit} from '@angular/core';
import {Language} from './interface/language.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  automation: Language[] = [];
  monitors: Language[] = [];

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < 3; i++) {
      this.automation.push(this.getLanguage());
    }
    for (let i = 0; i < 500; i++) {
      this.monitors.push(this.getLanguage());
    }
  }

  private getLanguage() {
    return {
      name: 'language ' + this.getRandomNumber(100),
      lcid: this.getRandomNumber(100),
      rightToLeft: true,
      code: 'code',
      mapped: !!this.getRandomNumber(2)
    };
  }

  private getRandomNumber(r) {
    return Math.floor((Math.random() * r));
  }

}
