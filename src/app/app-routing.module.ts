import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {AppMainComponent} from './alfred/main-component/app.main.component';
import { DashboardComponent } from './alfred/dashboard/dashboard.component';
import { LogoutComponent } from './alfred/logout/logout.component';
import { AppLoginComponent } from './alfred/login/app.login.component';
import { AppNotfoundComponent } from './alfred/error-pages/not-found-page/app.notfound.component';
import { AppErrorComponent } from './alfred/error-pages/error-page/app.error.component';
import { AppAccessdeniedComponent } from './alfred/error-pages/access-denied-page/app.accessdenied.component';
import { CompaniesManagementComponent } from './alfred/companies-management/companies-management.component';
import { UsersManagementComponent } from './alfred/users-management/users-management.component';
import { ModuleConfigManagementComponent } from './alfred/module-config-management/module-config-management.component';
import { ModulesManagementComponent } from './alfred/modules-management/modules-management.component';
import { LicenseManagementComponent } from './alfred/companies-management/license/license-management/license-management.component';
import { CitiesComponent } from './alfred/module-config-management/cities/cities.component';
import { StatesComponent } from './alfred/module-config-management/states/states.component';
import { CountriesComponent } from './alfred/module-config-management/countries/countries.component';
import { CatalogsComponent } from './alfred/module-config-management/catalogs/catalogs.component';
import { AuditlogComponent } from './alfred/auditlog/auditlog.component';
import { MenulinksComponent } from './alfred/modules-management/menulinks/menulinks.component';
import { OperationsComponent } from './alfred/modules-management/operations/operations.component';
import { ServicesComponent } from './alfred/modules-management/services/services.component';
import { PasswordRecoveryComponent } from './alfred/login/password-recovery/password-recovery.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'alfred', component: AppMainComponent,
                children: [
                    {path: 'dashboard', component: DashboardComponent},
                    {path: 'auditlog', component: AuditlogComponent},
                    {path: 'configurations', component: ModuleConfigManagementComponent},
                    {path: 'configurations/cities', component: CitiesComponent},
                    {path: 'configurations/states', component: StatesComponent},
                    {path: 'configurations/countries', component: CountriesComponent},
                    {path: 'configurations/catalogs', component: CatalogsComponent},
                    {path: 'companies', component: CompaniesManagementComponent},
                    {path: 'companies/licenses', component: LicenseManagementComponent},
                    {path: 'modules', component: ModulesManagementComponent},
                    {path: 'modules/menulinks', component: MenulinksComponent},
                    {path: 'modules/operations', component: OperationsComponent},
                    {path: 'modules/services', component: ServicesComponent},
                    {path: 'users', component: UsersManagementComponent},
                    {path: 'logout', component: LogoutComponent},
                ]
            },
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: '', component: AppLoginComponent},
            {path: 'recoveryPassword', component: PasswordRecoveryComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
