import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';


@Component({
  selector: 'app-accessdenied',
  templateUrl: './app.accessdenied.component.html',
})
export class AppAccessdeniedComponent implements OnInit{

  constructor(private secureService: SecurityService){}

  async ngOnInit(){
    if(localStorage.getItem(LocalSecurity.username)){
      this.secureService.doLogoutAuto();
    }
    localStorage.clear();
  }
}
