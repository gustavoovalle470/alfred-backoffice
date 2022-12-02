import {Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import {AppMainComponent} from '../main-component/app.main.component';
import { MenulinkService } from '../../business/API/system/menulink.service';
import { LocalSecurity } from '../../business/co.com.jgs/security/localSecurity';
import { menuNodes } from 'src/environments/environment';
import { Menulink } from 'src/app/business/co.com.jgs/security/menulink';

@Component({
    selector: 'app-menu',
    template: `
		<ul class="layout-menu">
			<li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
		</ul>
    `,
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
export class AppMenuComponent implements OnInit {

    nodes = menuNodes;
    model: any[]=[];

    constructor(public app: AppMainComponent, 
                private messageService : MessageService,
                private menulinkService: MenulinkService) {}

    async ngOnInit() {
        this.model = [];
        this.model.push({label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/alfred/dashboard']});
        if(localStorage.getItem(LocalSecurity.username) && localStorage.getItem(LocalSecurity.sessionId)){
            var userOptions : Menulink[] = await this.menulinkService.getMenuLinks(this.messageService)
            if(userOptions){
                for(let menulink of userOptions){
                    this.addNode(menulink.node);
                    for(let option of this.model){
                        if(option.id === menulink.node && !this.menulinkWasAdded(option, menulink)){
                        option.items.push({label : menulink.menuName, icon: menulink.iconExpression, routerLink:[menulink.link]});
                        }
                    }
                }
            }
            this.model.push({label: 'Cerrar sesion', icon: 'pi pi-fw pi-sign-out', routerLink: ['/alfred/logout']});
        }
        
    }
    menulinkWasAdded(option: any, menulink: Menulink) : boolean{
        for(let item of option.items){
            if(item.label === menulink.menuName){
                return true;
            }
        }
        return false;
    }
    
    addNode(node: string) {
        var optionWasAdd = false;
        for(let options of this.model){
            if(options.id === node){
                optionWasAdd = true;
            }
        }
        if(!optionWasAdd && this.getNode(node)){
            this.model.push(this.getNode(node));
        }
    }

    getNode(nodeName: string): any {
        for(let node of this.nodes){
            if(node.id === nodeName){
                return node;
            }
        }
    }
}
