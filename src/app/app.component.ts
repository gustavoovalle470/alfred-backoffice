import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { SecurityService } from './business/API/system/security.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent {
    
    theme = 'orange';

    layoutMode = 'static';

    megaMenuMode = 'gradient';

    menuMode = 'dark';

    profileMode = 'inline';

    inputStyle = 'outlined';

    ripple: boolean;

    constructor(private primengConfig: PrimeNGConfig,
                private messageService : MessageService,
                private securityService: SecurityService) {
    }

    ngOnInit() {
        this.securityService.doLogginUserSystem(this.messageService);
        this.primengConfig.ripple = true;
        this.ripple = true;
    }
}
