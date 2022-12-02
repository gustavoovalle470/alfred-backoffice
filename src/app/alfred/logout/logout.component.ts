import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SecurityService } from 'src/app/business/API/system/security.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styles: [`
        :host ::ng-deep .p-message {
            margin-left: .25em;
        }

        :host ::ng-deep .p-toast{
            z-index:99999;
        }
    `],
    providers: [MessageService]
})
export class LogoutComponent implements OnInit {

  constructor(private messageService: MessageService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.securityService.doLogout(this.messageService, true);
  }

}
