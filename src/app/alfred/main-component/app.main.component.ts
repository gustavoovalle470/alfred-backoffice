import {Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../../app.component';
import { JGSComponent } from '../../business/UIComponents/jgscomponent';
import { SecurityService } from '../../business/API/system/security.service';
import { LocalSecurity } from '../../business/co.com.jgs/security/localSecurity';
import { UserService } from '../../business/API/user/user.service';
import { MenuService } from '../menu/app.menu.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
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
export class AppMainComponent extends JGSComponent implements OnInit{

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    menuHoverActive: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    megaMenuActive: boolean;

    megaMenuClick: boolean;

    usermenuActive: boolean;

    usermenuClick: boolean;

    activeProfileItem: any;

    configActive: boolean;

    configClick: boolean;

    constructor(private menuService: MenuService, 
                public app: AppComponent, 
                menulink : MenulinkService,
                messageService: MessageService,
                securityService : SecurityService) { 
        super(messageService, securityService, '/dashboard', menulink);
        
    }

    async ngOnInit() {
        await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.megaMenuClick) {
            this.megaMenuActive = false;
        }

        if (!this.usermenuClick && this.isSlim()) {
            this.usermenuActive = false;
            this.activeProfileItem = null;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.menuService.reset();
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.configClick = false;
        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
        this.megaMenuClick = false;
        this.usermenuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.app.layoutMode === 'overlay') {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    onMegaMenuButtonClick(event) {
        this.megaMenuClick = true;
        this.megaMenuActive = !this.megaMenuActive;
        event.preventDefault();
    }

    onMegaMenuClick() {
        this.megaMenuClick = true;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isHorizontal() {
        return this.app.layoutMode === 'horizontal';
    }

    isSlim() {
        return this.app.layoutMode === 'slim';
    }

    isOverlay() {
        return this.app.layoutMode === 'overlay';
    }
}
