import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppProfileComponent } from './alfred/profile/app.profile.component';
import { BreadcrumbService } from './alfred/breadcrumb/app.breadcrumb.service';
import { AppMenuComponent } from './alfred/menu/app.menu.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { AppFooterComponent } from './alfred/footer/app.footer.component';
import { MenuService } from './alfred/menu/app.menu.service';
import { AppBreadcrumbComponent } from './alfred/breadcrumb/app.breadcrumb.component';
import { AppTopBarComponent } from './alfred/topbar/app.topbar.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, TabViewModule, PanelModule, ButtonModule],
      declarations: [
        AppComponent,
        AppTopBarComponent,
        AppMenuComponent,
        AppProfileComponent,
        AppFooterComponent,
        AppBreadcrumbComponent
      ],
      providers: [BreadcrumbService, MenuService]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
