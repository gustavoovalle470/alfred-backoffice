// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  debugMode: true
};

export const serverInfo = {
  Server : "http://localhost",
  APIJGSEndpoint: "/JGS/API/",
  SystemPort: ":4000",
  UserPort : ":4001"
};

export const APISystem = {
  operationInfoEndpoint: serverInfo.Server+serverInfo.SystemPort+serverInfo.APIJGSEndpoint+"system/CONTROLLER/VERSION/operationInfo"
};

export const APIUser ={
  operationInfoEndpoint: serverInfo.Server+serverInfo.UserPort+serverInfo.APIJGSEndpoint+"user/CONTROLLER/VERSION/operationInfo"
};

export const consultUser ={
  username: "SYSTEM",
  password: "SYSTEM.JGS.2022",
  licenseid: "AAAA-AAAA-AAAA-AAAA-AAAA-AAAAA"
}

export const menuNodes = [{id: 'EMPRESAS',       label: 'Empresas', icon : 'pi pi-fw pi-building',   routerLink:['/alfred/'],  items:[]},
                          {id: 'LOGS',           label: 'Logs',      icon : 'pi pi-fw pi-server',    routerLink:['/alfred/'],  items:[]},
                          {id: 'MODULOS',        label: 'Módulos',  icon : 'pi pi-fw pi-sliders-v',  routerLink:['/alfred/'],  items:[]},
                          {id: 'CONFIGURACION',  label: 'Sistema',  icon : 'pi pi-fw pi-cog',        routerLink:['/alfred/'],  items:[]},
                          {id: 'USUARIOS',       label: 'Usuarios', icon : 'pi pi-fw pi-users',      routerLink:['/alfred/'],  items:[]}];