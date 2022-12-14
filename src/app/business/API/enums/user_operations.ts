export enum UserOperations{
    AUTENTICARSE = 1,
    VALIDAR_SESION = 2,
    CIERRE_DE_SESION = 3,
    REGISTRAR_OPCIONES_DE_USUARIO = 4,
    ACTUALIZAR_OPCIONES_DE_USUARIO = 5,
    CONSULTA_OPCIONES_DE_USUARIO = 6,
    CONSULTA_OPCIONES_DE_USUARIO_POR_USUARIO = 7,
    CONSULTA_LOS_NODOS_DE_LAS_OPCIONES = 8,
    REGISTRAR_USUARIO = 15,
    ACTUALIZAR_USUARIO = 16,
    CONSULTA_USUARIOS = 17,
    CONSULTAR_USUARIOS_POR_USERNAME = 18,
    CONSULTAR_USUARIOS_POR_ESTADO = 19,
    CONSULTAR_TODOS_LOS_DATOS_DE_USUARIO = 20,
    CONSULTAR_TODOS_LOS_DATOS_DE_USUARIO_POR_USERNAME = 21,
    RECUPERACION_CLAVE = 22,
    CONSULTAR_SI_LA_CLAVE_ESTA_VENCIDA = 23,
    CONSULTAR_SI_LA_CLAVE_ESTA_VENCIDA_POR_USUARIO = 24,
    CAMBIO_DE_CLAVE = 25,
    CONTAR_SESIONES_ABIERTAS = 26,
    USUARIO_EN_LINEA = 27
}