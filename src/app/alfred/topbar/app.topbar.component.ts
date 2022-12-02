import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AppMainComponent } from 'src/app/alfred/main-component/app.main.component';


@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent{


    constructor(public app: AppComponent, public appMain: AppMainComponent) {}
}
