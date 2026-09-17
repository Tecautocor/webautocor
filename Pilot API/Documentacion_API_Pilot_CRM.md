# Documentación API Pilot CRM
_Extraído de Pilot University (support.services.pilotcrm.io), curso "API CRM" — guardado el 2026-09-16. Referencia interna para integraciones de Web AUTOCOR con Pilot._

## Primeros pasos - API CRM
Primeros pasos - API CRM
Colapsar todo
Expandir todo

### Introducción - API CRM
Introducción
API Pilot
 es una Interfaz de Programación de Aplicaciones (Application Programming Interface) que te permite consultar, insertar, actualizar y/o eliminar información en nuestro CRM de una forma rápida y sencilla.
Aumentá el poder de tu cuenta integrándola con múltiples servicios y administra tus clientes, stock, ventas y legajos entre otros, utilizando todos los recursos de nuestra 
API Pilot
.
Te invitamos a descubrir cómo sacarle el máximo provecho a nuestro CRM!
Estructura ejemplo básica:
{
	"data": {
		{{estructura}}
	},
	"header": {
		"FlowName": "descripcion_del_servicio",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "0CA0836F-7847-4A30-B09A-60DE9606BA04",
		"access_token":"{{token}}"
	}
}
Parámetros
data
struct
required
{{estructura}}
struct
required
Esta estructura depende de cada servicio y entidad.
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
TimeStamp
timestamp
Fecha de la respuesta del servicio
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
required
Token válido de autorización
Posibles respuestas
Status
HTTP o HTTPS
El servicio funcionó correctamente
success
200 OK
Error por alguna regla de negocio
error
400 BUSINESS ERROR
Error de autorización
error
401 UNAUTHORIZED
Error de servidor
error
500 SERVER ERROR

### Qué es REStful - API CRM
Qué es RESTful - 
API CRM
REST
 “
RE
presentational 
S
tate 
T
ransfer” nos permite crear servicios y aplicaciones que pueden ser usadas por cualquier dispositivo o cliente que entienda 
HTTP o HTTPS
, por lo que es sustencialmente más simple y convencional que otras alternativas.
La clave de 
REST
 es que este servicio no tiene estado (es 
stateless
), lo que quiere decir que, entre dos llamadas cualesquiera, el servicio pierde todos sus datos.
Esto es, que no se puede llamar a un servicio 
REST
 y pasarle unos datos (por ej. un usuario y una contraseña) y esperar que “nos recuerde” en la siguiente petición, de ahí el nombre.
El estado lo mantiene el cliente y por lo tanto es el cliente quien debe pasar el estado en cada llamada.
Si quiero que un servicio 
REST
 me recuerde, debo pasarle quien soy en cada llamada. Eso puede ser un usuario y una contraseña, un
token (como es nuestro caso)
 o cualquier otro tipo de credenciales, pero debo pasarlas en cada llamada. Y lo mismo aplica para el resto de información.
Para utilizar nuestra 
API REST
, tu aplicación deberá realizar un pedido HTTP o HTTPS y analizar la respuesta. La principal ventaja de este tipo de API es que puede ser usada con cualquier lenguaje de programación o framework. Debes recordar que el formato que necesitas utilizar tanto para los inputs como los outputs es 
JSON
.

### Rate Limit - API CRM
Rate Limit - API CRM
Cómo funciona
 ?
La API permite un máximo de 
60 requests por minuto
, contando todos los endpoints en conjunto, ya sea auth, stock, sales, etc. Si se superan los 60 requests en una ventana de 60 segundos, los requests excedentes son bloqueados, o major dicho descartados hasta que comience el siguiente minuto.
Cuando se supera el límite, la API responde con código 433 y el siguiente cuerpo: 
{
“success”: false,
    “message”: “Request blocked. You have exceeded the limit of 60 requests per minute. Please wait 60 seconds before retrying.”,
    “technical_message”: “Rate limit exceeded: 60 requests/min. Retry after 60 seconds.”,
    “code”: 433,
    “sub_code”: “Rate Limit Exceeded”,
    “result”: {
        “action”: “block_request”,
        “retry_after_seconds”: 60,
        “limit”: 60,
        “limit_window”: “1 minute”
    }
}
Cómo administrar reintentos correctamente 
Cuando se reciba un `433`, **no reintentar de inmediato**. 
El flujo recomendado es: 
Detectar el código `433` en la respuesta.
Leer el campo `retry_after_seconds` (actualmente es `60`).
Esperar ese tiempo antes de volver a intentar.
Recomendaciones generales para no agotar el límite
No hacer polling agresivo.
 Si necesitan consultar stock o datos periódicamente, espaciar las llamadas (por ejemplo, una cada 2-3 segundos como mínimo).
Se criterioso, 
es decir, por ejemplo, no es necesario consultar el stock cada 5 minutos.
No reintentar en loop sin espera
 ante cualquier mensaje de rate limit o incluso algun time-out por issues de red general en internet tampoco debería disparar reintentos inmediatos.
Controle los  requests en sus propios sistemas para detectar picos o loop antes de llegar al límite.
✅ Hacer
❌ No hacer
Guardar y reutilizar el token (válido 6 hs)
NO – Llamar a /auth en cada request
Esperar retry_after_seconds ante un 433
NO – Reintentar inmediatamente ante un 433
Espaciar las llamadas en el tiempo
NO – Hacer polling cada pocos milisegundos
Cachear o ser criterioso con datos que no cambian
NO – Repetir la misma consulta sin necesidad
Usar backoff exponencial en reintentos
NO – Hacer loop de reintentos sin delay

### Respuesta Estándar - API CRM
Respuesta Estándar - API CRM
Para cada llamada a un end-point, el sistema responde con una estructura estándar, tanto en el caso de una respuesta exitosa como en el caso de una respuesta con error.
Estructura
Valores de retorno
ts
timestamp
timestamp de la consulta a la API
_id
numeric
Identificador de la llamada en la API (se utiliza para realizar un tracking de las llamadas)
result
struct
status
string
Estado de la respuesta: “
success
” o “
error
” 
aditional_data
struct
Estructura en la que se declara la información referida a la entidad consultada.
En el caso de los end-points, que retornan una colección de entidades, la API devuelve la información necesaria  para paginar, a saber:
“page”:
 número de pagina actual
“page_count”:
 cantidad de páginas total del set obtenido
“rows_count”:
 cantidad de registros total del set obtenido
“rows_per_page”
: cantidad de registros por página
“rows_in_page”
: cantidad de registros en la página en curso
“
rows_remaining”
: cantidad de registros restantes
entitydata
struct
Entidad o colección de entidades según corresponda con el método o end-point consultado.
Respuesta para consultas exitosas – Ejemplo
En el caso de la respuesta exitosa el código de respuesta HTTP es 200 OK.
{
	"ts": "1498664615",
	"_id": "109811",
	"result": {
		"status": "
success
",
                "aditional_data":{ 
                      "page":1, 
                      "page_count":5, 
                      "rows_count":50, 
                      "rows_per_page":10, 
                      "rows_in_page":10, 
                      "rows_remaining":40 
                },
		"entitydata": [{{entidad o colección de entidades de dato}}]
	}
}
Respuesta para consultas erróneas – Ejemplo
En el caso de una respuesta errónea, la API devuelve el siguiente código HTTP, dependiendo del error que se presente:
400 para registros no encontrados
500 para errores de la API
{
	"ts": "1498664684",
	"_id": "109815",
	"result": {
		"status": "
error
",
		"aditional_data": [],
		"code": "{{codigo de error Ej: business_error}}",
		"message": "{{codigo descriptivo del error EJ: Master not available or not exist}}"
	}
}

### End Point / URL - API CRM
End Point / URL - API CRM
Todas las llamadas deben ser realizadas a la siguiente URL 
https://api.pilotsolution.net/
{metodo-especifico}
, 
en la que en su porción final, se declara el 
método específico
 que se necesita invocar.
Consideraciones:
Todos los end-points para 
listar
 o 
buscar
 registros están limitados a un máximo de 
100
 registros por consulta.
Por razones de seguridad, la API registra las consultas y su uso.
Por cada interacción, la API registra una solicitud. En caso de superar las 
1000  consultas hora
, la API puede 
bloquear
 la IP del cliente por un periodo de 1 hora o de forma indefinida.
Es responsabilidad del usuario de la API verificar y velar por un uso razonable de la API.

### Ejemplo de solicitud - API CRM
Ejemplo de solicitud - API CRM
Donde los parámetros:
FlowName
: representa el nombre del flow o acción que se esta ejecutando.
SequenceId
: representa un identificador de secuencia de llamada a la API desde el sistema que la esta invocando. Es opcional y sirve de referencia para debug o identificación de situaciones complejas ante la necesidad de soporte.
TimeStamp
: es la fecha/hora en formato Unix en la que se realiza la llamada a la API. Es informativo para el registro y log de la trasacción.
TrackingId
: es un identificador de la llamada a la API, que envía el sistema origen. Es opcional y sirve para identificar la llamada a la api dentro del log de PIlot ante una necesidad puntual de soporte. Se podria enviar un GUID por ejemplo.
access_token
: es obligatorio y debe tener el token JWT obtenido del proceso de autenticación en la API.

### Log de cambios - API CRM
Log de cambios - API CRM
Fecha
Cambio
25-03-2019
Nueva directiva “showmedia” agregada en listado de stock para recuperar las imágenes al listar el stock.
15-04-2019
Se especifica los filtros posibles en leads y ventas. Se agregan filtros nuevos en leads.
16-04-2019
Leads: Se agregan los endpoints para reactivar un lead cerrado, ingresar un comentario en un lead y crear un evento en un lead.
16-04-2019
Usuarios: Se agrega un endpoint para obtener el avatar de un usuario.
16-04-2019
Notificaciones: Se agrega un endpoint para ingresar notificaciones de sistema.
16-04-2019
Presupuesto Interactivo: Se agregan endpoints para leer un presupuesto interactivo, listarlos y registrar una visualización de un presupuesto.
16-04-2019
Catálogo de Productos: Se agregan endpoints para leer y listar productos del catálogo.
17-04-2019
Usuarios: Se agrega un endpoint para leer el usuario de la sesión activa.
08/08/2019
consulta de maestros – se agregaron nuevos maestros
ampliamos la entidad lead retornada cuando se consulta un lead por id /v1/welcomes/read.php
nuevo endpoint para listar eventos /v1/welcomes/events/list.php
nuevo endpoint para crear tareas en un lead /v1/welcomes/tasks/create.php
nuevo endpoint para Cerrar Tarea y Crear Nueva en los leads /v1/welcomes/tasks/done.php
09/09/2019
[fix] se aplicó el scope de visualización a las ventas. Esto puede afectar la visualización de ventas de usuarios que no tengan correctamente establecido el scope de visualización de registros.
Agregado en el endpoint de actualización de leads del atributo “Grado de interés”.
30/09/2019
El endpoint para actualizar una venta tiene nuevas validaciones de completitud de datos. En el caso de enviar un monto para la retoma de un usado, se debe indicar la información del mismo; también en el caso de informar un monto de financiación se debe enviar la información de referencia de la operación crediticia.
También se agregaron otras validaciones adicionales de tipo y formato de dato.
29/11/2019
Actualización de la documentación de la sección “Entidad Venta”. Se amplía la estructura del nodo “Credit”.
16/04/2020
Se agrega especificación de nuevo parámetro welcome_id para filtros en las ofertas.
02/08/2020
Se agrega ruta para crear comentarios en las ventas.
21/09/2020
Se modifica la creación de eventos en los leads para que se pueda enviar estructuras de datos adicionales como componentes.

## Autorización - API CRM
Autorización - API CRM

### Obtener token - API CRM
Obtener token - API CRM
POST 
 /v1/users/auth.php 
Para utilizar los servicios de Pilot API se requiere obtener un 
Token
. Para ello, es necesario cumplir con los siguientes pasos:
Autenticarse mediante la invocación de 
v1/users/auth.php
 con los parámetros 
username
 y 
password
, los que corresponden a un usuario activo en 
CRM PILOT
.
Contar con los permisos necesarios para poder ejecutar la operación de su interés.
El servicio de autenticación, regresa un 
token
.
Pueden solicitarse “tokens” cuantas veces sea necesario.
Autenticación Solicitud - Ejemplo
curl --request POST \
 --url '
https://api.pilotsolution.net/v1/users/auth.php?username=nombre_usuario&password=clave_usuario'
Respuestas
La respuesta que devuelve la API de Autenticación es en formato JSON
Autenticación Exitosa – Ejemplo de respuesta
{
  "ts": "1494520174",
  "_id": "",
  "result": {
      "status": "success",
      "aditional_data": [],
      "entitydata": "eyasdasFAWdV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0OTQ1NDE3NzQsImlh"
	}
}
Autenticación Errónea – Ejemplo de respuesta
{
  "ts": "1494520418",
  "_id": "",
  "result": {
	"status": "error",
	"aditional_data": [],
	"code": "internal_error",
	"message": "AuthException La instancia se encuentra suspendida o dada de baja. 
Puede deberse a un saldo deudor de facturas impagas o a la baja definitiva del 
servicio. Puede consultar en soporte@pilotsolution.com.ar."
	}
}
Control de Cambios
Fecha
Cambio
22 Junio 2022
Documento actualizado

## Maestros - API CRM
Maestros - API CRM

### Entidad - API CRM
Entidad - API CRM
Toda vez que se necesita consultar un Dato Maestro en 
CRM PILOT
, se invoca la API provista 
/v1/masters/read.php
.
Valores de retorno para todos los servicios de masters
code
string
Código del Maestro que se consulta
name
string
Nombre del Maestro que se consulta
Ejemplo de Response a una Solicitud de Dato Maestro
{
	"ts": "1498664615",
	"_id": "109811",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": [
			{
				"code": "person",
				"name": "Particular"
			},
			{
				"code": "person_r",
				"name": "Revendedor"
			},
			{
				"code": "organizati",
				"name": "Empresa"
			}
		]
	}
}

### Maestros que pueden consultarse - API CRM
Maestros que pueden consultarse - API CRM
Master
Entidad
Nombre
Descripción
Nombre
Parámetro
adminfiles_status
Estado del legajo
Adminfiles
status_code
branches
Sucursales
Sales
branch_code
business_type
Tipo de negocios
Sales
business_type_code
companies
Empresas de la instancia
Company
company_code
country
Países
Customer
address_country_code
customer_type
Tipo de cliente
Customers
type_code
document_type
Tipo de documento
Customers
national_document_type_code
gender
Género de la persona
Customers
gender_code
sales_status
Estado de una venta
Sales
status_code

### Consultar Maestros - API CRM
Consultar Maestros - API CRM
 GET
 /v1/masters/read.php 
Definiciones Generales
La consulta a un Maestro puede aplicarse a un dato Maestro en particular o a un conjunto mediante utilización de filtros de selección.
Quién:
 Sistema Externo
Cuándo:
 toda vez que se necesite consultar la información de un Dato Maestro en CRM PILOT
Maestros que pueden consultarse
Master
Entidad (Correspondencia)
Nombre
Descripción
Nombre
Campo Nombre
adminfiles_status
Estado del legajo
Legajos
status_code
branches
Sucursales
Sales
branch_code
business_type
Tipo de negocios
Sales
business_type_code
customer_type
Tipo de cliente
Customers
type_code
sales_status
Estado de una venta
Sales
status_code
Especificación de parámetros
data
struct
 requerido
master
string
 requerido
   Nombre del Maestro a consultar
filters
struct
field
string
Código de la marca (Solo en maestros workshop_model y workshop_service)
operation
string
Operador
value
string
valor del 'field'
header
struct
 requerido
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha/Hora del llamado al servicio
TrackingId
numeric
Número de tracking, que el sistema externo puede declarar para seguimiento
access_token
string
Token válido de 
autorización
Ejemplo solicitud
curl --location --request GET '
https://api.pilotsolution.net/v1/masters/read.php'
 \
--header 'content-type: application/json' \
--header 'Cookie: PHPSESSID=sidnnmj6jeqku800hu22juf5j1' \
--data-raw ' {
	"data": {
		"master": "workshop_model"	
	},
	"header": {
		"FlowName": "masterdata_read",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{access_token}}"
	}
}'
Ejemplo con filtro de código de marca
{
	"data": {
		"master": "workshop_model",
        "filters": [
                {
		  "field": "brand_code",
		  "operation": "=",
		  "value": "TY"
		}
	},
	"header": {
		"FlowName": "masterdata_read",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta sin errores 
La respuesta estándar es una estructura JSON con la entidad o colección de entidades.Ver 
[entidad de maestros]
{
    "ts": "1656344768",
    "_id": "164241567",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 12,
            "rows_per_page": 100,
            "rows_in_page": 12,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": "9",
                "code": "1",
                "name": "FOCUS",
                "deleted": "0",
                "visible": "1",
                "visual_order": "1",
                "brand": {
                    "code": "1",
                    "name": "FORD"
                },
                "audit_dt": "2019-08-15T20:00:30+0000",
                "audit_usr": "21298"
            },
            {
                "id": "10",
                "code": "2",
                "name": "FIESTA",
                "deleted": "0",
                "visible": "1",
                "visual_order": "2",
                "brand": {
                    "code": "1",
                    "name": "FORD"
                },
                "audit_dt": "2019-08-15T20:00:45+0000",
                "audit_usr": "21298"
            }
        ]
    }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1498664684",
	"_id": "109815",
	"result": {
		"status": "error",
		"aditional_data": [],com.ar 
		"code": "business_error",
		"message": "Master not available or not exist"
	}
}
Control de Cambios
Fecha
Cambio
Junio 2022
Documento actualizado
Diciembre 2022
Documento actualizado – Se reemplazó URL api.pilotsolution.com.ar por api.pilotsolution.net

## Prospectos - API CRM
Prospectos - API CRM

### Entidad Prospecto - API CRM
Entidad Prospecto - API CRM
Ejemplo en JSON valores de retorno de una entidad de prospecto
"id": "7F66BDCE-9E26-4497-9411-7504E79971AE",
"first_name": "asd",
"last_name": "",
"phone": "3417050442",
"cellphone": "",
"email": "",
"whatsapp_internal_id": null,
"whatsapp_username": null,
"address": {
	"street": "Maipu",
	"door_number": "3156",
	"floor": "",
	"apartment": "",
	"city": "olivos",
	"province": {
		"code": "2",
		"name": "BUENOS AIRES"
	},
	"country": {
		"code": "AR",
		"name": "Argentina"
	},
	"postal_code": "B1636AAY",
	"latitude": "-34.5068521",
	"longitude": "-58.493046"
},
"birthday": "",
"welcome_id": null,
"tax_identification": "",
"customer_type": null,
"sale_representative": {
	"user": {
		"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
		"integration_reference_code": null,
		"name": "localdesa.admin@pilotsolution.com.ar",
		"fullname": "Desa Local"
	},
	"branch": {
		"code": "1",
		"name": "Beccar"
	}
},
"notes": null,
"last_contact": {
	"datetime": "",
	"origin": null,
	"user": null
},
"gender": {
	"code": "E",
	"name": "Indefinido"
},
"company": "",
"tracking_id": null,
"repetead_qty": "0",
"created": {
	"user": {
		"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
		"integration_reference_code": null,
		"name": "localdesa.admin@pilotsolution.com.ar",
		"fullname": "Desa Local"
	},
	"dt": "2016-11-15T14:06:18+0000"
},
"updated": {
	"user": {
		"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
		"integration_reference_code": null,
		"name": "localdesa.admin@pilotsolution.com.ar",
        	"fullname": "Desa Local"
	},
	"dt": "2016-11-16T15:37:48+0000"
},
"deleted": {
	"flag": "0",
	"dt": "",
	"user": null
}
Valores de retorno para todos los servicios de prospecto
id
string
Id del prospecto
first_name
string
Nombre del prospecto
last_name
string
Apellido del prospecto
phone
string
Teléfono del prospecto
cellphone
string
Celular del prospecto
email
string
Email del prospecto
whatsapp_internal_id
string
Identificador de whatsapp
whatsapp_username
string
Nombre de usuario en whatsapp
address
struct
street
string
Nombre de la calle donde vive el prospecto
door_number
string
Número de la altura donde vive el prospecto
floor
string
Número piso
apartment
string
Departamento
city
string
Ciudad
province
struct
name
string
Provincia donde vive el prospecto
code
string
Código provincia
country
struct
name
string
País
code
string
Código país
postal_code
string
Código postal
latitude
string
Latitud
longitude
string
Longitud
birthday
datetime
Fecha de nacimiento
welcome_id
string
Lead que originó el prospecto
tax_identification
string
Identificación tributaria
customer_type
string
Tipo de customer
notes
string
Notas del prospecto
company
string
Nombre de la compañía
tracking_id
string
tracking id
repeated_qty
numeric
Cantidad de veces que el prospecto se repite
sale_representative
struct
Usuario representante del prospecto
user
struct
id
string
   Id del usuario 
integration_reference_code
string
   Código de referencia del usuario 
name
string
   Mail del usuario 
fullname
string
   Nombre completo del usuario
branch
struct
code
string
   Código de referencia de la sucursal 
name
string
   Nombre de la sucursal
notes
string
notas del prospecto
last_contact
struct
datetime
isodatetime
   Fecha de último contacto 
origin
string
   Origen del último contacto 
user
struct
id
string
   Id del usuario 
integration_reference_code
string
   Código de referencia del usuario 
name
string
   Mail del usuario 
fullname
string
   Nombre completo del usuario
gender
struct
code
string
   Código de referencia del género del prospecto (ir a ver maestro) 
name
string
   Nombre del género del prospecto (ir a ver maestro)
company
string
nombre de la compañía
tracking_id
string
tracking id
repeated_qty
numeric
cantidad de veces que el prospecto se repite
created
struct
user
struct
id
string
   Id del usuario 
integration_reference_code
string
   Código de referencia del usuario del sistema que se integra 
name
string
   Email del usuario 
fullname
string
   Nombre completo del usuario
dt
isodatetime
   Fecha de creación del cliente
updated
struct
user
struct
id
string
   Id del usuario 
integration_reference_code
string
   Código de referencia del usuario del sistema que se integra 
name
string
   Email del usuario 
fullname
string
   Nombre completo del usuario
dt
isodatetime
   Fecha de última actualización del cliente
deleted
struct
user
struct
id
string
   Id del usuario 
integration_reference_code
string
   Código de referencia del usuario del sistema que se integra 
name
string
   Email del usuario 
fullname
string
   Nombre completo del usuario
dt
isodatetime
   Fecha de eliminación del cliente

### Leer - API CRM
Leer - API CRM
 POST 
 /v1/prospects/read.php 
Este servicio permite leer un prospecto.
Ejemplo solicitud JSON
"data": {
              "id": "7F66BDCE-9E26-4497-9411-7504E79971AE"
          },
  "header": {
  "FlowName": "read_prospect",
  "SequenceId": [],
  "TimeStamp": [],
  "access_token":"{{token}}"
  }
  }
Ejemplo respuesta JSON
{
	"ts": "1494625198",
	"_id": "5994",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": {
			"id": "7F66BDCE-9E26-4497-9411-7504E79971AE",
			"first_name": "asd",
			"last_name": "",
			"phone": "3417050442",
			"cellphone": "",
			"email": "",
                        "whatsapp_internal_id": "",
                        "whatsapp_username": "",
			"address": {
				"street": "Maipu",
				"door_number": "3156",
				"floor": "",
				"apartment": "",
				"city": "olivos",
				"province": {
					"code": "2",
					"name": "BUENOS AIRES"
				},
				"country": {
					"code": "AR",
					"name": "Argentina"
				},
				"postal_code": "B1636AAY",
				"latitude": "-34.5068521",
				"longitude": "-58.493046"
			},
			"birthday": "",
			"welcome_id": null,
			"tax_identification": "",
			"customer_type": null,
			"sale_representative": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"branch": {
					"code": "1",
					"name": "Beccar"
				}
			},
			"notes": null,
			"last_contact": {
				"datetime": "",
				"origin": null,
				"user": null
			},
			"gender": {
				"code": "E",
				"name": "Indefinido"
			},
			"company": "",
			"tracking_id": null,
			"repetead_qty": "0",
			"created": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2016-11-15T14:06:18+0000"
			},
			"updated": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2016-11-16T15:37:48+0000"
			},
			"deleted": {
				"flag": "0",
				"dt": "",
				"user": null
			}
		}
	}
}
Parámetros
data
struct
required
id
string
Id del customer
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
Fecha de la respuesta del servicio
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
Entidad prospecto

### Listar - API CRM
Listar - API CRM
 POST 
 /v1/prospects/read.php 
Este servicio permite:
listar prospectos mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un prospecto en CRM PILOT
Nombre del Parámetro
Requerido
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es 100.
page
SI
texto
1
Número de página en curso
NOTA:
El índice de página inicia en 1.
filters
NO
estructura
texto
texto
texto
"gender_code"
"="
"E"
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
sorts
field
order
NO
SI
SI
estructura
texto
texto
 "updated"
"DESC"
Ordenamiento a aplicar
nombre del campo por el que se ordena
Sentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
List_prospect”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de filtros de selección que pueden aplicarse para elegir un conjunto de Prospectos.
Campo
Descripción  
  cellphone
 Número de celular
gender_code
Código del género
address_province_code
Código de provincia
address_country_code
Código de país
created
Fecha de creación del prospecto (Formato ISO YYYY-MM-DDTHH:mm:ss.000)
updated
Fecha de última actualización del prospecto (Formato ISO YYYY-MM-DDTHH:mm:ss.000)
Lista de parámetros por los cuales puede ordenarse la lista de leads a seleccionar
Parámetro de Ordenamiento
Descripción
created
Fecha de creación del prospecto (ASC o DESC)
updated
Fecha de última actualización del prospecto (ASC o DESC)
Operadores
Operador
Símbolo
Igual
=
Distinto
!=
Mayor a
&gt;
Menor a
&lt;
Consideraciones Solicitud
Limit admite como máximo valor 100.
Page admite como máximo valor 50.
En caso de declarar un valor para Page superior a 50 se despliega el siguiente mensaje de error: "This API is limited to 50 pages".
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página es mayor a 1 se obtiene un arreglo vacío.
La concatenación de filtros en una misma solicitud se aplica como una condición lógica AND.
Consideraciones Retorno
Page: Número de página que se retorna.
Page_count: Cantidad total de páginas.
Rows_count: Cantidad total de registros.
Rows_per_page: Cantidad de registros por página (según limit).
Rows_in_page: Cantidad de registros en la página en curso.
Rows_remaining: Cantidad de registros que restan.
Lista de filtros de selección que pueden aplicarse para elegir un conjunto de Prospectos.
Campo
Descripción
gender_code
Código del género
address_province_code
Código de provincia
address_country_code
Código de país
created
Fecha de creación del prospecto (Formato ISO YYYY-MM-DDTHH:mm:ss.000)
updated
Fecha de última actualización del prospecto (Formato ISO YYYY-MM-DDTHH:mm:ss.000)
Lista de parámetros por los cuales puede ordenarse la lista de leads a seleccionar
Parámetro de Ordenamiento
Descripción
created
Fecha de creación del prospecto (ASC o DESC)
updated
Fecha de última actualización del prospecto (ASC o DESC)
Operadores
Operador
Símbolo
Igual
=
Distinto
!=
Mayor a
&gt;
Menor a
&lt;
Consideraciones Solicitud
Limit admite como máximo valor 100.
Page admite como máximo valor 50.
En caso de declarar un valor para Page superior a 50 se despliega el siguiente mensaje de error: "This API is limited to 50 pages".
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página es mayor a 1 se obtiene un arreglo vacío.
La concatenación de filtros en una misma solicitud se aplica como una condición lógica AND.
Consideraciones Retorno
Page: Número de página que se retorna.
Page_count: Cantidad total de páginas.
Rows_count: Cantidad total de registros.
Rows_per_page: Cantidad de registros por página (según limit).
Rows_in_page: Cantidad de registros en la página en curso.
Rows_remaining: Cantidad de registros que restan.

### Actualizar - API CRM
Actualizar - API CRM
 POST 
 /v1/prospects/update.php 
Endpoint público mediante el cual se actualiza un prospecto. El prospecto no puede estar eliminado, y se debe enviar al menos un dato de contacto (email, número de teléfono o número de teléfono móvil).
Las reglas de negpocio se declaran en la descripción de cada parámetro.
Ejemplo solicitud JSON
{
    "data": {
          "id":"ACA1B8A6-1CBF-4B1E-906B-063983B82AED",
          "first_name":"Juan",
          "last_name":"García",
          "second_last_name" : "",
          "phone":"1122223333",
          "cellphone": "1144445555",
          "email":"juangarcia@gmail.com",
          "birthday":"1994-11-05T13:15:30Z",
          "tax_identification":"20123456789",
          "customer_type_code":"1",
          "representative_id":"50E6ACC4-E495-4497-948A-12ED60EAA777",
          "notes":"update desde api",
          "gender_code":"Masculino",
          "company":"Empresa S.A.",
          "tracking_id":"0019",
          "address_street":"Av. Maipu",
          "address_door_number":"2005",
          "address_floor":"1",
          "address_apartment":"D",
          "address_city":"Olivos",
          "address_postal_code":"1636",
          "address_comments":"Usando api",
          "address_province_code":"2",
          "address_country_code":"AR",
          "address_latitude":"1",
          "address_longitude":"2",
          "whatsapp_internal_id = "",
          "whatsapp_username = ""
        },
    "header": {
    "FlowName": "PROSPECT_UPDATE_PILOT",
    "SequenceId": [],
    "TimeStamp": [],
    "access_token":"{token}"
    }
    }
Ejemplo respuesta JSON
{
    "ts": "1533825262",
    "_id": "197",
    "result":{
    "status": "success",
    "aditional_data":[],
    "entitydata":{
        "id": "ACA1B8A6-1CBF-4B1E-906B-063983B82AED",
        "first_name": "Juan",
        "last_name": "García",
        "phone": "1122223333",
        "cellphone": "1144445555",
        "email": "juangarcia@gmail.com",
        "whatsapp_internal_id": null,
        "whatsapp_username": null,
        "address":{
            "street": "Av. Maipu",
            "door_number": "2005",
            "floor": "1",
            "apartment": "D",
            "city": "Olivos",
            "province":{
                "code": "2",
                "name": "BUENOS AIRES"
            },
            "country":{
                "code": "AR",
                "name": "Argentina"
            },
            "direccion_comments": "Usando api",
            "postal_code": "1636",
            "latitude": "1",
            "longitude": "2"
        },
        "birthday": "1994-11-05T13:15:30+0000",
        "welcome_id": null,
        "tax_identification": "20123456789",
        "customer_type":{
            "code": "1",
            "name": "Particular"
        },
        "sale_representative":{
            "user":{
                "id": "11D0D028-3E33-4C0F-AC57-52CE47BED88E",
                "integration_reference_code": "",
                "name": "usuario@activabi.com.ar",
                "fullname": "Usuario Pilot"
            },
            "branch":{
                "code": "1",
                "name": "Beccar"
            }
        },
        "notes": "update desde api",
        "last_contact":{
            "datetime": "",
            "origin": null,
            "user": null
        },
        "gender":{
            "code": "Masculino",
            "name": "Masculino"
        },
        "company": "Ford",
        "tracking_id": "0019",
        "repetead_qty": "0",
        "created":{
            "user":{
                "id": "11D0D028-3E33-4C0F-AC57-52CE47BED88E",
                "integration_reference_code": "",
                "name": "usuario@pilotsolution.com.ar",
                "fullname": "Usuario Pilot"
                },
            "dt": "2016-12-19T19:38:28+0000"
        },
        "updated":{
            "user":{
                "id": "A5451D66-0D73-43DF-B418-24B4D104FE53",
                "integration_reference_code": "",
                "name": "usuario@pilotsolution.com.ar",
                "fullname": "Usuario Pilot"
                },
            "dt": "2018-08-09T14:34:22+0000"
        },
        "deleted":{
            "flag": "0",
            "dt": "",
            "user": null
            }
        }
    }
}
Ejemplo estructura error de respuesta JSON
{
    "ts": "1533825650",
    "_id": "199",
    "result":{
        "status": "error",
        "aditional_data":[],
        "code": "business_error",
        "message": "El prospecto no existe"
    }
}
Parámetros
data
struct
requerido
id
string
requerido
Identificador del prospecto a modificar. Es único para cada prospecto.
first_name
string
Nombre del prospecto
phone
string
Número de teléfono fijo del prospecto.
cellphone
string
Número de teléfono móvil del prospecto.
email
string
Dirección de email del prospecto.
notes
string
Notas del prospecto.
company
string
Razón Social del prospecto.
tax_identification
string
Identificación tributaria del prospect (Cuit/Cuil/Dni/Otro).
whatsapp_tracking_id
string
Número para el seguimiento del prospecto.
whatsapp_internal_id
string
Identificadopr del whatsapp
whatsapp_username
string
Nombre del usuario .
address_street
string
Nombre de la calle donde vive el prospecto.
address_door_number
string
Número de la altura donde vive el prospecto.
address_floor
string
Número de piso donde vive el prospecto.
address_apartment
string
Número, letra o descripción del departamento donde vive el prospecto.
address_postal_code
string
Código postal donde vive el prospecto.
address_city
string
Ciudad donde vive el prospecto.
address_comments
string
Comentario sobre la dirección del prospecto.
address_province_code
string
Código de referencia de la provincia donde vive el prospecto.
address_country_code
string
Código de referencia del país donde vive el prospecto.
address_latitude
string
Latitud de donde vive el prospecto.
address_longitude
string
Longitud de donde vive el prospecto.
birthday
isodatetime
Fecha de nacimiento del prospecto.
gender_code
string
Código de referencia del género del prospecto 
Ver Maestros.
customer_type_code
string
Tipo de customer.
sale_representative_id
string
Identificador del usuario asignado al prospecto.
header
struct
requerido
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha del pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
Fecha de la respuesta del servicio
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
entidad prospect
Control de cambios
Fecha
 Cambio
31 Agosto 2026
 Se agregan los siguientes parámetros:
whatsapp_internal Id = identificaor de  de whatsapp
whatsapp_username = nombre del usuario en whatsapp

## Leads - API CRM
Leads - API CRM

### Entidad Lead - API CRM
Entidad Lead - API CRM
Valores de retorno para todos los servicios de Lead
Nombre del Parámetro
Tipo
Comentario
id
texto (de 32 bits en formato GUID)
Identificador único del lead de CRM PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al lead.
status
       code
        name
estructura
texto
texto
Estructura que describe el Estado del Lead
Código de Estado del Lead
Nombre del estado del Lead
Valores Posibles:
 Sin Gestión, Gestión, Oportunidad, Cerrado, Ganado Perdido
origin
code
         name
estructura
texto
texto
Estructura
Código de Origen.
Nombre de Origen
suborigin
code
         name
estructura
texto
texto
Estructura
Código de Suborigen.
Nombre de Suborigen
delivery_type
          code
estructura
texto
Estructura que identifica el conjunto de personas habilitadas para tomar el ‘dato’
Código del Tipo de Delivery
Valores Posibles:
Para todos: 
Se envía un mensaje a todos los usuarios de este origen para que tomen el dato.
Equitativo: 
Se asigna el dato normalmente de uno en uno.
business_type
       id
       code
       name
estructura
texto
texto
texto
Estructura que describe el tipo de negocio
Identificador único (valor técnico)
Código del Tipo de negocio
Nombre del Tipo de negocio Ej: (1) Convencional / 0km | (2) Usados |(3) Plan de Ahorro
business_type_behavior
        id
       name
       code
estructura
texto
texto
texto
Estructura que describe el tipo de comportamiento (aplicación según el tipo de negocio)
Identificador único (valor técnico)
Nombre del Tipo de Comportamiento
Código del Tipo de Comportamiento
source_type
id
       name
       code
estructura
texto
texto
texto
Estructura que describe el tipo de fuente (origen)
Identificador único (valor técnico)
Nombre
Código del Tipo de fuente.
publication_link
texto
URL del proveedor del servicio
publication_name
texto
Nombre del proveedor del servicio
publication_mail_format_id
texto
publication_mail_format
texto
interest_level
      code
     name
     color
estructura
texto
texto
texto
Estructura vinculada al producto de interés
Código
Nombre
Color de referencia
co
ntact_type 
      name
      code
estructura
texto
texto
Estructura vinculada al tipo de contacto
Nombre
Código
NOTA:
Identifica la forma por la cual se establece el contacto con el lead/prospecto.
asigned user
      id
      fullname
      user_integration_reference_code
      branch
           code
           name
      dt
estructura
texto (de 32 bits en formato GUID)
texto
texto
estructura
texto
texto
Estructura que explicita información del Comercial que atiende al Lead
Identificador único (del comercial) en CRM PILOT
nombre del comercial en CRM PILOT
Identificador único del Comercial en el Sistema Externo.
Estructura que explicita información de la sucursal en la que se realizó el contacto
Código de Sucursal
Nombre de la Sucursal
Fecha en la que se asigna el Comercial que atiende al Lead/prospecto
NOTA:  
su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs
assigned_flag
flag
Marca de lead asignado a un asesor comercial
welcome_notifications_opt_in_consent_flag
flag
Indica se el Lead acepta recibir notificaciones desde cualquier medio de contacto
welcome_publicity_opt_in_consent_flag
flag
Indica se el Lead acepta recibir publicaciones
product_of_interest
texto libre
Marca y Modelo del vehículo de interés del Lead
notes
texto
Comentario referido al Lead
open_dt
fecha
Fecha en la que el lead/prospecto pasa a estar del estado “sin gestión” a “en gestión”
converted_to_business_dt
fecha
last_priority_event_dt
fecha
contact_events_qty
número
Cantidad de eventos asociados al lead/prospecto
reassign_qty
número
Cantidad de veces que el lead fue reasignado
prospect_repeated_qty
número
Cantidad de veces que el lead fue repetido
created user
fullname
dt
estructura
texto 
fecha
Estructura de auditoría referida a la creación del registro lead
Nombre completo del usuario
Fecha de creación del lead
NOTA: su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs
modified user
        fullname
dt
estructura
texto
fecha
Estructura de auditoría referida a la última modificación del registro lead
Nombre completo del usuario
Fecha de creación del lead/prospecto
NOTA: su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs
prospect
      id
      company
      firstname
      lastname
      second_lastname
      phone
      email
      cellphone
      tracking_id
      address_location
      province_id
      address_street
      address_floor
      address_number
      address_department
      country_id
      address_postal_code
      tax_id
      birth_date
      gender_id
      address_comments
      address_latitude
      address_longitude
      customer_type
           id
           name
           physical_person_flag
       internal_id
       whatsapp_username
estructura
texto(de 32 bits en formato GUID)
texto
texto
texto
texto
texto
texto
texto
texto
texto
número
texto
texto
texto
número
texto
número
texto
número
texto
texto
texto
texto
estructura
número
texto
flag
texto
texto
Estructura 
que explicita información del lead
Identificador único del lead/prospecto
Nombre de la empresa en la que trabaja el lead
Nombre del Lead
Apellido paterno del Lead
Apellido materno del Lead
Teléfono fijo del Lead
Dirección de correo electrónico del Lead
Número de celular del Lead
Identificador de seguimiento
Ubicación
Identificador único de Provincia/Estado (valor técnico)
Calle
Piso
Número
Departamento
Identificador único del País (valor técnico)
Código Postal
Código del Régimen Fiscal
Fecha de Nacimiento / Fecha de Inicio de Actividades
Identificador único del Género (valor técnico)
Comentarios referidos al Domicilio
Latitud
Longitud
Estructura de Personería Jurídica
Identificador único (valor técnico)
Nombre del Tipo de Cliente
Marca si el Tipo de Cliente es Físico (1) o Jurídico 
id de whatsapp
nombre el usuario
desist
       dt
      comments
     status
          name
          code
      user
         fullname
estructura
fecha
texto
estructura
texto
texto
estructura
texto
Estructura que brinda información acerca del cierre del lead
Fecha en la que el Lead/prospecto desiste de llevar a cabo la operación   
NOTA:  su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs. 
Comentario vinculado al desistimiento
Estructura Motivo de Cierre
Descripción del Motivo de Cierre
Código del Motivo de Cierre
estructura
Nombre de la persona que desiste
mercadolibre
     hasOrder
     color
     orders_status
estructura
texto
texto
texto
delay_color
     texto
estructura
texto
delay
     texto
estructura
texto
opportunity
     texto
estructura
texto
bad_flag
flag
Marca que clasifica el potencial del Lead (Good Lead – Bad Lead)
Valores posibles
0 = Good Lead
1 = Bad Lead
won_flag
flag
Marca que identifica si el Lead fue Ganado o Perdido.
Valores posibles
0 = Perdido
1 = Ganado
Updated on 08/29/2025

### Crear - API CRM
Crear - API CRM
POST
/v1/welcomes/create.php
Toda vez que se ingresa (crea) un Lead en el 
ERP o Middleware
, esta acción debe ser informada a 
CRM
PILOT
 mediante la invocación de la API provista.
Parámetros para crear un Lead
Nombre del parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
welcome_firstname
    SI
texto
 “Juan Olegario”
Nombre del Lead
welcome_lastname
    NO
texto
 “Perez”
Apellido paterno del Lead
welcome_second_lastname
    NO
texto
 “Galván”
Apellido materno del Lead
welcome_phone
   NO 
*
texto
 “48952635”
Teléfono fijo del lead  
welcome_cellphone
   NO 
*
texto
 “5491153767296”
Número de celular del lead
welcome_email
   NO 
*
texto
 “ejemplo@gmail.com”
Dirección de correo electrónico del Lead
welcome_contact_type_code
   SI
dato maestro
“Entrevista”
Medio por el cual se contacta a la personaLos valores para este campo se obtienen consultando el dato maestro  
contact_type_code  
Ver contact_type
welcome_business_type_code
   SI
dato maestro
nuevo
Canal de ventaLos valores para este campo se obtienen consultando el dato maestro 
 business_type_code  
Ver business_type
welcome_notes
   NO
texto
 “vehículo/financiación”
Comentarios, observaciones de interés que el ‘actor’ agrega al momento de ingresar el Lead
welcome_suborigin_code
   SI
dato maestro
 “DOWHL93P7M2LN1Q0S”
Código que identifica el origen primario del Lead.
Los valores para este campo se obtienen consultando el dato maestro 
 suborigen_code  
Ver welcome_suborigin
welcome_assigned_user
  NO
texto
 “cuentausuario@dominio.com”
Código del Vendedor al que se le quiere asignar el dato.
Nota:
La asignación manual del dato tiene prelación por sobre los grupos de captura de datos
welcome_city
  NO
texto
  “Capital Federal”
Ciudad de ubicación del dato
welcome_province
  NO
dato maestro
” CABA”
Provincia/Estado de ubicación del dato.
Los valores para este campo se obtienen consultando el dato maestro 
 address_province_code  
Ver province
welcome_country
  NO
dato maestro
 “ARGENTINA”
País de ubicación del datoLos valores para este campo se obtienen consultando el dato maestro 
address_country_code 
Ver country
welcome_vendor_name
  NO
texto
 “”
Nombre del proveedor del dato.
welcome_vendor_email
  NO
texto
 “”
E-mail del proveedor del dato.
welcome_vendor_phone
  NO
texto
 “”
Teléfono del proveedor del dato.
welcome_provider_service
  NO
texto
 “”
Nombre del servicio que provee el dato.
Nota:
Permite identificar el proveedor del servicio o el patrón de ruteo en caso de necesitar asignaciones dinámicas a diferentes grupos de captura.
welcome_provider_url
  NO
texto
 “”
URL del servicio que recolectó el dato.
welcome_client_identity_document
  NO
texto
 “”
Documento de Identidad del Lead.
welcome_tracking_id
  NO
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Código de seguimiento: GUID o ID único que identifica al Lead en el origen.
welcome_client_ip
  NO
texto
 “”
IP del Lead al momento de la captura.
welcome_product_code
  NO
texto
 “”
Código de Producto según la lista de precios.
welcome_product_of_interest
  NO
 texto libre
“”
 Marca y Modelo del vehículo de interés del Lead
welcome_car_brand
 NO
 texto
 “Peugeot”
 Marca del vehículo de interés
welcome_car_modelo
 NO
 texto
 “208”
 Modelo del vehículo de interés
welcome_notifications_opt_in_consent_flag
  NO
flag
 1
Indica si el Lead acepta recibir notificaciones a través de cualquier medio de contacto.
Valores posibles:
0 = no acepta ; 1 = si acepta
Valor por defecto:
 0 (no acepta)
welcome_publicity_opt_in_consent_flag
   NO
flag
 1
Indica si el Lead acepta recibir material publicitario a través de cualquier medio de contacto.
Valores posibles:
0 = no acepta ; 1 = si acepta
Valor por defecto:
 0 (no acepta)
bad_flag
   NO
 flag
 null
Califica al Lead como Good Lead o Bad Lead
Valores Posibles:
0: Good Lead ; 1: Bad Lead
Valor por defecto: 
null
Nota:
 Si el campo bad_flag = 1, los parámetros desist_status_code y desists_comments  deben. completarse.
desist_status_code
   NO/SI
 texto
“”
Código del motivo de cierre. Los valores para este campo se obtienen consultando el dato maestro 
 bad_lead_status 
Ver bad_lead_status
Nota:
 Debe completarse si bad_flag =1
desists_comments
  NO/SI
 texto
“”
Comentario relacionado al motivo de cierre
Nota:
 Debe completarse si bad_flag = 1
Ejemplo de solicitud para crear un Lead
 ⧉ Copy 
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "welcome_firstname": "Juan Olegario",
        "welcome_lastname": "Perez",
        "welcome_second_lastname":"Galván",
        "welcome_phone": "48952635",
        "welcome_cellphone": "5491153767296",
        "welcome_email": "ejemplo@gmail.com",
        "welcome_contact_type_code": "1",
        "welcome_business_type_code":"nuevo",
        "welcome_notes": "Lead interesado en adquirir un vehículo",
        "welcome_suborigin_code": "DOWHL93P7M2LN1Q0S",
        "welcome_assigned_user": "",
        "welcome_city": "buenos aires",
        "welcome_province": "buenos aires",
        "welcome_country": "Argentina",
        "welcome_vendor_name": "",
        "welcome_vendor_email": "",
        "welcome_vendor_phone": "",
        "welcome_provider_service": "",
        "welcome_provider_url": "",
        "welcome_client_identity_document": "",
        "welcome_tracking_id": "lead_prueba",
        "welcome_client_ip": "",
        "welcome_best_contact_time": "",
        "welcome_product_code": "",
        "welcome_product_of_interest":"",
        "welcome_car_brand":"Peugeot",
        "welcome_car_modelo":"208",
        "welcome_notifications_opt_in_consent_flag":1,
        "welcome_publicity_opt_in_consent_flag":1,
        "bad_flag":0
    },
    "header": {
        "FlowName": "lead_create",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
    }
}'
Respuesta a Solicitud creación de un Lead  Satisfactoria.  
Especificación de la entidad “lead”
 {
    "ts": "1714072558",
    "_id": "60463853",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "DB8FA1C4-85E8-4587-82CC-54CA5D9BD571",
            "status": {
                "code": "100",
                "name": "Sin Gestion"
            },
            "origin": {
                "code": "referido",
                "name": "DEALER_REFERIDO"
            },
            "suborigin": {
                "code": "DOWHL93P7M2LN1Q0S",
                "name": "Postventa",
                "delivery_type": {
                    "code": "EQ"
                }
            },
            "business_type": {
                "id": 1,
                "name": "Nuevo",
                "code": "nuevo"
            },
            "business_type_behavior": {
                "id": 1,
                "name": "NEW VEHICLES",
                "code": "NEW-VEHICLES"
            },
            "source_type": {
                "id": 2,
                "name": "2",
                "code": "API WEB"
            },
            "publication_link": "",
            "publication_name": "",
            "publication_mail_format_id": null,
            "publication_mail_format": null,
            "interest_level": {
                "code": null,
                "name": null,
                "color": null
            },
            "contact_type": {
                "name": "Electronico",
                "code": "1"
            },
            "asigned": {
                "user": {
                    "id": null,
                    "fullname": null,
                    "user_integration_reference_code": null
                },
                "branch": {
                    "code": null,
                    "name": null
                },
                "dt": null
            },
            "assigned_flag": 0,
            "welcome_notifications_opt_in_consent_flag": "1",
            "welcome_publicity_opt_in_consent_flag": "1",
            "product_of_interest": "Peugeot 208",
            "notes": "ESTO ES UN LEAD DE PRUEBA GUs & Mar - MARCA: Peugeot - MODELO: 208",
            "open_dt": null,
            "converted_to_business_dt": null,
            "last_priority_event_dt": "2024-04-25T19:15:57+0000",
            "contact_events_qty": 0,
            "reassign_qty": 0,
            "prospect_repeated_qty": "0",
            "created": {
                "user": {
                    "fullname": "API Hubford2"
                },
                "dt": "2024-04-25T19:15:57+0000"
            },
            "modified": {
                "user": {
                    "fullname": null
                },
                "dt": null
            },
            "prospect": {
                "id": "BD9729B8-D5C4-4CA0-A516-4DF240B35266",
                "company": "",
                "firstname": "Create Lead",
                "lastname": "CRM-API",
                "second_lastname": "0km_19",
                "phone": "48952635",
                "email": "",
                "cellphone": "48952635",
                "tracking_id": "",
                "address_location": "buenos aires",
                "province_id": "121",
                "address_street": "",
                "address_floor": "",
                "address_number": "",
                "address_departament": "",
                "country_id": "1",
                "address_postal_code": "",
                "tax_id": "",
                "birth_date": null,
                "gender_id": "3",
                "address_comments": null,
                "address_latitude": "-34.6036844",
                "address_longitude": "-58.3815591",
                "customer_type": {
                    "id": null,
                    "name": null,
                    "physical_person_flag": null
                }
            },
            "desist": {
                "dt": null,
                "comments": null,
                "status": {
                    "name": null,
                    "code": null
                },
                "user": {
                    "fullname": null
                }
            },
            "mercadolibre": {
                "hasOrder": 0,
                "color": "#fff074",
                "orders_status": null
            },
            "delay_color": "#000000",
            "delay": 0,
            "opportunity": [],
            "bad_flag": null,
            "won_flag": null
        }
    }
Ejemplo de Respuesta con error (al crear un lead el valor del campo business_type_code no existe)
{ "ts": "1714072118",
"_id": "60451603",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"sub-code": null,
"message": "El tipo de negocio no existe o se encuentra eliminado."
}
}
Control de Cambios
Fecha
Cambio
2018
Documento creado
26-Agosto-2025
Se agregan los campos 
desist_status_code
 y 
desists_comments. 
Deben completarse toda vez que 
bad_flag = 1
Si el parámetro 
bad_flag
 no se incluye en el body, es equivalente a haberse declarado como bad_flag = 0
Updated on 08/29/2025

### Leer - API CRM
Leer - API CRM
POST
/v1/welcomes/read.php&lt;
Se utiliza para consultar/leer un Lead/Prospecto  a partir del ID – Identificador Único en CRM PILOT.
Parámetros para crear un Lead
Nombre del parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (del Lead/Prospecto) de CRM PILOT sobre la que ocurrió la operación actualización/reserva. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
texto
número
timestamp
número
texto
“read_prospect”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Consultar/Leer un lead
curl --location -- request POST \
 --url '
https://api.pilotsolution.net/v1/welcomes/read.php'
--header 'content-type: application/json'\
--data-raw '{
     "data": {
         "id": "409F0198-51AC-4878-9BEF-CF2822DAF317"
     },
     header": {
         "Flowname": "read_prospect",
         "Sequenceid": 2,
         "TimeStamp": 1248377,
         "TrackingId": "55A6BCD4-0857-4486-85FB-09A2288641B4",
         "access_token": "{{access_token}}"
}
}
Respuesta a Solicitud Consulta/Lectura de un lead Satisfactoria   
Especificación de la entidad “lead”
 ⧉ Copy 
{
    "ts": "1702398304",
    "_id": "22497211",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "D110F988-B4BE-4412-8765-2D02C18AE327",
            "status": {
                "code": "300",
                "name": "Oportunidad"
            },
            "origin": {
                "code": "57BB3659",
                "name": "ADS - GOOGLE"
            },
            "suborigin": {
                "code": "DOWHL93P7M2LN1Q0S",
                "name": "AGENCIA",
                "delivery_type": {
                    "code": "EQ"
                }
            },
            "business_type": {
                "id": 1,
                "name": "0 Km",
                "code": "convencional"
            },
            "business_type_behavior": {
                "id": 1,
                "name": "NEW VEHICLES",
                "code": "NEW-VEHICLES"
            },
            "source_type": {
                "id": 1,
                "name": 1,
                "code": "MANUAL"
            },
            "publication_link": "",
            "publication_name": "",
            "publication_mail_format_id": null,
            "publication_mail_format": null,
            "interest_level": {
                "code": null,
                "name": null,
                "color": null
            },
            "contact_type": {
                "name": "Electronico",
                "code": "1"
            },
            "asigned": {
                "user": {
                    "id": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
                    "fullname": "Marcela Molero",
                    "user_integration_reference_code": "1429"
                },
                "branch": {
                    "code": "default",
                    "name": "Casa Central"
                },
                "dt": "2023-12-12T16:08:15+0000"
            },
            "assigned_flag": 1,
            "welcome_notifications_opt_in_consent_flag": "0",
            "welcome_publicity_opt_in_consent_flag": "0",
            "product_of_interest": "FORD 100% FIESTA",
            "notes": "Lead Comment",
            "open_dt": "2023-12-12T16:13:54+0000",
            "converted_to_business_dt": "2023-12-12T16:23:09+0000",
            "last_priority_event_dt": "2023-12-12T16:22:04+0000",
            "contact_events_qty": 0,
            "reassign_qty": 0,
            "prospect_repeated_qty": "0",
            "created": {
                "user": {
                    "fullname": "Marcela Molero"
                },
                "dt": "2023-12-12T16:08:15+0000"
            },
            "modified": {
                "user": {
                    "fullname": "Marcela Molero"
                },
                "dt": "2023-12-12T16:23:09+0000"
            },
            "prospect": {
                "id": "4565CE14-44E2-40A7-8E14-79F004DD94E2",
                "company": "",
                "firstname": "Alejandra",
                "lastname": "Escudero",
                "second_lastname": "Soler",
                "phone": "",
                "email": "aes@gmail.com",
                "cellphone": "",
                "tracking_id": "",
                "address_location": "",
                "province_id": null,
                "address_street": "",
                "address_floor": "",
                "address_number": "",
                "address_departament": "",
                "country_id": null,
                "address_postal_code": "",
                "tax_id": "",
                "birth_date": null,
                "gender_id": "3",
                "address_comments": null,
                "address_latitude": "",
                "address_longitude": "",
                "customer_type": {
                    "id": null,
                    "name": null,
                    "physical_person_flag": null
                }
            },
            "desist": {
                "dt": null,
                "comments": null,
                "status": {
                    "name": null,
                    "code": null
                },
                "user": {
                    "fullname": null
                }
            },
            "mercadolibre": {
                "hasOrder": 0,
                "color": "#fff074",
                "orders_status": null
            },
            "delay_color": "#000000",
            "delay": 17,
            "opportunity": [],
            "bad_flag": 0,
            "won_flag": null
        }
    }
Ejemplo de Respuesta con error (al consultar/leer un lead inexistente)
 ⧉ Copy 
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Lead doesn't exist in database"
	}
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Listar - API CRM
Listar - API CRM
POST
/v1/welcomes/list.php
listar prospectos mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un conjunto de leads 
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
SI
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
SI
SI
SI
estructura
texto
texto
texto
“welcome_email”
“LIKE”
“%MM@%”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
sorts
field
order
NO
SI
SI
estructura
texto
texto
 “welcome_email”
“DESC”
Ordenamiento a aplicar
nombre del campo por el que se ordena
Sentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“List_leads”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
               Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de Leads. 
Fitros de selección
created 
Fecha de creación del Lead.       - Formato UTC (YYYY-MM-DDThh:mm:ss.000)
updated 
Fecha de última modificación del Lead.       - Formato UTC (YYYY-MM-DDThh:mm:ss.000)
welcome_delay
 Dato vinculado a Mercado Libre
welcome_asigned_user_id
ID – Identificador único del comercial asignado al Lead (Guid)
welcome_firstname
Nombre del Lead. 
(*) No acepta el operador LIKE
welcome_lastname
Apellido del Lead  
(*) No acepta el operador LIKE
welcome_phone
Últimos 8 caracteres del Teléfono del Lead 
(*) Acepta  el operador LIKE
welcome_cellphone
Últimos 8 caracteres del Celular del Lead 
(*) Acepta el operador LIKE
welcome_email
Dirección de email del Lead. 
(*) No aplica para el Filtro LIKE
prospect_cuit
Id Fiscal del Lead
status_code
Estado del Lead
welcome_asigned_branch
Nombre de la Sucursal en la que el Lead fue registrado 
(*) No acepta el operador LIKE
welcome_origin
Nombre del Agrupador de Origen de datos 
(*) 
No acepta el operador LIKE
welcome_suborigin
Nombre del Origen de datos 
(*) 
No acepta el operador LIKE
prospect_empresa
Empresa en la que el Lead trabaja  
(*) 
No acepta el operador LIKE
interest_level_code
Grado de interés (temperatura) del Lead
business_type_code
Código del Tipo de Negocio
welcome_desist_status
Condición del desistimiento. 
(*) 
No acepta el operador LIKE
seek
Palabra Clave que indica que el valor declarado sea buscado en el registro
Campo que se utiliza para filtrar genéricamente. Es decir, el valor con el que se complete el campo seek es considerado como dato de búsqueda y filtra todos los registros por todos los campos que contengan ese valor
      Lista de parámetros  por los cuales puede 
ordenarse
 la lista de leads a seleccionar
Parámetros de ordenamiento
 created
Fecha de creación del Lead            - Formato UTC (YYYY-MM-DDThh:mm:ss.000)
 updated
Fecha de actualización del Lead     - Formato UTC (YYYY-MM-DDThh:mm:ss.000)
welcome_origin
Código de origen del Lead
welcome_asigned_user_id
ID – Identificador único del comercial asignado al Lead (Guid)
Operadores
 Igualdad
 =
 Distinto a
 &lt;&gt;
 Mayor a
 &gt;
 Menor a
 &lt;
 Mayor – igual a
 &gt; =
 Mayor – igual a
 &lt; =
 LIKE
 LIKE – Es necesario agregar el parámetro “wildcard”: “*”
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer un lead aplicando LIKE
{
    "data": {
        "limit": 25,
        "page": 1,
        "filters":[
            {
                "field": "welcome_cellphone",
                "operation": "LIKE",
                "value": "12345678"
            }    
        ],
       "wildCard": "*",
       "sorts": [
            {
                "field": "created",
                "order": "DESC"
            }
        ],
    },
    "header": {
        "FlowName": "List_Leads",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token":"{{token}}"
    }
}
Respuesta a Solicitud listar un conjunto de leads por su id Satisfactoria   
Especificación de la entidad “lead”
{
    "ts": "1709922486",
    "_id": "43392426",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 25,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": "A341B444-1E2E-4395-B36A-F8B24C3909F6",
                "status": {
                    "code": "300",
                    "name": "Oportunidad"
                },
                "origin": {
                    "code": "showroom",
                    "name": "DEALER_VENTA_PISO"
                },
                "suborigin": {
                    "code": "DT5RE95JVPEQXG4R5",
                    "name": "Visita Showroom"
                },
                "business_type": {
                    "name": "Nuevo",
                    "code": "nuevo"
                },
                "publication_name": "",
                "interest_level": {
                    "code": null,
                    "name": null,
                    "color": null
                },
                "contact_type": {
                    "name": "Electronico",
                    "code": "1"
                },
                "asigned": {
                    "user": {
                        "id": null,
                        "fullname": null,
                        "user_integration_reference_code": null
                    },
                    "branch": {
                        "code": null,
                        "name": null
                    },
                    "dt": null
                },
                "welcome_notifications_opt_in_consent_flag": "0",
                "welcome_publicity_opt_in_consent_flag": "0",
                "product_of_interest": "",
                "notes": "",
                "open_dt": "2024-01-25T23:54:03+0000",
                "contact_events_qty": 0,
                "reassign_qty": 0,
                "prospect_repeated_qty": "1",
                "created": {
                    "user": {
                        "fullname": "API BusinessPro"
                    },
                    "dt": "2024-01-25T23:47:20+0000"
                },
                "modified": {
                    "user": {
                        "fullname": "API BusinessPro"
                    },
                    "dt": "2024-01-25T23:54:03+0000"
                },
                "prospect": {
                    "id": "80BEC223-BBE8-4387-9243-5B3FB3348345",
                    "company": "",
                    "firstname": "Daniel",
                    "lastname": "Montoya",
                    "second_lastname": "Hernández",
                    "phone": "5584962351",
                    "email": "dmontoya@businesspro.mx",
                    "cellphone": "5584962351",
                    "tracking_id": ""
                },
                "desist": {
                    "dt": null,
                    "comments": null,
                    "status": {
                        "name": null
                    },
                    "user": {
                        "fullname": null
                    }
                },
                "mercadolibre": {
                    "hasOrder": 0,
                    "color": "#fff074",
                    "orders_status": null
                },
                "delay_color": "#adadad",
                "opportunity": [],
                "bad_flag": 0,
                "won_flag": null
            }
        ]
    }
}
Ejemplo de Respuesta con error (al listar un lead por su id inexistente)
{
	"ts": "1494623926",
	"_id": "5405",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "El id  '' no es válido."
	}
}
      Control de Cambios
Fecha
Cambio
24 Enero 2018
Documento creado
Updated on 09/30/2025

### Actualizar - API CRM
Actualizar - API CRM
POST
/v1/welcomes/update.php
Se utiliza para actualizar un Lead  a partir del ID – Identificador Único en CRM PILOT
Parámetro para actualizar un lead en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único (del Lead) de CRM PILOT sobre la que se aplica  la operación de actualización. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al Lead en CRM PILOT.
suborigin_code
NO
texto
 “11”
Código del suborigen del lead.Los valores para este campo se obtiene consultando el dato maestro 
welcome_suborigin 
Ver más
contact_type_code
NO
texto
“LS”
Código del tipo de contacto del lead.Los valores para este campo se obtiene consultando el dato maestro 
welcome_contact_type 
Ver más
business_type_code
NO
texto
“convencional”
Código del tipo de negocio del lead. 
Ver Maestros
Los valores para este campo se obtienen consultando el dato maestro 
business_type  
Ver más
notes
NO
texto
“Notas del Lead”
Notas relativas al Lead
provider_url
NO
texto
 “
http://www.google.com.ar
”
URL de la publicación de origen del lead.
provider_service
NO
texto
 “Google AR”
Nombre de la publicación de origen del lead.
interest_level_code
NO
texto
 “1”
Código del grado de interés del lead.Los valores para este campo se obtienen consultando el dato maestro 
welcome_interest_level  
Ver más
product_of_interest
 NO
text
“Ford KA”
 Producto de interés
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
texto
número
timestamp
texto
texto
“update_prospect”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Actualizar un lead
 ⧉ Copy 
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/update.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
  "data": {
    "id":"6005B367-D9C9-4A90-AF73-F07BEF5B01EB",
    "suborigin_code": "11",
    "contact_type_code":"LS",
    "business_type_code": "convencional",
    "notes": "Modificando desde la API",
    "provider_url": "
http://www.google.com.ar
",
    "provider_service": "Google AR"
  },
  "header": {
    "FlowName": "update_prospect",
    "SequenceId": 1,
    "TimeStamp": 1493991052,
    "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
    "access_token":"{{token}}"
  }
}
Respuesta a Solicitud Actualización de un lead/prospecto 
Satisfactoria
Especificación de la entidad “lead/”
 ⧉ Copy 
{
  "ts": "1533818597",
  "_id": "482",
  "result":{
    "status": "success",
    "aditional_data":[],
    "entitydata":{
      "contact_type":{
        "code": "1",
        "name": "Electronico"
      },
      "business_type":{
        "code": "convencional",
        "name": "0 Km"
      },
      "notes": "Comentarios para el lead Prueba importación",
      "assigned":{
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "localdesa.admin@pilotsolution.com.ar",
          "fullname": "Desa Local"
        },
        "branch":{
          "code": "default",
          "name": "Default"
        },
        "dt": "2018-07-26T11:46:17-0300"
      },
      "open_dt": "2018-08-03T23:20:35-0300",
      "status":{
        "code": "300",
        "name": "Oportunidad"
      },
      "desist":{
        "comments": "",
        "dt": "",
        "user": null,
        "status": null
      },
      "origin":{
        "code": "59DFF18B",
        "name": "CAMPAÑA - CONTAC CENTER"
      },
      "suborigin":{
        "code": "DPNKKJED4CQCR4SW1",
        "name": "Llamado Entrante"
      },
      "created":{
        "dt": "2018-07-26T11:46:17-0300",
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "localdesa.admin@pilotsolution.com.ar",
          "fullname": "Desa Local"
        }
      },
      "modified":{
        "dt": "2018-08-09T09:43:16-0300",
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "localdesa.admin@pilotsolution.com.ar",
          "fullname": "Desa Local"
        }
      },
      "source":{
        "link": "",
        "mail_format": "",
        "publication_name": "",
        "type_code": 4
      },
      "reassign_qty": 0,
      "id": "E5DAE15C-E47F-484A-8CD1-7DEC910BFECB",
      "contact_events_qty": 1,
      "converted_to_business_dt": "2018-08-03T23:20:35-0300",
      "last_priority_event_dt": "2018-08-03T23:20:35-0300",
      "prospect":{
        "id": "31612BAC-FE24-470F-966F-99DAD63992A9"
      }
    }
  }
}
Ejemplo de Respuesta con 
error
 (al consultar/leer un lead inexistente)
 ⧉ Copy 
     {
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Lead doesn't exist in database"
	}
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Cerrar - API CRM
Cerrar - API CRM
POST
/v1/welcomes/close.php
El desistimiento/cierre de un Lead se realiza mediante la invocación de la API provista.
Para cerrar/desistir un Lead, 
ERP
 debe utilizar el 
ID – Identificador único del lead en CRM PILOT
. Este identificador es asignado al momento de crear el Lead en 
CRM PILOT.  
Se recomienda preservar este valor en el 
ERP 
ya que es la única manera de acceder a la unidad.
Parámetros para desistir/cerrar un Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único del Lead en CRM PILOT sobre el que se realizará la operación de cierre.
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al lead.
desist_status_code
SI
texto
“5”
Código del motivo de cierre del lead. 
Ver Maestros – welcome_desist_status
desist_comments
SI
texto
“Obtuvo una mejor oferta”
Comentario para entender la razón del cierre
Header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
SI
SI
SI
Estructura
texto
número
fecha
número
string
“LEAD_CLOSE_PILOT”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
Cabecera de la Solicitud
Nombre descriptivo del servicio
Número de secuencia
Fecha en la que se realiza la solicitud
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de Solicitud para desistir/cerrar un Lead
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/close.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
"data": {
    "id":"6005B367-D9C9-4A90-AF73-F07BEF5B01EB",
    "desist_status_code": "5",
    "desist_comments": "Obtuvo una mejor oferta"
  },
  "header": {
    "FlowName": "LEAD_CLOSE_PILOT",
    "SequenceId": 1,
    "TimeStamp": 1493991052,
    "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
    "access_token":"{{token}}"
  }
}
Respuesta a Solicitud Cierre/Desistimiento  de un Lead  Satisfactoria 
Especificación de la entidad “Lead”
{
  "ts": "1533818597",
  "_id": "482",
  "result":{
    "status": "success",
    "aditional_data":[],
    "entitydata":{
      "contact_type":{
        "code": "1",
        "name": "Electronico"
      },
      "business_type":{
        "code": "convencional",
        "name": "0 Km"
      },
      "notes": "Comentarios para el lead Prueba importación",
      "assigned":{
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Nombre Usuario"
        },
        "branch":{
          "code": "default",
          "name": "Default"
        },
        "dt": "2018-07-26T11:46:17-0300"
      },
      "open_dt": "2018-08-03T23:20:35-0300",
      "status":{
        "code": "300",
        "name": "Oportunidad"
      },
      "desist":{
        "comments": "probando la api",
        "dt": "2018-08-09T13:51:08+0000",
        "user":{
          "id": "A5451D66-0D73-43DF-B418-24B4D104FE53",
          "integration_reference_code": "",
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Nombre Usuario"
        },
        "status":{
          "code": "5",
          "name": "Imposible de contactar"
        }
      }
      "origin":{
        "code": "59DFF18B",
        "name": "CAMPAÑA - CONTAC CENTER"
      },
      "suborigin":{
        "code": "DPNKKJED4CQCR4SW1",
        "name": "Llamado Entrante"
      },
      "created":{
        "dt": "2018-07-26T11:46:17-0300",
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "usuario"
        }
      },
      "modified":{
        "dt": "2018-08-09T09:43:16-0300",
        "user":{
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "usuario"
        }
      },
      "source":{
        "link": "",
        "mail_format": "",
        "publication_name": "",
        "type_code": 4
      },
      "reassign_qty": 0,
      "id": "6005B367-D9C9-4A90-AF73-F07BEF5B01EB",
      "contact_events_qty": 1,
      "converted_to_business_dt": "2018-08-03T23:20:35-0300",
      "last_priority_event_dt": "2018-08-03T23:20:35-0300",
      "prospect":{
        "id": "31612BAC-FE24-470F-966F-99DAD63992A9"
      }
    }
  }
}
Ejemplo de Respuesta con error (al cerrar/desistir un Lead que ya estaba cerrado)
{
  "ts": "1533747217",
  "_id": "3333",
  "result":{
    "status": "error",
    "aditional_data":[],
    "code": "business_error",
    "message": "No puede cerrarse el Lead, ya se encuentra cerrado"
  }
}
Control de Cambios
Fecha
Cambio
01 Diciembre 2018
Documento creado
Updated on 11/07/2024

### Crear comentario - API CRM
Crear comentario - API CRM
POST
/v1/welcomes/comments/create.php
Se utiliza para 
agregar
 un comentario a un Lead a partir del  
ID – Identificador Único en CRM PILOT
El comentario puede ser compartido con otro usuario
Parámetros para agregar un comentario a un Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (del Lead ) de CRM PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
comment
SI
texto  (4000)
“texto comentario”
Comentario que se asocia al Lead
header
Flowname
SequenceId
TimeStamp
TrackingId
access_token
SI
NO
SI
SI
SI
texto
número
TimeStamp
número
texto
“lead_comment_create”
Nombre descriptivo del servicio
Número de secuencia
Fecha del pedido
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Crear un Comentario No Link
curl --location --request GET '
https://api.pilotsolution.net/v1/welcomes/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
		"id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
		"comment": "Texto del nuevo comentario"
	},
	"header": {
		"FlowName": "lead_comment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo de solicitud para Crear un Comentario de tipo Link
curl --location --request GET '
https://api.pilotsolution.net/v1/welcomes/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
		"id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
                "comment": "{\"actions\":
                              [
                               {\"type\":\"link\",
                                \"icon\":\"o-clock\",
                                \"color\":\"blue\",
                                \"link\":\"
http://google.com
\",
                                \"text\":\"Abrirsistemaexterno\"
                               }
                             ],
                            \"comment\":
                             {\"text\":\"Hemos realizado la validacion de su compra.
                                                     Para ver el detalle siga el link\",
                             \"relevance\":\"low\"
                             }
                           }"
	      },
	"header": {
		"FlowName": "lead_comment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo de solicitud para Crear un Comentario en un Lead y compartirlo con otro usuario
curl --location --request GET '
https://api.pilotsolution.net/v1/welcomes/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
		"id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
		"comment": "Texto del nuevo comentario",
                "cc_user_id": "CE703666-4810-4B85-A8AF-4E1D6AD38HJE"
	},
	"header": {
		"FlowName": "lead_comment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud de agregado de un comentario a un lead Satisfactoria
{
  "ts": "1555338471",
  "_id": "13712",
  "result": {
    "status": "success",
    "aditional_data": []
  }
}
Ejemplo de Respuesta con error (al intentar aplicar un comentario a un Lead inexistente)
{
  "ts": "1549043448",
  "_id": "6737",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Lead D3263CCF-F425-4F6E-AD87-6DEFD183HYU7 not found "
  }
}
Control de Cambios
Fecha
Cambio
15 Abril 2019
Documento creado
18 Junio 2024
Envío de un link como comentario
Updated on 11/26/2025

### Eventos / Crear Evento - API CRM
Crear un evento - API CRM
POST
/v1/welcomes/events/create.php
Este servicio permite agregar un evento a un Lead.
Parámetros para agregar un evento a un Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI 
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (del Lead ) de CRM PILOT
event_type_code
SI
texto
Código del tipo de evento.
Tipos de evento disponibles:
47
: Contacto a Representante
48
: Contacto a Supervisor
49
: Solicitud de testdrive del usuario al que se le envía una copia del mensaje.
comment
SI
texto
El documento JSON que se coloca en la propiedad Comment del evento, no puede contener más de 3000 caracteres
header
Flowname
SequenceId
TimeStamp
TrackingId
access_token
SI
NO
SI
SI
SI
texto
número
TimeStamp
número
texto
“event_create”
Nombre descriptivo del servicio
Número de secuencia
Fecha del pedido
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Tipos de Eventos
Comentarios (ver Ejemplo de un evento Comentario - solicitud JSON)
Eventos con datos 
Un evento se expresa como un 
Documento JSON
 con información estructurada, que luego es tratada de manera específica por el front-end. 
Al Documento JSON se lo denomina COMPONENT y está tipificado. 
Component MAP
Un 
Componen MAP
, se utiliza  para enviar un evento que identifica una acción que sucede en una locación determinada. Debe ser geolocalizado,  enviando latitud y longitud del evento.
Datos de Evento
Valores de retorno para todos los servicios de prospecto
JSON
struct
comment
struct
Comentario
component
array
Colección de componentes del evento. Solo se puede enviar uno de cada tipo-
Componentes aceptados:
-map: mapa de geolocalización de eventos
Data del comentario
Data del comentario
comment
struct
text
string
Texto del comentario. Admite hasta 3000 caracteres
relevance
string
Resaltar el evento
Soporta "hight" y "normal".
En el caso de ser "hight" el front-end resalta el evento.
Dato componente MAP
component
struct
type
string
requerido
Flujo "map"
lat
number
requerido
Latitud
long
number
requerido
Longitud
Ejemplo de un evento Comentario - solicitud JSON
 {
"data": {
"id" : "D3263CCF-F425-4F6E-AD87-6DEFD1834523",
"event_type_code": "50",
"comment": "Hola este es un mensaje desde la api 010203"
},
"header": {
"FlowName": "event_create",
"SequenceId": [],
"TimeStamp": [],
"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
"access_token":"{{token}}"
}
} 
Ejemplo respuesta JSON
{ "ts": "1555340898",
"_id": "13713",
"result": {
"status": "success",
"aditional_data": [] } }
Ejemplo de un evento Tipo Comment - Estructura del documento JSON
{
            "comment": {
                "text": "Text comentario del evento",
                "relevance": 'normal|hight'
            },
            "components": [
                 {
                    "type": 'map',
                    "lat": -34.676398,
                    "long": -58.353870
                }
            ]
        }
}
Ejemplo solicitud JSON  de un evento tipo Comment - Componente MAP
{
	"data": {
		"id" : "D3263CCF-F425-4F6E-AD87-6DEFD1834523",
		"event_type_code": "50",
		"comment": {
                             "comment":{
                                         "text":"Text comentario del evento",
                                         "relevance":"normal"
                                       },
                             "components":[
                                           {
                                              "type":"map",
                                              "lat":-34.676398,
                                              "long":-58.35387
                                           }
                                          ]
                            }
	},
	"header": {
		"FlowName": "event_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Valores de retorno 
ts
timestrap
Fecha de la respuesta del servicio
id
numeric
result
struct
status
string
Estado de la respuesta: "success" o "error"
aditional_data
array
Información adicional
entitydata
struct
Sin datos
Ejemplo respuesta JSON
{ "ts": "1555340898", "_id": "13713",
"result": {
"status": "success",
"aditional_data": [] } }
Control de Cambios
Fecha
Cambio
15 Abril 2019
Documento creado
18 Junio 2024
Envío de un link como comentario
Updated on 07/19/2024

### Eventos / Listar Evento - API CRM
Listar Eventos - API CRM
POST
/v1/welcomes/events/list.php
Permite listar los eventos de un lead.
Los eventos pueden ser automáticos: creados por el sistema cuando el usuario realiza actividades o programáticos.
Parámetros
data
struct
required
id
string
Identificador del lead (GUID) del cual se quieren obtener los eventos
IMPORTANTE 
En caso que no se envie éste parametro la API retornara todos los eventos de leads
filter
array
Colección de valores posibles de filtro:
– welcome_event_code  – código de evento (consultar lista en los 
maestros
)
– welcome_event_dt – fecha del evento en formato ISO “2019-04-30T14:43:25.760”
sort
Ordenamiento del listado.
Los campos disponibles para filtro son:
– welcome_event_dt – fecha del evento
– welcome_event_code – tipo de evento
page
Página del paginado. Default 1
limit
Cantidad de registros por página. Default 25 – max 100
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Ejemplo de solicitud JSON
{
	"data": {
		"id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
		"filter": [
		   {
		      "field": "welcome_event_code",
		      "operation": "=",
		      "value": "4"
		   }
		 ],
	 	"sort": [
 		   {
		      "field": "welcome_event_dt",
		      "order": "DESC"
		   }
		 ],
		 "limit": 3,
		 "page": 1
	},
	"header": {
		"FlowName": "welcomes_event_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo de respuesta JSON
{
    "ts": "1565311506",
    "_id": "4320212",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 28,
            "rows_count": 28,
            "rows_per_page": 1,
            "rows_in_page": 1,
            "rows_remaining": 27
        },
        "entitydata": [
            {
                "id": "2847",
                "event_type_code": "46",
                "event_legend": "Administrador visualizó el Lead",
                "event_type_name": "Visualización de Lead",
                "event_type_icon": "fa-sign-out",
                "event_type_color": "#a2d367",
                "created": {
                    "user": {
                        "id": "3DC9B54F-4142-4009-86E1-FB7B8AE07D07",
                        "fullname": "Administrador"
                    },
                    "dt": "2019-08-05T17:39:48"
                }
            }
        ]
    }
}
Ejemplo de estructura error de respuesta JSON
{
  "ts": "1549043448",
  "_id": "6737",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Lead D3263CCF-F425-4F6E-AD87-6DEFD183HYU7 not found "
  }
}
Valores de retorno
ts
timestrap
Fecha de la respuesta del servicio
id
numeric
result
struct
status
string
Estado de la respuesta: "success" o "error"
aditional_data
array
Información adicional
entitydata
struct
Sin datos
Control de Cambios
Fecha
Cambio
29 Abril 2025
Documento creado
Updated on 01/29/2025

### Tareas / Crear una Tarea - API CRM
Crear una Tarea - API CRM
POST
/v1/welcomes/tasks/create.php
Crear tareas para un lead.
Importante: 
Un Lead puede tener una 
única
 tarea activa.
Cada Lead, es creado con una tarea de primer contacto, por defecto.
En ciertas operaciones el Lead puede quedar abierto sin tarea activa. En esos casos es necesario utilizar este endpoint para crear un seguimiento nuevo.
Solo se puede crear una tarea para un Lead cuando éste no tiene tareas activas pendientes.
Ejemplo solicitud JSON
 {
    "data": {
        "welcome_id": "A57B73A4-5EB4-47D3-80DD-77888263A155",
        "task_duedate": "2019-07-26",
        "task_duedate_time": "15:50",
        "task_owner_user_id": "6605C421-26AB-4E38-83A1-583A24886800",
        "task_type_code": "2",
        "task_comments": "Comentario para la tarea" 
    },
    "header": {
        "FlowName": "welcome_task_create",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
} 
Ejemplo respuesta JSON
 {
  "ts": "1555340898",
  "_id": "13713",
  "result": {
    "status": "success",
    "aditional_data": []
  }
} 
Ejemplo estructura error de respuesta JSON
 {
  "ts": "1549043453",
  "_id": "6738",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Event Type 50 not found"
  }
} 
Parámetros
data
struct
required
welcome_id
string
requerido
Identificador del lead
task_duedate
date
requerido
Fecha de vencimiento de la tarea en formato YYYY/MM/DD.
task_duedate_time
string
requerido
Hora de vencimiento de la tarea. Formato HH:MM
task_owner_user_id
string
requerido
ID del usuario asignado a la tarea
task_type_code
string
requerido
Tipo de tarea. Consultar en 
maestros
 con la clave “task_type”
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
 Número de sencuencia
TimeStamp
timestamp
Fecha del pedido
TrackingId
numeric
 Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
required
Fecha de la respuesta del servicio
id
numeric
result
struct
status
string
Estado de la respuesta: "success" o "error"
aditional_data
array
Información adicional
entitydata
struct
Sin datos

### Tareas / Cerrar y Crear Nueva Tarea - API CRM
Cerrar y Crear Nueva Tarea - API CRM
POST
/v1/welcomes/tasks/done.php
Se utiliza para 
cerrar una tarea de seguimiento en curso de un Lead y crear una nueva
Consideraciones
El Lead debe tener siempre una tarea de seguimiento activa. Sólo cuando se cierra el Lead, queda sin tarea.
Para consultar la tarea de seguimiento en curso de un Lead se debe acceder a éste por su ID – Identificador Único 
Ejemplo solicitud JSON
  {
    "data": {
        "welcome_id": "8C71E54F-609F-47CF-888D-BC0A3D76C9FE",
        "task_closere_code":"301",  // código del motivo de cierre de la tarea  consultar picklist 
        "task_closed_comments": "comentarios de cierre de la tarea",  // comentarios del cierre de la tarea 
        "new_task_type_code": "2",  // codigo del tipo de la nueva tarea a crear 
        "new_task_owner_user_id": "6605C421-26AB-4E38-83A1-583A24886800", // usuario asignado a la nueva tarea
        "new_task_comments":"comentario nueva tarea", // comentarios de la nueva tarea
        "new_task_duedate": "2019-09-25",  // fecha de vencimiento de la nueva tarea YYYY-MM-DD
        "new_task_duedate_time": "12:08"  // hora de vencimiento de la nueva tarea  HH:MM
    },
    "header": {
        "FlowName": "welcome_task_done",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
} 
Ejemplo respuesta JSON
   {
  "ts": "1555340898",
  "_id": "13713",
  "result": {
    "status": "success",
    "aditional_data": []
  }
} 
Ejemplo estructura error de respuesta JSON
{
  "ts": "1549043453",
  "_id": "6738",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Event Type 50 not found"
  }
}
Parámetros
data
struct
required
welcome_id
string
requerido
Identificador del lead
task_closere_code
date
requerido
Código del Motivo de cierre de la tarea actualmente activa ( 
picklist
 )
task_closed_comments
string
Comentario de cierre de la tarea
new_task_duedate
date
requerido
Fecha de vencimiento de la tarea en formato YYYY/MM/DD.
new_task_duedate_time
string
requerido
Hora de vencimiento de la tarea. Formato HH:MM
new_task_owner_user_id
string
requerido
ID del usuario asignado a la tarea
new_task_type_code
string
requerido
Tipo de tarea. Consultar en 
maestros
 con la clave “task_type”
new_task_comments
string
 Comentarios de seguimiento para la tarea
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
 Número de secuencia
TimeStamp
timestamp
Fecha del pedido
TrackingId
numeric
 Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
required
Fecha de la respuesta del servicio
id
numeric
result
struct
status
string
Estado de la respuesta: "success" o "error"
aditional_data
array
Información adicional
entitydata
struct
Sin datos
Updated on 04/09/2025

### Tareas / Listar las Tareas - API CRM
Listar las tareas del lead - API CRM
POST
/v1/welcomes/tasks/list.php
Ejemplo solicitud JSON
{
    "data": {
        "id": "F470F7FA-F1D7-4289-8BA7-F486A3B000F3",   // id del lead 
        "filters": [   // filtros - opcionales 
            {
                "field": "status_code",  // código del estado de la tarea - consultar el listado en maestros
                "operation": "=",
                "value": "1"
            }
        ],
        "sort": [ // orden del listado - opcional 
            {
                "field": "task_id",  // campos disponibles: status_code | task_id
                "order": "ASC"
            }
        ],
        "limit": 20,  // default 25 
        "page": 1
    },
    "header": {
        "FlowName": "welcome_task_active",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Ejemplo respuesta JSON
{ "ts": "1565315724", "_id": "4320486", "result": { "status": "success", "aditional_data": { "page": 1, "page_count": 0, "rows_count": 1, "rows_per_page": 20, "rows_in_page": 1, "rows_remaining": 0 }, "entitydata": [ { "id": "13328", "status": { "code": "1", "name": "Pendiente" }, "type": { "code": "PRI", "name": "Primer Contacto" }, "contact_type": { "code": "EN", "name": "Entrevista" }, "icon": "fa fa-user-plus", "interest_level": { "code": null, "name": null }, "color": "#d84a38", "duedate": "2019-08-08T18:00:00+0000", "comments": "Tarea de seguimiento", "prospect": { "id": "A56DEE20-26AD-4BEB-8C93-C54FFC624E5B", "firstname": "alejandro ", "lastname": "martinez", "phone": "", "email": "amartinez-fer@hotmail.com", "cellphone": "099359050" }, "owner_user": { "id": "D67E06A3-2AC0-439A-9981-FEB2CCED08C0", "fullname": "Vendedor Uno" }, "closed_comments": null, "closed_reason": { "code": null, "name": null }, "created": { "user": { "id": "D67E06A3-2AC0-439A-9981-FEB2CCED08C0", "fullname": "Vendedor Uno" }, "dt": "2019-08-08T16:47:54+0000" }, "modified": { "user": { "id": null, "fullname": null }, "dt": null }, "closed": { "user": { "id": null, "fullname": null }, "dt": null } } ] } }
Ejemplo estructura error de respuesta JSON
{
  "ts": "1549043453",
  "_id": "6738",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Event Type 50 not found"
  }
}
Valores de retorno
ts
timestamp
Fecha de la respuesta del servicio
id
numeric
result
struct
status
string
Estado de la respuesta: "success" o "error"
aditional_data
array
Información adicional
entitydata
struct
Sin datos
Updated on 04/25/2024

### Análisis de Necesidades - API CRM
Análisis de Necesidades - API CRM
POST
/v1/analysis/list.php
Este servicio permite listar un conjunto de análisis de necesidad de un lead.
La solicitud para listar los análisis de necesidad puede ser referida a todos los análisis de necesidad  (no se aplica ningún filtro) o bien al conjunto de análisis de necesidad que cumplen con alguno de los siguientes filtros:
welcome_guid :
 Identificador único del prospecto en 
CRM PILOT
 – Ej.: “CF30600E-020B-4CE9-9DCA-5B6A915AF153”
analysis_guid :
 Identificador único del análisis de necesidad en 
CRM PILOT
 – Ej.: “8A724825-D81A-4E4B-ACAB-EF40E81313BB”
form_guid :
 Identificador único del formulario en 
CRM PILOT
 – Ej.: “4E0C7399-41FF-4D8E-A4F6-7”
Parámetros para listar un conjunto de encuestas ‘análisis de necesidades’
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
data
        filters
field
value
SINO
NO
NO
estructuraestructura
texto
texto
“welcome_guid”
“CF30600E-020B-4CE9-9DCA-5B6A915AF153”
Si no se indicara ningún filtro, la selección aplica a todas las encuestas
Nombre del campo por el que se selecciona
Valores posibles:
welcome_guid
 : Identificador único del prospecto en 
CRM PILOT
analysis_guid : Identificador único de versión de analysis en 
CRM PILOT
form_guid
 : Identificador único del formulario en 
CRM PILOT
header
SequenceId
TimeStamp
access_token
SI
SI
SI
estructura
texto
timestamp
texto
“list_analysis”
“1513352637”
“{{token}}”
Nombre descriptivo del servicio
Fecha de la solicitud
Token válido de 
autorización
Valores de retorno
Nombre del Parámetro
Tipo
Comentario
entity_data
id
form_id
form_code
form_name
form_guid
welcome_id
welcome_guid
deleted
comments
analysis_guid
created_dt
created_user_id
created_user_name
modified_dt
modified_user_id
modified_user_name
estructura
número
número
texto
texto
texto  (de 32 bits en formato GUID)
número
texto  (de 32 bits en formato GUID)
flag
texto
texto  (de 32 bits en formato GUID)
fecha
número
texto
fecha
número
texto
 Agrupa información general del análisis de necesidadIdentificador interno del análisis de necesidad
Identificador interno del formulario
Código del formulario
Nombre del formulario
Identificador único (del formulario) de CRM PILOT
Identificador interno del lead
Identificador único (del prospecto) de CRM PILOT
Identifica que la encuesta está activa: 0 = Encuesta activa / 1 = Encuesta no activa.  Uso interno
Comentarios generales acerca de la encuesta
Identificador único (de la encuesta) de CRM PILOT
Fecha de creación de la encuesta
Identificador del usuario que creó la encuesta
Nombre & Apellido del usuario que creó la encuesta
Fecha de última actualización de la encuesta
Identificador del último usuario que actualizó la encuesta
Nombre & Apellido del último usuario que actualizó la encuesta
given_answers
id
analysis_id
question_id
question_count_for_complete_flag
question_code
question_text
question_required
answered_id
text
weight
audit_dt
audit_usr
estructuranúmero
número
número
flag
texto
texto
flag
número
texto
número
fecha
texto
 Se repite tantas veces como preguntas se hayan realizadoIdentificador interno de la pregunta
Identificador del item de análisis de necesidad
identificador de  la pregunta
Indica si la pregunta  fue respondida: 0 = No respondida / 1 = Respondida
Código de la pregunta
Pregunta
Indica si la pregunta es mandatoria: 0 = No mandatoria / 1 = Mandatoria
ID de la opción de respuesta (Ej. 4)
Referencia de la respuesta (Ej. Buena)
Peso ponderado de la pregunta ( no se usa en general)
Auditoría de cambios Fecha y Hora
Auditoría de cambios usuario
Ejemplo de solicitud para listar todas las encuestas de análisis de necesidad
curl --location --request POST '
https://api.pilotsolution.net/v1/analysis/list.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
    "data":{
    },
    "header":{
        "FlowName": "list_prospect",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Respuesta a la Solicitud
"_id": "246786227",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 6,
            "rows_per_page": 25,
            "rows_in_page": 6,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": 18,
                "form_id": 1,
                "form_code": "DEFAULT_Homologación",
                "form_name": "Análisis de Necesidades Pilot Default",
                "form_guid": "93158761-4B45-42FC-AF48-22110F9898B0",
                "welcome_id": 328,
                "welcome_guid": "388BE6F0-C2C3-47DE-9B40-E4713C03696A",
                "deleted": 0,
                "comments": "_autogenerated_",
                "analisys_guid": "EA00210E-AE5D-4E18-894A-9901CD7536A2",
                "created_dt": "2019-09-26T14:30:10.003",
                "created_user_id": 11535,
                "created_user_name": "Admin Homologacion",
                "modified_dt": null,
                "modified_user_id": null,
                "modified_user_name": null,
                "given_answers": [
                    {
                        "id": 171,
                        "analisys_id": 18,
                        "question_id": 5,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q5",
                        "question_text": "Marca auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "fiat",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 172,
                        "analisys_id": 18,
                        "question_id": 6,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q6",
                        "question_text": "Modelo auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "uno",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 173,
                        "analisys_id": 18,
                        "question_id": 7,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q7",
                        "question_text": "Año auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "2010",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 174,
                        "analisys_id": 18,
                        "question_id": 8,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q8",
                        "question_text": "Kilómetros auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "200000",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                    {
                        "id": 175,
                        "analisys_id": 18,
                        "question_id": 1,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q1",
                        "question_text": "Motivo del análisis",
                        "question_required": "0",
                        "answer_id": 1,
                        "text": "Trabajo",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                ]
            },
            {
                "id": 17,
                "form_id": 1,
                "form_code": "DEFAULT_Homologación",
                "form_name": "Análisis de Necesidades Pilot Default",
                "form_guid": "93158761-4B45-42FC-AF48-22110F9898B0",
                "welcome_id": 56,
                "welcome_guid": "31862BE8-A000-4F5D-858F-5EF1DAC3D87D",
                "deleted": 0,
                "comments": "_autogenerated_",
                "analisys_guid": "AA0923F1-D175-489C-9C3D-D8FDC05BC8DC",
                "created_dt": "2019-09-26T14:30:09.993",
                "created_user_id": 11535,
                "created_user_name": "Admin Homologacion",
                "modified_dt": null,
                "modified_user_id": null,
                "modified_user_name": null,
                "given_answers": [
                    {
                        "id": 161,
                        "analisys_id": 17,
                        "question_id": 5,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q5",
                        "question_text": "Marca auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": null,
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:09.993",
                        "audit_usr": 11535
                    },
                    {
                        "id": 162,
                        "analisys_id": 17,
                        "question_id": 6,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q6",
                        "question_text": "Modelo auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": null,
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:09.993",
                        "audit_usr": 11535
                    },
                    {
                        "id": 163,
                        "analisys_id": 17,
                        "question_id": 7,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q7",
                        "question_text": "Año auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "0",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:09.993",
                        "audit_usr": 11535
                    },
                    {
                        "id": 164,
                        "analisys_id": 17,
                        "question_id": 8,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q8",
                        "question_text": "Kilómetros auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "0",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:09.997",
                        "audit_usr": 11535
                    }         
        ]
    }
}
{
    "ts": "1516902981",
    "_id": "1485415",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": true
        }
    }
}
Ejemplo de solicitud para listar la encuesta de necesidad de un prospecto en particular – 
welcome_guid
curl --location --request POST '
https://api.pilotsolution.net/v1/analysis/list.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
    "data":{
       "filters":[
           {
               "field":"welcome_guid",
               "value":"388BE6F0-C2C3-47DE-9B40-E4713C03696A"
           }
       ]
    },
    "header":{
        "FlowName": "list_prospect",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud de encuesta de necesidad de un prospecto en particular [welcome_guid*
"ts": "1680808514",
    "_id": "246866411",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 25,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": 18,
                "form_id": 1,
                "form_code": "DEFAULT_Homologación",
                "form_name": "Análisis de Necesidades Pilot Default",
                "form_guid": "93158761-4B45-42FC-AF48-22110F9898B0",
                "welcome_id": 328,
                "welcome_guid": "388BE6F0-C2C3-47DE-9B40-E4713C03696A",
                "deleted": 0,
                "comments": "_autogenerated_",
                "analisys_guid": "EA00210E-AE5D-4E18-894A-9901CD7536A2",
                "created_dt": "2019-09-26T14:30:10.003",
                "created_user_id": 11535,
                "created_user_name": "Admin Homologacion",
                "modified_dt": null,
                "modified_user_id": null,
                "modified_user_name": null,
                "given_answers": [
                    {
                        "id": 171,
                        "analisys_id": 18,
                        "question_id": 5,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q5",
                        "question_text": "Marca auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "fiat",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 172,
                        "analisys_id": 18,
                        "question_id": 6,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q6",
                        "question_text": "Modelo auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "uno",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 173,
                        "analisys_id": 18,
                        "question_id": 7,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q7",
                        "question_text": "Año auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "2010",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.003",
                        "audit_usr": 11535
                    },
                    {
                        "id": 174,
                        "analisys_id": 18,
                        "question_id": 8,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q8",
                        "question_text": "Kilómetros auto actual",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "200000",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                    {
                        "id": 175,
                        "analisys_id": 18,
                        "question_id": 1,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q1",
                        "question_text": "Motivo del análisis",
                        "question_required": "0",
                        "answer_id": 1,
                        "text": "Trabajo",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                    {
                        "id": 176,
                        "analisys_id": 18,
                        "question_id": 3,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q3",
                        "question_text": "Exp. con nuestra marca",
                        "question_required": "0",
                        "answer_id": 4,
                        "text": "Buena",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                    {
                        "id": 177,
                        "analisys_id": 18,
                        "question_id": 9,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q9",
                        "question_text": "Necesita crédito",
                        "question_required": "0",
                        "answer_id": 10,
                        "text": "No",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.007",
                        "audit_usr": 11535
                    },
                    {
                        "id": 178,
                        "analisys_id": 18,
                        "question_id": 10,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q10",
                        "question_text": "Expectativas generales",
                        "question_required": "0",
                        "answer_id": null,
                        "text": null,
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.010",
                        "audit_usr": 11535
                    },
                    {
                        "id": 179,
                        "analisys_id": 18,
                        "question_id": 4,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q4",
                        "question_text": "Tiene auto actual?",
                        "question_required": "0",
                        "answer_id": 7,
                        "text": "Si",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.010",
                        "audit_usr": 11535
                    },
                    {
                        "id": 180,
                        "analisys_id": 18,
                        "question_id": 2,
                        "question_count_for_complete_flag": "1",
                        "question_code": "Q2",
                        "question_text": "Intención de cierre",
                        "question_required": "0",
                        "answer_id": null,
                        "text": "2019-06-28",
                        "weight": 0,
                        "audit_dt": "2019-09-26T14:30:10.010",
                        "audit_usr": 11535
                    }
                ]
            }
        ]
    }
}
Control de Cambios
Fecha
Cambio
6 Abril 2023
Documento creado
Updated on 11/26/2025

### Grupo de captura / Listar - API CRM
Listar  - API CRM
POST
/v1/users/read.php
Este servicio permite:
listar los grupos de captura de la instancia en curso
Parámetro para listar los grupos de captura de la instancia en curso
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
data
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
NO
NO
NO
SI
texto
texto
número
timestamp
texto
texto
[ ]
“List_hunt_groups”
[ ]
[ ]
” ”
“{{token}}”
no se declara información alguna
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Resultado de la solicitud – Parámetros
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ts
SI
timestamp
fecha en la que se aplica la asignación
_id
NO
texto
result
status
aditional_data
entitydata
SI
NO
NO
texto
texto
texto
Indica si la solicitud fue correcta o errónea
Valores Posibles:
 success – error
Ejemplo de solicitud para Listar los Grupos de Captura
 curl --location --request GET '
https://api.pilotsolution.net/v1/users/list_hunt_groups.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
"data": {
},
"header": {
"FlowName": "Lists_hunt_groups",
"SequenceId": [],
"TimeStamp": [],
"TrackingId": "3462ACEB-E4A3-4976-AFDA-5F52C34AABAA",
"access_token":"{{token}}"
}
}
Respuesta a Solicitud de Lista de Grupo de captura Satisfactoria
{
    "ts": "1677510717",
    "_id": "237819649",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": [
            {
                "role_id": "9101",
                "role_name": "CarNow",
                "role_description": "Vendedor 1",
                "count_users": 1
            },
            {
                "role_id": "9102",
                "role_name": "Grupo 2",
                "role_description": "vendedor 2",
                "count_users": 1
            },
        ]
    }
}
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Grupo de captura / Asignar usuario - API CRM
Asignar a un usuario o grupo de captura - API CRM
POST
/v1/welcomes/assign.php
Se utiliza para asignar un Lead a un usuario (comercial) o a un grupo de captura (conjunto de usuarios (comerciales).
Parámetro para asignar un Lead a un usuario o a un grupo de captura,  en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (del lead ) en CRM PILOT sobre el que  ocurrió la asignación. Es el valor que se recibe en el mensaje de creación del Lead  enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
to_entity_id
SI
texto
Si es a un usuario: 
409F0198-51AC-4B78-9BEF-CF2B22DAF400
Si es a un grupo de captura:
 9797
Identificador del usuario o grupo de captura al que se quiere asignar el lead.Un 
grupo de captura
 es un grupo de usuarios (uno o más usuarios) que pueden recibir un lead, según su orden de secuencia (turno de asignación). CRM PILOT es el encargado de verificar el turno de asignación. El Identificador de grupo se corresponde al role_id – ver  
Grupo de captura/Listar “
to_type
SI
texto
“huntGroup”
Tipo de entidad que se le asigna al usuario
Valores posibles:
“user”
, cuando se asigna el lead a un usuario (comercial)
“huntGroup”
, cuando se asigna el lead a un grupo de captura.
comment
NO
texto
Comentario referido a la asignación del lead a un usuario o grupo de captura
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
texto
número
timestamp
texto
texto
“update_prospect”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Resultado de la solicitud – Parámetros
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ts
SI
timestamp
fecha en la que se aplica la asignación
_id
NO
texto
result
status
aditional_data
entitydata
SI
NO
NO
texto
texto
flag
Indica si la solicitud fue correcta o errónea
Valores Posibles:
 success – error
Ejemplo de solicitud para Asignar un Lead a un usuario
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/assign.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
	"data": {
        "id": "7E0D5C27-A53B-4CFC-819B-6DBF1431CF12",
        "to_entity_id": "3B0E5C13-A53B-4CFC-819B-6DBF1431CF23",
        "to_type": "user"
        "comment": "Algun comentario"
	},
	"header": {
		"FlowName": "assign_lead",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud de asignación de un Lead a un usuario Satisfactoria
{
    "ts": "1516902981",
    "_id": "1485415",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": true
        }
    }
}
Ejemplo de solicitud para Asignar un Lead a un Grupo de Captura
 curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/assign.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
"data": {
        "comment": "Asignación al usuario que le corresponda en secuencia en el Grupo de Captura 9101 - ",
        "id": "3462ACEB-E4A3-4976-AFDA-5F52C34AABAA",
        "to_entity_id": "9101",
        "to_type": "huntGroup",
"reactivate":0
},
"header": {
"FlowName": "lead_assign_to_huntgroup",
"SequenceId": [],
"TimeStamp": [],
"TrackingId": "3462ACEB-E4A3-4976-AFDA-5F52C34AABAA",
"access_token":"{{token}}"
}
} 
Respuesta a Solicitud de asignación de un Lead a un Grupo de Captura  Satisfactoria
{
    "ts": "1516902981",
    "_id": "1485415",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": true
        }
    }
}
Ejemplo de Respuesta con error (al intentar asignar un Lead a un usuario o Grupo de Captura)
 {
"ts": "1494623926",
"_id": "5405",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "Lead was not assigned"
}
} 
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Calificación / Bad Lead - API CRM
Calificación – Bad Lead - API CRM
POST
/v1/welcomes/qualification/bad.php
Se utiliza para calificar un Lead/Prospecto  a partir de su ID – Identificador Único en CRM PILOT como Bad Lead
Bad Lead 
refiere a un 
contacto spam con el cual no se avanzará en la prospección.
Nota:
 Como resultado de la ejecución de esta API, se actualiza el campo bad_flag = 1
Parámetro para calificar a un lead/prospecto en CRM PILOT como Bad Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único (del Lead/Prospecto) de CRM PILOT sobre la que se aplica  la operación de calificación. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al Lead en CRM PILOT.
desist_status_code
SI
texto
bad_lead
Código de Motivo de Cierre calificado como a aplicar sobre un contacto no viable (bad lead)Los valores para este campo se obtienen consultando el dato maestro 
bad_lead_status  
Ver más
desists_coments
SI
texto
imposible de establecer un contacto
Comentario que describe la o las razones por las cuales se decide calificar al contacto como ‘bad lead’
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
textonúmero
timestamp
texto
texto
“lead_bad_close”1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Actualizar un lead/prospecto
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/quealification/bad.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
    "data": {
       "id": "E63E338B-106E-4A68-AA56-551FA638601D",
       "desist_status_code": "bad_lead",
       "desist_comments": "soy un comentario de cierre - criss"
    },
    "header": {
        "FlowName": "Lead_bad_close",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
  }
}
Respuesta a Solicitud Calificación Bad Lead de un lead/prospecto Satisfactoria   
Especificación de la entidad “lead/prospecto”
"ts": "1706304530",
    "_id": "33311063",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "60F4F377-EB9D-4A8F-BC25-669B9E318A5C",
            "status": {
                "code": "400",
                "name": "Cerrado"
            },
            "origin": {
                "code": "fabrica_mbenz_ar",
                "name": "OTRO CRM"
            },
            "suborigin": {
                "code": "EPNO14E001FA6VMDC",
                "name": "CarNow"
            },
            "business_type": {
                "name": "0 Km",
                "code": "convencional"
            },
            "publication_name": "",
            "interest_level": {
                "code": null,
                "name": null,
                "color": null
            },
            "contact_type": {
                "name": "Electronico",
                "code": "1"
            },
            "asigned": {
                "user": {
                    "id": "45A51A5E-8D6C-406E-8A2A-93E14B90E62B",
                    "fullname": "Car Now",
                    "user_integration_reference_code": ""
                },
                "branch": {
                    "code": "default",
                    "name": "Casa Central"
                },
                "dt": "2024-01-26T14:06:00+0000"
            },
            "welcome_notifications_opt_in_consent_flag": "0",
            "welcome_publicity_opt_in_consent_flag": "0",
            "product_of_interest": "",
            "notes": "COMENTARIO: Credit Rating: Not AvailableTranscript: 
http://app.carnow.com/da/he5dj8prfwkn2Lcc
 VEHICULO DE INTERES: Kia Rio LX 2021 
 CIUDAD: Envigado - REGION: ANT - PAIS: US",
            "open_dt": null,
            "contact_events_qty": 0,
            "reassign_qty": 0,
            "prospect_repeated_qty": "1",
            "created": {
                "user": {
                    "fullname": "Marcela Molero"
                },
                "dt": "2024-01-26T14:06:00+0000"
            },
            "modified": {
                "user": {
                    "fullname": "Api Consultas"
                },
                "dt": "2024-01-26T21:28:49+0000"
            },
            "prospect": {
                "id": "7D4F033C-8316-47FA-B9C8-38CEAB7B88B7",
                "company": "",
                "firstname": "Mila",
                "lastname": "Reyes",
                "second_lastname": "",
                "phone": "",
                "email": "email@gmail.com",
                "cellphone": "",
                "tracking_id": ""
            },
            "desist": {
                "dt": "2024-01-26T21:28:48+0000",
                "comments": "soy un comentario de cierre - criss",
                "status": {
                    "name": "Bad Lead"
                },
                "user": {
                    "fullname": "Api Consultas"
                }
            },
            "mercadolibre": {
                "hasOrder": 0,
                "color": "#fff074",
                "orders_status": null
            },
            "delay_color": "#544f4f",
            "opportunity": [],
            "bad_flag": 1,
            "won_flag": 0
        }
    }
}
Ejemplo de Respuesta con error (al intentar calificar un lead que ya ha sido declarado como Bad Lead)
 {
"ts": "1495546597",
"_id": "6145",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "El Lead ya se encuentra cerrado"
}
} 
Control de Cambios
Fecha
Cambio
20 Diciembre 2023
Documento creado
Updated on 11/26/2025

### Calificación / Good Lead - API CRM
Calificación – Good Lead - API CRM
POST
/v1/welcomes/qualification/good.php
Se utiliza para calificar a un Lead/Prospecto  a partir de su ID – Identificador Único en CRM PILOT como Good Lead
Good Lead refiere a un prospecto que muestra una necesidad o interés inicial en los productos o servicios y tiene mayor probabilidad
 de convertirse en un cliente. 
Nota:
 Como resultado de la ejecución de esta API, se actualiza el campo bad_flag = 0
Parámetro para calificar a un lead/prospecto en CRM PILOT como Good Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único (del Lead/Prospecto) de CRM PILOT sobre la que se aplica  la operación de calificación. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al Lead en CRM PILOT.
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
textonúmero
timestamp
texto
texto
“lead_good”1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Calificar un lead/prospecto como Good Lead
curl --location --request POST '
https://api.pilotsolution.net/v1/welcomes/quealification/good.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
  "data": {
    "id":"5E10E873-E392-49F6-89BD-9A8ABBD6638A",
  },
  "header": {
    "FlowName": "lead_good",
    "SequenceId": 1,
    "TimeStamp":1493991052,
    "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
    "access_token":"{{token}}"
  }
}
Respuesta a Solicitud Calificación Good Lead de un lead/prospecto 
Satisfactoria
Especificación de la entidad “lead/prospecto”
{
    "ts": "1706301596",
    "_id": "33300939",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "879D17BA-EA80-4236-8B8E-A352A0323D9E",
            "status": {
                "code": "100",
                "name": "Sin Gestion"
            },
            "origin": {
                "code": "fabrica_mbenz_ar",
                "name": "OTRO CRM"
            },
            "suborigin": {
                "code": "EPNO14E001FA6VMDC",
                "name": "CarNow"
            },
            "business_type": {
                "name": "0 Km",
                "code": "convencional"
            },
            "publication_name": "",
            "interest_level": {
                "code": null,
                "name": null,
                "color": null
            },
            "contact_type": {
                "name": "Electronico",
                "code": "1"
            },
            "asigned": {
                "user": {
                    "id": "45A51A5E-8D6C-406E-8A2A-93E14B90E62B",
                    "fullname": "Car Now",
                    "user_integration_reference_code": ""
                },
                "branch": {
                    "code": "default",
                    "name": "Casa Central"
                },
                "dt": "2024-01-26T15:55:55+0000"
            },
            "welcome_notifications_opt_in_consent_flag": "0",
            "welcome_publicity_opt_in_consent_flag": "0",
            "product_of_interest": "",
            "notes": "COMENTARIO: Credit Rating: Not AvailableTranscript: 
http://app.carnow.com/da/devgjIa2mnm4iImI
 VEHICULO DE INTERES: Kia Rio LX 2021 
 CIUDAD: Sabaneta - REGION: SAN - PAIS: US",
            "open_dt": null,
            "contact_events_qty": 0,
            "reassign_qty": 0,
            "prospect_repeated_qty": "1",
            "created": {
                "user": {
                    "fullname": "Marcela Molero"
                },
                "dt": "2024-01-26T15:55:55+0000"
            },
            "modified": {
                "user": {
                    "fullname": "Api Consultas"
                },
                "dt": "2024-01-26T20:39:55+0000"
            },
            "prospect": {
                "id": "507A85A4-824B-432A-91F6-4F4728584CEE",
                "company": "",
                "firstname": "Juan",
                "lastname": "Miller",
                "second_lastname": "",
                "phone": "1026547854",
                "email": "",
                "cellphone": "1026547854",
                "tracking_id": ""
            },
            "desist": {
                "dt": null,
                "comments": null,
                "status": {
                    "name": null
                },
                "user": {
                    "fullname": null
                }
            },
            "next_task": {
                "id": "1176",
                "owner_user_id": "45A51A5E-8D6C-406E-8A2A-93E14B90E62B",
                "duedate_dt": "2024-01-26T17:00:00+0000",
                "isoverdue": 1,
                "task_type_code": "PRI",
                "task_type": "Primer Contacto",
                "type_icon": "fa fa-user-plus",
                "color": "#d84a38"
            },
            "mercadolibre": {
                "hasOrder": 0,
                "color": "#fff074",
                "orders_status": null
            },
            "delay_color": "#544f4f",
            "opportunity": [],
            "bad_flag": 0,
            "won_flag": null
        }
    }
}
Ejemplo de Respuesta con 
error
 (al intentar calificar un lead que ya ha sido declarado com Good Lead)
 {
"ts": "1495546597",
"_id": "6145",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "El Lead ya se encuentra calificado"
}
} 
Control de Cambios
Fecha
Cambio
26 Enero 2024
Documento creado
Updated on 11/26/2025

## Ofertas - API CRM
Ofertas - API CRM

### Entidad Oferta - API CRM
Entidad Oferta - API CRM
Valores de retorno para todos los servicios de Opportunities
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
Identificador único (de la Oportunidad – Presupuesto) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la unidad.
exchange_rate_amt
número (18,2)
Valor de la tasa de conversión de moneda (el día en el que se cotiza)
payment_methods
trade_in_car
color
comments
domain
brand
model
version
value_amt
year
kms
inspection_number
inspection_user
repairment_cost_amt
estimate_sale_amt
profitability_percentaje
reserve_amt
cash_amt
credit
credit_amt
bank
rate
shares
shares_amt
insurance_amt
status_dt
reward_amt
reward_substract_from_total
total_transaction_amt 
expenses_amt 
cash_reserve_amt
cash_reserve_dt
discount 
reinforcement_payment_dt
estructura
estructura
texto (100)
texto (4000)
texto (10)
texto (50)
texto (50)
texto (100)
número (18,2)
texto
texto
texto
texto
número (18,2)
número (18,2)
número
número (18,2)
número (18,2)
estructura
número (18,2)
texto
texto
texto
número (18,2)
número (18,2)
fecha
número (18,2)
flag
número (18,2)
número (18,2)
número (18,2)
fecha
número
fecha
Estructura que agrupa información vinculada al pago del  vehículo
Estructura que describe la retoma del vehículo
Color
Comentarios de la retoma del usado
Dominio del vehículo (chapa patente)
Marca
Modelo
Versión
Valor de toma del vehículo (Sin separador de miles)
Año de fabricación del vehículo
Odómetro del vehículo
Número de inspección del vehículo para la toma
Apellido Nombre del perito
Costo de reparación de la unidad (Sin separador de miles)
Valor de venta estimado (Sin separador de miles)
Porcentaje bruto de ganancia calculado
Monto total en efectivo de la reserva, entregado por el cliente (Sin separador de miles)
Monto a pagar en efectivo, entregado por el cliente (Sin separador de mils)
Estructura que describe el Crédito tomado por el cliente  para la compra
Monto del crédito que se otorga para la compra. (Sin separador de miles)
Banco emisor del crédito
Interés del crédito en porcentaje absoluto
Cantidad de cuotas del crédito Ej 36
Valor de cuota del crédito.  (Sin separador de miles)
Monto del seguro del crédito. (Sin separador de miles)
Fecha del último cambio realizado en el estado del crédito
    NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Premio por la colocación de la financiación. (Sin separador de miles)
Flag que indica si el monto del premio fue usado como bonificación para la venta
    Valores posibles:
 0 = No aplicado como bono ; 1 = Aplicado como bono
Monto total en efectivo de la reserva, entregado por el cliente (Sin separador de miles)
Monto total de los gastos de compra. Ej flete, formularios, registro del vehículo, etc. (Sin separador de miles)
Monto total en efectivo de la reserva, entregado por el cliente (Sin separador de miles)
Fecha de pago efectivo de la reserva
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Descuento %
Fecha de pago del refuerzo del anticipo por la operación
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
integration_reference_code
texto (500)
Código de referencia de la oportunidad en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada oportunidad:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las oportunidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declararse.
prospect
id
estructura
texto  (de 32 bits en formato GUID)
Estructura que informa acerca del prospect
Identificador único del Prospecto (de PILOT) asociado al Lead que originó la venta
customer
id
name
estructura
texto  (de 32 bits en formato GUID)
texto (100)
Estructura que informa acerca del cliente
Identificador único del cliente a facturar (de PILOT) 
(*)
(*) 
Con el guid se puede consultar el cliente en el endpoint de 
clientes
Razón Social
vehicle
texto
sale_quoted_stock_guid
texto
sale_status
code
name
sale_status_color
estructura
texto (50)
texto (50)
texto (10)
Estructura que brinda información acerca del estado de la venta
Código del estado de la venta
Nombre del estado de la venta 
(*)
Color que identifica el estado de la venta
(*) NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
sales_status
Ver más
type
code
name
estructura
texto (50)
texto (50)
Estructura que describe el Tipo de Venta
Código de  tipo de la venta  Ej Menudeo; Flotila; …
Nombre del tipo de la venta
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
sales_type
Ver más
representative
id
integration_reference_code
name
fullname
estructura
texto  (de 32 bits en formato GUID)
texto (500)
texto (100)
texto (250)
Estructura que describe al Representante de venta
Identificador único (de PILOT) del representante de la venta
Código del usuario en el sistema integrado
Email del usuario
Nombre completo del usuario
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
users
Ver más
branch
code
name
estructura
texto (50)
texto (100)
Representa la Sucursal / Punto de VentaCódigo de la Sucursal / Punto de VentaNombre de la Sucursal / Punto de Venta
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
branches 
Ver más
business_type
id
code
name
estructura
texto
texto (50)
texto (50)
Estructura que describe el Tipo de Negocio
Código del tipo de negocio
Nombre del tipo de negocio
NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
business_type
Ver más
product
code
name
comercial_condition
rep_authorized_discount
model
code
name
brand
code
name
observations
valid_date
estructura
texto (50)
texto (50)
número (18,2)
texto
estructura
texto (50)
texto (50)
estructura
texto (50)
texto (50)
texto (4000)
fecha
Describe las características del producto según la lista de precios
Código del vehículo
Nombre del vehículo
Condición comercial (sin separador de miles) (es un descuento)
Descuento Máximo Autorizado %
Describe Modelo del vehículo
Código del modelo
Nombre del modelo
Describe Marca del vehículo
Código de la marca
Nombre de la marca
Indica particularidades de la venta del vehículo. Ej: Interés en accesorios, versiones, accesorios bonificados
Fecha de vigencia del precio de lista
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
product_quotation
domain
brand
model
version
estructura
texto (10)
texto (50)
texto (50)
texto (50)
Producto ofertado
Dominio
Marca
Modelo
Versión
value
número (18,2)
 Precio de Lista
comission
amt
date
estructura
número (18,2)
fecha
Estructura que refiere a la Comisión del Vendedor
Monto de la comisión del vendedor (Sin separador de miles)
Fecha de cobro de la comisión
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
vehicle_registration_plate_by
code
name
 estructura
texto (50)
texto (50)
Estructura que agrupa información de registro del vehículo
Código que indica quién realiza el registro del vehículo
Descripción del registrante del vehículo
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
vehicle_registration_plate_by 
Ver más
approximate_vehicle_registration_plate_date
mm
Mes previsto de patentamiento
approximate_delivery_date
 fecha
Fecha aproximada/comprometida de entrega con el cliente
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
desist
reason
subreason
comments
dt
user
estructura
texto
texto
texto
fecha
texto
status
code
name
estructura
texto (50)
texto (50)
Estructura en la que se declara información relativa a la reserva de la unidad 
updated
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría que refiere a la actualización del registro oportunidad
Información del responsable de la actualización del registro oportunidad
Id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de actualización de la oportunidad
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
created
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría referida a la creación del registro oportunidad
Información del responsable de la creación del registro oportunidad
Id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de creación de la oportunidad
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
opportunity_comments
texto (4000)
Observaciones sobre el detalle económico 
 Ej: Prendas, gastos extra; ….
saving_plan
first_shares_amount
shares
type
estructura
número (18,2)
número
Información referida al Plan de AhorroMonto de la primera cuotaCantidad de cuotas
Control de Cambios
Fecha
Cambio
Marzo 2018
Documento creado
Diciembre 2023
 Agregado de Especificación funcional
Updated on 07/21/2025

### Filtros - API CRM
Filtros - API CRM
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un presupuesto. Para entender cómo aplicarlos, ver el servicio 
Listar
.
Filtros de selección
Valores de retorno para todos los servicios de Opportunities
Nombre del Parámetro
Tipo
business_type_code
Tipo de negocio
type_code
Tipo de oportunidad
status_code
Estado de la oportunidad
branch_code
Sucursal
integration_reference_code
Código de referencia del sistema que se integra
created
Fecha de creación (formato ISO – Ej. 2018-08-12T10:00:00-0000)
updated
Fecha de actualización (formato ISO – Ej. 2018-08-12T10:00:00-0000)
welcome_id
Lead Guid ID por ejemplo “BD2C378D-E826-4ADC-8EB0-03306B59271E”
Lista de parámetros por los cuales puede 
ordenarse
 la lista de presupuesto a seleccionar
Parámetros de Ordenamiento
 created
 Fecha de creación
 updated
 Fecha de última actualización
Updated on 01/02/2024

### Listar - API CRM
Listar - API CRM
POST
/v1/opportunities/list.php
Este servicio permite:
listar un conjunto de oportunidades/presupuestos mediante la aplicación de 
filtros
. 
[Ver lista de filtros y sorting a aplicar
]
ordenar los resultados
Ejemplo de solicitud para Consultar oportunidades/presupuestos de un lead ordenados según su fecha de creación
{
    "data": {
        "filters": [
        	{
                "field": "welcome_id",
                "operation": "=",
                "value": "BD2C378D-E826-4ADC-8EB0-03306B59271E"
            }
        ],
        "sort": [
            {
                "field": "created",
                "order": "DESC"
            }
        ],
        "limit": 25,
        "page": 1
    },
    "header": {
        "FlowName": "list_opportunities",
        "SequenceId": "",
        "TimeStamp": "",
        "access_token": "{{token}}"
    }
}
Ejemplo de solicitud para Consultar oportunidades/presupuestos considerando: business_type_code, type_code y status_code
{
	"data": {
		"filters": [
			{
				"field": "business_type_code",
				"operation": "=",
				"value": "convencional"
			},
			{
				"field": "type_code",
				"operation": "=",
				"value": "1"
			},
			{
				"field": "status_code",
				"operation": "=",
				"value": "1"
			}
		],
                "sorts": [
                        {
                                "field": "id",
                                "order": "DESC"
                         }
                ],
		"limit": 25,
		"page": 1
	},
	"header": {
		"FlowName": "list_opportunities",
		"SequenceId": "",
		"TimeStamp": "",
		"TrackingId": "",
		"access_token": "{{token}}"
	}
}
Control de Cambios
Fecha
Cambio
12 Marzo 2018
Documento creado
Updated on 01/02/2024

### Crear - API CRM
Crear - API CRM
POST
/v1/opportunities/create.php
La creación de una oportunidad de negocio para un Lead se realiza mediante la invocación de la API provista.
Parámetros para crear una oportunidad para un Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
lead_id
SI
texto (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBDD6638A
Identificador único del Lead en CRM PILOT para el cual se crea una oportunidad. 
Nota:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al lead.
business_type_code
SI
texto
“convencional”
Código del tipo de negocio.
Los valores para este campo se obtienen consultando 
Ver Maestros
.
product_code
SI
texto
“XX100”
Código de producto.
Los valores para este campo se obtienen consultando 
Ver Maestros
. 
Nota:
se requiere cuando el tipo de negocio es: Convencional / Plan de Ahorro
product_brand
SI
texto
Marca de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
product_model
SI
texto
Modelo de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
product_version
SI
texto
Versión de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
product_domain
SI
texto
Dominio de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
product_year
SI
texto
Año de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
product_color
SI
texto
“Rojo”
Color de la unidad
product_year
SI
texto
Año de la unidad.
Nota:
se requiere cuando el tipo de negocio es: Usado
type_code
SI
texto
“1”
Código del tipo de oportunidad.
Los valores para este campo se obtienen consultando 
Ver Maestros
.
cash_amt
NO
número (18.2)
“12000”
Monto a pagar en efectivo.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_value_amt
NO
número (18.2)
“10”
Valor del vehículo a tomar como parte de pago.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_brand
NO
texto
“Ford”
Marca del vehículo a tomar como parte de pago.
trade_in_car_model
NO
texto
“Focus”
Modelo del vehículo a tomar como parte de pago.
trade_in_car_version
NO
texto
“XC”
Versión del vehículo a tomar como parte de pago.
trade_in_car_year
NO
texto
“2005”
Año del vehículo a tomar como parte de pago.
trade_in_car_domain
NO
texto
“AAA111”
Dominio del vehículo a tomar como parte de pago.
trade_in_car_color
NO
texto
“Gris”
Color del vehículo a tomar como parte de pago.
trade_in_car_kms
NO
texto
“89000”
Kms del vehículo a tomar como parte de pago.
trade_in_car_comments
NO
texto (4000)
Comentarios relativos al vehículo a tomar como parte de pago.
credit_amt
NO
número (18.2)
“20000”
Monto del crédito.
Nota:
se expresa sin separadores de miles y con coma decimal
credit_bank
NO
texto
“Santander Río”
Nombre del Banco que otorga el crédito.
credit_rate
NO
texto
“10”
Tasa de interés del crédito otorgado.
credit_shares
NO
texto
“24”
Cantidad de cuotas del crédito.
credit_shares_amt
NO
número (18.2)
“1000”
Valor de la cuota del crédito.
Nota:
se expresa sin separadores de miles y con coma decimal
credit_insurance_amt
NO
número (18.2)
“500”
Monto del seguro (del crédito).
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_amt
NO
número (18.2)
“100000”
Bono/quebranto del crédito otorgado.
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_subtract_from_total
NO
Flag
“1”
Flag que indica si el Bono/quebranto se deduce del Monto Total.
Valores posibles:
“0”: no se deduce
“1”: se deduce
exchange_rate_amt
NO
número (18.2)
“10”
Valor de cambio de la moneda del crédito.
expenses_amt
NO
número (18.2)
“1000”
Monto total de los gastos.
Nota:
se expresa sin separadores de miles y con coma decimal
comments
NO
texto (4000)
Comentarios generales.
Header
Flowname
SI
texto
“LEAD_CLOSE_PILOT”
Nombre descriptivo del servicio.
SequenceId
SI
número
1
Número de secuencia.
TimeStamp
SI
fecha
1493991052
Fecha en la que se realiza la solicitud.
TrackingId
SI
número
“55A6BCD4-0857-4A86-85FB-09A2288641B4”
Número de tracking que puede utilizar el cliente para hacer seguimiento.
access_token
SI
string
“{{token}}”
Token válido de 
autorización
.
Ejemplo de Solicitud para crear una oportunidad
curl --location --request POST '
https://api.pilotsolution.net/v1/opportunities/create.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
   "data":{  
      "lead_id":"67BB96EC-53C0-4326-ADB4-8840F4C830XF",
      "business_type_code":"convencional",
      "product_code":"XX100",
      "product_color":"Rojo",
      "product_comments":"Comentarios internos, no se imprime en el presupuesto",
      "type_code":"1",
      "cash_amt":"120000",
      "trade_in_car_value_amt":"10",
      "trade_in_car_brand":"Ford",
      "trade_in_car_model":"Focus",
      "trade_in_car_version":"XC",
      "trade_in_car_year":"2005",
      "trade_in_car_domain":"AAA111",
      "trade_in_car_color":"Gris",
      "trade_in_car_kms":"89000",
      "trade_in_car_comments":"comentarios del auto en parte de pago",
      "credit_amt":"20000",
      "credit_bank":"Santander Rio",
      "credit_rate":"10",
      "credit_shares":"24",
      "credit_shares_amt":"1000",
      "credit_insurance_amt":"500",
      "credit_reward_amt":"100000",
      "credit_reward_subtract_from_total":"1",
      "exchange_rate_amt":"10",
      "expenses_amt":"1000",
      "comments":"comentarios para el presupuesto"
   },
   "header":{  
      "FlowName":"OPPORTUNITY_CREATE_PILOT",
      "SequenceId":[  
      ],
      "TimeStamp":[  
      ],
      "access_token”:”{token}"
   }
}
Ejemplo de Respuesta con error (al crear una oportunidad – Lead no existe)
{
  "ts": "1533747217",
  "_id": "3333",
  "result":{
    "status": "error",
    "aditional_data":[],
    "code": "business_error",
    "message": "Lead no existe"
  }
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
Updated on 12/06/2023

### Actualizar
Actualizar
POST
/v1/opportunities/update.php
Toda vez que se modifican datos de una oportunidad/presupuesto, éstos deben informarse a 
CRM
PILOT
 mediante la invocación de la API provista.
Una oportunidad/presupuesto puede ser modificada mientras no haya sido ‘vendida o ‘desistida’
Parámetros para actualizar una oportunidad/presupuesto para un Lead
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único (de la oportunidad/presupuesto) de CRM PILOT.
product_code
NO
texto
 “XX100”
Código de producto
Los valores para este campo se obtienen consultando 
Ver Maestros
Nota:
se requiere cuando el tipo de negocio es: Convencional / Plan de Ahorro
product_brand
NO
texto
Marca de la unidad
Nota:
se requiere cuando el tipo de negocio es: Usado
product_model
NO
texto
Modelo de la unidad
Nota:
se requiere cuando el tipo de negocio es: Usado
product_version
NO
texto
Versión de la unidad
Nota:
se requiere cuando el tipo de negocio es: Usado
product_domain
NO
texto
Dominio de la unidad
Nota:
se requiere cuando el tipo de negocio es: Usado
product_year
NO
texto
Año de la unidad
Nota:
se requiere cuando el tipo de negocio es: Usado
product_color
NO
texto
 “Rojo”
Color de la unidad
product_comments
NO
texto
“Comentarios internos”
type_code
NO
texto
Código del tipo de oportunidad
Los valores para este campo se obtienen consultando 
Ver Maestros
.
cash_amt
NO
número (18,2)
 “12000”
Monto a pagar en efectivo.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_value_amt
SI
(cuando se permuta)
número (18,2)
 “10”
Valor del vehículo a tomar como parte de pago.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_brand
SI
(cuando se permuta)
texto
“Ford”
Marca del vehículo a tomar como parte de pago
trade_in_car_model
SI
(cuando se permuta)
texto
 “Focus”
Modelo del vehículo a tomar como parte de pago
trade_in_car_version
SI
(cuando se permuta)
texto
 “XC”
Versión del vehículo a tomar como parte de pago
t
rade_in_car_year
SI
(cuando se permuta)
texto
 “2005”
Año del vehículo a tomar como parte de pago
trade_in_car_domain
NO
texto
 “AAA111”
Dominio del vehículo a tomar como parte de pago
trade_in_car_color
NO
texto
 “Gris”
Color del vehículo a tomar como parte de pago
trade_in_car_kms
NO
texto
 “89000”
Kms del vehículo a tomar como parte de pago
trade_in_car_comments
NO
texto (4000)
Comentarios relativos al vehículo a tomar como parte de pago
credit_amt
NO
número (18,2)
 “20000”
Monto del crédito
Nota:
se expresa sin separadores de miles y con coma decimal
credit_bank
NO
texto
 “Santander Rio”
Nombre del Banco que otorga el crédito
credit_rate
NO
texto
 “10”
Tasa de Interés del crédito otorgado
credit_shares
NO
texto
 “24”
Cantidad de cuotas del crédito
credit_shares_amt
NO
número (18,2)
 “1000”
Valor de la cuota del crédito
Nota:
se expresa sin separadores de miles y con coma decimal
credit_insurance_amt
NO
número (18,2)
 “500”
Monto del seguro (del crédito)
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_amt
NO
número (18,2)
 “100000”
Bono/quebranto del crédito otorgado
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_subtract_from_total
NO
Flag
 “1”
Flag que indica si el Bono/quebranto se deduce del Monto Total
Valores Posibles:
“0”
 : no se deduce
“1”
 : se deduce
exchange_rate_amt
NO
número (18,2)
 “10”
Valor de cambio de la moneda del crédito
expenses_amt
NO
número (18,2)
 “1000”
Monto Total de los gastos
Nota:
se expresa sin separadores de miles y con coma decimal
comments
NO
texto (4000)
Comentarios generales
Header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
SI
SI
SI
Estructura
texto
número
fecha
número
string
“LEAD_CLOSE_PILOT”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
Cabecera de la Solicitud
Nombre descriptivo del servicio
Número de secuencia
Fecha en la que se realiza la solicitud
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de Solicitud para actualizar una oportunidad/presupuesto
curl --location --request POST '
https://api.pilotsolution.net/v1/opportunities/update.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{   
   "data":{  
      "id":"006A23B3-5C32-49AB-AEF5-988BE549F2AX",
      "product_code":"XX100",
      "product_color":"Rojo",
      "product_comments":"Comentarios internos, no se imprime en el presupuesto",
      "type_code":"1",
      "cash_amt":"120000",
      "trade_in_car_value_amt":"10",
      "trade_in_car_brand":"Ford",
      "trade_in_car_model":"Focus",
      "trade_in_car_version":"XC",
      "trade_in_car_year":"2005",
      "trade_in_car_domain":"AAA111",
      "trade_in_car_color":"Gris",
      "trade_in_car_kms":"89000",
      "trade_in_car_comments":"comentarios del auto en parte de pago",
      "credit_amt":"20000",
      "credit_bank":"Santander Rio",
      "credit_rate":"10",
      "credit_shares":"24",
      "credit_shares_amt":"1000",
      "credit_insurance_amt":"500",
      "credit_reward_amt":"100000",
      "credit_reward_subtract_from_total":"1",
      "exchange_rate_amt":"10",
      "expenses_amt":"1000",
      "comments":"comentarios para el presupuesto"
   },
   "header":{  
      "FlowName":"OPPORTUNITY_UPDATE_PILOT",
      "SequenceId":[  
      ],
      "TimeStamp":[  
      ],
      "access_token”:”{token}"
   }
}
Ejemplo de Respuesta con error (al modificar  una oportunidad/presupuesto y ésta no existe)
{
  "ts": "1533747217",
  "_id": "3333",
  "result":{
    "status": "error",
    "aditional_data":[],
    "code": "business_error",
    "message": "El id "006A23B3-5C32-49AB-AEF5-988BE549F2AX' no es válido."
  }
}
Control de Cambios
Fecha
Cambio
9 Agosto 2018
Documento creado
Updated on 01/04/2024

### Desistir - API CRM
Desistir - API CRM
POST
/v1/opportunities/desist.php
El desistimiento de una oportunidad/presupuesto se realiza mediante la invocación de la API provista, indicando 
ID – Identificador Único de la oportunidad/presupuesto en CRM PILOT.
Parámetros para desistir una oportunidad/presupuesto en CRM PILOT
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
ID
SI
texto (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (de la oportunidad/presupuesto) de CRM PILOT. 
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
desist_subreason_code
SI
texto
Submotivo por el que se desiste la oportunidad.
Ver Maestros [opportunity_desist_subreason]
.
desist_comments
SI
texto
Comentarios
Ejemplo de solicitud para Desistir una oportunidad/presupuesto
{
	"data": {
      "id":"105905AB-5207-41BE-9463-2514FEF89342",
      "desist_subreason_code":"1_1",
      "desist_comments":"desistir desde api"
	},
	"header": {
		"FlowName": "OPPORTUNITY_DESIST_PILOT",
		"SequenceId": [],
		"TimeStamp": [],
		"access_token":"{token}"
	}
}
Control de Cambios
Fecha
Cambio
10 Agosto 2018
Documento creado
Updated on 01/02/2024

### Vender - API CRM
Vender
POST
/v1/opportunities/sell.php
La venta de una oportunidad/presupuesto se realiza mediante la invocación de la API provista.
Parámetros para declarar una oportunidad/presupuesto como vendida
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
integration_reference_code
SI
texto
Identificador único de la oportunidad/presupuesto en el ERP
NOTA:
Generalmente representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada oportuidad/presupuesto:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en CRM PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el ERP no se guarde el ID de CRM
status_code
SI
dato maestro
pendiente_aprobacion
Código de estado de la venta. Valor a asignar: pendiente_aprobacion
Los valores para este campo se obtienen consultado sale_status Ver 
Maestros
opportunity_id
SI
texto  (de 32 bits en formato GUID)
“5E10E873-E392-49F6-89BD-9A8ABBD6638A”
Identificador único de la Oportunidad  en CRM PILOT (a marcar como vendida)
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la oportunidad
customer_id
SI
texto  (de 32 bits en formato GUID)
“5E10E873-E392-49F6-89BD-9A8ABBD6638A”
Identificador único del Cliente a Facturar en CRM PILOT
NOTA:
Debe estar creado previamente
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al cliente a facturar
sale_representative_id
SI
dato maestro (de 32 bits en formato GUID)
“5E10E873-E392-49F6-89BD-9A8ABBD6638A”
Identificador único del vendedor en CRM PILOT
Los valores para este campo se obtienen consultando Users Ver  
Maestros
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al vendedor
type_code
SI
dato maestro
“1”
Identificador correspondiente a un tipo de negocio (Business Type)
Los valores para este campo se obtienen consultando 
Ver Maestros
w
elcome_clos
e
NO
Flag
 “0”
Flag que indica si el Lead se cierra al momento de Vender el  Presupuesto
Valores Posibles:
“0”
 : no se cierra (Valor por defecto)
“1”
 : se cierra indicando Motivo: Vendido
commission_amt
NO
número
 “1200000.00”
Monto de la comisión del vendedor.
Nota:
se expresa sin separadores de miles y con coma decimal
cash_amt
NO
número
 “12000”
Monto a pagar en efectivo.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_value_amt
NO
número
 “10”
Valor del vehículo a tomar como parte de pago.
Nota:
se expresa sin separadores de miles y con coma decimal
trade_in_car_brand
NO
texto
“Ford”
Marca del vehículo a tomar como parte de pago
trade_in_car_model
NO
texto
 “Focus”
Modelo del vehículo a tomar como parte de pago
trade_in_car_version
NO
texto
 “XC”
Versión del vehículo a tomar como parte de pago
trade_in_car_domain
NO
texto
 “AAA111”
Dominio del vehículo a tomar como parte de pago
trade_in_car_kms
NO
texto
 “89000”
Kms del vehículo a tomar como parte de pago
t
rade_in_car_year
NO
texto
 “2005”
Año del vehículo a tomar como parte de pago
trade_in_car_color
NO
texto
 “Gris”
Color del vehículo a tomar como parte de pago
trade_in_car_comments
NO
texto
Comentarios relativos al vehículo a tomar como parte de pago
credit_amt
NO
número
 “20000”
Monto del crédito
Nota:
se expresa sin separadores de miles y con coma decimal
credit_bank
NO
texto
 “Santander Rio”
Nombre del Banco que otorga el crédito
credit_rate
NO
texto
 “10”
Tasa de Interés del crédito otorgado
credit_shares
NO
texto
 “24”
Cantidad de cuotas del crédito
credit_shares_amt
NO
número
 “1000”
Valor de la cuota del crédito
Nota:
se expresa sin separadores de miles y con coma decimal
credit_insurance_amt
NO
número
 “500”
Monto del seguro (del crédito)
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_amt
NO
número
 “100000”
Bono/quebranto del crédito otorgado
Nota:
se expresa sin separadores de miles y con coma decimal
credit_reward_subtract_from_total
NO
Flag
 “1”
Flag que indica si el Bono/quebranto se deduce del Monto Total
Valores Posibles:
“0”
 : no se deduce
“1”
 : se deduce
exchange_rate_amt
NO
número
 “10”
Valor de cambio de la moneda del crédito
expenses_amt
NO
número
 “1000”
Monto Total de los gastos
Nota:
se expresa sin separadores de miles y con coma decimal
cash_reserve_amt
NO
texto
Comentarios generales
cash_reserve_dt
NO
texto
 “2018-11-27T15:00:00-0000”
Fecha en que se realizo el pago de la reserva
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
no se informa hora
reinforcement_payment_dt
NO
texto
 “2018-11-27T15:00:00-0000”
Fecha del pago de refuerzo del anticipo de la operación
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
no se informa hora
approximate_delivery_date
NO
texto
 “2018-11-27T00:00:00-0000” sin informar hora
Fecha aproximada comprometida de entrega de la unidad.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
no se informa hora
observations
NO
texto
Comentarios para el presupuesto
Nota:
no se imprimen en el presupuesto dado que son internos para el dealer
product_observations
NO
texto
 “se entrega con polarizados”
Comentarios sobre la unidad a entregar
product_desired_color
NO
texto
Color de preferencia de la unidad
product_average_km_per_year
NO
texto
Cantidad de kilómetros promedio que realiza con el vehículo.
Nota:
Se utiliza para el cálculo de predicción de servicios de post venta
Header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
SI
SI
SI
Estructura
texto
número
fecha
número
string
“OPPORTUNITY_SALE_PILOT”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
Cabecera de la Solicitud
Nombre descriptivo del servicio
Número de secuencia
Fecha en la que se realiza la solicitud
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de Solicitud para declarar una oportunidad/presupuesto como vendida 
satisfactoria
Especificación de la entidad “Oferta”
curl --location --request POST '
https://api.pilotsolution.net/v1/opportunities/sell.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
   "data":{  
      "integration_reference_code": "CC656E23D95A2",
      "opportunity_id": "32B89841-EEAA-4308-97DE-CC656E23D95A",
      "customer_id": "CF11B9DD-FB41-4C44-843C-8F41F598F5BD",
      "sale_representative_id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF", 
      "status_code": "unidad_facturada",
      "type_code": "1",
      "commission_amt": "10000", 
      "cash_amt": "100000",
      "trade_in_car_value_amt": "110000",
      "trade_in_car_brand": "FIAT",
      "trade_in_car_model": "CUBO",
      "trade_in_car_version": "S",
      "trade_in_car_domain": "FGH345",
      "trade_in_car_kms": "45000",
      "trade_in_car_year": "2017",
      "credit_amt": "120000",
      "credit_bank": "SANTANDER",
      "credit_rate": "45",
      "credit_shares": "36",
      "credit_shares_amt": "4833",
      "credit_insurance_amt": "1500",
      "credit_reward_amt": "500",
      "credit_reward_amt_subtract_from_total" : 1, 
      "expenses_amt": "50000",
      "cash_reserve_amt": "12000",
      "cash_reserve_dt": "2018-11-27T15:00:00-0000",
      "reinforcement_payment_dt" : "2018-12-27T15:00:00-0000",
      "approximate_delivery_date": "2018-11-30T00:00:00-0000",
      "observations": "Comentarios de la venta (internos)",
      "product_observations": "Se entrega con polarizado",
      "product_desired_color": "Blanco", 
      "product_average_km_per_year": 10000 
   },
   "header":{  
      "FlowName":"OPPORTUNITY_SELL_PILOT",
      "SequenceId":[],
      "TimeStamp":[],
      "TrackingId": "",
      "access_token”:”{token}"
   }
}
Ejemplo de Respuesta con 
error
 (al declarar una oportunidad como vendida y ésta no existe)
{
  "ts": "1533747217",
  "_id": "3333",
  "result":{
    "status": "error",
    "aditional_data":[],
    "code": "business_error",
    "message": "El id  'CF318A06-4CDD-4069-B740-43EB940E6A5' no es válido."
  }
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
1 Marzo 2023
Se agrega el parámetro welcome_close
Updated on 01/29/2024

## Stock - API CRM
Stock - API CRM

### Entidad stock - API CRM
Entidad stock - API CRM
Valores de retorno para todos los servicios de ventas
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
Identificador único (de la unidad de stock) de PILOT sobre la que se realizara la operación de actualización.
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la unidad.
integration_reference_code
texto
ID – Identificador único de la unidad de stock en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de stock:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declararse.
brand
texto
Marca del vehículo
model
texto
Modelo del vehículo
version
texto
Version del vehículo
year
texto
Año del vehículo
odometer
texto
Kilómetros del vehículo
color
texto
Color del vehículo
location
texto
Ubicación de la unidad (agencia – sucursal …)
accesories
texto
Descripción de los accesorios de la unidad
license_plate
texto
Chapa patente de la unidad
vin
texto
Número Identificador  del vehículo.
NOTA:
En el caso de los pedidos de vehículos nuevos, puede que no esté disponible hasta estar más avanzado el proceso de compra.
business_channel
texto
Representa el canal de venta de la unidad.
NOTA:
Es abierto e informativo. Puede completarse con valores tales como por ejemplo: “eCommerce” ;  “0km” ; “salón” ; “USADO” ; “SEMI NUEVO”
received_flag
flag
Flag que identifica si el vehículo se encuentra físicamente en stock.
Valores posibles:
 0 = Vehículo no recibido ; 1 = Vehículo físico
days_in_stock
número
Dias que está en el stock  (Dato calculado en CRM PILOT)
manual_flag
flag
 Flag si fue ingresado manualmente o automáticamente
comments
texto
Comentarios del vehículo
published_in_web
texto
Flag que indica si la unidad puede ser publicada automáticamente o no, cuando el sistema usa el plugin de Stock de PILOT.
Valores posibles:
 0 = No publicar ; 1 = publicar
engine_number
texto
Número del motor de la unidad
type
code
name
estructura
texto
texto
Código que representa la condición del vehículo (VN/VO)Nombre de la condición del vehículo
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  técnico 
vehicle_types 
Ver más
certificate
has_document
number
estructura
flag
Número
Estructura en la que se declara el motivo (según ERP) de la disponibilidad / no disponibilidad de la unidadFlag que indica si la unidad tiene certificado
Valores posibles:
 0 = Si Certificado ; 1 = Con Certificado
Número de Certificado
reservation
reserved_by_user
    id
    integration_reference_code
    name
    fullname
    reserved_dt
   expiration_dt
opportunity_sale
id
integration_reference_code
name
fullname
      comments
assigned_by_user
id
integration_reference_code
product_quotation
brand
model
version
assigned_dt
estructura
estructura
texto
texto
texto
texto
fecha
fecha
estructura
texto
texto
texto
texto
texto
estructura
Id del usuario
texto
estructura
texto
texto
texto
fecha
Estructura en la que se declara información relativa a la reserva de la unidad 
Estructura que detalla datos del usuario responsable de la reserva
id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de la reserva
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
Fecha de expiración de la reserva
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Estructura que detalla datos de la oportunidad sobre la que se reservó
id de la oportunidad por vender
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Comentarios de la reserva (máximo 4000 caracteres)
Estructura que detalla datos del usuario responsable de la reserva a una oportunidad
Identificador del usuario
Código de referencia de usuario del sistema que se integra
Estructura que detalla datos del producto reservado
Marca
Modelo
Versión
Fecha en la que se realiza la asignación de la unidad
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
factory
request_number
code
invoicing_dt
status
invoice_payment_dt
estructura
texto
texto
fecha
texto
fecha
Estructura en. la que se declara información vinculada a la fabricación de la unidad
Número de pedido a la fábrica que identifica la unidad
Código de fábrica de la unidad
Fecha de factura de la unidad al dealer
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Estado del vehículo en la fábrica
Fecha de pago de la unidad a la fábrica
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
position
texto
status
code
name
estructura
texto
texto
Estructura en la que se declara el motivo (según ERP) de la disponibilidad / no disponibilidad de la unidad
Código de estado propio de 
ERP
 (para visión del usuario). Ej: si una unidad asume el estado de disponibilidad : No disponible, en status_code podría asignarse “En Taller”
Descripción del estado
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
stock_status
Ver más
prices
type
currency
value
estructura
texto
texto
número
Estructura en la que se declara el valor de venta / compra de la unidadTipo de Precio
Valores posibles:
 SALE_COST = Precio de Venta ; PURCHASE_COST = Precio de Compra
Moneda
Valor
fuel
code
name
estructura
texto
texto
Estructura referida al Tipo de CombustibleCódigo del tipo de combustible del vehículo
Nombre del tipo de combustible del vehículo
availability_status
code
name
estructura
texto
texto
Estructura correspondiente al Estado de Disponibilidad del vehículo
Código de estado de la disponibilidad del vehículo
Descripción del estado de disponibilidad del vehículo
NOTA:
Los valores correspondientes a esta estructura se obtienen consultando el dato maestro  
stock_availability  
Ver más
created
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto
texto
texto
fecha
Estructura de auditoría referida a la creación del registro unidad de stock
Información del responsable de la creación del registro unidad de stock
Id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de creación del stock
updated
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto
texto
texto
fecha
Estructura de auditoría referida a la actualización del registro unidad de stock
Información del responsable de la actualización del registro unidad de stock
Id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de actualización de la unidad de stock
deleted
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto
texto
texto
fecha
Estructura de auditoría referida al borrado (baja lógica) del registro unidad de stock
Información del responsable del borrado (baja lógica)  del registro unidad de stock
Id del usuario
Código de referencia de usuario del sistema que se integra
Email del usuario
Nombre completo del usuario
Fecha de borrado lógico de la unidad de stock
owner_branch_code
texto
Código de sucursal
NOTA:
Los valores correspondientes se obtienen consultando el dato maestro  
branches  
Ver más
import_code
texto
 Código de importación
saving_plan
saving_plan_group
saving_plan_order
estructura
texto
texto
Estructura que describe el Plan de Ahorro
Grupo Plan de Ahorro
Orden en Plan de Ahorro
Updated on 06/10/2025

### Leer - API CRM
Leer - API CRM
GET
/v1/stock/read.php
Se utiliza para consultar/leer una unidad del stock a partir del ID – Identificador Único en CRM PILOT Parámetro para consultar/leer una unidad de stock en CRM PILOT
Parámetro para consultar/leer el avatar de un usuario de CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (de la unidad de stock) de CRM PILOT sobre la que ocurrió la operación actualización/reserva. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
Ejemplo de solicitud para Consultar/Leer una unidad de stock
curl --location --request GET '
https://api.pilotsolution.net/v1/stock/read.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "id": "409F0198-51AC-4B78-9BEF-CF2B22DAF317"
    },
    "header": {
        "FlowName": "stock_read",
        "SequenceId": 2,
        "TimeStamp": 1248377,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token"
    }
}'
Respuesta a Solicitud Consulta/Lectura de una unidad de stock 
Satisfactoria 
Especificación de la entidad “unidad stock
”
{
    "ts": "1658439920",
    "_id": "123714",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "409F0198-51AC-4B78-9BEF-CF2B22DAF317",
            "integration_reference_code": "",
            "brand": "Ford",
            "model": "Mustang",
            "version": "Nafta",
            "year": "2020",
            "odometer": null,
            "color": "Negro",
            "location": "Buenos Aires",
            "accesories": "",
            "license_plate": "",
            "vin": "",
            "business_channel": "Prueba stock usado2",
            "received_flag": "0",
            "days_in_stock": 0,
            "manual_flag": "1",
            "comments": "",
            "published_in_web": "0",
            "engine_number": "",
            "type": {
                "code": "VO",
                "name": "Vehiculo usado"
            },
            "certificate": {
                "has_document": null,
                "number": ""
            },
            "reservation": {
                "reserved_by_user": null,
                "reserved_dt": "",
                "expiration_dt": "",
                "opportunity_sale": {
                    "id": "CE702178-7631-4606-95AB-3558C0863727",
                    "integration_reference_code": "9090",
                    "product_quotation": {
                        "brand": null,
                        "model": null,
                        "version": null
                    }
                },
                "comments": "",
                "assigned_by_user": {
                    "id": "50E6ACC4-E495-4497-948A-12ED60EAA777",
                    "integration_reference_code": "",
                    "name": "test.admin@pilotsolution.com.ar",
                    "fullname": "Admin Test"
                },
                "assigned_dt": "2021-03-16T17:52:37+0000"
            },
            "factory": {
                "request_number": "",
                "code": "",
                "invoicing_dt": "",
                "status": "",
                "invoice_payment_dt": ""
            },
            "position": "",
            "status": null,
            "prices": [
                {
                    "type": "SALE_COST",
                    "value": "100000000.00"
                },
                {
                    "type": "PURCHASE_COST",
                    "value": ".00"
                }
            ],
            "fuel": null,
            "availability_status": {
                "code": "4",
                "name": "Asignado"
            },
            "created": {
                "user": {
                    "id": "50E6ACC4-E495-4497-948A-12ED60EAA777",
                    "integration_reference_code": "",
                    "name": "test.admin@pilotsolution.com.ar",
                    "fullname": "Admin Test"
                },
                "dt": "2021-03-03T14:48:37+0000"
            },
            "updated": {
                "user": {
                    "id": "50E6ACC4-E495-4497-948A-12ED60EAA777",
                    "integration_reference_code": "",
                    "name": "test.admin@pilotsolution.com.ar",
                    "fullname": "Admin Test"
                },
                "dt": "2021-03-16T17:52:37+0000"
            },
            "deleted": {
                "flag": "0",
                "user": null,
                "dt": ""
            },
            "owner_branch_code": null,
            "import_code": null,
            "saving_plan": {
                "saving_plan_group": "",
                "saving_plan_order": ""
            }
        }
    }
}
Ejemplo de Respuesta con 
error
 (al consultar/leer una unidad de stock inexistente)
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Sale dont exist in database"
	}
}
Updated on 11/26/2025

### Listar - API CRM
Listar - API CRM
GET
/v1/stock/list.php
Este servicio permite:
listar un conjunto de unidades de stock mediante la aplicación de 
filtros
. 
ordenar los resultados
Parámetro para consultar/leer el avatar de un usuario de CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
SI
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NOSISI
SI
estructura
textotexto
texto
“fuel_type_code””=”
“01”
Filtro a aplicar
nombre del campo por el que se seleccionaoperador lógico
valor
sorts
field
order
NOSISI
estructura
textotexto
 “updated””DESC”
Ordenamiento a aplicar
nombre del campo por el que se ordenaSentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
estructura
textonúmero
timestamp
texto
texto
“List_stock”1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuenciafecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘filtros de selección’ que pueden aplicarse para elegir un conjunto de unidades de stock. 
Filtros de selección
fuel_type_code
Tipo de combustible
availability_status_code
Estado del stock
type_code
Tipo de vehículo
integration_reference_code
Código de referencia del sistema que se integra
vin
 VIN del vehiculo
 owner_branch_code
 Código de Sucursal asignada del stock.
 reserved_by_user
 invoincing_dt
Fecha de facturación
 certificate_number
Número de Certi
 owner_branch_code
 Código de Sucursal asignada del stock.
 license_plate
Chapa patente de la unidad
 factory_request_number
Número de pedido a la fábrica que identifica la unidad
status
Código de estado propio de 
ERP
 (para visión del usuario).
factory_code
Código de fábrica de la unidad
 created
 Fecha de creación en formato ISO, ejemplo “2018-03-28T16:33:22”
 updated
  Fecha de última actualización en formato ISO, ejemplo “2018-03-28T16:33:22”
Lista de parámetros  por los cuales puede 
ordenarse
 la lista de unidades de stock a seleccionar
Filtros de parámetros
 created
type_code
 updated
integration_reference_code
fuel_type_code
 vin
 availability_status_code
owner_branch_code
Operadores
Igualdad
 =
 Distinto a
 &lt;&gt;
 Mayor a
 &gt;
 Menor a
 &lt;
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer unidades de stock considerando: fuel_type_code y availability_status_code
{
	"data": {
		"filters": [
				{
				"field": "fuel_type_code",
				"operation": "=",
				"value": "01"
			},
			{
				"field": "availability_status_code",
				"operation": "=",
				"value": "1"
			}
		],
		"sort": [
			{
				"field": "updated",
				"order": "DESC"
			}
		],
                "show_media": true,
		"limit": 2,
		"page": 1
	},
	"header": {
		"FlowName": "stock_list",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud Consulta/Lectura de unidades de stock Satisfactoria 
Especificación de la entidad “unidad stock”
{
	"ts": "1498232332",
	"_id": "95468",
	"result": {
		"status": "success",
		"aditional_data": {
			"page": 1,
			"page_count": 2,
			"rows_count": 4,
			"rows_per_page": 2,
			"rows_in_page": 2,
			"rows_remaining": 2
		},
		"entitydata": [
			{
				"id": "F24AD221-61C9-4BF2-80BD-B80294B0346E",
				"integration_reference_code": "115305",
				"brand": "HYUNDAI",
				"model": "EON GL 800 CC",
				"version": "EON",
				"year": "2014",
				"odometer": "21798",
				"color": "CELESTE",
				"location": "",
				"accesories": "",
				"license_plate": "",
				"vin": "MALA251AAEM260247",
				"business_channel": "",
				"received_flag": "0",
				"days_in_stock": null,
				"manual_flag": null,
				"comments": "",
				"published_in_web": "0",
				"engine_number": "G3HADM234260",
				"type": {
					"code": "VO",
					"name": "Vehiculo usado"
				},
				"certificate": {
					"flag": null,
					"number": ""
				},
				"reservation": {
					"reserved_by_user": null,
					"reserved_dt": "",
					"expiration_dt": "",
					"sale_id": null,
					"comments": null,
					"assigned_by_user": null,
					"assigned_dt": ""
				},
				"factory": {
					"request_number": "",
					"code": "U-N092254",
					"invoicing_dt": "",
					"status": ""
				},
				"status": null,
				"prices": [
					{
						"type": "SALE_COST",
						"value": null
					},
					{
						"type": "PURCHASE_COST",
						"cost": ".00"
					}
				],
				"fuel": {
					"code": "01",
					"name": "Gasolina"
				},
				"availability_status": {
					"code": "1",
					"name": "Disponible"
				},
				"resources": {
					"image": null
				},
				"created": {
					"user": {
						"id": "FB7B27CD-7094-47E9-9E38-6A7D1F85C5E2",
						"integration_reference_code": "380",
						"name": "api.test@pilotsolution.com.ar",
						"fullname": "Api Test"
					},
					"dt": "2017-05-18T21:04:15+0100"
				},
				"updated": {
					"user": {
						"id": "9E93E98A-C102-4A39-B840-AF7977454BEC",
						"integration_reference_code": "380",
						"name": "gerente.test@pilotsolution.com.ar",
						"fullname": "GERENTE TEST"
					},
					"dt": "2017-05-29T18:49:36+0100"
				},
				"deleted": {
					"flag": "0",
					"user": null,
					"dt": ""
				},
                                "media": []
			},
			{
				"id": "EFCD244F-3895-4A0E-9B39-80B2562D8D86",
				"integration_reference_code": "ABA11d21",
				"brand": "FORD",
				"model": "RANGER",
				"version": "LIMITE",
				"year": "",
				"odometer": null,
				"color": "",
				"location": "",
				"accesories": "",
				"license_plate": "",
				"vin": "",
				"business_channel": "",
				"received_flag": null,
				"days_in_stock": null,
				"manual_flag": "0",
				"comments": "",
				"published_in_web": "0",
				"engine_number": "",
				"type": {
					"code": "VN",
					"name": "Vehiculo nuevo"
				},
				"certificate": {
					"flag": null,
					"number": ""
				},
				"reservation": {
					"reserved_by_user": null,
					"reserved_dt": "",
					"expiration_dt": "",
					"sale_id": null,
					"comments": "",
					"assigned_by_user": null,
					"assigned_dt": ""
				},
				"factory": {
					"request_number": "",
					"code": "",
					"invoicing_dt": "",
					"status": ""
				},
				"status": {
					"code": "0000000001",
					"name": "Próximo a ingreso"
				},
				"prices": [
					{
						"type": "SALE_COST",
						"value": "123500"
					},
					{
						"type": "PURCHASE_COST",
						"cost": "210500.00"
					}
				],
				"fuel": {
					"code": "01",
					"name": "Gasolina"
				},
				"availability_status": {
					"code": "1",
					"name": "Disponible"
				},
				"resources": {
					"image": null
				},
				"created": {
					"user": {
						"id": "FB7B27CD-7094-47E9-9E38-6A7D1F85C5E2",
						"integration_reference_code": "380",
						"name": "api.test@pilotsolution.com.ar",
						"fullname": "Api Test"
					},
					"dt": "2017-05-29T20:44:02+0100"
				},
				"updated": {
					"user": null,
					"dt": ""
				},
				"deleted": {
					"flag": "0",
					"user": null,
					"dt": ""
				}, 
                                "media": []
			}
		]
	}
}
Ejemplo de Respuesta con error (al consultar/leer unidad de stock por ‘fuel_type_code’ inexistente en la muestra)
{
	"ts": "1498232368",
	"_id": "95471",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "fuel_type_code not found: 33301"
	}
}
Control de Cambios
Fecha
Cambio
4 Mayo 2018
Documento creado
Updated on 07/28/2025

### Crear - API CRM
Crear - API CRM
POST
/v1/stock/create.php
Toda vez que se ingresa (crea) una unidad de  Stock en el 
ERP
, esta acción debe ser informada a 
CRM
PILOT
 mediante la invocación de la API provista.
Consideraciones/Recomendaciones
Las unidades que se deben informar (crear)  en 
CRM PILOT
, son las del 
stock de venta
. No se debe informar unidades del inventario que no sean para la venta. 
Los parámetros que se declaran en el mensaje (API) varían según sea la condición del vehículo: nueva  o usada.
Parámetros para crear una unidad NUEVA
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
factory_request_number
NO
texto
JH-212-FF
Número de Pedido de la unidad (a la fábrica)
integration_reference_code
NO
texto
234234-2022
Identificador único de la unidad de stock en el ERP
NOTA:
Generalmente representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de stock:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en CRM PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el ERP no se guarde el ID de CRM
availability_status_code
SI
número
1
Código de estado de la disponibilidad del vehículo 
Los valores para este campo se obtienen consultando el dato maestro  
stock_availability  
Ver más
NOTA:
Los 
valores posibles de estado
 que se declaran en el servicio son:  0 – no disponible ; 1 – disponible
Campo Técnico – Sus valores No pueden modificarse
type_code
SI
dato maestro
vn
Código que representa la condición de la unidad (vn/vo)
Los valores para este campo se obtienen consultado el dato maestro 
vehicle_type  
Ver más
brand
SI
texto
FORD
Marca de la unidad
model
SI
texto
KA
Modelo de la unidad
version
SI
texto
1.2
Versión de la unidad
factory_code
SI
texto
MCB
Código de fábrica de la unidad según la terminal.Debe existir en el Maestro de Productos de PILOT.
odometer
NO
texto
25000
Valor actual del odómetro
vin
 NO
texto
KB777889
Vin del vehículo ( 17 dígitos del vin o al menos los últimos 8 )
business_channel
 NO
texto
USADO o SEMINUEVO
 Representa el canal de venta de la unidad.
NOTA:
Es un campo abierto e informativo. Puede completarse con valores tales como, por ejemplo: “eCommerce” ;  “0km” ; “salón” ; “USADO” ; “SEMINUEVO”
color
SI
texto
GRIS PLATA
Color del vehículo
year
SI
número
2022
 Año de fabricación del vehículo
received_flag
SI
flag
1
Flag que identifica si el vehículo se encuentra físicamente en stock.
Valores posibles:
 0 = Vehículo no recibido ; 1 = Vehículo físico
fuel_type_code
 NO
dato maestro
Gas
Código de tipo de combustible.
Los valores para este campo se obtienen consultando el dato maestro 
fuel_type 
Ver más
comments
 NO
texto
Excelente estado
 Campo de texto libre que se utiliza para  agregar información de la unidad tales  como:  su condición, su estado, particularidades de la misma
Generalmente se completa cuando la unidad es usada.
accesories
NO
texto
Alarma, luces frontales
Descripción de los accesorios de la unidad
prices
type
currency
value
NO
estructura
texto
texto
número
“SALE_COST”,
“Dólar”,
25000
Estructura en la que se declara el valor de venta de la unidad.
Nota:
Se usa habitualmente cuando la unidad es usada. Permite valorizar el stock .
Si se informa 
value, type
 es mandatorio y su valor es 
“SALE_COST”
value
 se expresa, sin separador de miles y con punto decimal
Otros parámetros que pueden ser de interés declarar al crear una unidad NUEVA
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
published_in_web_flag
NO
flag
1
Flag que indica si la unidad puede ser publicada automáticamente o no, cuando el sistema usa el plugin de Stock de PILOT.
Valores posibles:
 0 = No publicar ; 1 = publicar
owner_branch_code
NO
texto
232
Id de la sucursal dueña del stock.
Nota:
Se usa para no permitir la venta de unidades entre puntos de venta diferentes
certificate
NO
texto
876s7dfasdasd78
Número de certificado de importación.
Nota:
Sólo válido para unidades nuevas de bienes de uso.
engine_number
NO
texto
2323232323
Número de motor de la unidad
factory_invoicing_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de facturación de la unidad, por parte de la fábrica
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
invoice_payment_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de pago de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Este dato luego se usa para determinar los días de stock de la unidad
prices
type
currency
value
 NO
estructura
texto
texto
número
“PURCHACE_COST”,
“Dólar”,
12000
Estructura en la que se declara el valor de compra de la unidad.
Nota:
Si se informa 
value, type
 es mandatorio y su valor es 
“PURCHACE_COST”
value
 se expresa, sin separador de miles y con punto decimal
fuel_type_code
 NO
dato maestro
 Gas
Código del tipo de combustible
Los valores para este campo se obtienen consultado el dato maestro 
fuel_type  
Ver más
last_update_pid
NO
texto
20220227143400
Código o identificación de la operación o momento en el que se invocó la API.
Se utiliza  para hacer un seguimiento de las operaciones (en caso de ser necesario) o de un lote de carga.
Parámetros para crear una unidad de stock USADOS
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
license_plate
NO
texto
JH-212-FF
Chapa patente de la unidad
integration_reference_code
NO
texto
234234-2022
ID – Identificador único de la unidad de stock en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de stock:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declarase.
availability_status_code
SI
número
1
Código de estado de la disponibilidad del vehículo .
Los valores para este campo se obtienen consultando el dato maestro  
stock_availability  
Ver más
NOTA:
Los 
valores posibles de estado
 que se declaran en el servicio son:
0 – no disponible ; 1 – disponible
Campo Técnico – Sus valores No pueden modificarse
type_code
SI
dato maestro
vn
Código que representa la condición de la unidad (vn/vo)
Los valores para este campo se obtienen consultando el dato maestro 
vehicle_type  
Ver más 
brand
SI
texto
FORD
Marca de la unidad
model
SI
texto
KA
Modelo de la unidad
version
SI
texto
1.2
Versión de la unidad
odometer
NO
texto
25000
Valor actual del odómetro
vin
 NO
texto
KB777889
Vin del vehículo ( 17 dígitos del vin o al menos los últimos 8 )
business_channel
 NO
texto
USADO o SEMINUEVO
Representa el canal de venta de la unidad.
NOTA:
Es un campo abierto e informativo. Puede completarse con valores tales como, por ejemplo: “eCommerce” ;  “0km” ; “salón” ; “USADO” ; “SEMINUEVO”
color
SI
texto
GRIS PLATA
 Color del vehículo
year
SI
número
2022
 Año de fabricación del vehículo
received_flag
SI
flag
1
Flag que identifica si el vehículo se encuentra físicamente en stock.
Valores posibles:
 0 = Vehículo no recibido ; 1 = Vehículo recibido
fuel_type_code
 NO
dato maestro
Gas
Código de tipo de combustible.
Los valores para este campo se obtienen consultando el dato maestro 
fuel_type  
Ver más 
comments
 NO
texto
Excelente estado
 Campo de texto libre que se utiliza para  agregar información de la unidad tales como:  su condición, su estado, particularidades de la misma
Generalmente se completa cuando la unidad es usada.
accesories
NO
texto
Alarma, luces frontales
Descripción de los accesorios de la unidad
prices
type
currency
value
NO
estructura
texto
texto
número
“SALE_COST”,
“Dólar”,
25000
Estructura en la que se declara el valor de venta de la unidad.
Nota:
Se usa habitualmente cuando la unidad es usada. Permite valorizar el stock .
Si se informa 
value, type
 es mandatorio y su valor es 
“SALE_COST”
value
 se expresa, sin separador de miles y con punto decimal
Otros parámetros que pueden ser de interés declarar al crear una unidad de stock USADOS
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
published_in_web_flag
NO
texto
123457
Flag que indica si la unidad puede ser publicada automáticamente o no, cuando el sistema usa el plugin de Stock de PILOT.
Valores posibles:
 0 = No publicar ; 1 = publicar
owner_branch_code
NO
texto
232
Id de la sucursal dueña del stock.
Nota:
Se usa para no permitir la venta de unidades entre puntos de venta diferentes
certificate
NO
texto
876s7dfasdasd78
Número de certificado de importación.
Nota:
Sólo válido para unidades nuevas de bienes de uso.
engine_number
NO
texto
2323232323
Número de motor de la unidad
factory_invoicing_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de facturación de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
invoice_payment_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de pago de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
prices
type
currency
value
 NO
estructura
texto
texto
número
“PURCHASE_COST”,
“Dólar”,
12000
Estructura en la que se declara el valor de compra de la unidad.
Nota:
Si se informa 
value, type
 es mandatorio y su valor es 
“PURCHASE_COST”
value
 se expresa, sin separador de miles y con punto decimal
last_update_pid
NO
texto
20220227143400
Código o identificación de la operación o momento en el que se invocó a la API.
Se utiliza  para hacer un seguimiento de las operaciones (en caso de ser necesario) o de un lote de carga.
Ejemplo de solicitud para crear una unidad NUEVA
curl --location --request POST '
https://api.pilotsolution.net/v1/stock/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "factory_request_number": "123457",
        "integration_reference_code": "mi_codigo_23",
        "availability_status_code": "1",
        "type_code": "vn",
        "brand": "FORD",
        "model": "RENEGADE",
        "version": "LIMITED",
        "factory_code": "GHJ123",
        "location": "San Francisco",
        "vin": "KB777889",
        "business_channel": "NUEVOS",
        "color": "GRIS_PLATA",
        "year": "2011",
        "received_flag": 0,
        "factory_status": "54-Logistica",
        "comments": "Nueva linea",
        "accesories": "Asientos calefaccionados",
        "prices": [
            {
                "type": "SALE_COST",
                "currency": "DOL",
                "value": 135034
            }
        ],
        "last_update_pid": "201902051400"
    },
    "header": {
        "FlowName": "stock_create",
        "SequenceId": 1,
        "TimeStamp": 124789,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token}}"
    }
}'
Respuesta a Solicitud creación de una unidad de stock  NUEVA 
Satisfactoria
.  
Especificación de la entidad “unidad stock”
{
    "ts": "1655785532",
    "_id": "195399",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "AE6E4BD1-CCB0-46D1-B234-B2DF4E3BF504",
            "integration_reference_code": "mi_codigo_23",
            "brand": "FORD",
            "model": "RENEGADE",
            "version": "LIMITED",
            "year": "2011",
            "odometer": null,
            "color": "GRIS_PLATA",
            "location": "San Francisco",
            "accesories": "Asientos calefaccionados",
            "license_plate": "",
            "vin": "KB777889",
            "business_channel": "NUEVOS",
            "received_flag": "0",
            "days_in_stock": 0,
            "manual_flag": "0",
            "comments": "Nueva linea",
            "published_in_web": "0",
            "engine_number": "",
            "type": {
                "code": "VN",
                "name": "Vehiculo nuevo"
            },
            "certificate": {
                "has_document": null,
                "number": ""
            },
            "reservation": {
                "reserved_by_user": null,
                "reserved_dt": "",
                "expiration_dt": "",
                "opportunity_sale": null,
                "comments": "",
                "assigned_by_user": null,
                "assigned_dt": ""
            },
            "factory": {
                "request_number": "123457",
                "code": "GHJ123",
                "invoicing_dt": "",
                "status": "54-Logistica",
                "invoice_payment_dt": ""
            },
            "position": "",
            "status": null,
            "prices": [
                {
                    "type": "SALE_COST",
                    "value": "135034.00"
                },
                {
                    "type": "PURCHASE_COST",
                    "value": null
                }
            ],
            "fuel": null,
            "availability_status": {
                "code": "1",
                "name": "Disponible"
            },
            "created": {
                "user": {
                    "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                    "integration_reference_code": "",
                    "name": "localdesa.admin@pilotsolution.com.ar",
                    "fullname": "Admin Localdesa"
                },
                "dt": "2022-06-21T04:25:29+0000"
            },
            "updated": {
                "user": {
                    "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                    "integration_reference_code": "",
                    "name": "localdesa.admin@pilotsolution.com.ar",
                    "fullname": "Admin Localdesa"
                },
                "dt": "2022-06-21T04:25:29+0000"
            },
            "deleted": {
                "flag": "0",
                "user": null,
                "dt": ""
            },
            "owner_branch_code": null,
            "import_code": null,
            "saving_plan": {
                "saving_plan_group": "",
                "saving_plan_order": ""
            }
        }
    }
}
Ejemplo de Respuesta con 
error 
(al crear una unidad de stock el valor del campo Branch_code no existe)
{
	"ts": "1498074655",
	"_id": "91377",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "branch_code not found:2"
	}
}
Control de Cambios
Fecha
Cambio
20 Marzo 2025
Se agrega la obligatoriedad de completitud del código de fábrica para autos nuevos. Debe existir en el Maestro de Productos de PILOT.
Updated on 03/24/2025

### Actualizar datos propios de una unidad - API CRM
Actualizar datos propios de una unidad
 - API CRM
Toda vez que se modifican datos de una unidad de  Stock en 
ERP
, éstos deben informarse a 
CRM
PILOT
 mediante la invocación de la API provista, a saber:
a) Datos propios de una unidad
b) Estado de disponibilidad de una unidad 
a) Datos propios de una unidad
POST
/v1/stock/update.php
Toda vez que se modifican datos de una unidad de  Stock (representativos para su venta) en 
ERP
, éstos deben informarse a 
CRM
PILOT
 mediante la invocación de la API provista.
Algunos ejemplos de eventos que deben generar una actualización del stock en Pilot:
a) Asignación de VIN a una Unidad Nueva pedida a fábrica.
b) Cambio en la logística/ubicación:  Ej. Una unidad pasa de un depósito a otro . 
Para actualizar una unidad, 
ERP
 debe utilizar el,  
ID – Identificador único de la unidad en el CRM PILOT
. Este identificador es asignado al momento de crear la unidad en 
CRM PILOT.  
Se recomienda preservar este valor en el 
ERP 
ya que es la única manera de acceder a la unidad.
Parámetros para actualizar la unidad NUEVA
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
5E10E873-E392-49F6-89BD-9A8ABBD6638A
Identificador único (de la unidad de stock) de PILOT sobre la que se realizara la operación de actualización.
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la unidad.
factory_request_number
SI
texto
123457
Número de Pedido de la unidad (a la fábrica)
availability_status_code
SI
texto
1
Código de estado de la disponibilidad del vehículo 
NOTA:
Los 
valores de estado
 que se declaran en el servicio son: 
0 – no disponible
1 – disponible
Campo Técnico – Sus valores No pueden modificarse
type_code
SI
texto
vn
Código que representa la condición del vehículo. (vn/vo)
Los valores para este campo se obtienen consultando el dato maestro 
vehicle_types  
Ver más
brand
SI
texto
FORD
Marca del vehículo
model
SI
texto
TA
Modelo del vehículo
version
SI
texto
1.2
Versión del vehículo
factory_code
SI
texto
GHJ123
Código de fábrica del vehículo. Debe existir en el Maestro de Productos de PILOT.
vin
 NO
texto
KB777889
Vin del vehículo.
NOTA:
En el caso de los pedidos de vehículos nuevos, puede que no esté disponible hasta estar más avanzado el proceso de compra.
business_channel
 NO
texto
0km
Representa el canal de venta de la unidad.
NOTA:
Es abierto e informativo. Puede completarse con valores tales como por ejemplo: “eCommerce” ;  “Nuevos” ; “Salón”
color
SI
texto
GRIS_PLATA
 Color de la unidad
year
SI
número
GRIS_PLATA
 Año de fabricación de la unidad
received_flag
SI
flag
1
Flag que identifica si el vehículo se encuentra físicamente en stock.
Valores posibles:
 0 = Vehículo no recibido ; 1 = Vehículo físico
factory_status
 NO
texto
23-en fabricación”
Campo de texto libre que representa el estado en el sistema de fabricación de la marca
comments
 NO
texto
Excelente estado
Campo de texto libre que se utiliza para  agregar información de la unidad tales  como:  su condición, su estado particularidades de la misma
Generalmente se completa cuando la unidad es usada.
accesories
NO
texto
Alarma, luces frontales
 Descripción de los accesorios de la unidad
prices
type
currency
value
NO
estructura
texto
texto
número
“SALE_COST”,
“Dólar”,
25000
Estructura en la que se declara el valor de venta de la unidad.
Nota:
Se usa habitualmente cuando la unidad es usada. Permite valorizar el stock .
Si se informa 
value, type
 es mandatorio y su valor es “
SALE_COST
“
value
 se expresa, sin separador de miles y con punto decimal
Otros parámetros que pueden ser de interés declarar al actualizar una unidad NUEVA
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
published_in_web_flag
NO
flag
1
Flag que indica si la unidad puede ser publicada automáticamente o no, cuando el sistema usa el plugin de Stock de PILOT.
Valores posibles:
 0 = No publicar ; 1 = publicar
owner_branch_code
NO
texto
232
Id de la sucursal dueña del stock.
Nota:
Se usa para no permitir la venta de unidades entre puntos de venta diferentes
certificate
NO
texto
876s7dfasdasd78
Número de certificado de importación.
Nota:
Sólo válido para unidades nuevas de bienes de uso.
engine_number
NO
texto
2323232323
Número de motor de la unidad
factory_invoicing_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de facturación de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
invoice_payment_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de pago de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
prices
type
currency
value
 NO
estructura
texto
texto
número
“PURCHACE_COST”,
“Dólar”,
12000
Estructura en la que se declara el valor de compra de la unidad.
Nota:
Si se informa 
value, type
 es mandatorio y su valor es 
“PURCHACE_COST”
value
 se expresa, sin separador de miles y con punto decimal
fuel_type_code
 NO
dato maestro
 gas
Código del tipo de combustible.
Los valores para este campo se obtienen consultando el dato maestro  
fuel_type  
Ver más
last_update_pid
NO
texto
20220227143400
Código o identificación de la operación o momento en el que se invocó a la API.
Se utiliza  para hacer un seguimiento de las operaciones (en caso de ser necesario) o de un lote de carga.
Parámetros para actualizar la unidad de stock USADOS
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
license_plate
NO
texto
JH-212-FF
Chapa patente de la unidad
integration_reference_code
NO
texto
234234-2022
ID – Identificador único de la unidad de stock en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de stock:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declarase.
availability_status_code
SI
dato maestro
1
Código de estado de la disponibilidad del vehículo
Los valores para este campo se obtienen consultando el dato maestro  
stock_availability  
Ver más
NOTA:
Los 
valores de estado
 que se declaran en el servicio son:  0 – no disponible ; 1 – disponible
Campo Técnico – Sus valores No pueden modificarse
type_code
SI
dato maestro
vn
Código que representa la condición del vehículo (vn/vo)
Los valores para este campo se obtienen consultando el dato maestro  
vehicle_types 
Ver más
brand
SI
texto
FORD
Marca del vehículo
model
SI
texto
TA
Modelo del vehículo
version
SI
texto
1.2
Versión del vehículo
odometer
NO
texto
25000
Valor actual del odómetro
vin
 NO
texto
KB777889
Vin del vehículo
business_channel
 NO
texto
SEMINUEVO
Representa el canal de venta de la unidad.
NOTA:
Es abierto e informativo. Puede completarse con valores tales como por ejemplo: “eCommerce” ;  “0km” ; “salón” ; “USADO” ; “SEMINUEVO”
color
SI
texto
GRIS PLATA
 Color del vehículo
year
SI
número
2022
 Año de fabricación del vehículo
received_flag
SI
flag
1
Flag que identifica si el vehículo se encuentra físicamente en stock.
Valores posibles:
 0 = Vehículo no recibido ; 1 = Vehículo físico
fuel_type_code
 NO
dato maestro
gas
Código de tipo de combustible
Los valores para este campo se obtienen consultando el dato maestro  
fuel_type 
Ver más
comments
 NO
texto
Excelente estado
 Campo de texto libre que se utiliza para  agregar información de la unidad tales  como:  su condición, su estado, particularidades de la misma
Generalmente se completa cuando la unidad es usada.
accesories
NO
texto
Alarma, luces frontales
Descripción de los accesorios de la unidad
prices
type
currency
value
NO
estructura
texto
texto
número
“SALE_COST”,
“Dólar”,
25000
Estructura en la que se declara el valor de venta de la unidad.
Nota:
Se usa habitualmente cuando la unidad es usada. Permite valorizar el stock .
Si se informa 
value, type
 es mandatorio y su valor es 
“SALE_COST”
value
 se expresa, sin separador de miles y con punto decimal
Otros parámetros que pueden ser de interés declarar al actualizar una unidad de stock USADOS
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
published_in_web_flag
NO
flag
1
Número de Pedido de la unidad (a la fábrica)
Cuando el sistema usa el plugin de Stock de Pilot, entonces puede publicar la unidad directamente indicando 1
owner_branch_code
NO
texto
232
Id de la sucursal dueña del stock.
Nota:
Se usa para no permitir la venta de unidades entre puntos de venta diferentes
certificate
NO
texto
876s7dfasdasd78
Número de certificado de importación.
Nota:
Sólo válido para unidades nuevas de vienes de uso.
engine_number
NO
texto
2323232323
Número de motor de la unidad
factory_invoicing_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de facturación de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
invoice_payment_dt
NO
fecha
2010-10-01T00:00:00-0000
Fecha de pago de la unidad,  a la fábrica.
Nota:
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
prices
type
currency
value
 NO
estructura
texto
texto
número
“PURCHASE_COST”,
“Dólar”,
12000
Estructura en la que se declara el valor de compra de la unidad.
Nota:
Si se informa 
value, type
 es mandatorio y su valor es 
“PURCHASE_COST”
value
 se expresa, sin separador de miles y con punto decimal
last_update_pid
NO
texto
20220227143400
Código o identificación de la operación o momento en el que se invocó a la API.
Se utiliza  para hacer un seguimiento de las operaciones (en caso de ser necesario) o de un lote de carga.
Ejemplo de Solicitud para actualizar una unidad de stock NUEVA
curl --location --request POST '
https://api.pilotsolution.net/v1/stock/update.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "id": "DF2D7312-9F49-428C-94C6-B1ECC624BFFB",
        "factory_request_number": "123457",
        "integration_reference_code": "mi_codigo_23",
        "availability_status_code": "1",
        "type_code": "vn",
        "brand": "FORD",
        "model": "RENEGADE",
        "version": "LIMITED",
        "factory_code": "GHJ123",
        "location": "San Francisco",
        "vin": "KB777889",
        "business_channel": "NUEVOS",
        "color": "GRIS_PLATA",
        "year": "2011",
        "received_flag": 0,
        "factory_status": "54-Logistica",
        "comments": "Nueva linea",
        "accesories": "Asientos calefaccionados",
        "prices": [
            {
                "type": "SALE_COST",
                "currency": "DOL",
                "value": 135034
            }
        ],
        "last_update_pid": "201902051400"
    },
    "header": {
        "FlowName": "stock_update",
        "SequenceId": 1,
        "TimeStamp": 124789,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token}}"
    }
}
Respuesta a Solicitud Actualización de una unidad de stock 
Satisfactoria
Especificación de la entidad “unidad stock”
{
    "ts": "1655785532",
    "_id": "195399",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "AE6E4BD1-CCB0-46D1-B234-B2DF4E3BF504",
            "integration_reference_code": "mi_codigo_23",
            "brand": "FORD",
            "model": "RENEGADE",
            "version": "LIMITED",
            "year": "2011",
            "odometer": null,
            "color": "GRIS_PLATA",
            "location": "San Francisco",
            "accesories": "Asientos calefaccionados",
            "license_plate": "",
            "vin": "KB777889",
            "business_channel": "NUEVOS",
            "received_flag": "0",
            "days_in_stock": 0,
            "manual_flag": "0",
            "comments": "Nueva linea",
            "published_in_web": "0",
            "engine_number": "",
            "type": {
                "code": "VN",
                "name": "Vehiculo nuevo"
            },
            "certificate": {
                "has_document": null,
                "number": ""
            },
            "reservation": {
                "reserved_by_user": null,
                "reserved_dt": "",
                "expiration_dt": "",
                "opportunity_sale": null,
                "comments": "",
                "assigned_by_user": null,
                "assigned_dt": ""
            },
            "factory": {
                "request_number": "123457",
                "code": "GHJ123",
                "invoicing_dt": "",
                "status": "54-Logistica",
                "invoice_payment_dt": ""
            },
            "position": "",
            "status": null,
            "prices": [
                {
                    "type": "SALE_COST",
                    "value": "135034.00"
                },
                {
                    "type": "PURCHASE_COST",
                    "value": null
                }
            ],
            "fuel": null,
            "availability_status": {
                "code": "1",
                "name": "Disponible"
            },
            "created": {
                "user": {
                    "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                    "integration_reference_code": "",
                    "name": "localdesa.admin@pilotsolution.com.ar",
                    "fullname": "Admin Localdesa"
                },
                "dt": "2022-06-21T04:25:29+0000"
            },
            "updated": {
                "user": {
                    "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                    "integration_reference_code": "",
                    "name": "localdesa.admin@pilotsolution.com.ar",
                    "fullname": "Admin Localdesa"
                },
                "dt": "2022-06-21T04:25:29+0000"
            },
            "deleted": {
                "flag": "0",
                "user": null,
                "dt": ""
            },
            "owner_branch_code": null,
            "import_code": null,
            "saving_plan": {
                "saving_plan_group": "",
                "saving_plan_order": ""
            }
        }
    }
}
Ejemplo de Respuesta con 
error 
(al modificar una unidad de stock el valor del campo type_code no existe)
{
	"ts": "1498156097",
	"_id": "93528",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "type_code not found: N"
	}
}
b) Estado de disponibilidad de la unidad
POST
/v1/stock/update.php
Una unidad de stock para la venta puede tomar los siguientes estados de disponibilidad:
No Disponible
Disponible
Reservado
Vendido
Entregado
Unidad Demo
Ciclo de transición del estado de disponibilidad de las unidades
En el siguiente mapa puede visualizarse el ciclo de transición del estado  de disponibilidad de una unidad de stock en 
CRM PILOT
.
Los únicos valores posibles que el 
ERP
 puede asignar al estado de disponibilidad son:
0 – No Disponible:
 la unidad no puede ser asignada a una venta o reservada. Tampoco se ve en el stock
1 – Disponible:
 la unidad está visible para los vendedores y se puede vender. 
Los otros estados de disponibilidad son de uso exclusivo de CRM PILOT
Si el 
ERP
 , por ejemplo, intentara cambiar la 
disponibilidad de la unidad del estado
 “Vendido” al estado “No Disponible”, 
CRM PILOT
, responde con un error, informando que el cambio NO puede ser realizado debido al estado actual de disponibilidad de la unidad.
Algunos motivos por los cuales podría necesitar cambiar el estado de disponibilidad, en 
CRM PILOT
:
Estando Disponible pasa a No Disponible:
 la unidad sufrió un desperfecto y debe ser llevada a reparar; la unidad se retira de la venta momentáneamente.
Estando No Disponible pasa a Disponible:
 se requiere poner disponible nuevamente para la venta.
Para cambiar el 
estado de disponibilidad
 de una unidad, el 
ERP
 debe utilizar el 
ID – Identificador único de la unidad en el CRM
. 
Parámetros para actualizar Estado de Disponibilidad de una unidad de stock
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
guid (32 bits)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único de la unidad de stock de 
CRM PILOT
availability_status_code
SI
dato maestro
1 o “1”
Código de estado de la disponibilidad de la unidad 
NOTA:
Los valores de estado que se declaran en el servicio son:  0 – no disponible ; 1 – disponible
Los otros estados que una unidad de stock puede presentar:  asignado, vendido, entregado son asignados por 
CRM PILOT.
Campo Técnico – Sus valores No pueden modificarse
status_code
NO
dato maestro
depósito
Código de estado propio de 
ERP
 (para visión del usuario). Ej: si una unidad asume el estado de disponibilidad : No disponible, en status_code podría asignarse “En Taller”
Los valores para este campo se obtienen consultando el dato maestro  
stock_status
Ver más
Ejemplo de solicitud para actualizar el Estado de Disponibilidad de una unidad
curl --location --request POST '
https://api.pilotsolution.net/v1/stock/update.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
       "id": "DF2D7312-9F49-428C-94C6-B1ECC624BFFB",
        "availability_status_code": "0",
        "status_code": "en_logistica"
    },
    "header": {
        "FlowName": "stock_update_availability_code",
        "SequenceId": 1,
        "TimeStamp": 124789,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token}}"
    }
}'
Ejemplo de Respuesta con error, cuando existe conflicto en la transición de un estado de disponibilidad (el actual) a otro
{
    "ts": "1657651447",
    "_id": "168598713",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "business_error",
        "message": "availability_status_code incorrecto, sólo se admite [0,1,6]"
    }
}
Control de Cambios
Fecha
Cambio
1 Diciembre 2018
Documento creado
31 Octubre 2022
Se especifican los parámetros a declarar según el tipo de unidad: Nueva – Usada
Se subdivide la actualización según ésta aplique a : Datos propios o estado de disponibilidad
Se profundiza en detalles referidos al estado de disponibilidad
20 Marzo 2025
Se agrega la obligatoriedad de completitud del código de fábrica para autos nuevos. Debe existir en el Maestro de Productos de PILOT.
Updated on 03/24/2025

### Actualizar Venta de una  - API CRM
Actualizar Venta de una unidad - API CRM
POST
/v1/stock/invoice.php
Cuando en el 
ERP
 se factura la unidad de inventario, ésta acción se informa a 
CRM PILOT 
indicando:
id = 
 ID de la unidad de stock de
 CRM PILOT
customer_invoice_number” = 
número de factura
customer_invoice_date
” = fecha de facturación
customer_invoice_amount
” = monto facturado 
Para actualizar información referida a la facturación de la unidad, el 
ERP
 debe utilizar el 
ID – Identificador único de la unidad en el CRM
. 
Parámetros para actualizar datos referidos a la facturación  de una unidad de stock
Parámetros para actualizar datos referidos a la facturación  de una unidad de stock
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
guid (32 bits)
52AF4FFB-A1E3-48FC-B552-C1AB54B93508
Identificador único de la unidad de stock de 
CRM PILOT
customer_invoice_number
SI
 texto
“54-986156”
Número de factura
customer_invoice_date
SI
fecha
2023-06-26
Fecha de factura
Nota:
su formato es UTC   yyyy-mm-dd
customer_invoice_amount
SI
 número
 8798798.77
Monto facturado
Nota:
se expresa, sin separador de miles y con punto decimal
Ejemplo de actualización de la unidad vendida con datos de facturación
curl --location --request POST '
https://api.pilotsolution.net/v1/stock/invoice.php'
 \
--header 'Content-Type: application/json' \
--data-raw '{
	"data": {
            "id": "52AF4FFB-A1E3-48FC-B552-C1AB54B93508", 
            "customer_invoice_number": "54-986156", 
            "customer_invoice_date": "2023-06-26", 
            "customer_invoice_amount": "8798798.77"
	},
	"header": {
		"FlowName": "stock_invoice_update",
		"SequenceId": 1,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
                "access_token": "{{auth_token}}"
	}
}'
Ejemplo de Respuesta 
Satisfactoria
{
    "ts": "1666298807",
    "_id": "251476",
    "result": {
        "status": "success",
        "aditional_data": []
    }
}
Ejemplo de Respuesta con 
error
{
    "ts": "1666298807",
    "_id": "251476",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "technical_error",
        "sub-code": null,
        "message": "El parámetro 'customer_invoice_date' es requerido."
    }
}
Control de Cambios
Fecha
Cambio
31 Octubre 2022
Documento creado
Updated on 03/09/2023

### Actualizar Entrega de una unidad
Actualizar Entrega de una unidad
POST
/v1/stock/delivery.php
Cuando en el 
ERP
 se entrega la unidad de inventario vendida, ésta se informa a 
CRM PILOT 
indicando:
id = 
 ID de la unidad de stock de
 CRM PILOT
customer_delivery_date
” = fecha de entrega, en formato “yyyy-mm-dd”
Para asignar la fecha de entrega de la unidad vendida, el 
ERP
 debe utilizar el 
ID – Identificador único de la unidad en el CRM
. 
Parámetros para actualizar datos referidos a la facturación  de una unidad de stock
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
guid (32 bits)
52AF4FFB-A1E3-48FC-B552-C1AB54B93508
Identificador único de la unidad de stock de 
CRM PILOT
customer_delivery_date
SI
fecha
2023-06-26
Fecha de entrega de la unidad
Nota:
su formato es UTC   yyyy-mm-dd
Ejemplo de actualización de la unidad entregada 
curl --location --request POST '
https://api.pilotsolution.net/v1/stock/delivery.php'
 \
--header 'Content-Type: application/json' \
--data-raw '{
	"data": {
            "id": "52AF4FFB-A1E3-48FC-B552-C1AB54B93508", 
            "customer_delivery_date": "2023-06-26"
	},
	"header": {
		"FlowName": "stock_delivery_update",
		"SequenceId": 1,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
                "access_token": "{{auth_token}}"
	}
}'
Ejemplo de Respuesta 
Satisfactoria
{
    "ts": "1666298807",
    "_id": "251476",
    "result": {
        "status": "success",
        "aditional_data": []
    }
}
Ejemplo de Respuesta con 
error
{
    "ts": "1666298807",
    "_id": "251476",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "technical_error",
        "sub-code": null,
        "message": "El parámetro 'customer_delivery_date' es requerido."
    }
}
Control de Cambios
Fecha
Cambio
31 Octubre 2022
Documento creado
Updated on 03/09/2023

### Adjuntar comentario - API CRM
Adjuntar comentario - API CRM
GET
/v1/stock/comments_create.php
Toda vez que se necesita adjuntar un comentario a una unidad de Stock en CRM PILOT, el Sistema Externo invoca la API provista.
Parámetros para adjuntar un comentario a una unidad de stock
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
Ej: 409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único de unidad de stock en CRM PILOT.
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
comment
NO
texto
“agregar un comentario”
Ejemplo de solicitud para adjuntar un comentario a unidad de stock  
curl --location --request GET '
https://api.pilotsolution.net/v1/stock/comments_create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
	"id": "BAE6822F-C569-4CE8-BA0C-FD5E1B08D86F",
        "comment": "agregar un comentario"
	},
	"header": {
		"FlowName": "stock_comment_create",
		"SequenceId": 1,
		"TimeStamp": 124789,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token": "{{token}}"
	}
}'
Respuesta a Solicitud creación de una unidad de stock NUEVA Satisfactoria. Especificación de la entidad “unidad stock” 
{
    "ts": "1655785532",
    "_id": "195399",
    "result": {
        "status": "success",
        "aditional_data": []
 }
}
Ejemplo de Respuesta con error (al adjuntar un comentario a una unidad de stock con Id de stock inexistente)
{
	"ts": "1498074655",
	"_id": "91377",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Stock not found:2"
	}
}
Updated on 08/03/2023

### Subir imagen - API CRM
Subir imagen - API CRM
POST
/v1/stock/images_create.php
Se utiliza para 
asociar
 una imagen a una unidad del stock a partir del 
ID – Identificador Único en CRM PILOT
Parámetro para solicitar la asociación de una imagen a unidad de stock
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
image
SI
file
 /Users/Downloads/ford.png
Imagen a asociar
id
SI
guid (32 bits)
20FDC391-873C-46BB-8C37-02EDFA10B849
Identificador único de la unidad de stock de PILOT
access_token
SI
texto
“eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjE2MT”
Identificador para autenticación
Ejemplo de solicitud para asociar una imagen a una unidad de stock  
curl --location --request GET '
https://api.pilotsolution.net/v1/stock/images_create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
	      "image": /Users/Downloads/ford.png,
              "id": 20FDC391-873C-46BB-8C37-02EDFA10B849,
              "access_token":"{{token}}"		
	},
	"header": {
		"Content-type": "multipart/form-data; boundary=------multipartformboundary1645204485827",
		"Content-length": "641",
		"Connection": close
	}
}
Respuesta a Solicitud de asociación de una imagen a una unidad de stock Satisfactoria. 
La imagen asociada a la unidad de stock es representada en 4 tipos diferentes referenciados en el atributo ‘size’: thumbnail; phone; phablet; desktop
{
    "ts": "1688653631",
    "_id": "267991097",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": [
            {
                "id": "81",
                "extension": "jpeg",
                "mime_type": "image/jpeg",
                "full_path": "
https://cdn.pilotsolution.net/crm/stock/homologacion/1/1_81_thumbnail.jpeg
",
                "size": "thumbnail",
                "audit_dt": "2023-07-06T14:27:10+0000",
                "audit_user_id": "49899"
            },
            {
                "id": "81",
                "extension": "jpeg",
                "mime_type": "image/jpeg",
                "full_path": "
https://cdn.pilotsolution.net/crm/stock/homologacion/1/1_81_phone.jpeg
",
                "size": "phone",
                "audit_dt": "2023-07-06T14:27:10+0000",
                "audit_user_id": "49899"
            },
            {
                "id": "81",
                "extension": "jpeg",
                "mime_type": "image/jpeg",
                "full_path": "
https://cdn.pilotsolution.net/crm/stock/homologacion/1/1_81_phablet.jpeg
",
                "size": "phablet",
                "audit_dt": "2023-07-06T14:27:10+0000",
                "audit_user_id": "49899"
            },
            {
                "id": "81",
                "extension": "jpeg",
                "mime_type": "image/jpeg",
                "full_path": "
https://cdn.pilotsolution.net/crm/stock/homologacion/1/1_81_desktop.jpeg
",
                "size": "desktop",
                "audit_dt": "2023-07-06T14:27:10+0000",
                "audit_user_id": "49899"
            }
        ]
    }
}
Ejemplo de Respuesta con error (al asociar una imagen a una unidad de stock inexistente) 
{
	"ts": "1498074655",
	"_id": "91377",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
                "subcode": null,
		"message": "stock does not exist"
	}
}
Control de Cambios
Fecha
Cambio
Junio 2022
Documento creado
Updated on 07/10/2023

### Borrar imagen - API CRM
Borrar imagen - API CRM
POST
/v1/stock/images_delete.php
Se utiliza para borrar una imagen  asociada a una unidad del stock a partir del 
ID – Identificador Único en CRM PILOT
 Parámetro para solicitar el borrado de una imagen asociada  a una unidad de stock 
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
guid (32 bits)
BAE6822F-C569-4CE8-BA0C-FD5E1B08D86F
Identificador único de la unidad de stock de PILOT
image_id
SI
texto
45
Identificador único de la imagen a dar de baja
header
Flowname
SequencedId
TimeStamp
TackingId
access_token
SI
SI
SI
SI
SI
texto
texto
texto
texto
texto
“stock_images_delete”
1
124789
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
{{token}}
nombre del flujo que se aplica
número de secuencia
Fecha y Hora de la acción en modo TimeStamp
Id de seguimiento
autenticación
Ejemplo de solicitud de baja de una imagen asociada a  una unidad de stock
curl --location --request GET '
https://api.pilotsolution.net/v1/stock/images_delete.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
              "id": 20FDC391-873C-46BB-8C37-02EDFA10B849,
              "image_id":"45"		
	},
	"header": {
               "FlowName": "stock_images_delete",
               "SequenceId": 1,
               "TimeStamp": 124789,
               "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",        
               "access_token": "RzIjoiMTYxNDcwMDE2MSIsIl9pZCI6IkVNQVUxMUdSS0cwWVRSMFhDIiwiYXBwa2"
 } 
}
Ejemplo de Respuesta con error (al borrar una imagen a una unidad de stock inexistente)
{
	"ts": "1498074655",
	"_id": "91377",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
                "subcode": null,
		"message": "stock does not exist"
	}
}
Control de Cambios
Fecha
Cambio
Abril 2022
Documento creado
Updated on 07/06/2023

### Listar imagen - API CRM
Listar imagen - API CRM
POST
/v1/stock/images_list.php
Se utiliza para ver (listar) la o las imágenes  asociadas a una unidad del stock a partir del 
ID – Identificador Único en CRM PILOT
 Parámetro para solicitar el listado de las imágenes asociadas a una unidad de stock 
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
guid (32 bits)
BAE6822F-C569-4CE8-BA0C-FD5E1B08D86F
Identificador único de la unidad de stock de PILOT
Ejemplo de solicitud de listado de las imágenes asociadas a una una unidad de stock
curl --location --request GET '
https://api.pilotsolution.net/v1/stock/images_list.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
           "id": "BAE6822F-C569-4CE8-BA0C-FD5E1B08D86F"
        },
        "header": {
        "FlowName": "stock_images_list",
        "SequenceId": 1,
        "TimeStamp": 124789,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "nRzIjoiMTYxNDcwMDE2MSIsIl9pZCI6IkVNQVUxMUdSS0cwWVRSMFhDIiwiYXBwa2V5IjoiMzM0..."
       }
}
Control de Cambios
Fecha
Cambio
Abril 2022
Documento creado
Updated on 07/10/2023

## Clientes - API CRM
Clientes - API CRM

### Entidad Clientes - API CRM
Entidad Clientes - API CRM
Valores de retorno para todos los servicios de cliente a facturar
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
ID – Identificador único del cliente a facturar en PILOT sobre el que se realiza la operación de actualización
NOTA:
Se recomienda preservar este valor en su sistema, pues es la única forma de acceder al cliente.
integration_reference_code
texto
ID – Identificador único del cliente a facturar en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada cliente a facturar:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declarase.
name
texto (100)
Razón Social del cliente
tax_identification
texto (50)
Identificador tributario del cliente. Es único para cada cliente.
NOTA:
e
n Argentina :
 se declara el Número de CUIT/CUIL
en México :
 se declara el Número RFC No Genérico o el CURP ´Número de Identidad único
phone
texto (50)
Número de Teléfono Fijo del cliente
cellphone
texto (50)
Celular del cliente
email
texto (250)
Email del cliente
birthday
fecha
Fecha de nacimiento del cliente
NOTA:
Su formato es UTC yyyy-mm-ddeThh:mm:sss en formato 24 hs.
comment
texto (4000)
Comentario referido al domicilio. Ej: Es la puerta negra
prospect
id
first_name
last_name
estructura
texto  (de 32 bits en formato GUID)
texto  (50)
texto  (50)
Prospecto
Id del prospecto
Nombre del prospecto
Apellido del prospecto
both_owners_flag
flag
Determina si ambos son dueños del vehículo
Valores Posibles:
 0 = Uno solo es dueño ; 1 = Ambos son dueños
emancipated_flag
flag
Flag que identifica si el cliente (siendo menor de edad) está emancipado o no
Valores Posibles:
 0 =  No Emancipado ; 1 = Emancipado
national_document
number
type
code
name
estructura
texto (50)
estructura
texto (10)
texto (50)
Documento de identidad del cliente
Número de documento de identidad
Tipo de Documento de identidad del cliente
Código del tipo de documento de identidad
Número del tipo de documento de identidad
address
street
door_number
floor
apartment
city
province
name
code
country
code
name
postal_code
latitude
longitude
comments
estructura
texto (250)
texto (10)
texto (10)
texto (10)
texto (100)
estructura
texto (50)
texto (10)
estructura
texto (10)
texto (50)
texto (50)
texto ((50)
texto (50)
texto (4000)
Domicilio de residencia del cliente
Nombre de la calle de residencia del cliente
Número de la altura de la calle de residencia del clienteNúmero de piso de de residencia del clienteletra o descripción del departamento de residencia del clienteCiudad de residencia del cliente
Provincia/Estado de residencia del cliente
Nombre de la Provincia/Estado de residencia del clienteCódigo de referencia de la Provincia/Estado de residencia del cliente
País de residencia del cliente
Código del País de residencia del cliente
Nombre del país de residencia del cliente
Código postalLatitud del domicilio del cliente
Longitud del domicilio del cliente
Comentario acerca del domicilio
tax_situation
code
name
estructura
texto (10)
texto (50)
Condición tributaria
Código de condición tributaria
Nombre de la condición tributaria
spouse
fullname
birthday
national_document
number
type
code
name
estructura
texto (100)
fecha
estructura
texto (50)
estructura
texto (10)
texto (50)
Cónyuge
Nombre completo
Fecha de nacimiento 
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
Documento de identidad
Número de documento
Tipo de Documento de identidad
Código del tipo de documento – Los valores para este campo se obtienen consultando el dato maestro  
document_type 
Ver más 
Nombre del tipo de documento
marital_state
code
name
estructura
texto (10)
texto (50)
Estado Civil
Código – Los valores para este campo se obtienen consultando el dato maestro  
marital_state 
Ver más 
Descripción del estado civil
type
code
name
estructura
texto (10)
texto (50)
Describe el tipo de cliente
Código del tipo de cliente – Los valores para este campo se obtienen consultando el dato maestro   
customer_type 
Ver más ;
Descripción del tipo de cliente
gender
code
name
estructura
texto (10)
texto (50)
Género
Código de género del cliente – Los valores para este campo se obtienen consultando el dato maestro   
gender 
Ver más 
Descripción del género del cliente
nationality
code
name
estructura
texto (10)
texto (50)
Nacionalidad
Código de nacionalidad del cliente – Los valores para este campo se obtienen consultando el dato maestro   
country 
Ver más 
Nombre de la nacionalidad
iibb_condition
code
name
estructura
texto (10)
texto (50)
Ingresos Brutos
Código de ingresos brutos – Los valores para este campo se obtienen consultando el dato maestro   
libb_type 
Ver más 
Nombre de la condición de ingresos brutos
Comments
texto (4000)
Notas
created
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
&lt;&gt;fecha
Estructura de auditoría referida a la creación del registro cliente
Información del responsable de la creación del registro cliente
Id del usuarioCódigo de referencia de usuario del sistema que se integraEmail del usuarioNombre completo del usuario
Fecha de creación del cliente
Nota: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
updated
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría referida a la última actualización del registro cliente
Información del responsable de la creación del registro cliente
Id del usuarioCódigo de referencia de usuario del sistema que se integraEmail del usuario
Nombre completo del usuario
Fecha de creación del cliente
Nota: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
deleted
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría referida al borrado (baja lógica) del registro cliente
Información del responsable de la creación del registro cliente
Id del usuarioCódigo de referencia de usuario del sistema que se integraEmail del usuario
Nombre completo del usuario
Fecha de creación del cliente
Nota: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
sale_extended_form_flag
flag
 Flag que indica que es necesario solicitar más información del cliente
Valores Posibles:
 0 =  No solicitar ; 1 = Solicitar
is_valid
flag
Valores Posibles:
 true / false   
(Deprecado)
required_fields
field
complete
field
complete
field
complete
field
complete
field
complete
field
complete
array
texto
texto
texto
texto
texto
texto
texto
texto
texto
texto
texto
texto
Array de uso interno PILOT – No considerar
“tax_identification”
“true”
“type_id”
“true”
“name”
“true”
“phone”
“true”
“cellphone”
“true”
“email”
“true”
Control de cambios
Fecha
Cambio
01 Diciembre 2018
Documento creado
 16 Noviembre 2022
 Agregado de longitud en la columna Tipo Ej: texto (100) Agregado de una Nota explicativa para la completitud del campo Tax_identification
Updated on 11/04/2025

### Crear - API CRM
Crear - API CRM
POST
/v1/customers/create.php
La creación de un cliente a facturar se realiza mediante la invocación de la API provista.
Parámetro para crear un cliente en CRM PILOT
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
integration_reference_code
NO
 texto
“0027”
 ID – Identificador único del cliente a facturar en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada cliente a facturar:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declarase.
tax_identification
SI
texto
“XAXX010101000”
Identificador tributario del cliente. Es único para cada cliente
NOTA:
e
n Argentina :
 se declara el Número de CUIT/CUIL
en México :
 se declara el Número RFC No Genérico o el CURP ´Número de Identidad único
name
SI
texto
“NISSAN33333 CHILE SPA”
Nombre/Razón Social del cliente.
phone
NO
texto
“115040602”
Número de Teléfono Fijo del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
cellphone
NO
texto
“1130201020”
Número de celular del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
email
NO
texto
“prueba@prueba.cm”
Email del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
document_type_code
NO
texto
 “4”
Código del tipo de documento del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
document_type 
Ver Maestros
document_number
NO
texto
 “34205710”
Número de documento de identidad del cliente
address_street
NO
texto
 “AV. ISIDORA GOYENECHEA 2800”
Nombre de la calle donde vive el cliente
address_door_number
NO
texto
 “300”
Número de la altura donde vive el cliente
address_floor
NO
texto
 “1”
Número piso de donde vive el cliente
address_apartment
NO
texto
 “A”
Número, letra o descripción del departamento donde vive el cliente
address_city
NO
texto
 “SANTIAGO”
Ciudad donde vive el cliente
address_province_code
NO
texto
 “24”
Código de referencia de la provincia donde vive el cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
province 
Ver Maestros
address_country_code
NO
texto
 “CL”
Código de referencia del país donde vive el cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
country 
Ver Maestros
address_postal_code
NO
texto
 “2333”
Código postal donde vive el cliente
address_latitude
NO
texto
 “3.7492”
Latitud de donde vive el cliente
address_longitude
NO
texto
 “40.4637”
Longitud de donde vive el cliente
address_comments
NO
texto
 “”
Comentarios sobre el domicilio
birthday
NO
texto
 “1983-02-12T15:19:21.000”
Fecha de nacimiento del cliente
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
comments
NO
texto
 “Confiable”
Notas
tax_situation_code
NO
texto
 “1”
Código de referencia de la situación tributaria del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
tax_situation 
Ver Maestros
spouse_fullname
NO
texto
 “Esposa”
Nombre completo del cónyuge del cliente
spouse_document_type_code
texto
 “4”
Código de referencia del tipo de documento del cónyuge del cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
document_type 
Ver Maestros
address_document_number
NO
texto
 “34567878”
Número de documento del cónyuge del cliente
spouse_birthday
NO
texto
 “1990-02-12”
Fecha de nacimiento del cónyuge
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
both_owners
NO
texto
 “Si”
Notación que indica si el Cliente y su cónyuge son ambos dueños de la unidad
Valores Posibles:
 NO = Uno solo es dueño ; SI = Ambos son dueños
marital_state_code
NO
texto
 “Soltero”
Código de referencia del estado matrimonial del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
marital_state 
Ver Maestros
type_code
NO
texto
 “person”
Código de referencia del tipo de cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
type_code 
Ver Maestros
gender_code
NO
texto
 “male”
 Código de referencia del género del cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
gender_code 
Ver Maestros
nationality_code
NO
texto
 “CL”
Código de referencia de la nacionalidad del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
nationality_code 
Ver Maestros
libb_condition_code
NO
texto
 “”
Código de referencia de la condición de ingresos brutos del cliente
NOTA:
Condición sólo valida en Argentina
Los valores para este campo se obtienen consultando el dato maestro  
libb_type 
Ver Maestros
emancipated_flag
NO
flag
 1
Flag que identifica si el cliente (siendo menor de edad) está emancipado o no
Valores Posibles:
 0 =  No Emancipado ; 1 = Emancipado
both_owners_flag
NO
flag
 0
Flag que indica si el cliente y su cónyuge son ambos dueños del vehiculo
Valores Posibles:
 0 = Uno solo es dueño ; 1 = Ambos son dueños
source_prospect_id
NO
texto
 null
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINONO
NO
SI
textonúmerotimestamp
texto
texto
“customer_to_invoice_create”11493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuenciafecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Crear un Cliente a Facturar
curl --location --request POST '
https://api.pilotsolution.net/v1/customers/create.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{{
	"data": {
		"integration_reference_code": "0027",
		"tax_identification":"XAXX010101000",
		"name": "NISSAN33333 CHILE SPA",
		"phone": "115040602",
		"cellphone": "1130201020",
		"email": "prueba@prueba.cm",
		"document_type_code": "4",
		"document_number": "34205710",
		"address_street": "AV. ISIDORA  GOYENECHEA 2800",
		"address_door_number": "300",
		"address_floor": "1",
		"address_apartment": "A",
		"address_city": "SANTIAGO",
                "address_province_code": "24",
		"address_country_code": "CL",
		"address_postal_code": "2333",
		"address_latitude": "3.7492",
		"address_longitude": "40.4637",
                "address_comments": "Puerta verde"
		"birthday": "1983-02-12T15:19:21.000",
                "comments": "Notas del cliente"
		"tax_situation_code": "1",
		"spouse_fullname": "Esposa",
		"spouse_document_type_code": "4",
		"spouse_document_number": "34567878",
		"spouse_birthday": "1990-02-12",
		"both_owners": "Si",
		"marital_state_code": "Soltero",
		"type_code": "person",
		"gender_code": "male",
		"nacionality_code": "CL",
		"iibb_condition_code": "",
		"emancipated_flag": "1",
		"both_owners_flag": 0,
		"source_prospect_id":null
	},
   "header": {
        "FlowName": "customer_to_invoice_create",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud Creación de un Cliente a facturar Satisfactoria 
Especificación de la entidad “Cliente”
{
    "ts": "1708372332",
    "_id": "38625731",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "969287D2-01A2-44DA-81A2-9397DFDBB2E3",
            "integration_reference_code": "0057",
            "name": "NISSAN33333 CHILE SPA",
            "tax_identification": "XAXX010101001",
            "phone": "115040602",
            "cellphone": "1130201020",
            "email": "prueba@prueba.cm",
            "birthday": "1983-02-12T00:00:00",
            "comment": "Notas del cliente",
            "prospect": {
                "id": null,
                "first_name": null,
                "last_name": null
            },
            "both_owners_flag": 0,
            "emancipated_flag": 1,
            "national_document": {
                "number": null,
                "type": {
                    "code": null,
                    "name": null
                }
            },
            "address": {
                "street": "AV. ISIDORA  GOYENECHEA 2800",
                "door_number": "300",
                "floor": "1",
                "apartment": "A",
                "city": "SANTIAGO",
                "province": {
                    "code": "24",
                    "name": "CAPITAL FEDERAL"
                },
                "country": {
                    "code": "CL",
                    "name": "Chile"
                },
                "postal_code": "2333",
                "latitude": "3.7492",
                "longitude": "40.4637",
                "comments": "Puerta verde",
            },
            "tax_situation": {
                "code": "1",
                "name": "Responsable Inscripto"
            },
            "spouse": {
                "fullname": "Esposa",
                "birthday": "1990-02-12",
                "national_document": {
                    "number": null,
                    "type": {
                        "code": null,
                        "name": null
                    }
                }
            },
            "marital_state": {
                "code": "Soltero",
                "name": "Soltero"
            },
            "type": {
                "code": "person",
                "name": "Revendedor"
            },
            "gender": {
                "code": "male",
                "name": "Masculino"
            },
            "nationality": {
                "code": null,
                "name": null
            },
            "iibb_condition": {
                "code": "1",
                "name": "Exento"
            },
            "created": {
                "user": {
                    "id": "CB6E1A6A-E3E5-4817-ABFB-DD5EDBA65D0C",
                    "integration_reference_code": null,
                    "name": "API.consultas@pilotsolution.net",
                    "fullname": "Api Consultas"
                },
                "dt": "2024-02-19T19:52:12.663"
            },
            "updated": {
                "user": {
                    "id": null,
                    "integration_reference_code": null,
                    "name": null,
                    "fullname": null
                },
                "dt": null
            },
            "deleted": {
                "user": {
                    "id": null,
                    "integration_reference_code": null,
                    "name": null,
                    "fullname": null
                },
                "dt": null
            },
            "sale_extended_form_flag": "0",
            "is_valid": true,
            "required_fields": [
                {
                    "field": "tax_identification",
                    "complete": true
                },
                {
                    "field": "type_id",
                    "complete": true
                },
                {
                    "field": "name",
                    "complete": true
                },
                {
                    "field": "phone",
                    "complete": true
                },
                {
                    "field": "cellphone",
                    "complete": true
                },
                {
                    "field": "email",
                    "complete": true
                }
            ]
        }
    }
}
Ejemplo estructura error de respuesta JSON
{
"ts": "1493991767",
"_id": "5594",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "customer exist in database"
}
}
Control de Cambios
Fecha
Cambio
19 Febrero 2024
se reemplazan los nombres de los siguientes parámetros
national_document_type_code
 por 
document_type_code
national_document_number
 por 
document_number
spouse_national_document_type_code
 por 
spouse_document_type_code
spouse_national_document_number
 por 
spouse_
document_number
se agrega el parámetro 
“both_owners_flag”
se reemplaza el nombre de FlowName 
“customer_create_pilot”
, por 
“customer_to_invoice_create”
1 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Listar - API CRM
Listar - API CRM
POST
/v1/customers/list.php
Este servicio permite:
listar clientes a facturar mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un conjunto de clientes a facturar en CRM PILOT
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
SI
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NOSI
SI
SI
estructura
texto
texto
texto
“tax_situation_code””=”
“1”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
sorts
field
order
NOSI
SI
estructura
texto
texto
 “updated””DESC”
Ordenamiento a aplicar
nombre del campo por el que se ordena
Sentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“List_customers”11493991052″55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de clientes a facturar. 
Filtros
tax_identification
Identificador fiscal
name
Razón Social / Nombre completo del cliente
tax_situation_code
Código de la condición tributaria
created
Fecha de creación del cliente
updated
Fecha de última actualización del cliente
Lista de parámetros  por los cuales puede ordenarse la lista de clientes a facturar a seleccionar
Sort
created
 Fecha de creación del cliente                        Formato ISO (YYYY-MM-DDThh:mm:ss.000)
 updated
 Fecha de última actualización del cliente     Formato ISO (YYYY-MM-DDThh:mm:ss.000)
Operadores
 Igualdad
 =
 Distinto a
 &lt;&gt;
 Mayor a
 &gt; aplica a created y updated
 Menor a
 &lt; aplica a created y updated
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer un customer por su tax_identification
{
    "data": {
        "limit": 25,
        "page": 1,
        "filters":[
            {
                "field": "tax_identification",
                "operation": "=",
                "value": "27129469874"
            }    
        ],
       "wildCard": "*",
       "sorts": [
            {
                "field": "updated",
                "order": "DESC"
            }
        ],
    },
    "header": {
        "FlowName": "List_Customers
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token":"{{token}}"
    }
}
Respuesta a Solicitud listar un conjunto de leads por su id 
Satisfactoria
Especificación de la entidad “Customer”
{
	"ts": "1494445136",
	"_id": "5931",
	"result": {
		"status": "success",
		"aditional_data": {
			"page": 1,
			"page_count": 126,
			"rows_count": 252,
			"rows_per_page": 2,
			"rows_in_page": 2,
			"rows_remaining": 250
		},
		"entitydata": [
			{
				"id": "7F7B612F-AEC7-4BE9-B4F1-531C670393AC",
				"integration_reference_code": "AAA111",
				"name": "Nombre del customer",
				"tax_identification": "27129469874",
				"phone": "47485758",
				"cellphone": "0237-8465651",
				"email": "roberto@nuevo.com",
				"birthday": "",
				"prospect": null,
				"both_owners_flag": "",
				"emancipated_flag": null,
				"national_document": {
					"number": "36789044",
					"type": {
						"code": "4",
						"name": "DNI"
					}
				},
				"address": {
					"street": "AVENIDA MITRE",
					"door_number": "5418",
					"floor": "",
					"apartment": "PISO 2, DE",
					"city": "san martin",
					"province": null,
					"country": {
						"code": "RD",
						"name": "Republica Dominicana"
					},
					"postal_code": "",
					"latitude": "",
					"longitude": ""
				},
				"tax_situation": null,
				"spouse": {
					"fullname": "karina LOPEZ",
					"birthday": "1990-02-12T00:00:00+0000",
					"national_document": {
						"number": "",
						"type": {
							"code": "4",
							"name": "DNI"
						}
					}
				},
				"marital_state": null,
				"type": {
					"code": "1",
					"name": "Particular"
				},
				"gender": null,
				"nacionality": {
					"code": "RD",
					"name": "Republica Dominicana"
				},
				"iibb_condition": null,
				"created": {
					"user": {
						"id": "EDEE33FC-2E6A-4833-9A3D-29A8EF199F0D",
						"integration_reference_code": "123123addddssss",
						"name": "juanpablo@hotmail.com",
						"fullname": "juan mantelli"
					},
					"dt": "2017-04-21T19:24:54+0000"
				},
				"updated": {
					"user": {
						"id": "EDEE33FC-2E6A-4833-9A3D-29A8EF199F0D",
						"integration_reference_code": "123123addddssss",
						"name": "juanpablo@hotmail.com",
						"fullname": "juan mantelli"
					},
					"dt": "2017-05-10T19:34:52+0000"
				},
				"deleted": {
					"user": null,
					"dt": ""
				}
			},
			{
				"id": "4A563B2E-04E7-431D-8178-C50603A25891",
				"integration_reference_code": "P990558",
				"name": "juan prueb",
				"tax_identification": "20-31567839-1",
				"phone": "234809584",
				"cellphone": "",
				"email": "",
				"birthday": "1900-01-01T00:00:00+0000",
				"prospect": null,
				"both_owners_flag": "1",
				"emancipated_flag": null,
				"national_document": {
					"number": "",
					"type": null
				},
				"address": {
					"street": "",
					"door_number": "",
					"floor": "",
					"apartment": "",
					"city": "",
					"province": null,
					"country": null,
					"postal_code": "",
					"latitude": "-36.6067248",
					"longitude": "-72.1407669"
				},
				"tax_situation": null,
				"spouse": {
					"fullname": "juan",
					"birthday": "1998-02-12T00:00:00+0000",
					"national_document": {
						"number": "33333333",
						"type": {
							"code": "LE",
							"name": "LE"
						}
					}
				},
				"marital_state": null,
				"type": {
					"code": "1",
					"name": "Particular"
				},
				"gender": {
					"code": "E",
					"name": "Indefinido"
				},
				"nacionality": null,
				"iibb_condition": null,
				"created": {
					"user": {
						"id": "EDEE33FC-2E6A-4833-9A3D-29A8EF199F0D",
						"integration_reference_code": "123123addddssss",
						"name": "juanpablo@hotmail.com",
						"fullname": "juan mantelli"
					},
					"dt": "2017-02-23T20:13:57+0000"
				},
				"updated": {
					"user": {
						"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
						"integration_reference_code": null,
						"name": "localdesa.admin@pilotsolution.com.ar",
						"fullname": "Desa Local"
					},
					"dt": "2017-05-10T14:37:51+0000"
				},
				"deleted": {
					"user": null,
					"dt": ""
				}
			}
		]
	}
}
Control de Cambios
Fecha
Cambio
24 Enero 2018
Documento creado
Updated on 10/20/2025

### Actualizar - API CRM
Actualizar - API CRM
POST
/v1/customers/update.php
La actualización de los datos de un cliente a facturar se realiza mediante la invocación de la API provista.
Solamente se modifican los parámetros declarados (con o sin valor). 
Parámetro para actualizar un cliente en CRM PILOT
Nombre del Parámetro
 Obligatorio  
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
“7F7B612F-AEC7-4BE9-B4F1-531C670393AC”
ID – Identificador único del cliente a facturar en PILOT sobre el que se realiza la operación de actualización
integration_reference_code
NO
 texto
“0027”
 ID – Identificador único del cliente a facturar en el Sistema Externo
NOTA:
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada cliente a facturar:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
 en el caso que en el sistema externo no se guarde el ID de PILOT es éste el dato que debería declarase.
tax_identification
SI
texto
“XAXX010101000”
Identificador tributario del cliente. Es único para cada cliente
NOTA:
e
n Argentina :
 se declara el Número de CUIT/CUIL
en México :
 se declara el Número RFC No Genérico o el CURP ´Número de Identidad único
name
SI
texto
“NISSAN33333 CHILE SPA”
Nombre/Razón Social del cliente.
phone
NO
texto
“115040602”
Número de Teléfono Fijo del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
cellphone
NO
texto
“1130201020”
Número de celular del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
email
NO
texto
“prueba@prueba.cm”
Email del cliente.
NOTA:
 Debe informarse al menos un medio de contacto.
document_type_code
NO
texto
 “4”
Código del tipo de documento del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
document_type 
Ver Maestros
document_number
NO
texto
 “34205710”
Número de documento de identidad del cliente
address_street
NO
texto
 “AV. ISIDORA GOYENECHEA 2800”
Nombre de la calle donde vive el cliente
address_door_number
NO
texto
 “300”
Número de la altura donde vive el cliente
address_floor
NO
texto
 “1”
Número piso de donde vive el cliente
address_apartment
NO
texto
 “A”
Número, letra o descripción del departamento donde vive el cliente
address_city
NO
texto
 “SANTIAGO”
Ciudad donde vive el cliente
address_province_code
NO
texto
 “24”
Código de referencia de la provincia donde vive el cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
province 
Ver Maestros
address_country_code
NO
texto
 “CL”
Código de referencia del país donde vive el cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
country 
Ver Maestros
address_postal_code
NO
texto
 “2333”
Código postal donde vive el cliente
address_latitude
NO
texto
 “3.7492”
Latitud de donde vive el cliente
address_longitude
NO
texto
 “40.4637”
Longitud de donde vive el cliente
address_comments
NO
texto
 “”
Comentarios sobre el domicilio
birthday
NO
texto
 “1983-02-12T15:19:21.000”
Fecha de nacimiento del cliente
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
comments
NO
texto
 “Confiable”
Notas
tax_situation_code
NO
texto
 “1”
Código de referencia de la situación tributaria del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
tax_situation 
Ver Maestros
spouse_fullname
NO
texto
 “Esposa”
Nombre completo del cónyuge del cliente
spouse_document_type_code
texto
 “4”
Código de referencia del tipo de documento del cónyuge del cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
document_type 
Ver Maestros
address_document_number
NO
texto
 “34567878”
Número de documento del cónyuge del cliente
spouse_birthday
NO
texto
 “1990-02-12”
Fecha de nacimiento del cónyuge
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
both_owners
NO
texto
 “Si”
Notación que indica si el Cliente y su cónyuge son ambos dueños de la unidad
Valores Posibles:
 NO = Uno solo es dueño ; SI = Ambos son dueños
marital_state_code
NO
texto
 “Soltero”
Código de referencia del estado matrimonial del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
marital_state 
Ver Maestros
type_code
NO
texto
 “person”
Código de referencia del tipo de cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
type_code 
Ver Maestros
gender_code
NO
texto
 “male”
 Código de referencia del género del cliente.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
gender_code 
Ver Maestros
nationality_code
NO
texto
 “CL”
Código de referencia de la nacionalidad del cliente
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
nationality_code 
Ver Maestros
libb_condition_code
NO
texto
 “”
Código de referencia de la condición de ingresos brutos del cliente
NOTA:
Condición sólo valida en Argentina
Los valores para este campo se obtienen consultando el dato maestro  
libb_type 
Ver Maestros
emancipated_flag
NO
flag
 1
Flag que identifica si el cliente (siendo menor de edad) está emancipado o no
Valores Posibles:
 0 =  No Emancipado ; 1 = Emancipado
both_owners_flag
NO
flag
 0
Flag que indica si el cliente y su cónyuge son ambos dueños del vehiculo
Valores Posibles:
 0 = Uno solo es dueño ; 1 = Ambos son dueños
source_prospect_id
NO
texto
 null
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
textonúmero
timestamp
texto
texto
“customer_to_invoice_update”11493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Modificar un Cliente a Facturar 
curl --location --request POST '
https://api.pilotsolution.net/v1/customers/update.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{{
	"data": {                
                "id": "7F7B612F-AEC7-4BE9-B4F1-531C670393AC",
		"integration_reference_code": "0027",
		"tax_identification":"XAXX010101000",
		"name": "NISSAN33333 CHILE SPA",
		"phone": "115040602",
		"cellphone": "1130201020",
		"email": "prueba@prueba.cm",
		"document_type_code": "4",
		"document_number": "34205710",
		"address_street": "AV. ISIDORA  GOYENECHEA 2800",
		"address_door_number": "300",
		"address_floor": "1",
		"address_apartment": "A",
		"address_city": "SANTIAGO",
                "address_province_code": "24",
		"address_country_code": "CL",
		"address_postal_code": "2333",
		"address_latitude": "3.7492",
		"address_longitude": "40.4637",
                "address_comments": "Puerta verde"
		"birthday": "1983-02-12T15:19:21.000",
                "comments": "Notas del cliente"
		"tax_situation_code": "1",
		"spouse_fullname": "Esposa",
		"spouse_document_type_code": "4",
		"spouse_document_number": "34567878",
		"spouse_birthday": "1990-02-12",
		"both_owners": "Si",
		"marital_state_code": "Soltero",
		"type_code": "person",
		"gender_code": "male",
		"nacionality_code": "CL",
		"iibb_condition_code": "",
		"emancipated_flag": "1",
		"both_owners_flag": 0,
		"source_prospect_id":null
	},
   "header": {
        "FlowName": "customer_to_invoice_create",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud Actualización de un Cliente a facturar 
Satisfactoria
Especificación de la entidad “Cliente”
{
    "ts": "1708372332",
    "_id": "38625731",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "969287D2-01A2-44DA-81A2-9397DFDBB2E3",
            "integration_reference_code": "0057",
            "name": "NISSAN33333 CHILE SPA",
            "tax_identification": "XAXX010101001",
            "phone": "115040602",
            "cellphone": "1130201020",
            "email": "prueba@prueba.cm",
            "birthday": "1983-02-12T00:00:00",
            "comment": "Notas del cliente",
            "prospect": {
                "id": null,
                "first_name": null,
                "last_name": null
            },
            "both_owners_flag": 0,
            "emancipated_flag": 1,
            "national_document": {
                "number": null,
                "type": {
                    "code": null,
                    "name": null
                }
            },
            "address": {
                "street": "AV. ISIDORA  GOYENECHEA 2800",
                "door_number": "300",
                "floor": "1",
                "apartment": "A",
                "city": "SANTIAGO",
                "province": {
                    "code": "24",
                    "name": "CAPITAL FEDERAL"
                },
                "country": {
                    "code": "CL",
                    "name": "Chile"
                },
                "postal_code": "2333",
                "latitude": "3.7492",
                "longitude": "40.4637",
                "comments": "Puerta verde",
            },
            "tax_situation": {
                "code": "1",
                "name": "Responsable Inscripto"
            },
            "spouse": {
                "fullname": "Esposa",
                "birthday": "1990-02-12",
                "national_document": {
                    "number": null,
                    "type": {
                        "code": null,
                        "name": null
                    }
                }
            },
            "marital_state": {
                "code": "Soltero",
                "name": "Soltero"
            },
            "type": {
                "code": "person",
                "name": "Revendedor"
            },
            "gender": {
                "code": "male",
                "name": "Masculino"
            },
            "nationality": {
                "code": null,
                "name": null
            },
            "iibb_condition": {
                "code": "1",
                "name": "Exento"
            },
            "created": {
                "user": {
                    "id": "CB6E1A6A-E3E5-4817-ABFB-DD5EDBA65D0C",
                    "integration_reference_code": null,
                    "name": "API.consultas@pilotsolution.net",
                    "fullname": "Api Consultas"
                },
                "dt": "2024-02-19T19:52:12.663"
            },
            "updated": {
                "user": {
                    "id": null,
                    "integration_reference_code": null,
                    "name": null,
                    "fullname": null
                },
                "dt": null
            },
            "deleted": {
                "user": {
                    "id": null,
                    "integration_reference_code": null,
                    "name": null,
                    "fullname": null
                },
                "dt": null
            },
            "sale_extended_form_flag": "0",
            "is_valid": true,
            "required_fields": [
                {
                    "field": "tax_identification",
                    "complete": true
                },
                {
                    "field": "type_id",
                    "complete": true
                },
                {
                    "field": "name",
                    "complete": true
                },
                {
                    "field": "phone",
                    "complete": true
                },
                {
                    "field": "cellphone",
                    "complete": true
                },
                {
                    "field": "email",
                    "complete": true
                }
            ]
        }
    }
}
Ejemplo estructura 
error
de respuesta JSON
{
"ts": "1493991767",
"_id": "5594",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "Customer GUID 810E6EB4-80A9-4623-AE89-0FC04FC79769 not found"
}
}
Control de Cambios
Fecha
Cambio
19 Febrero 2024
se reemplazan los nombres de los siguientes parámetros
national_document_type_code
 por 
document_type_code
national_document_number
 por 
document_number
spouse_national_document_type_code
 por 
spouse_document_type_code
spouse_national_document_number
 por 
spouse_
document_number
se agrega el parámetro 
“both_owners_flag”
se reemplaza el nombre de FlowName 
“customer_create_pilot”
, por 
“customer_to_invoice_create”
1 Diciembre 2018
Documento creado
Updated on 11/26/202

## Ventas - API CRM
Ventas - API CRM

### Entidad Venta - API CRM
Entidad Venta - API CRM
Valores de retorno para todos los servicios de ventas
Nombre del Parámetro
Tipo
Comentario
id
texto (de 32 bits en formato GUID)
Identificador único (de la venta) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la venta.
integration_reference_code
texto
ID – Identificador único de la venta en el Sistema Externo
origin
code
name
estructura
texto
texto
Estructura
Código de Origen. Nombre de Origen
suborigin
code
name
estructura
texto
texto
ID – Identificador único de la venta en el Sistema Externo
NOTA:
Por lo general representa al 
ID
o la 
PK (Primary Key)
 del sistema que se integraEstructura Motivo de Cierre
Debería ser único para cada venta:
es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud:
en el caso que en el sistema externo no se guarde el ID de PILOT, es éste el dato que debería declarase.
prospect
id
estructura
texto (de 32 bits en formato GUID)
Estructura que informa acerca del prospect
Identificador único del Prospecto (de PILOT) asociado al Lead que originó la venta
customer
id
name
estructura
texto (de 32 bits en formato GUID)
texto (100)
Estructura que informa acerca del cliente
Identificador único del cliente a facturar (de PILOT) (*)(*) Con el guid se puede consultar el cliente en el endpoint de 
clientes
Razón social
vehicle
id
estructura
texto (de 32 bits en formato GUID)
Estructura que informa acerca del vehículo
Identificador único (de PILOT) del vehículo del stock asignado a la venta (*) (*) Con el guid se puede consultar el vehículo en el 
stock
status
code
name
estructura
texto (50)
texto (50)
texto (100)
Estructura que brinda información acerca del estado de la venta
Código del estado de la venta
Nombre del estado de la venta (*)
Color que identifica el estado de la venta
(*)NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
sales_status
Ver más
type
code
name
estructura
texto (50)
texto (50)
Estructura que describe el Tipo de Venta
Código de tipo de la venta Ej Particular/Reventa/Otros
Nombre del tipo de la venta
Color que identifica el estado de la venta
NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
sales_type
Ver más
sale_representative
id
integration_reference_code
name
fullname
estructura
texto (de 32 bits en formato GUID)
texto (500)
texto (100)
texto (250)
Estructura que describe al Representante de venta
Identificador único (de PILOT) del representante de la venta
Código del representante de venta en el sistema integrado
Email del representante de venta
Nombre completo del representante de venta
NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
users
Ver más
branch
id
code
name
estructura
número
texto (50)
texto (100)
Estructura que describe la sucursal
Identificador interno en PILOT de la sucursal
Código de la sucursal
Nombre de la sucursal
NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
branches
Ver más
business_type
code
name
estructura
texto (50)
texto (50)
Estructura que describe el Tipo de Negocio
Código del tipo de negocio
Nombre del tipo de negocio
NOTA:
Los valores para este campo se obtienen consultando el dato maestro 
business_type
Ver más
business_perform_as
texto
Identifica si la venta es de un usado o nuevo
price_list_product
code
name
commercial_condition
valid_date
rep_authorized_discount
model
code
name
brand
code
name
estructura
texto (50)
texto (50)
número (18.2)
fecha
estructura
texto (50)
texto (50)
Estructura que informa acerca del producto en la lista de precios
Código del producto – Consultar el maestro price_lists Ver más
Nombre del producto
Condición comercial (sin separador de miles) (es un descuento)
Fecha de vencimiento de la vigencia comercial del precio
NOTA:
su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs.
Descuento autorizado para el vendedor (Porcentaje absoluto)
Estructura que describe el modelo y marca del vehículo
Código del modelo del producto – Consultar maestro price_lists Ver más
Nombre del modelo del producto
Estructura que describe la marca del vehículo.
Código del marca del producto – Consultar maestro price_lists Ver más
Nombre de la marca del producto
product
observations
year
vin
license_plate
desired_color
value
commercial_condition_amt
valid_date
rep_authorized_discountn
manager_authorized_discount
savingplan_first_share_amount
brand
model
version
estructura
texto (4000)
texto
texto (10)
texto (50)
número (18,2)
número(18,2)
fecha
número(18,2)
texto
número(18,2)
texto (50)
texto (50)
texto (100)
Estructura que describe el producto vendido
Observaciones generales referidas al producto vendido
Año del vehículo
Número Identificador del vehículo.
NOTA:
En el caso de los pedidos de vehículos nuevos, puede que no esté disponible hasta estar más avanzado el proceso de compra.
Chapa patente de la unidad
Color deseado del vehículo
Valor de la venta (Sin separador de miles)
Monto según la condición comercial (Sin separador de miles)
Fecha de validez
Descuento autorizado para el vendedor (Porcentaje absoluto)
Responsable que autoriza el descuento
Valor de la primer cuota del plan de ahorro (Sin separador de miles)
Marca del vehículo
Modelo del vehículo
Versión del vehículo
commission
amt
date
estructura
número (18,2)
fecha
Estructura que refiere a la Comisión del Vendedor
Monto de la comisión del vendedor (Sin separador de miles)
Fecha de cobro de la comisión
NOTA:
Esu formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs.
payment_methods
cash_amt
trade_in_car
domain
brand
model
version
color
value_amt
repairment_costs_amt
estimate_sale_amt
profitability_percentaje
inspection_number
inspection_user
year
kms
comments
credit
credit_amt
bank
rate
shares
shares_amt
insurance_amt
status_dt
status
code
name
financed_reward_amt
credit_reward_subtract_from_total_flag
 total_transaction_amt
 expenses_amt
cash_reserve_amt
exchange_reserve_amt
cash_reserve_dt
reinforcement_payment_dt
estructura
número (18,2)
estructura
texto (10)
texto (50)
texto (50)
texto (100)
texto (100)
número (18,2)
número (18,2)
número (18,2)
número
texto (50)
texto
texto
texto
texto (4000)
estructura
número (18,2)
texto
texto
texto
número (18,2)
número (18,2)
fecha
estructura
texto (10)
texto (50)
número (18,2)
flag
número (18,2)
número (18,2)
número (18,2)
número (18;2)
fecha
fecha
Estructura que agrupa información vinculada al pago del vehículo
Monto parcial en efectivo de la compra
Estructura que describe la retoma del vehículo
Dominio del vehículo (chapa patente)
Marca
Modelo
Versión
Color
Valor de toma del vehículo (Sin separador de miles)
Costo de reparación de la unidad (Sin separador de miles)
Valor de venta estimado (Sin separador de miles)
Porcentaje bruto de ganancia calculado
Número de inspección del vehículo para la toma
Usuario que lo inspeccionó
Año de fabricación del vehículo
Odómetro del vehículo
Comentarios de la retoma del usado
Estructura que describe el Crédito tomado por el cliente para la compra
Monto del crédito que se otorga para la compra. (Sin separador de miles)
Banco emisor del crédito
Interés del crédito en porcentaje absoluto
Cantidad de cuotas del crédito Ej 36
Valor de cuota del crédito. (Sin separador de miles)
Monto del seguro del crédito. (Sin separador de miles)
Fecha del último cambio realizado en el estado del crédito
NOTA:
su formato es UTC yyyy-mm-ddThh:mm:sss en formato 24 hs.
Estructura que describe el Estado del crédito
Código del estado del crédito – Consultar el maestro 
credits_status
 Ver más
Nombre del estado del crédito
Nota
 Valores posibles: 1 = Pendiente ; 2 = Aprobado ; 3 = Rechazado
Premio por la colocación de la financiación. (Sin separador de miles)
Flag que indica si el monto del premio fue usado como bonificación para la venta
Valores posibles: 0 = No aplicado como bono ; 1 = Aplicado como bono
Monto total de la transacción. (Sin separador de miles)
Monto total de los gastos de compra. Ej flete, formularios, registro del vehículo, etc. (Sin separador de miles)
Monto total en efectivo de la reserva, entregado por el cliente (Sin separador de miles)
Valor de la tasa de conversión de moneda (el día en el que se cotiza)
Fecha de pago efectivo de la reserva
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Fecha de pago del refuerzo del anticipo por la operación
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
vehicle_registration_plate_by
code
name
estructura
texto (50)
texto (50)
Estructura que agrupa información de registro del vehículo
Código que indica quién realiza el registro del vehículo
Descripción del registrante del vehículo
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
vehicle_registration_plate_by 
Ver más
approximate_delivery_date
fecha
Fecha aproximada/comprometida de entrega con el cliente
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
observations
texto (4000)
Comentarios (internos) del vendedor sobre la venta
opportunity_comments
texto (4000)
Comentarios referidos a la oportunidad
average_km_per_year
texto
km promedio por año
closed_flag
flag
Flag que indica si el legajo está cerrado
    Valores posibles:
 0 = legajo abierto ; 1 = legajo cerrado
created
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría referida a la creación del registro venta
Información del responsable de la creación del registro venta
Id del responsable
Código de referencia del usuario del sistema que se integra
Email del responsable
Nombre completo del responsable
Fecha de creación de la venta
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
updated
user
id
integration_reference_code
name
fullname
dt
estructura
estructura
texto
texto (500)
texto (100)
texto (250)
fecha
Estructura de auditoría referida a la actualización del registro venta
Información del responsable de la actualización del registro venta
Id del responsable
Código de referencia del responsable del sistema que se integra
Email del responsable
Nombre completo del responsable
Fecha de actualización de la venta
   NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs.
Control de Cambios
Fecha
Cambio
01 Diciembre 2018
Documento creado
16 Noviembre 2022 
 Agregado de longitud en la columna Tipo Ej: texto (100)
26 Julio 2023 
 Agregado de Especificación de Estructura de Estado de Crédito
Updated on 11/20/2024

### Filtros - API CRM
Filtros - API CRM
Lista de ‘
filtros de selección’
  para elegir un conjunto de ventas.  [Ver cómo aplicar un filtro 
Listar
]
Filtros de selección
 branch_code
Sucursal de la venta
 business_type_code
Tipo de negocio de la venta
 credit_status_code
Estado del crédito
 type_code
Tipo de venta
 status_code
Estado de la venta
integration_reference_code
Código de referencia del sistema que se integra
created
Fecha de creación en formato ISO, ejemplo “2018-03-28T16:33:22”
updated
Fecha de última actualización en formato ISO, ejemplo “2018-03-28T16:33:22”
prospect_id
GUID del prospecto asociado a la venta. Ej:”55A6BCD4-0857-4A86-85FB-09A228B641B4″
customer_id
GUID del customer (cliente) asociado a la venta. Ej:”55A6BCD4-0857-4A86-85FB-09A228B641B4″
Lista de parámetros por los cuales puede 
ordenarse
 la lista de ventas a seleccionar
Parámetros de ordenamiento
 created
branch_code
 updated
business_type_code
 integration_reference_code
credit_status_code
 prospect_id
 type_code
customer_id
Updated on 12/06/2023

### Leer - API CRM
Leer - API CRM
POST
/v1/sales/read.php
Se utiliza para consultar/leer una venta a partir del ID – Identificador Único en CRM PILOT
Parámetro para consultar/leer una venta en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (de la venta) de CRM PILOT sobre la que ocurrió la operación actualización/reserva. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
Ejemplo de solicitud para Consultar/Leer una venta
{
	"data": {
		"id": "0B3C41FE-08D2-41D0-8BFE-0833B25E9FC8"
	},
	"header": {
		"FlowName": "read_sale",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "0CA0836F-7847-4A30-B09A-60DE9606BA04",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud Consulta/Lectura de una venta Satisfactoria 
Especificación de la entidad “venta”
{
	"ts": "1495543422",
	"_id": "6144",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": {
			"id": "C4A8F81B-5D5E-4555-B7D5-BBAA2F5333E8",
			"integration_reference_code": "",
			"prospect": {
				"id": "645465B5-C9E3-4A5E-B885-646EEB1DFC55"
			},
			"customer": {
				"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8",
				"name": "Juan Pedro"
			},
			"vehicle": {
				"id": "EF40D17E-0980-4A3F-9700-63BCF960AD05"
			},
			"status": {
				"code": "4",
				"name": "Contrato en trámite"
			},
			"status_dt": "2017-05-11T19:06:59+0000",
			"type": {
				"code": "1",
				"name": "Normal"
			},
			"sale_representative": {
				"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
				"integration_reference_code": null,
				"name": "localdesa.admin@pilotsolution.com.ar",
				"fullname": "Desa Local"
			},
			"branch": {
				"code": "1",
				"name": "Beccar"
			},
			"business_type": {
				"code": "convencional",
				"name": "0 Km"
			},
			"product": {
				"code": "1PINSYFEC5279Q",
				"name": "ACTIVE 1.6 N",
				"price": "351900.00",
				"commercial_condition": ".00",
				"valid_date": "2017-02-11T00:00:00+0000",
				"rep_authorized_discount": ".00",
				"manager_authorized_discount": ".00",
				"savingplan_first_share_amount": null,
				"model": {
					"code": "8B0E194E",
					"name": "2008 ACTIVE 1.6 N"
				}
			},
			"value": "351900.00",
			"commission": {
				"amt": null,
				"date": ""
			},
			"payment_methods": {
				"reserve_amt": null,
				"cash_amt": ".00",
				"trade_in_car": {
					"domain": "",
					"brand": "",
					"model": "",
					"version": "",
					"value_amt": ".00",
					"year": null,
					"kms": null
				},
				"credit": {
					"credit_amt": ".00",
					"bank": "",
					"rate": null,
					"shares": null,
					"shares_amt": null,
					"insurance_amt": null,
					"status_dt": "",
					"status": null
				},
				"total_transaction_amt": null,
				"expenses_amt": ".00",
				"cash_reserve_amt": null,
				"cash_reserve_dt": "",
				"reinforcement_payment_dt": ""
			},
			"vehicle_registration_plate_by": null,
			"approximate_vehicle_registration_plate_date": null,
			"approximate_delivery_date": "",
			"observations": "",
			"created": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2017-05-11T19:06:59+0000"
			},
			"updated": {
				"user": null,
				"dt": ""
			}
		}
	}
}
Ejemplo de Respuesta con error (al consultar/leer una venta inexistente)
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Sale dont exist in database"
	}
}
Parámetros
data
struct
required
id 
string
required
Id de la venta
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
entidad sales
Updated on 08/27/2022

### Listar - API CRM
Listar - API CRM
POST
/v1/sales/list.php
Este servicio permite:
listar un conjunto de ventas mediante la aplicación de filtros. [Ver lista de filtros y sorting a aplicar acá]
ordenar los resultados
Parámetros para listar un conjunto de ventas
data
estructura
requerido
filters
estructura
field
texto
Nombre del campo por el que selecciona (filtra)
operation
texto
Operador lógico
value
texto
Valor del campo
sort
estructura
field
texto
Campo a ordenar
order
texto
Orden descendente DESC o ascendente ASC
limit
texto
Cantidad de filas (registros) por página (MAX 100)
page
texto
Página a consultar
header
estructura
requerido
FlowName
texto
Nombre descriptivo del servicio
SequenceId
número
 Número de secuencia
TimeStamp
timestamp
 Fecha de pedido
TrackingId
número
 Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
texto
Token válido de 
autorización
Ejemplo de solicitud para Consultar/leer ventas por status_code y ordenamiento descendente por fecha de creación
{
	"data": {
		"filters": [
			{
				"field": "status_code",
				"operation": "=",
				"value": "4"
			}
		],
		"sort": [
			{
				"field": "created",
				"order": "DESC"
			}
		],
		"limit": 2,
		"page": 1
	},
	"header": {
		"FlowName": "",
		"SequenceId": "",
		"TimeStamp": "",
		"TrackingId": "",
		"access_token": "{{token}}"
	}
}
Respuesta a Solicitud Consulta/Lectura de ventas Satisfactoria 
Especificación de la entidad ventas
{
	"ts": "1495551419",
	"_id": "6151",
	"result": {
		"status": "success",
		"aditional_data": {
			"page": 1,
			"page_count": 36,
			"rows_count": 72,
			"rows_per_page": 2,
			"rows_in_page": 2,
			"rows_remaining": 70
		},
		"entitydata": [
			{
				"id": "C4A8F81B-5D5E-4555-B7D5-BBAA2F5333E8",
				"integration_reference_code": "",
				"prospect": {
					"id": "645465B5-C9E3-4A5E-B885-646EEB1DFC55"
				},
				"customer": {
					"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8",
					"name": "Juan Pedro"
				},
				"vehicle": {
					"id": "EF40D17E-0980-4A3F-9700-63BCF960AD05"
				},
				"status": {
					"code": "4",
					"name": "Contrato en trámite"
				},
				"status_dt": "2017-05-11T19:06:59+0000",
				"type": {
					"code": "1",
					"name": "Normal"
				},
				"sale_representative": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"branch": {
					"code": "1",
					"name": "Beccar"
				},
				"business_type": {
					"code": "convencional",
					"name": "0 Km"
				},
				"product": {
					"code": "1PINSYFEC5279Q",
					"name": "ACTIVE 1.6 N",
					"price": "351900.00",
					"commercial_condition": ".00",
					"valid_date": "2017-02-11T00:00:00+0000",
					"rep_authorized_discount": ".00",
					"manager_authorized_discount": ".00",
					"savingplan_first_share_amount": null,
					"model": {
						"code": "8B0E194E",
						"name": "2008 ACTIVE 1.6 N"
					}
				},
				"value": "351900.00",
				"commission": {
					"amt": "5000.00",
					"date": ""
				},
				"payment_methods": {
					"reserve_amt": null,
					"cash_amt": "350000.00",
					"trade_in_car": {
						"domain": "OPQ125",
						"brand": "Peugeot",
						"model": "207",
						"version": "Sport",
						"value_amt": "310000.00",
						"year": "2016",
						"kms": "4500"
					},
					"credit": {
						"credit_amt": "10000.00",
						"bank": "Macro",
						"rate": null,
						"shares": "5",
						"shares_amt": "2000.00",
						"insurance_amt": null,
						"status_dt": "",
						"status": null
					},
					"total_transaction_amt": null,
					"expenses_amt": null,
					"cash_reserve_amt": null,
					"cash_reserve_dt": "",
					"reinforcement_payment_dt": ""
				},
				"vehicle_registration_plate_by": null,
				"approximate_vehicle_registration_plate_date": null,
				"approximate_delivery_date": "",
				"observations": "",
				"created": {
					"user": {
						"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
						"integration_reference_code": null,
						"name": "localdesa.admin@pilotsolution.com.ar",
						"fullname": "Desa Local"
					},
					"dt": "2017-05-11T19:06:59+0000"
				},
				"updated": {
					"user": {
						"id": "EDEE33FC-2E6A-4833-9A3D-29A8EF199F0D",
						"integration_reference_code": "123123addddssss",
						"name": "juanpablo@hotmail.com",
						"fullname": "juan mantelli"
					},
					"dt": "2017-05-23T14:37:34+0000"
				}
			},
			{
				"id": "6EDC0E6D-30EB-4A61-A694-89F16AB9A829",
				"integration_reference_code": "",
				"prospect": {
					"id": "645465B5-C9E3-4A5E-B885-646EEB1DFC55"
				},
				"customer": {
					"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8",
					"name": "Carlos Beltran"
				},
				"vehicle": null,
				"status": {
					"code": "4",
					"name": "Contrato en trámite"
				},
				"status_dt": "2017-05-11T18:54:15+0000",
				"type": {
					"code": "1",
					"name": "Normal"
				},
				"sale_representative": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"branch": {
					"code": "1",
					"name": "Beccar"
				},
				"business_type": {
					"code": "convencional",
					"name": "0 Km"
				},
				"product": {
					"code": "1PINSYFEC5279Q",
					"name": "ACTIVE 1.6 N",
					"price": "351900.00",
					"commercial_condition": ".00",
					"valid_date": "2017-02-11T00:00:00+0000",
					"rep_authorized_discount": ".00",
					"manager_authorized_discount": ".00",
					"savingplan_first_share_amount": null,
					"model": {
						"code": "8B0E194E",
						"name": "2008 ACTIVE 1.6 N"
					}
				},
				"value": "351900.00",
				"commission": {
					"amt": null,
					"date": ""
				},
				"payment_methods": {
					"reserve_amt": null,
					"cash_amt": ".00",
					"trade_in_car": {
						"domain": "",
						"brand": "",
						"model": "",
						"version": "",
						"value_amt": ".00",
						"year": null,
						"kms": null
					},
					"credit": {
						"credit_amt": ".00",
						"bank": "",
						"rate": null,
						"shares": null,
						"shares_amt": null,
						"insurance_amt": null,
						"status_dt": "",
						"status": null
					},
					"total_transaction_amt": null,
					"expenses_amt": ".00",
					"cash_reserve_amt": null,
					"cash_reserve_dt": "",
					"reinforcement_payment_dt": ""
				},
				"vehicle_registration_plate_by": null,
				"approximate_vehicle_registration_plate_date": null,
				"approximate_delivery_date": "",
				"observations": "",
				"created": {
					"user": {
						"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
						"integration_reference_code": null,
						"name": "localdesa.admin@pilotsolution.com.ar",
						"fullname": "Desa Local"
					},
					"dt": "2017-05-11T18:54:15+0000"
				},
				"updated": {
					"user": null,
					"dt": ""
				}
			}
		]
	}
}
Ejemplo de Respuesta con error (al consultar/leer ventas por status_code inexistente)
{
	"ts": "1495551457",
	"_id": "6152",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "status_code not found: 34"
	}
}
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
struct
page
numeric
Número de la página que se muestra
page_count
numeric
Cantidad total de páginas
rows_count
numeric
Cantidad total de registros
rows_per_page
numeric
Cantidad de registros por página
rows_in_page
numeric
Cantidad de registros en la página actual
rows_remaining
numeric
 Cantidad total de registros restantes
entitydata
struct
entidad 
sales

### Actualizar - API CRM
Actualizar - API CRM
POST
/v1/sales/update.php
Toda vez que se modifican datos de una venta en 
ERP
, éstos deben informarse a 
CRM
PILOT
 mediante la invocación de la API provista.
Para actualizar una venta, 
ERP
 debe utilizar el,  
ID – Identificador único de la venta en el CRM PILOT, 
el cual es asignado al momento de crear la venta en 
CRM PILOT.  
Se recomienda preservar este valor en el 
ERP 
ya que es la única manera de acceder a la venta.
Ejemplo de Solicitud de actualización de una venta
{
	"data": {
		"id": "C4A8F81B-5D5E-4555-B7D5-BBAA2F5333E8",
		"integration_reference_code": "",
		"customer_id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8",
		"type_code": "1",
		"product_code": "1PINSYFEC5279Q",
                "product_desired_color": "Blanco",
                "product_average_km_per_year": 10000, 
		"commission_amt": "5000",
		"commission_dt": "",
		"cash_amt": "350000",
		"trade_in_car_brand": "Peugeot",
		"trade_in_car_domain": "OPQ125",
		"trade_in_car_kms": "4500",
		"trade_in_car_model": "207",
		"trade_in_car_value_amt": "310000",
		"trade_in_car_version": "Sport",
		"trade_in_car_year": "2016",
		"trade_in_car_inspection_number" : "889988",
		"trade_in_car_inspection_user_id" : "6174", 
		"trade_in_car_repairment_costs" : "1000",
		"trade_in_car_estimate_sale_amt" : "350000",
		"trade_in_car_profitability_percentaje" : "14" 
		"credit_amt": "10000",
		"credit_bank": "Macro",		
		"credit_rate": "",
		"credit_shares": "5",
		"credit_shares_amt": "2000",
		"credit_insurance_amt": "",
		"credit_status_dt": "",
		"credit_status_code": "",
                "credit_reward_amt": 10000, 
                "credit_reward_subtract_from_total_flag": 1 
		"expenses_amt": "",
		"cash_reserve_amt": "",
		"cash_reserve_dt": "",
		"reinforcement_payment_dt": "",
		"vehicle_registration_plate_by_code": "",
		"approximate_vehicle_registration_plate_date": "",
		"approximate_delivery_date": "",
		"observations": "",
	},
	"header": {
		"FlowName": "sales_update",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Parámetros
data
struct
required
id 
string
required
Id de la venta
integration_reference_code
string
Código de referencia del sistema que se integra. Es único para cada customer
type_code
string
Tipo de Venta 
Ver maestro
 [
sales_type
]
business_type_code
string
Tipo de negocio que se esta vendiendo, se refiere a usados, nuevos, plan es de ahorro 
Ver maestro
 [business_type]
product_code
string
Código de producto de la lista de precios. Vehículo vendido. 
Ver maestro
 [price_list]
product_desired_color
string
Color de preferencia del vehículo
product_average_km_per_year
number
Cantidad de kilómetros promedio que realiza con el vehículo. Se utiliza luego para el cálculo de predicción de servicios de post venta.
product_brand
string
required solo cuando es unidad usada
Marca del vehículo vendido. Solo para el caso de unidades usadas.
product_model
required solo cuando es unidad usada
Modelo del vehículo vendido.Solo para el caso de unidades usadas.
product_version
required solo cuando es unidad usada
Versión del vehículo vendido.Solo para el caso de unidades usadas.
customer_id
GUID
GUID del Cliente a facturar. Entidad 
Cliente
sale_representative_id
GUID
GUID del usuario vendedor asignado a la venta. 
Ver maestro
 [users]
commission_amt
number
Valor de la comisión de venta del vendedor. Valores sin separadores de miles Ej: 10000.
commission_dt
ISO DateTime
Fecha en la que el vendedor cobro la comisión de venta
cash_amt
string
Código de referencia de la provincia donde vive el cliente. Debe ser un valor existente (ir a ver maestro)
trade_in_car_brand
string
Código de referencia del país donde vive el cliente. Debe ser un valor existente (ir a ver maestro)
trade_in_car_domain
string
Código postal donde vive el cliente
trade_in_car_kms
string
Latitud de donde vive el cliente
trade_in_car_model
string
Longitud de donde vive el cliente
trade_in_car_value_amt
string
Descripción de si son ambos dueños (revisar) tiene que ser flag
trade_in_car_version
string
Flag para determinar si el cliente está emancipado o no
trade_in_car_year
string
Código de referencia de la situación tributaria del cliente
credit_amt
string
Nombre completo de la esposa/o del cliente
credit_bank
string
Código de referencia del tipo de documento de la esposa/o del cliente. Debe ser un valor existente (ir a ver maestro)
credit_rate
string
Número de documento de la esposa/o del cliente
credit_shares
isodateime
Fecha de nacimiento de la esposa/o del cliente
credit_shares_amt
string
Código de referencia del estado marital del cliente. Debe ser un valor existente (ir a ver maestro)
credit_insurance_amt
string
Código de referencia del género del cliente. Debe ser un valor existente (ir a ver maestro)
credit_status_dt
string
Código de referencia de la nacionalidad del cliente. Debe ser un valor existente (ir a ver maestro)
credit_status_code
string
Código de referencia de la condición de ingresos brutos del cliente. Debe ser un valor existente (solo argentina)
Ver maestro
expenses_amt
string
 Monto de los gastos
cash_reserve_amt
string
 Monto del efectivo para la reserva
cash_reserve_dt
string
 Fecha de la reserva
reinforcement_payment_dt
string
vehicle_registration_plate_by_code
estructura (code y name)
Persona o entidad que registra el vehículo 
Ver maestro
approximate_vehicle_registration_plate_date
estructura (code y name)
Fecha aproximada de registro (Catálogo técnico pre-definido)
approximate_delivery_date
string
 Fecha aproximada de entrega
observations
string
 Comentarios sobre la venta
sale_financed_reward_amt
string
Bono de financiamiento/ Quebranto/ Comisión
sale_financed_reward_subtract_from_total_flag
string
 “1” Para restar al precio sugerido de venta el bono o quebranto. “0” Para que dicho campo no afecte al precio sugerido.
Updated on 10/10/2023

### Cambiar estado - API CRM
Cambiar estado - API CRM
POST
/v1/sales/change_status.php
Toda vez que se cambiar el estado de una venta  en 
ERP
, éste debe informarse a 
CRM
PILOT
 mediante la invocación de la API provista.
Para cambiar el estado de una venta, 
ERP
 debe utilizar el,  
ID – Identificador único de la venta en el CRM PILOT
. Este identificador es asignado al momento de crear la venta en 
CRM PILOT.  
Se recomienda preservar este valor en el 
ERP 
ya que es la única manera de acceder a la unidad.
Ejemplo de Solicitud para cambiar el estado de una venta
{
	"data": {
		"id": "BDF07B1C-802D-4F84-BE63-3C1EB7E8AF6F",
		"status_code": "5"
	},
	"header": {
		"FlowName": "sales_read",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token": "{{token}}"
	}
}
Respuesta a Solicitud Actualización de una unidad de stock Satisfactoria 
Especificación de la entidad “venta”
{
	"ts": "1494879380",
	"_id": "6008",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": {
			"id": "9484CEA7-B30D-434B-BE5C-23A1743ECC12",
			"integration_reference_code": "",
			"prospect": {
				"id": "645465B5-C9E3-4A5E-B885-646EEB1DFC55"
			},
			"customer": {
				"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8"
			},
			"vehicle": null,
			"status": {
				"code": "4",
				"name": "Pendiente de aprobacion"
			},
			"status_dt": "2017-05-15T20:16:19+0000",
			"type": {
				"code": "1",
				"name": "Normal"
			},
			"sale_representative": {
				"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
				"integration_reference_code": null,
				"name": "localdesa.admin@pilotsolution.com.ar",
				"fullname": "Desa Local"
			},
			"branch": {
				"code": "1",
				"name": "Beccar"
			},
			"business_type": {
				"code": "convencional",
				"name": "0 Km"
			},
			"product": {
				"code": "1PINSYLECL279Q",
				"name": "ALLURE TIPTRONIC",
				"price": "398200.00",
				"commercial_condition": ".00",
				"valid_date": "2017-02-11T00:00:00+0000",
				"rep_authorized_discount": ".00",
				"manager_authorized_discount": ".00",
				"savingplan_first_share_amount": null,
				"model": {
					"code": "94063257",
					"name": "2008 ALLURE TIPTRONIC"
				}
			},
			"value": "398200.00",
			"commission": {
				"amt": null,
				"date": ""
			},
			"payment_methods": {
				"reserve_amt": null,
				"cash_amt": ".00",
				"trade_in_car": {
					"domain": "",
					"brand": "",
					"model": "",
					"version": "",
					"value_amt": ".00",
					"year": null,
					"kms": null
				},
				"credit": {
					"credit_amt": ".00",
					"bank": "",
					"rate": null,
					"shares": null,
					"shares_amt": null,
					"insurance_amt": null,
					"status_dt": "",
					"status": null
				},
				"total_transaction_amt": ".00",
				"expenses_amt": ".00",
				"cash_reserve_amt": null,
				"cash_reserve_dt": "",
				"reinforcement_payment_dt": ""
			},
			"vehicle_registration_plate_by": null,
			"approximate_vehicle_registration_plate_date": null,
			"approximate_delivery_date": "",
			"observations": "",
			"created": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2017-05-15T20:16:19+0000"
			},
			"updated": {
				"user": null,
				"dt": ""
			}
		}
	}
}
Ejemplo de Respuesta con error (al cambiar el estado de una venta inexistente)
{
	"ts": "1495556805",
	"_id": "6162",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "La venta no existe"
	}
}
Parámetros
data
struct
requerido
id 
string
requerido
Id de la venta
status_code
string
requerido
Código del estado de la venta.
Ver Maestros
header
struct
requerido
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
requerido
Token válido de 
autenticación
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
entidad 
sales
Updated on 06/27/2025

### Asignar vehículo - API CRM
Asignar vehículo - API CRM
POST
/v1/sales/vehicle/assign.php
Toda vez que se necesita asignar un vehículo a una venta, ésta no puede tener un vehículo asignado. El vehículo a asignar debe estar disponible.
Ejemplo de Solicitud para asignar una unidad de stock a una venta
{
	"data": {
		"id": "33D5454B-55A2-414A-9F8C-65412ED3713B",
		"vehicle_id": "69B6C850-543F-47CC-BF62-7959C6A31278"
	},
	"header": {
		"FlowName": "assign_vehicle_to_sale",
		"SequenceId": 1,
		"TimeStamp": 124567,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud Asignación de una unidad de stock a una venta Satisfactoria 
Especificación de la entidad “venta”
{
	"ts": "1494361802",
	"_id": "5809",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": {
			"id": "33D5454B-55A2-414A-9F8C-65412ED3713B",
			"integration_reference_code": "",
			"prospect": {
				"id": "FD682D0E-D93A-4A5A-8755-F20732C1FDF6"
			},
			"customer": {
				"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8"
			},
			"vehicle": {
				"id": "69B6C850-543F-47CC-BF62-7959C6A31278"
			},
			"status": {
				"code": "4",
				"name": "Pendiente de aprobacion"
			},
			"status_dt": "2017-05-02T14:01:04+0000",
			"type": {
				"code": "1",
				"name": "Normal"
			},
			"sale_representative": {
				"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
				"integration_reference_code": null,
				"name": "localdesa.admin@pilotsolution.com.ar",
				"fullname": "Desa Local"
			},
			"branch": {
				"code": "1",
				"name": "Beccar"
			},
			"business_type": {
				"code": "convencional",
				"name": "0 Km"
			},
			"product": {
				"code": "1PINSYFEC5279Q",
				"name": "ACTIVE 1.6 N",
				"price": "351900.00",
				"commercial_condition": ".00",
				"valid_date": "2017-02-11T00:00:00+0000",
				"rep_authorized_discount": ".00",
				"manager_authorized_discount": ".00",
				"model": {
					"code": "8B0E194E",
					"name": "2008 ACTIVE 1.6 N"
				},
				"audit_dt": "2017-02-15T16:15:18+0000",
				"audit_usr": "3314",
				"savingplan_first_share_amount": null
			},
			"value": "351900.00",
			"commission": {
				"amt": null,
				"date": ""
			},
			"payment_methods": {
				"reserve_amt": null,
				"cash_amt": ".00",
				"trade_in_car": {
					"domain": "",
					"brand": "",
					"model": "",
					"version": "",
					"value_amt": ".00",
					"year": null,
					"kms": null
				},
				"credit": {
					"credit_amt": ".00",
					"bank": "",
					"rate": null,
					"shares": null,
					"shares_amt": null,
					"insurance_amt": null,
					"status_dt": "",
					"status": null
				},
				"total_transaction_amt": ".00",
				"expenses_amt": ".00",
				"cash_reserve_amt": null,
				"cash_reserve_dt": "",
				"reinforcement_payment_dt": ""
			},
			"vehicle_registration_plate_by": null,
			"approximate_vehicle_registration_plate_date": null,
			"approximate_delivery_date": "",
			"observations": "",
			"created": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2017-05-02T14:01:04+0000"
			},
			"updated": {
				"user": null,
				"dt": ""
			}
		}
	}
}
Ejemplo de Respuesta con error (al asignar una unidad de stock a una venta que ya tiene un vehículo asignado)
{
	"ts": "1494420759",
	"_id": "5816",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "la venta ya tiene un stock asignado"
	}
}
Parámetros
data
struct
requerido
id 
string
requerido
id de la venta en Pilot.
vehicle_id
string
requerido
id del vehículo en Pilot.
header
struct
requerido
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
token válido 
ver
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
struct
información adicional
entitydata
struct
entidad 
sales
Updated on 08/26/2022

### Liberar vehículo - API CRM
Liberar vehículo - API CRM
POST
/v1/sales/vehicle/release.php
Se invoca toda vez que se necesita liberar un vehículo asignado a una venta
Ejemplo de Solicitud para liberar una unidad de stock a una venta
{
	"data": {
		"id": "33D5454B-55A2-414A-9F8C-65412ED3713B"
	},
	"header": {
		"FlowName": "release_vehicle_sale",
		"SequenceId": 1,
		"TimeStamp": 124567,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Ejemplo respuesta JSON
{
	"ts": "1494361811",
	"_id": "5810",
	"result": {
		"status": "success",
		"aditional_data": [],
		"entitydata": {
			"id": "33D5454B-55A2-414A-9F8C-65412ED3713B",
			"integration_reference_code": "",
			"prospect": {
				"id": "FD682D0E-D93A-4A5A-8755-F20732C1FDF6"
			},
			"customer": {
				"id": "15A6005A-8445-4C34-A1B9-080D9BF4F0F8"
			},
			"vehicle": null,
			"status": {
				"code": "4",
				"name": "Pendiente de aprobacion"
			},
			"status_dt": "2017-05-02T14:01:04+0000",
			"type": {
				"code": "1",
				"name": "Normal"
			},
			"sale_representative": {
				"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
				"integration_reference_code": null,
				"name": "localdesa.admin@pilotsolution.com.ar",
				"fullname": "Desa Local"
			},
			"branch": {
				"code": "1",
				"name": "Beccar"
			},
			"business_type": {
				"code": "convencional",
				"name": "0 Km"
			},
			"product": {
				"code": "1PINSYFEC5279Q",
				"name": "ACTIVE 1.6 N",
				"price": "351900.00",
				"commercial_condition": ".00",
				"valid_date": "2017-02-11T00:00:00+0000",
				"rep_authorized_discount": ".00",
				"manager_authorized_discount": ".00",
				"model": {
					"code": "8B0E194E",
					"name": "2008 ACTIVE 1.6 N"
				},
				"audit_dt": "2017-02-15T16:15:18+0000",
				"audit_usr": "3314",
				"savingplan_first_share_amount": null
			},
			"value": "351900.00",
			"commission": {
				"amt": null,
				"date": ""
			},
			"payment_methods": {
				"reserve_amt": null,
				"cash_amt": ".00",
				"trade_in_car": {
					"domain": "",
					"brand": "",
					"model": "",
					"version": "",
					"value_amt": ".00",
					"year": null,
					"kms": null
				},
				"credit": {
					"credit_amt": ".00",
					"bank": "",
					"rate": null,
					"shares": null,
					"shares_amt": null,
					"insurance_amt": null,
					"status_dt": "",
					"status": null
				},
				"total_transaction_amt": ".00",
				"expenses_amt": ".00",
				"cash_reserve_amt": null,
				"cash_reserve_dt": "",
				"reinforcement_payment_dt": ""
			},
			"vehicle_registration_plate_by": null,
			"approximate_vehicle_registration_plate_date": null,
			"approximate_delivery_date": "",
			"observations": "",
			"created": {
				"user": {
					"id": "AD848D18-9D6D-431D-BED7-37383B31425E",
					"integration_reference_code": null,
					"name": "localdesa.admin@pilotsolution.com.ar",
					"fullname": "Desa Local"
				},
				"dt": "2017-05-02T14:01:04+0000"
			},
			"updated": {
				"user": null,
				"dt": ""
			}
		}
	}
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1494421215",
	"_id": "5818",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "la venta no tiene un stock asignado"
	}
}
Parámetros
data
struct
required
id 
string
required
Id de la venta
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
token válido 
ver
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
entidad sales
Updated on 11/01/2022

### Listar eventos - API CRM
Listar eventos - API CRM
POST
/v1/sales/events/list.php
Este servicio permite obtener el listado de eventos de una venta. Se debe enviar un ID de venta existente.
Ejemplo solicitud JSON
{
    "data": {
        "id": "A4E0D2F4-C268-4CCC-950C-DAE93AA44C40"
    },
    "header": {
        "FlowName": "sales_events",
        "SequenceId": 2,
        "TimeStamp": 1248377,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{token}}"
    },
    "Context": {
        "TechUser": [],
        "QPending": [],
        "OperationType": []
    }
}
Ejemplo respuesta JSON
{
    "ts": "1553525739",
    "_id": "173722",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": [
            {
                "id": "360640",
                "event_type_id": "2",
                "event_legend": "Código interno de la operación actualizado :  -&gt; Codigo",
                "event_type_name": "Comentario",
                "event_type_icon": "fa-comments",
                "event_type_color": null,
                "created": {
                    "user": {
                        "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                        "fullname": "Admin"
                    },
                    "dt": "2019-03-21T15:19:29"
                }
            },
            {
                "id": "360639",
                "event_type_id": "2",
                "event_legend": "Producto de vendido actualizado : 1967 -&gt; 104032",
                "event_type_name": "Comentario",
                "event_type_icon": "fa-comments",
                "event_type_color": null,
                "created": {
                    "user": {
                        "id": "5E10E873-E392-49F6-89BD-9A8ABBD6638A",
                        "fullname": "Admin"
                    },
                    "dt": "2019-03-21T15:12:20"
                }
            }
        ]
    }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Event dont exist in database"
	}
}
Parámetros
data
struct
required
id 
string
required
Id de la venta
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
timestamp
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
Listado de eventos
entitydata
struct
event
struct
Descripción de los atributos de un evento
event
struct
id
guid
Id del evento
event_legend
string
Descripción del evento
event_type_color
string
Color del tipo de evento
event_type_icon
string
Icono del tipo de evento
event_type_id
numeric
 Id del tipo de evento
event_type_name
string
 Nombre del tipo de evento
create
struct
user
struct
id
guid
id del usuario
fullname
string
nombre completo del usuario
dt
isodatetime
 fecha de creación del evento
Updated on 04/09/2019

### Crear comentarios - API CRM
Crear comentarios - API CRM
POST
/v1/sales/comments/create.php
Se utiliza para agregar un comentario en una Venta, a partir del ID – Identificador Único en CRM PILOT El comentario puede ser compartido con otro usuario
Parámetros para agregar un comentario en una Venta en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (de la Venta ) de CRM PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
comment
SI
texto
“Texto del nuevo comentario (en copia marcel@gmail.com”
Texto del comentarioAl texto del comentario se le agrega entre paréntesis `
en copia a `+ nombre del usuario al que se copia.
user_cc_id
NO
texto
“C4733BB0-7C5B-4C0F-9828-31F8747B4C93”
Identificador del usuario al que se le envía una copia del mensaje.
header
Flowname
SequenceId
TimeStamp
TrackingId
access_token
SINO
SI
SI
SI
textonúmero
TimeStamp
número
texto
Nombre descriptivo del servicio “sale_comment_create”
Número de secuencia
Fecha del pedido
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Crear un Comentario en una Venta
curl --location --request GET '
https://api.pilotsolution.net/v1/welcomes/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
		"sale_id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
		"comment": "Texto del nuevo comentario"
	},
	"header": {
		"FlowName": "sale_comment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo de solicitud para Crear un Comentario en una Venta y compartirlo con otro usuario
curl --location --request GET '
https://api.pilotsolution.net/v1/sales/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
		"sale_id" : "D3263CCF-F425-4F6E-AD87-6DGHF1834523",
		"comment": "Texto del nuevo comentario",
                "cc_user_id": "CE703666-4810-4B85-A8AF-4E1D6AD38HJE"
	},
	"header": {
		"FlowName": "sale_comment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud de agregado de un comentario a una venta Satisfactoria
{
  "ts": "1555338471",
  "_id": "13712",
  "result": {
    "status": "success",
    "aditional_data": []
  }
}
Ejemplo de Respuesta con error 
(al intentar aplicar un comentario a una Venta inexistente)
{
  "ts": "1549043448",
  "_id": "6737",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Sale D3263CCF-F425-4F6E-AD87-6DEFD183HYU7 not found "
  }
}
Control de Cambios
Fecha
Cambio
15 Abril 2019
Documento creado
Updated on 11/26/2025

## Talleres - API CRM
Talleres - API CRM

### Crear Cita - API CRM
Crear Cita - API CRM
POST
/v1/workshop/appointment/create.php
Se utiliza para crear una cita en un taller.
Parámetros para crear una Cita
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
services
code
SI
estructura
texto
“507”
Código de servicio
workshop_code
SI
texto
“Taller 1”
Código del Taller
rc_id
SI
texto
“B6045847-80D9-4C71-AE51-98B130B7F94D”
Identificador único (de PILOT) del Responsable del Cliente
date
SI
fecha
“2024-03-21”
Fecha de la Cita
hour_code
SI
texto
“1530”
Hora de la Cita
vehicle_domain
SI
texto
“ABB771”
Dominio del vehículo
vehicle_vin
SI
texto
“15kopl8965u675rft”
Vin del vehículo ( 17 dígitos del vin o al menos los últimos 8 )
vehicle_model_code
SI
texto
“5”
Modelo del vehículo
version
 NO
texto
KB777889
Versión del vehículo
vehicle_actual_kms
 NO
texto
“20000”
Kilómetros actuales del vehículo
vehicle_year_kms
NO
texto
null
Promedio de kilómetros anuales del vehículo
prospect_tax_identification 
SI
número
“20215896327”
Identificación Fiscal
prospect_company
SI
texto
“prueba taller api”
Razón Social
prospect_first_name
 SI
texto
“Nombre API Prueba”
Nombre del contacto
prospect_lastname
 SI
texto
“Apellido APIPrueba”
Apellido paterno del contacto
prospect_phone
NO
texto
“1520520388”
Teléfono fijo del contacto
prospect_cellphone
 SI
texto
“5499829998”
Número de celular del contacto
prospect_email
NO
texto
“prueba98@prueba.com”
Email del contacto
notes
NO
texto
“Esto es una prueba en api”
Notas referidas a la cita
require_taxi_flag
NO
flag
0
Indica si el cliente solicita un taxi
Valores posibles:
 0 = El cliente NO solicita un taxi  ; 1 = El cliente solicita un taxi
warranty_flag
NO
flag
0
Indica si el vehículo se encuentra en garantía
Valores posibles:
 0 = El vehículo NO se encuentra garantía ; 1 = El vehículo se encuentra en garantía
return_job_flag
NO
flag
0
Indica si es un reingreso
Valores posibles:
 0 = No es reingreso ; 1 = Es  reingreso
is_overlap_flag
NO
flag
0
Indica si es un Sobreturno
Valores posibles:
 0 = El cliente NO ingresa on Sobreturno  ; 1 = El cliente ingresa con sobreturno
header
Flowname
SequenceId
TimeStamp
TrackinId
access_token
SI
SI
NO
NO
NO
SI
estructura
texto
texto
texto
texto
texto
“appointment_create”
[token]
representa el nombre del flow o acción que se esta ejecutando.
representa un identificador de secuencia de llamada a la API desde el sistema que la esta invocando.
es la fecha/hora en formato Unix en la que se realiza la llamada a la API.
es un identificador de la llamada a la API, que envía el sistema origen.
es obligatorio y debe tener el token JWT obtenido del proceso de autenticación en la API.
Valores de retorno del servicio de creación de una Cita de Taller
Nombre del Parámetro
Obligatorio
Comentario
guid
texto  (de 32 bits en formato GUID)
Identificador único (de la cita) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la cita.
workshop
code
name
estructura
texto
texto
Estructura que informa acerca del taller
Código del Taller
Nombre del Taller
date
 fecha
Fecha de la cita
NOTA: 
su formato yyyy-mm-dd
hour
code
name
estructura
texto
texto
Estructura que informa acerca de la hora de la cita
código de la hora
nombre de la hora
rc
id
name
estructura
texto  (de 32 bits en formato GUID)
texto
Estructura que informa acerca del Responsable del Cliente
Identificador único (de PILOT) del Responsable del Cliente
Nombre del Responsable del Cliente
services
code
name
estructura
texto
texto
Estructura que brinda información acerca de los servicios a aplicar  (puede ser más de uno)
Código del Servicio
Nombre del Servicio
vehicle
domain
vin
kms_year
kms_actual
brand
code
name
model
code
name
version
sold_by
car_year
estructura
texto
texto
texto
texto
estructura
texto
texto
estructura
texto
texto
texto
texto
texto
Estructura que brinda información acerca del vehículo
Dominio del vehículo
VIN del vehículo
Promedio de kilómetros anuales del vehículo
Kilómetros actuales del vehículo
Estructura que describe la marca del vehículo
Código  de la marca del vehículo
Nombre de la marca del vehículo
Estructura que describe el modelo del vehículo
Código  del modelo del vehículo
Nombre del modelo del vehículo
Versión del vehículo
Concesionario de venta
Año de fabricación del vehículo
prospect
id
tax_identification
first_name
last_name
phone
cell_phone
email
company
estructura
texto  (de 32 bits en formato GUID)
texto
texto
texto
texto
texto
texto
texto
Estructura que describe el Contacto
Identificador único (de PILOT) del Contacto
Código de Régimen Fiscal
Nombre del contacto
Apellido paterno del contacto
Teléfono fijo del contacto
Número de celular del contacto
Dirección de correo electrónico del contacto
Nombre de la compañía en la que el contacto trabaja, en caso que se presente en nombre de una comañía
notes
texto
Notas referidas a la cita
status
code
name
estructura
texto
texto
Estructura que describe el estado de una cita
Código  de estado de la cita
Nombre del estado de la cita
created
dt
user
estructura
fecha
texto
Estructura de auditoría referida a la creación del registro citas
Fecha de creación de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
Nombre completo del usuario
modified
dt
user
estructura
fecha
texto
Estructura de auditoría referida a la última modificación del registro citas
Fecha de última modificacción de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
Nombre completo del usuario
require_taxy_flag
flag
Cliente solicita taxi
return_job_flag
flag
Reingreso del vehículo
warrantly_flag
flag
Trabajo en garantía
is_overlap_flag
flag
Sobreturno
Ejemplo de solicitud para Crear una Cita
curl --location --request POST '
https://api.pilotsolution.net/v1/workshop/appointment/create.php'
 \ 
--header 'content-type: application/json' \ 
--data-raw '{ 
	"data": {
		"services": [
			{"code": "servicio_1"},
			{"code": "servicio_2"}
		],
		"workshop_code": "t1",
		"rc_id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
		"date": "2018-12-08",
		"hour_code": "1000",
		"vehicle_domain": "XXX224",
		"vehicle_vin": "VFGD41523418UJISRT4",
		"vehicle_model_code": "ET",
		"vehicle_version": "XTZ",
		"vehicle_actual_kms": "20000",
		"vehicle_year_kms": "10000",
		"prospect_tax_identification": "20123456789",
		"prospect_company": "Empresa API",
		"prospect_firstname": "Prueba",
		"prospect_lastname": "Api",
		"prospect_phone": "1123456789",
		"prospect_cellphone": "1123456781",
		"prospect_email": "email@prueba.com",
		"notes": "Notas desde la api",
		"require_taxi_flag": 1,
		"warranty_flag": 0,
		"return_job_flag": 1,
		"send_notification_by_email": 0
	},
	"header": {
		"FlowName": "appointment_create",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Respuesta a Solicitud Creación de una cita Satisfactoria
{
    "ts": "1710796583",
    "_id": "45911590",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "guid": "09167C37-A7DF-47CA-8C50-BF170D724E1E",
            "workshop": {
                "code": "Taller 1",
                "name": "Taller 1"
            },
            "date": "2024/03/22",
            "hour": {
                "code": "1800",
                "name": "18:00"
            },
            "rc": {
                "id": "B6045847-80D9-4C71-AE51-98B130B7F94D",
                "name": "Marcelo DRI"
            },
            "services": [
                {
                    "code": "Servicio 20000 km",
                    "name": "507"
                }
            ],
            "vehicle": {
                "domain": "ABB771",
                "vin": "15kopl8965u675rft",
                "kms_year": 0,
                "kms_actual": 20000,
                "brand": {
                    "code": "1",
                    "name": "FORD"
                },
                "model": {
                    "code": "5",
                    "name": "BRONCO"
                },
                "version": null,
                "sold_by": null,
                "car_year": null
            },
            "prospect": {
                "id": "081C2BC9-24E2-44B3-BA67-B7C4211A8324",
                "tax_identification": "20215896327",
                "firstname": "Nombre API Prueba",
                "lastname": "Apellido APIPrueba",
                "phone": "1520520388",
                "cellphone": "5499829998",
                "email": "prueba98@prueba.com",
                "company": "prueba taller api"
            },
            "notes": "Esto es una prueba en api",
            "status": {
                "code": "1",
                "name": "Pendiente"
            },
            "created": {
                "dt": "2024-03-18T21:16:23.040",
                "user": "api.whatsapp@myworkplace.com.ar"
            },
            "modified": {
                "dt": null,
                "user": null
            },
            "require_taxi_flag": 0,
            "return_job_flag": 0,
            "warranty_flag": 0
        }
    }
}
Ejemplo de Respuesta con error 
(cuando un servicio declarado no existe)
{
  "ts": "1545313992",
  "_id": "35208",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "One of the services doesn't exist"
  }
}
Control de Cambios
Fecha
Cambio
01 Diciembre 2018
Documento creado
Updated on 11/26/2025

### Entidad Cita de Taller - API CRM
Entidad Cita de Taller - API CRM
Valores de retorno del servicio de lectura de una Cita Taller
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
Identificador único (de la cita) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la cita.
is_closed_flag
flag
Marca que indica si la cita está cerrada
workshop_id
Código del Taller
workshop_code
texto
Código del Taller
workshop_address
texto
Domicilio del Taller
workshop
texto
Nombre del Taller
date_id
número
Fecha de la cita expresada como yyyymmdd
date
fecha
Fecha de la cita expresada com yyyy/mm/dd
hour_id
número
Identificador único de la hora de la cita (dato técnico)
hour
texto
Nombre de la hora expresado como hh:mm
hour_code
texto
Código de la hora expresao como hhmm
customer_service_rep_id
número
Identificador único del responsable del cliente (dato técnico)
customer_service_rep_code
texto
Código del responsable del cliente
customer_service_rep_guid
texto  (de 32 bits en formato GUID)
Identificador único (del responsable del cliente) de PILOT
customer_service_rep
texto
Nombre completo del responsable del cliente
customer_service_rep_email
texto
Email del responsable del cliente
welcome_id
texto
No considerar
prospect_id
número
Identificador único del Contacto (dato técnico)
prospect_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Contacto
prospect_cuit
texto
Código de Régimen Fiscal del Contacto
prospect_firstname
texto
Nombre del contacto
prospect_lastname
texto
Apellido paterno del contacto
prospect_phone
texto
Teléfono fijo del contacto
prospect_cellphone
texto
Número de celular del contacto
prospect_email
texto
Dirección del contacto electrónico del contacto
prospect_empresa
texto
Nombre de la compañía a la que el contacto representa
car_model_id
número
Identificador único del modelo de vehículo (dato técnico)
car_model_code
texto
Código del modelo del vehículo
car_model
texto
Denominación del modelo del vehículo
car_model_visible
flag
Indica si el modelo del vehículo está activo
Valores posibles:
 1 – Activo ; 0 – No Activo
car_model_deleted
flag
Indica si el modelo del vehículo ha sido dado de baja (baja lógica)
Valores posibles:
 1 – Borrado ; 0 – No Borrado
car_brand_id
número
Identificador único de la marca del vehículo (dato técnico)
car_brand_code
texto
Código de la marca del vehículo
car_brand
texto
Denominación de la marca del vehículo
car_brand_visible
flag
Indica si la marca del vehículo está activa
Valores posibles:
 1 – Activa ; 0 – No Activa
car_brand_deleted
flag
Indica si la marca del vehículo ha sido dada de baja (baja lógica)
Valores posibles:
 1 – Borrada ; 0 – No Borrada
car_version
texto
Versión del vehículo
car_vin
texto
Vin del vehículo
car_license_plate
texto
Matrícula
car_year
texto
Año de fabricación del vehículo
car_actual_kms
texto
Kilómetros actuales del vehículo
car_kms_year
texto
Promedio de kilómetros anuales del vehículo
car_color
texto
Color del vehículo
sold_by
texto
Concesionario de venta
time_units
texto
Unidades de tiempo asignadas a los servicios
cost
número
Costo Total de los servicios
NOTA: 
se expresa, sin separador de miles y con punto decimal
promised_delivery_date_id
texto
Fecha de entrega comprometida expresada como : yyyymmdd
promised_delivery_code
texto
Código de la fecha de entrega comprometida
promised_delivery_date
fecha
Fecha de entrega comprometida expres
promised_delivery_hour_id
número
Identificador único de la hora de entrega comprometida (dato técnico)
promised_delivery_hour_code
texto
Código de la hora de entrega comprometida
promised_delivery_hour
texto
Hora de entrega comprometida
notes
texto
Comentario interno
require_taxi_flag
flag
Indica si requiere taxi
Valores posibles:
 1 – Si requiere ; 0 – No requiere
is_return_flag
flag
Indica si reingresó al taller
Valores posibles:
 1 – Si reingresó ; 0 – No es un reingreso
is_warranty_flag
flag
Indica si el trabajo es en garantía
Valores posibles:
 1 – Si bajo garantía ; 0 – No bajo garantía
is_overlap_flag
flag
Indica si es un sobreturno
Valores posibles:
 1 – Si es sobreturno ; 0 – No es sobreturno
status_id
número
Identificador único del estado de la cita (dato técnico)
status_code
texto
Código  de estado de la cita
status
texto
Nombre del estado de la cita
is_in_workshop
flag
Indica si el vehículo se se encuentra en el taller
Valores posibles:
 1 – Activo ; 0 – No Activo
is_closed
flag
Indica si el modelo del vehículo está activo
Valores posibles:
 1 – Activo ; 0 – No Activo
status_color
texto
Color de la etiqueta del estado de la cita
customer_id
número
Identificador único del cliente facturar (dato técnico)
customer_vat_id
texto
Tipo de Documento del cliente a facturar
customer_name
texto
Nombre completo del cliente a facturar
customer_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Cliente a facturar
invoice_type
texto
Tipo de factura
created_dt
fecha
Fecha de creación de la cita (dato de auditoría)
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_id
número
Identificador único del usuario que creó la cita (dato técnico)
created_user_name
texto
Nombre del usuario que creó la cita (dato de auditoría)
created_user_fullname
texto
Nombre completo del usuario que creó la cita (dato de auditoría)
created_email
texto
Dirección de correo del usuario que creó la cita
created_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del  usuario que créo la cita
modified_dt
fecha
Fecha de última modificación de la cita (dato de auditoría)
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
modified_user_id
número
Identificador único del usuario que modificó  la cita (dato técnico)
modified_user_name
texto
Nombre del usuario que modificó la cita (dato de auditoría)
modified_user_fullname
texto
Nombre completo del usuario que modificó la cita (dato de auditoría)
modified_email
texto
Dirección de correo del usuario que modificó la cita
modified_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del  usuario que modificó la cita
deleted_dt
fecha
Fecha de baja de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
deleted_user_id
número
Identificador único del usuario que borra  (baja lógica) la cita (dato técnico)
deleted_user_name
texto
Nombre del usuario que borra  (baja lógica) la cita (dato de auditoría)
deleted_user_fullname
texto
Nombre completo del usuario que borra  (baja lógica) la cita (dato de auditoría)
deleted_flag
flag
Indica si la cita ha sido borrada
Updated on 11/18/2025

### Modificar Status de Cita - API CRM
Modificar Status de Cita - API CRM
POST
/v2/lookups/workshops/appointments/set_status.php
Este servicio permite:
modificar el estado de una cita de taller
Parámetros para modificar el estado de una cita de taller en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
“16B229A6-6F5B-476C-B99D-A79E09A6F51B”
Identificador único de. la cita
status_id
SI
texto
1
Identificador único del status de la cita (dato técnico)
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
        SI
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
.
“workshops_appointment_set_status”
114
“93991052”
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
.
nombre descriptivo del servicio
número de secuencia de la solicitud
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Modificar el estado de una Cita de Taller
{
	"data": {
             "id": "16B229A6-6F5B-476C-B99D-A79E09A6F52B",
            "status_id": 2
		}
	"header": {
		"FlowName": "workshops_appointment_set_status",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Respuesta a Solicitud Modificar el estado de una Cita de Taller 
Satisfactoria
{
    "ts": "1745188011",
    "_id": "244641313",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": 32,
            "guid": "16B229A6-6F5B-476C-B99D-A79E09A6F51B",
            "is_closed_flag": 0,
            "workshop_id": 2,
            "workshop_code": "er84g",
            "workshop_address": "Santa Fe, Argentina",
            "workshop": "Taller 1",
            "workshop_headers": "Taller de prueba para integracion",
            "date_id": 20250320,
            "date": "20/03/2025",
            "hour_id": 61,
            "hour": "08:00",
            "hour_code": "0800",
            "customer_service_rep_id": 11535,
            "customer_service_rep_code": "homologacion.admin@pilotsolution.com.ar",
            "customer_service_rep_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "customer_service_rep": "Marcela Molero",
            "customer_service_rep_email": "homologacion.admin@pilotsolution.com.ar",
            "customer_service_rep_telephone": "+531153767295",
            "customer_service_rep_parent": null,
            "customer_service_rep_signature": "&lt;b&gt;Admin Homologacion&lt;/b&gt;&lt;br&gt;&lt;a href="mailto:homologacion.admin@pilotsolution.com.ar"&gt;homologacion.admin@pilotsolution.com.ar&lt;/a&gt;&lt;br&gt;Sucursal Casa Central&lt;br&gt;Homologación",
            "prospect_id": 1199,
            "prospect_guid": "EEF8BD83-80B2-4925-8B0E-080EF16957A9",
            "prospect_cuit": "VAMR900915MC",
            "prospect_firstname": "Juan de la Cruz",
            "prospect_lastname": "Belgrano",
            "prospect_empresa": "Razon Social",
            "prospect_phone": null,
            "prospect_cellphone": "1234567890",
            "prospect_email": "jcsm@gmail.com",
            "car_model_id": 6,
            "car_model_code": "AV",
            "car_model": "Aveo",
            "car_model_visible": "1",
            "car_model_deleted": "0",
            "car_brand_id": "3",
            "car_brand_code": "CH",
            "car_brand": "Chevrolet",
            "car_brand_visible": "1",
            "car_brand_deleted": "0",
            "car_version": "Version Aveo",
            "car_vin": "VIN-12345678",
            "car_license_plate": "DOM-123456",
            "car_actual_kms": 5000,
            "car_kms_year": 2,
            "car_color": "Rojo",
            "car_year": 25,
            "sold_by": "Concesionario de venta",
            "time_units": 2,
            "cost": "10000.00",
            "promised_delivery_date_id": 20250417,
            "promised_delivery_code": 20250417,
            "promised_delivery_date": "17/04/2025",
            "promised_delivery_hour_id": 61,
            "promised_delivery_hour_code": "0800",
            "promised_delivery_hour": "08:00",
            "notes": "Comentario Interno",
            "external_notes": "Comentario Externo - Voz del cliente",
            "require_taxi_flag": 1,
            "is_return_flag": 1,
            "is_warranty_flag": 1,
            "is_overlap_flag": 1,
            "car_is_in_workshop_flag": 0,
            "status_id": 2,
            "status_code": "confirmado",
            "status": "Confirmado",
            "is_in_workshop": "0",
            "is_closed": "0",
            "status_color": "#e8d20c",
            "customer_id": 261,
            "customer_vat_id": "27-12946988-6",
            "customer_name": "CLIENTECITATALLER",
            "customer_guid": "60C35E29-4E39-4173-80D2-C782EF9635B5",
            "invoice_type": "B",
            "created_dt": "2025-03-20T19:41:14.450",
            "created_user_id": 11535,
            "created_user": "Marcela Molero",
            "created_user_fullname": "homologacion.admin@pilotsolution.com.ar",
            "created_email": "homologacion.admin@pilotsolution.com.ar",
            "created_user_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "modified_dt": "2025-04-20T22:26:50.913",
            "modified_user_id": 49899,
            "modified_user": "Api Consultas",
            "modified_user_fullname": "API.consultas@pilotsolution.net",
            "modified_email": "API.consultas@pilotsolution.net",
            "modified_user_guid": "CB6E1A6A-E3E5-4817-ABFB-DD5EDBA65D0C",
            "deleted_dt": null,
            "deleted_user_id": null,
            "deleted_user": null,
            "deleted_user_fullname": null,
            "deleted_flag": 0,
            "welcome_id": null,
            "cone_number": null,
            "car_engine_number": "MOtor 505",
            "warranty_expiration_date": "2025-06-30"
        }
    }
}
Ejemplo de Respuesta con 
error
(al consultar un estado de cita de taller con un valor de 
‘id’ 
 incorrecto)
{
  "ts": "1545313992",
  "_id": "35208",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "500",
    "message":"GUID: 16B229A6-6F5B-476C-B99D-A79E09A6F52B not found"
   }
}
Control de Cambios
Fecha
Cambio
16 Abril 2025
Documento creado
Updated on 04/20/2025

### Lista de Status de una Cita - API CRM
Lista de Status de una Cita - API CRM
POST
/v2/lookups/workshops/appointments/status/list.php
Este servicio permite:
obtener la lista de valores de estado que puede adoptar una cita de taller
Parámetros para listar una cita de taller en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página.
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
.
NO
Depende
Depende
estructura
texto
texto
texto
.
“status_code”
“=”
“2”
Filtro a aplicar
nombre del campo por el que se selecciona operador valor
NOTA:
La estructura Filters debe declararse.
Si no se especifican sus parámetros se seleccionan todas las citas
sorts
field
order
.
NO
SI
SI
estructura
texto
texto
texto
.
“workshop_name
“ASC”
Ordenamiento a aplicar
nombre del campo por el que se ordenaSentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
        SI
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
.
“Workshop_appointments_status_list”
114
“93991052”
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
.
nombre descriptivo del servicio
número de secuencia de la solicitud
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Filtros de selección
Nombre del Parámetro
Obligatoro
id
Identificador único del status code de la cita
code
Código de estado de la cita
name
Nombre del estado de la cita
is_closed
flag que identifica si el estado es de tipo ‘cita cerrada’
Valores posibles:
 1 – Cerrada ; 0 – No Cerrada (Abierta)
is_in_workshop
flag que identifica si el estado es de tipo ‘cita abierta’
Valores posibles:
 1 – En Taller ; 0 – No ingresó al Taller
visible
flag que indica si el estado está disponible para su asignación
Valores posibles:
 1 – Disponible para su asignación ; 0 – No Disponible para su asignación
deleted
flag que indica si el estado fue dado de baja lógica
Valores posibles:
 1 – Borrado lógico ; 0 – Activa
Configuración Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
 Valores de Retorno
Nombre del Parámetro
Tipo
Comentario
id
número
Identificador único del estado de la cita en PILOT (valor técnico
code
texto
Código  de estado de la cita
name
texto
Nombre del estado de la cita
color
texto
Color de la etiqueta del estado de la cita
is_closed
flag
Indica si la cita fue cerrada
is_in_workshop
flag
Indica si el vehículo fue ingresado al taller
deleted
flag
Indica si el estado fue borrado (baja lógica)
visible
flag
Indica si el estado está disponible para ser asignado
visualorder
texto
Orden de visualización en el fronting
audit
fecha
Fecha – hora de última actualización del registro (dato de auditoría)
audit_user_id
texto
Identificador del usuario responsable de la actualización del registro (dato auditoría)
Ejemplo de solicitud para Consultar todos los estados posibles que puede adoptar una Cita de Taller
Variante Tipo 1
{
	"data": {
		}
	"header": {
		"FlowName": "lookups_workshop_appointments_status_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Variante Tipo 2
{
	"data": {	
             "filters":[
		],
	"header": {
		"FlowName": "lookups_workshop_appointments_status_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Ejemplo de solicitud para Consultar un estado de una Cita de Taller
{
	"data": {
             "page": 1,
             "limit": 10,		
             "filters":[
			{
			  "field": "status_code",
			  "operation": "=",
			  "value": "3",
			}
		],
	"header": {
		"FlowName": "lookups_workshop_appointments_status_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Respuesta a Solicitud Consulta de un estado de Cita de Taller 
Satisfactoria
{
    "ts": "1741805464",
    "_id": "232246054",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 2,
            "rows_per_page": 8,
            "rows_in_page": 2,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": 1,
                "code": "pendiente",
                "color": "#eda518",
                "name": "Pendiente",
                "is_closed": 0,
                "is_in_workshop": 1,
                "deleted": 0,
                "visible": 1,
                "visualorder": 1,
                "auditdt": "2025-03-06T20:56:44.840",
                "audit_user_id": 11535,
                "parentid": null
            },
            {
                "id": 2,
                "code": "confirmado",
                "color": "#e8d20c",
                "name": "Confirmado",
                "is_closed": 0,
                "is_in_workshop": 0,
                "deleted": 0,
                "visible": 1,
                "visualorder": 2,
                "auditdt": "2025-03-06T20:41:27.553",
                "audit_user_id": 11535,
                "parentid": null
            },
        ]
    }
}
Ejemplo de Respuesta con 
error
(al consultar un estado de cita de taller con un valor de 
‘field’ 
 incorrecto)
{
  "ts": "1545313992",
  "_id": "35208",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "500",
    "message": "Column 'status_code' not found in model"
  }
}
Control de Cambios
Fecha
Cambio
12 Marzo 2025
Documento creado
Updated on 04/20/2025

### Crear Comentario en una Cita - API CRM
Crear Comentario en una Cita - API CRM
POST
/v1/workshop/appointment/events/comments/create.php
Se utiliza para crear un comentario en una cita
Parámetro para crear un comentario en una cita en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
4342E8B7-2045-4DAA-9C8C-44F20B3E4DD8
Identificador único (de la cita) de CRM PILOT a la que se le adjunta un comentario.
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
comment
SI
texto
“Comentario en la cita ……”
Comentario que se adjunta a la cita
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
texto
número
timestamp
número
texto
“appointment_event_create_comment”
nombre descriptivo del servicionúmero de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud de creación de un comentario en una cita
curl --location --request POST '
https://api.pilotsolution.net/v1/workshop/appointments/comments/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
     "data": {
         "id": "4342E8B7-2045-4DAA-9C8C-44F20B3E4DD8",
         "comment": "Comentario en la cita ......"
     },
     "header": {
     "FlowName": "appointment_event_create_comment",
     "SequenceId": [],
     "TimeStamp": [],
     "TrackingId":"4342E8B7-2045-4DAA-9C8C-44F20B3E4DD8",
     "access_token": "{{token}}"
    }
}'
Respuesta a Solicitud de creación de un comentario 
Satisfactoria
{
  "ts": "1555338471",
  "_id": "13712",
  "result": {
    "status": "success",
    "aditional_data": []
  }
}
Ejemplo de Respuesta con 
error
(al intentar crear un comentario en una cita)
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "Appointment was not found"
	}
}
Control de Cambios
Fecha
Cambio
27 Febrero 2023
Documento creado
Updated on 11/26/2025

### Asignar Cliente a Facturar - API CRM
Asignar Cliente a Facturar - API CRM
POST
/v2/workshops/appointments/assign_customer.php
Este servicio permite:
asignar un cliente a facturar a una cita de taller
Parámetros para asignar un cliente a facturar a una cita de taller en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto  (de 32 bits en formato GUID)
“16B229A6-6F5B-476C-B99D-A79E09A6F51B”
Identificador único de. la cita
customer_id
SI
texto  (de 32 bits en formato GUID)
“1614FD7B-9AE8-4D66-A736-973D35681831”
Identificador único del cliente a facturarNota: El cliente debe ser creado previamente en CRM PILOT
header
FlownameSequencedIdTimeStampTrackingId
access_token
        SI
SINONONO
SI
estructura
textonúmerotimestamptexto
texto
.
“workshops_appointment_update_customer”
114
“93991052”
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
. 
nombre descriptivo del servicionúmero de secuencia de la solicitudfecha en la que se realiza la solicitudnúmero de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para asignar un Cliente a facturar a una Cita de Taller
{
	"data": {
             "id": "16B229A6-6F5B-476C-B99D-A79E09A6F52B",
            "customer_id": "1614FD7B-9AE8-4D66-A736-973D35681831"
		}
	"header": {
		"FlowName": "workshops_appointment_set_status",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Respuesta a Solicitud Asignar cliente a facturar a una Cita de Taller 
Satisfactoria
{
    "ts": "1745188011",
    "_id": "244641313",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": 32,
            "guid": "16B229A6-6F5B-476C-B99D-A79E09A6F51B",
            "is_closed_flag": 0,
            "workshop_id": 2,
            "workshop_code": "er84g",
            "workshop_address": "Santa Fe, Argentina",
            "workshop": "Taller 1",
            "workshop_headers": "Taller de prueba para integracion",
            "date_id": 20250320,
            "date": "20/03/2025",
            "hour_id": 61,
            "hour": "08:00",
            "hour_code": "0800",
            "customer_service_rep_id": 11535,
            "customer_service_rep_code": "homologacion.admin@pilotsolution.com.ar",
            "customer_service_rep_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "customer_service_rep": "Marcela Molero",
            "customer_service_rep_email": "homologacion.admin@pilotsolution.com.ar",
            "customer_service_rep_telephone": "+531153767295",
            "customer_service_rep_parent": null,
            "customer_service_rep_signature": "&lt;b&gt;Admin Homologacion&lt;/b&gt;&lt;br&gt;&lt;a href="mailto:homologacion.admin@pilotsolution.com.ar"&gt;homologacion.admin@pilotsolution.com.ar&lt;/a&gt;&lt;br&gt;Sucursal Casa Central&lt;br&gt;Homologación",
            "prospect_id": 1199,
            "prospect_guid": "EEF8BD83-80B2-4925-8B0E-080EF16957A9",
            "prospect_cuit": "VAMR900915MC",
            "prospect_firstname": "Juan de la Cruz",
            "prospect_lastname": "Belgrano",
            "prospect_empresa": "Razon Social",
            "prospect_phone": null,
            "prospect_cellphone": "1234567890",
            "prospect_email": "jcsm@gmail.com",
            "car_model_id": 6,
            "car_model_code": "AV",
            "car_model": "Aveo",
            "car_model_visible": "1",
            "car_model_deleted": "0",
            "car_brand_id": "3",
            "car_brand_code": "CH",
            "car_brand": "Chevrolet",
            "car_brand_visible": "1",
            "car_brand_deleted": "0",
            "car_version": "Version Aveo",
            "car_vin": "VIN-12345678",
            "car_license_plate": "DOM-123456",
            "car_actual_kms": 5000,
            "car_kms_year": 2,
            "car_color": "Rojo",
            "car_year": 25,
            "sold_by": "Concesionario de venta",
            "time_units": 2,
            "cost": "10000.00",
            "promised_delivery_date_id": 20250417,
            "promised_delivery_code": 20250417,
            "promised_delivery_date": "17/04/2025",
            "promised_delivery_hour_id": 61,
            "promised_delivery_hour_code": "0800",
            "promised_delivery_hour": "08:00",
            "notes": "Comentario Interno",
            "external_notes": "Comentario Externo - Voz del cliente",
            "require_taxi_flag": 1,
            "is_return_flag": 1,
            "is_warranty_flag": 1,
            "is_overlap_flag": 1,
            "car_is_in_workshop_flag": 0,
            "status_id": 2,
            "status_code": "confirmado",
            "status": "Confirmado",
            "is_in_workshop": "0",
            "is_closed": "0",
            "status_color": "#e8d20c",
            "customer_id": 261,
            "customer_vat_id": "27-12946988-6",
            "customer_name": "CLIENTECITATALLER",
            "customer_guid": "60C35E29-4E39-4173-80D2-C782EF9635B5",
            "invoice_type": "B",
            "created_dt": "2025-03-20T19:41:14.450",
            "created_user_id": 11535,
            "created_user": "Marcela Molero",
            "created_user_fullname": "homologacion.admin@pilotsolution.com.ar",
            "created_email": "homologacion.admin@pilotsolution.com.ar",
            "created_user_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "modified_dt": "2025-04-20T22:26:50.913",
            "modified_user_id": 49899,
            "modified_user": "Api Consultas",
            "modified_user_fullname": "API.consultas@pilotsolution.net",
            "modified_email": "API.consultas@pilotsolution.net",
            "modified_user_guid": "CB6E1A6A-E3E5-4817-ABFB-DD5EDBA65D0C",
            "deleted_dt": null,
            "deleted_user_id": null,
            "deleted_user": null,
            "deleted_user_fullname": null,
            "deleted_flag": 0,
            "welcome_id": null,
            "cone_number": null,
            "car_engine_number": "MOtor 505",
            "warranty_expiration_date": "2025-06-30"
        }
    }
}
Ejemplo de Respuesta con 
error
(al asignar un cliente a facturar a una Cita de Taller que no existe)
{
  "ts": "1545313992",
  "_id": "35208",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "500",
    "message":"GUID: 16B229A6-6F5B-476C-B99D-A79E09A6F52B not found"
   }
}
Control de Cambios
Fecha
Cambio
16 Abril 2025
Documento creado
Updated on 04/20/2025

### Leer una cita - API CRM
Leer una cita - API CRM
GET
/v2/workshops/appointments/read.php
Se utiliza para consultar/leer una Cita de Taller  a partir del ID – Identificador Único en CRM PILOT.
Parámetro para consultar/leer una cita en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto  (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único (de la cita) de CRM PILOT sobre la que ocurrió la operación actualización/reserva. Es el valor que se recibe en el mensaje de actualización enviado al WebHook del ERP;
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a CRM PILOT.
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SINO
NO
NO
SI
textonúmero
timestamp
número
texto
“workshops_appointment_read”
nombre descriptivo del servicio
número de secuenciafecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Consultar/Leer una Cita
curl --location --request POST '
https://api.pilotsolution.net/v2/workshops/appointments/read.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "id": "409F0198-51AC-4B78-9BEF-CF2B22DAF317"
    },
    "header": {
        "FlowName": "workshop_appointment_read",
        "SequenceId": 2,
        "TimeStamp": 1248377,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token"
    }
}'
Respuesta a Solicitud Consulta/Lectura de una Cita  Satisfactoria
{
    "ts": "1744122323",
    "_id": "241213096",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "id": "16B229A6-6F5B-476C-B99D-A79E09A6F51B",
            "is_closed_flag": 0,
            "workshop_id": 2,
            "workshop_code": "er84g",
            "workshop_address": "Santa Fe, Argentina",
            "workshop": "Taller 1",
            "date_id": 20250320,
            "date": "20/03/2025",
            "hour_id": 61,
            "hour": "08:00",
            "hour_code": "0800",
            "customer_service_rep_id": 11535,
            "customer_service_rep_code": "homologacion.admin@pilotsolution.com.ar",
            "customer_service_rep_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "customer_service_rep": "Marcela Molero",
            "customer_service_rep_email": "homologacion.admin@pilotsolution.com.ar",
            "welcome_id": null,
            "prospect_id": 1199,
            "prospect_guid": "EEF8BD83-80B2-4925-8B0E-080EF16957A9",
            "prospect_cuit": "VAMR900915MC",
            "prospect_firstname": "Juan de la Cruz",
            "prospect_lastname": "Belgrano",
            "prospect_phone": null,
            "prospect_cellphone": "1234567890",
            "prospect_email": "jcsm@gmail.com",
            "prospect_empresa": "Razon Social",
            "car_model_id": 6,
            "car_model_code": "AV",
            "car_model": "Aveo",
            "car_model_visible": "1",
            "car_model_deleted": "0",
            "car_brand_id": "3",
            "car_brand_code": "CH",
            "car_brand": "Chevrolet",
            "car_brand_visible": "1",
            "car_brand_deleted": "0",
            "car_version": "Version Aveo",
            "car_vin": "VIN-12345678",
            "car_license_plate": "DOM-123456",
            "car_year": 25,
            "car_actual_kms": 5000,
            "car_kms_year": 2,
            "car_color": "Rojo",
            "sold_by": "Concesionario de venta",
            "time_units": 2,
            "cost": "10000.00",
            "promised_delivery_date_id": null,
            "promised_delivery_code": null,
            "promised_delivery_date": null,
            "promised_delivery_hour_id": null,
            "promised_delivery_hour_code": null,
            "promised_delivery_hour": null,
            "notes": "Comentario Interno",
            "require_taxi_flag": 1,
            "is_return_flag": 1,
            "is_warranty_flag": 1,
            "is_overlap_flag": 1,
            "car_is_in_workshop_flag": 0,
            "status_id": 1,
            "status_code": "1",
            "status": "Pendiente",
            "is_in_workshop": "1",
            "is_closed": "0",
            "status_color": "#eda518",
            "customer_id": null,
            "customer_vat_id": null,
            "customer_name": null,
            "customer_guid": null,
            "invoice_type": null,
            "created_dt": "2025-03-20T19:41:14.450",
            "created_user_id": 11535,
            "created_user_name": "Marcela Molero",
            "created_user_fullname": "homologacion.admin@pilotsolution.com.ar",
            "created_email": "homologacion.admin@pilotsolution.com.ar",
            "created_user_guid": "90C33097-2C23-4639-8F91-3A9CDC9B9DF2",
            "modified_dt": null,
            "modified_user_id": null,
            "modified_user_name": null,
            "modified_user_fullname": null,
            "modified_email": null,
            "modified_user_guid": null,
            "deleted_dt": null,
            "deleted_user_id": null,
            "deleted_user_name": null,
            "deleted_user_fullname": null,
            "deleted_flag": 0
        }
    }
}
Valores de retorno del servicio de lectura de una Cita de Taller
Parámetro para consultar/leer una cita en CRM PILOT
Nombre del Parámetro
Tipo
Ejemplo
id
texto  (de 32 bits en formato GUID)
Identificador único (de la cita) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la cita.
is_closed_flag
flag
Marca que indica si la cita está cerrada
workshop_id
Código del Taller
workshop_code
texto
Código del Taller
workshop_address
texto
Domicilio del Taller
workshop
texto
Nombre del Taller
date_id
número
Fecha de la cita expresada como yyyymmdd
date
fecha
Fecha de la cita expresada com yyyy/mm/dd
hour_id
número
Identificador único de la hora de la cita (dato técnico)
hour
texto
Nombre de la hora expresado como hh:mm
hour_code
texto
Código de la hora expresao como hhmm
customer_service_rep_id
número
Identificador único del responsable del cliente (dato técnico)
customer_service_rep_code
texto
Código del responsable del cliente
customer_service_rep_guid
texto  (de 32 bits en formato GUID)
Identificador único (del responsable del cliente) de PILOT
customer_service_rep
texto
Nombre completo del responsable del cliente
customer_service_rep_email
texto
Email del responsable del cliente
welcome_id
texto
No considerar
prospect_id
número
Identificador único del Contacto (dato técnico)
prospect_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Contacto
prospect_cuit
texto
Código de Régimen Fiscal del Contacto
prospect_firstname
texto
Nombre del contacto
prospect_lastname
texto
Apellido paterno del contacto
prospect_phone
texto
Teléfono fijo del contacto
prospect_cellphone
texto
Número de celular del contacto
prospect_email
texto
Dirección del contacto electrónico del contacto
prospect_empresa
texto
Nombre de la compañía a la que el contacto representa
car_model_id
número
Identificador único del modelo de vehículo (dato técnico)
car_model_code
texto
Código del modelo del vehículo
car_model
texto
Denominación del modelo del vehículo
car_model_visible
flag
Indica si el modelo del vehículo está activo
Valores posibles:
 1 – Activo ; 0 – No Activo
car_model_deleted
flag
Indica si el modelo del vehículo ha sido dado de baja (baja lógica)
Valores posibles:
 1 – Borrado ; 0 – No Borrado
car_brand_id
número
Identificador único de la marca del vehículo (dato técnico)
car_brand_code
texto
Código de la marca del vehículo
car_brand
texto
Denominación de la marca del vehículo
car_brand_visible
flag
Indica si la marca del vehículo está activa
Valores posibles:
 1 – Activa ; 0 – No Activa
car_brand_deleted
flag
Indica si la marca del vehículo ha sido dada de baja (baja lógica)
Valores posibles:
 1 – Borrada ; 0 – No Borrada
car_version
texto
Versión del vehículo
car_vin
texto
Vin del vehículo
car_license_plate
texto
Matrícula
car_year
texto
Año de fabricación del vehículo
car_actual_kms
texto
Kilómetros actuales del vehículo
car_kms_year
texto
Promedio de kilómetros anuales del vehículo
car_color
texto
Color del vehículo
sold_by
texto
Concesionario de venta
time_units
texto
Unidades de tiempo asignadas a los servicios
cost
número
Costo Total de los servicios
NOTA: 
se expresa, sin separador de miles y con punto decimal
promised_delivery_date_id
texto
Fecha de entrega comprometida expresada como : yyyymmdd
promised_delivery_code
texto
Código de la fecha de entrega comprometida
promised_delivery_date
fecha
Fecha de entrega comprometida expres
promised_delivery_hour_id
número
Identificador único de la hora de entrega comprometida (dato técnico)
promised_delivery_hour_code
texto
Código de la hora de entrega comprometida
promised_delivery_hour
texto
Hora de entrega comprometida
notes
texto
Comentario interno
require_taxi_flag
flag
Indica si requiere taxi
Valores posibles:
 1 – Si requiere ; 0 – No requiere
is_return_flag
flag
Indica si reingresó al taller
Valores posibles:
 1 – Si reingresó ; 0 – No es un reingreso
is_warranty_flag
flag
Indica si el trabajo es en garantía
Valores posibles:
 1 – Si bajo garantía ; 0 – No bajo garantía
is_overlap_flag
flag
Indica si es un sobreturno
Valores posibles:
 1 – Si es sobreturno ; 0 – No es sobreturno
status_id
número
Identificador único del estado de la cita (dato técnico)
status_code
texto
Código  de estado de la cita
status
texto
Nombre del estado de la cita
is_in_workshop
flag
Indica si el vehículo se se encuentra en el taller
Valores posibles:
 1 – Activo ; 0 – No Activo
is_closed
flag
Indica si el modelo del vehículo está activo
Valores posibles:
 1 – Activo ; 0 – No Activo
status_color
texto
Color de la etiqueta del estado de la cita
customer_id
número
Identificador único del cliente facturar (dato técnico)
customer_vat_id
texto
Tipo de Documento del cliente a facturar
customer_name
texto
Nombre completo del cliente a facturar
customer_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Cliente a facturar
invoice_type
texto
Tipo de factura
created_dt
fecha
Fecha de creación de la cita (dato de auditoría)
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_id
número
Identificador único del usuario que creó la cita (dato técnico)
created_user_name
texto
Nombre del usuario que creó la cita (dato de auditoría)
created_user_fullname
texto
Nombre completo del usuario que creó la cita (dato de auditoría)
created_email
texto
Dirección de correo del usuario que creó la cita
created_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del  usuario que créo la cita
modified_dt
fecha
Fecha de última modificación de la cita (dato de auditoría)
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
modified_user_id
número
Identificador único del usuario que modificó  la cita (dato técnico)
modified_user_name
texto
Nombre del usuario que modificó la cita (dato de auditoría)
modified_user_fullname
texto
Nombre completo del usuario que modificó la cita (dato de auditoría)
modified_email
texto
Dirección de correo del usuario que modificó la cita
modified_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del  usuario que modificó la cita
deleted_dt
fecha
Fecha de baja de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
deleted_user_id
número
Identificador único del usuario que borra  (baja lógica) la cita (dato técnico)
deleted_user_name
texto
Nombre del usuario que borra  (baja lógica) la cita (dato de auditoría)
deleted_user_fullname
texto
Nombre completo del usuario que borra  (baja lógica) la cita (dato de auditoría)
deleted_flag
flag
Indica si la cita ha sido borrada
Ejemplo de Respuesta con error 
(al consultar/leer una  cita inexistente)
(al intentar crear un comentario en una cita)
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "GUID: 16B229A6-6F5B-476C-B99D-A79E09A6F519 not found"
	}
}
Control de Cambios
Fecha
Cambio
Noviembre 2024
Documento creado
Updated on 11/26/2025

### Listar Citas - API CRM
Listar Citas - API CRM
GET
/v1/workshop/appointment/list.php
Este servicio permite:
obtener un conjunto de citas de taller mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar una cita de taller en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página.
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
SI
Depende
Depende
Depende
estructura
texto
texto
texto
“status_code”
“=”
“2”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
NOTA:
La estructura Filters debe declararse.
Si no se especifican sus parámetros se seleccionan todas las citas
sorts
field
order
NO
SI
SI
estructura
texto
texto
 “wrokshop_name”
“ASC”
Ordenamiento a aplicar
nombre del campo por el que se ordena
Sentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“Workshop_appointments_list”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de citas
Filtros de selección
id o guid
Identificador único de la cita
status_code
Código de estado de la cita
status_name
Nombre del estado de la cita
scheduled_date_code
Fecha programada para la cita YYYYMMDD
require_taxi_flag
Solicita Taxi
is_warranty_flag
Trabajo en Garantía
is_overlap_flag
Sobreturno
car_is_in_workshop_flag
Sobreturno
workshop_code
Código del Taller
asesor_guid
Identificador único (de PILOT) del Responsable del Cliente
asesor_code
Email del Responsable del Cliente
car_brand_code
Código  de la marca del vehículo
car_model_code
Código  del modelo del vehículo
car_version
Versión del vehículo
car_licenseplate
Dominio/Matrícula/Patente
car_vin
Número de VIN
car_year
Año del vehículo
prospect_guid
Identificador único (de PILOT) del Prospecto
prospect_cuit
Identificador Fiscal
prospect_razon_social
Razón Social del Prospecto (se completa cuando el cliente es Persona Moral)
prospect_firstname
Nombre del Lead/prospecto
prospect_lastname
Apellido paterno del Lead/prospecto
prospect_phone
Teléfono fijo del Lead/prospecto
prospect_cellphone
Número de celular del Lead/prospecto
prospect_email
Dirección de correo electrónico del Lead/prospecto
delivery_date_code
Fecha de entrega comprometida YYYYMMDD
promise_delivery_hour_code
Hora de entrega comprometida HHMM
created_dt
Fecha de creación de la cita
created_user_guid
Identificador único (de PILOT) del usuario que creó la cita
created_user_code
Nombre y Apellido del usuario que creó la cita
created_user_name
Dirección de email del usuario que creó la cita
modified_dt
Fecha de última modificación de la cita
modified_user_guid
Identificador único (de PILOT) del usuario que modificó la cita
modified_user_code
Nombre y Apellido del usuario que modificó la cita
modified_user_name
Dirección de email del usuario que modificó la cita
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Valores de retorno del servicio de Consulta de una Cita de Taller
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
texto  (de 32 bits en formato GUID)
Identificador único (de la cita) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder a la cita.
status_code
texto
Código  de estado de la cita
status_name
texto
Nombre del estado de la cita
status_color
texto
Color de la etiqueta del estado de la cita
status_is_closed
flag
Indica si la cita de taller está cerrada
scheduled_date_code
fecha
Fecha de la cita
NOTA: 
su formato yyyymmdd
scheduled_date_name
fecha
Fecha de la cita
NOTA: 
su formato DD/MM/AAAA
scheduled_hour_code
texto
Hora agendada para la cita
NOTA: 
su formato hhmm
scheduled_hour_name
texto
Hora agendada para la cita
NOTA: 
su formato hh:mm
require_taxy_flag
flag
Cliente solicita taxi
is_rework_flag
flag
Reingreso del vehículo
warrantly_flag
flag
Trabajo en garantía
is_overlap_flag
flag
Sobreturno
car_is_in_workshop_flag
flag
Vehículo ingresado al Taller
is_in_workshop
flag
Vehículo ingresado al taller
invoice_type
texto
Tipo de factura
costs_amt
número
Costo Total de los servicios
NOTA: 
se expresa, sin separador de miles y con punto decimal
workshop_code
texto
Código del Taller
workshop_name
texto
Nombre del Taller
asesor_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Responsable del Cliente
asesor_code
texto
Email del Responsable del Cliente
asesor_name
texto
Nombre y Apellido del Responsable del Cliente
car_brand_code
texto
Código de la marca dele vehículo
car_brand_name
texto
Nombre de la marca del vehículo
car_model_code
texto
Código del modelo del vehículo
car_model_name
texto
Nombre del modelo del vehículo
car_version
texto
Versión del vehículo
car_licenseplate
texto
Dominio del vehículo
car_vin
texto
VIN del vehículo
car_year
texto
Año de fabricación del vehículo
car_kms_year
texto
Promedio de kilómetros anuales del vehículo
car_actual_kms
texto
Kilómetros actuales del vehículo
car_sold_by
texto
Concesionario de venta
prospect_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Prospecto
prospect_cuit
texto
Régimen Fiscal
prospect_razon_social
texto
Razón Social del Lead/prospecto
prospect_firstname
texto
Nombre del Lead/prospecto
prospect_lastname
texto
Apellido paterno del Lead/prospecto
prospect_phone
texto
Teléfono fijo del Lead/prospecto
prospect_cellphone
texto
Número de celular del Lead/prospecto
prospect_email
texto
Dirección de correo electrónico del Lead/prospecto
delivery_date_code
texto
Fecha de Entrega comprometida
NOTA: 
su formato yyyymmdd
delivery_date_name
texto
Fecha de Entrega comprometida
NOTA: 
su formato DD/MM/AAAA
promise_delivery_hour_code
texto
Hora de Entrega comprometida
NOTA: 
su formato hhmm
promise_delivery_hour_name
texto
Hora de Entrega comprometida
NOTA: 
su formato hhmm
notes
texto
Notas
created_dt
texto
Fecha de creación de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Prospecto
created_user_code
texto
Nombre y Apellido del usuario que creó la cita
created_user_name
texto
Dirección de email del usuario que creó la cita
modified_dt
fecha
Fecha de creación de la cita
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
modified_user_guid
texto  (de 32 bits en formato GUID)
Identificador único (de PILOT) del Prospecto
modified_user_code
texto
Nombre y Apellido del usuario que modificó la cita
modified_user_fullname
texto
Dirección de email del usuario que modificó la cita
Ejemplo de solicitud para Consultar Citas de Taller
{
	"data": {
             "page": 1,
             "limit": 10,		
             "filters":[
			{
			  "field": "status_code",
			  "operation": "=",
			  "value": "2",
			}
		],
		"sort": [
		    {
		         "field": "workshop_code",
		         "order": "ASC"
	             }
                ],
	"header": {
		"FlowName": "workshop_appointments_lis",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token": "token"
	}
}
Respuesta a Solicitud Consulta de una Cita de Taller Satisfactoria
{
    "ts": "1621001584",
    "_id": "100552",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 3,
            "rows_count": 24,
            "rows_per_page": 10,
            "rows_in_page": 10,
            "rows_remaining": 14
        },
        "entitydata": [
            {
                "id": "9235E22E-31DF-45B4-9386-51E381585E9C",
                "status_code": "2",
                "status_name": "Confirmado",
                "status_color": "#578ebe",
                "status_is_closed": "0",
                "scheduled_date_code": 20210316,
                "scheduled_date_name": "16/03/2021",
                "scheduled_hour_code": "0900",
                "scheduled_hour_name": "09:00",
                "require_taxi_flag": "1",
                "is_rework_flag": "1",
                "is_warranty_flag": "1",
                "is_overlap_flag": "1",
                "invoice_type": null,
                "costs_amt": ".00",
                "workshop_code": "tas1",
                "workshop_name": "Taller Central",
                "asesor_guid": "7378F25C-DB3F-4DEC-BDB5-FEA852E79558",
                "asesor_code": "asesorservicio@pilot.com",
                "asesor_name": "Asesor Servicios",
                "car_brand_code": "VW",
                "car_brand_name": "Volkswaguen",
                "car_model_code": "GL",
                "car_model_name": "Gol Trend",
                "car_version": "",
                "car_licenseplate": "GHJ123",
                "car_vin": "12345678912345678",
                "car_kms_year": "10000",
                "car_actual_kms": "20000",
                "car_sold_by": "",
                "prospect_guid": "6D7849FA-2B37-49F6-BE68-EB14F477BF41",
                "prospect_cuit": "",
                "prospect_razon_social": "",
                "prospect_firstname": "Nombre cliente",
                "prospect_lastname": "Apellido cliente",
                "prospect_phone": "1234567890",
                "rospect_cellphone": "",
                "prospect_email": "cliente@email.com",
                "delivery_date_code": null,
                "delivery_date_name": null,
                "promise_delivery_hour_code": null,
                "promise_delivery_hour_name": null,
                "notes": "",
                "created_dt": "2021-03-16T20:19:07.353",
                "created_user_guid": "50E6ACC4-E495-4497-948A-12ED60EAA777",
                "created_user_code": "test@pilotsolution.com.ar",
                "created_user_name": "Test",
                "modified_dt": "2021-03-23T19:22:04.350",
                "modified_user_guid": "8982D618-E17F-4E56-8C26-E31AB19EE6EB",
                "modified_user_code": "teamapp@pilotsolution.net",
                "modified_user_fullname": "Team Leader APP"
            },
Ejemplo de Respuesta con error
(al consultar una cita de taller con un valor de 
‘field’ 
 incorrecto)
{
  "ts": "1545313992",
  "_id": "35208",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "500",
    "message": "Column 'statuss_code' not found in model"
  }
}
Control de Cambios
Fecha
Cambio
27 Febrero 2023
Documento creado
Updated on 04/20/2025

### Citas de Taller / Listar sus servicios - API CRM
Listar sus servicios - API CRM
POST
/v2/workshops/appointments//services/list_assigned.php
Este servicio permite:
listar los servicios incluidos en una Cita de Taller
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un conjunto de servicios en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
NO
NO
NO
estructura
texto
texto
texto
“appointment_id”
“=”
“F6FD514F-3F3C-4913-9A7A-7EB0E1B48713”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“workshops_appointment_services_list”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de servicios.
Filtros de selección
appointment_id
Identificador único de la cita de taller (Guid)
Operadores
Igualdad
 =
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer una inspección específica – appointment_id
{
    "data": {
        "appointment_id": "16B229A6-6F5B-476C-B99D-A79E09A6F51B"
        "filters": [
        ]
    },
    "header": {
        "FlowName": ""workshops_appointment_services_assigned_list",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud listar los servicios incluidos en una cita de taller 
– appointment_id 
Satisfactoria
Especificación de la entidad “inspecciones”
{
    "ts": "1743952922",
    "_id": "240593908",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 10,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": 37,
                "appointment_id": "16B229A6-6F5B-476C-B99D-A79E09A6F51B",
                "service_id": 15,
                "service_name": "10.000 km",
                "service_code": "CH1",
                "service_color": "#0000FF",
                "service_ut": "2.00",
                "service_estimated_cost": "10000.00",
                "appointment_date_id": null,
                "appointment_hour_id": null,
                "appointment_workshop_id": null,
                "appointment_car_licenseplate": null,
                "appointment_car_vin": null,
                "appointment_status_id": null,
                "appointments_status_code": null
            }
        ]
    }
}
Ejemplo de Respuesta con error
(al listar los servicios incluidos en una cita de taller por un id que no existe)
{
    "ts": "1721913645",
    "_id": "113575394",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 0,
            "rows_count": 0,
            "rows_per_page": 25,
            "rows_in_page": 0,
            "rows_remaining": 25
        },
        "entitydata": []
    }
}
Control de Cambios
Fecha
Cambio
23-Julio-2024
Documento creado
Updated on 04/20/2025

### Citas de Taller / Listar sus inspecciones
Listar sus inspecciones
POST
/v2/workshops/appointments/inspections/list.php
Este servicio permite:
listar las inspecciones realizadas durante una Cita de Taller, mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un conjunto de inspecciones en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
NO
NO
NO
estructura
texto
texto
texto
“appointment_id”
“=”
“F6FD514F-3F3C-4913-9A7A-7EB0E1B48713”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“workshops_inspection_list”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de inspecciones. 
Filtros de selección
id
ID – Identificador único de la Inspección realizada en la cita de taller (Guid)
entity_code
Código Identificador del Taller en el que se realiza la Inpsección
appointment_id
Identificador único de la cita de taller (Guid)
template_id
ID – Identificador único del Template de Inspección (valor técnico)
template_name
Nombre del Template de Inspección
template_code
Código del Template de Inspección
type_id
ID – Identificador único del Tipo de Inspección (valor técnico)
type_code
Código  del Tipo de Inspección
type_name
Nombre del Tipo de Inspección
created_dt
Fecha en la que se ingresa la Inspección    Formato ISO (YYYY-MM-DDThh:mm:ss.000)
created_user_id
ID – Identificador único del operador que ingresa la inspección
created_user_fullname
Nombre completo del operador que ingresa la inspección
deleted_flag
Marca que indica si la inspección fue borrada (baja (lógica)
completed
Indicador que informa si la inspección fue completada
Operadores
 Igualdad
 =
 Distinto a
 &lt;&gt;
 Mayor a
 &gt;
 Menor a
 &lt;
 Mayor o igual a
 &gt;=
 Menor o igual a
 &lt;=
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer una inspección específica – appointment_id
{
    "data": {
        "filters": [
            {
                "field": "appointment_id",
                "operation": "=",
                "value": "F6FD514F-3F3C-4913-9A7A-7EB0E1B48713"
            }
        ]
    },
    "header": {
        "FlowName": "workshops_inspection_list",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud listar una inspección específica 
– appointment_id 
Satisfactoria
Especificación de la entidad “inspecciones”
{
    "ts": "1721912294",
    "_id": "113565595",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 25,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": "D8DB94FD-81B8-4AD3-A043-C8ADF14B0A12",
                "appointment_id": "F6FD514F-3F3C-4913-9A7A-7EB0E1B48713",
                "type_id": "1",
                "type_code": "Code 1",
                "type_name": "Inspección Tipo 1",
                "template_id": 1,
                "template_name": "Verifica puertas",
                "customer_notes": "Test customer",
                "rc_notes": "Test rc",
                "created_dt": "2024-07-22T22:03:11.497",
                "created_user_id": 49899,
                "created_user_fullname": "Api Consultas",
                "updated_dt": null,
                "updated_user_id": null,
                "updated_user_fullname": null,
                "deleted_dt": null,
                "deleted_user_id": null,
                "deleted_user_fullname": null,
                "deleted_flag": 0,
                "completed": 0
            }
        ]
    }
}
Ejemplo de Respuesta con error
(al listar una inspección por un id que no existe)
{
    "ts": "1721913645",
    "_id": "113575394",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 0,
            "rows_count": 0,
            "rows_per_page": 25,
            "rows_in_page": 0,
            "rows_remaining": 25
        },
        "entitydata": []
    }
}
Control de Cambios
23-Julio-2024
Documento creado
Updated on 04/20/2025

### Entidad Inspecciones en Cita de Taller - API CRM
Entidad Inspecciones en Cita de Taller - API CRM
Valores de retorno para los servicios de Inspecciones
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
ID – Identificador único de la Inspección realizada en la cita de taller (Guid)
appointment_id
texto  (de 32 bits en formato GUID)
Identificador único de la cita de taller (Guid)
type_id
número (10)
ID – Identificador único del Tipo de Inspección (valor técnico)
type_code
texto (50)
Código del Tipo de Inspección
type_name
texto (100)
Nombre del Tipo de Inspección
template_id
número (10)
ID – Identificador único del Template de Inspección (valor técnico)
template_name
texto (100)
Nombre del Template de Inspección
customer_notes
texto (1000)
Comentarios/Observaciones del cliente
rc_notes
 texto (1000)
Comentarios/Observaciones del Responsable del Cliente
created_dt
fecha
Fecha en la que se ingresa la Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_id
número (10)
Id – Identificador único del operador que ingresa la inspección (valor técnico)
created_user_fullname
texto (250)
Nombre completo del operador que ingresa la inspección
updated_dt
fecha
Fecha de última modificación del registro de la inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
updated_user_id
número (10)
Id – Identificador único del operador que modifica el registro de la inspección (valor técnico)
updated_user_fullname
texto (250)
Nombre completo del operador que realizara la última modificación del registro de la inspección
deleted_dt
fecha
Fecha de
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
deleted_user_id
número (10)
Id del Usuario que borra (baja lógica) el registro de la inspeccion
deleted_user_fullname
texto (250)
Nombre completo del operador que borra (baja lógica) el registro de la inspección
deleted_flag
flag
Marca que indica si la inspección fue borrada (baja (lógica)
Valores posibles:
 0 = Activa ; 1 = Borrada
Valor por defecto:
 0
completed
flag
Flag que indica si la  Inspección fue realizada
Valores posibles:
 0 = No realizada ; 1 = Realizada
Valor por defecto:
 0
Control de Cambios
Nombre del Parámetro
Tipo
17 Julio 2024
Documento creado
Updated on 04/20/2025

### Listar inspecciones - Templates - API CRM
Listar inspecciones - Templates - API CRM
POST
/v2/lookups/workshops/appointments/inspections/templates/list.php
Este servicio permite:
listar el set de Templates de Inspección 
(*) 
que pueden aplicarse durante una Cita, mediante la aplicación de 
filtros
. 
(*) Nota:
 Un Template de Inspección es un conjunto de actividades/acciones (checks) a realizar
Parámetros para listar un set de Templates de Inspección
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página.
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
NO
NO
NO
estructura
texto
texto
texto
“”
“”
“”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“lookups_inspection_template_list”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un set de Templates de Inspección
Filtros de selección
NINGUNO
En caso de no especificar ningún filtro se obtiene la lista completa de Templates de Inspección
VALORES de RETORNO (*)
Los nodos de retorno son ‘filtros de selección’
Valores de retorno
Nombre del Parámetro
Tipo
Comentario
id
texto  (de 32 bits en formato GUID)
ID – Identificador único de la Inspección realizada en la cita de taller (Guid)
inspection_type_id
número (10)
ID – Identificador único del Tipo de Inspección (valor técnico)
inspection_type_code
texto (50)
Código del Tipo de Inspección
inspection_type_name
texto (100)
Nombre del Tipo de Inspección
name
texto (100)
Nombre del Template de Inspección
code
texto (50)
Código del Template de Inspección
description
texto (1000)
Descripción del Template de Inspección
company_id
número (10)
Identificador único de Compañía en PILOT
NOTA: No considerar
business_entity_id
número (10)
ID – Identificador único del Tipo de Negocio (valor técnico)
NOTA: No considerar
created_dt
fecha
Fecha en la que se crea el registro del Template
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_id
número (10)
Id – Identificador único del operador que ingresa el registro del Template  de Inspección (valor técnico)
created_user_fullname
texto (250)
Nombre completo del operador que ingresa el registro del Template de Inspección
updated_dt
fecha
Fecha de última modificación del registro de Template de Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
updated_user_id
número (10)
Id – Identificador único del operador que modifica el registro de Template de Inspección (valor técnico)
updated_user_fullname
texto (250)
Nombre completo del operador que realizara la última modificación del registro de Template de Inspección
deleted_dt
fecha
Fecha de borrado (baja lógica) del registro de Template de Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
deleted_user_id
número (10)
Id del Usuario que borra (baja lógica) el registro de la inspeccion
deleted_user_fullname
texto (250)
Nombre completo del operador que borra (baja lógica) el registro de la inspección
deleted_flag
flag
Marca que indica si la inspección fue borrada (baja (lógica)
Valores posibles:
 0 = Activa ; 1 = Borrada
Valor por defecto:
 0
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer los Templates de Inspección considerando el Código de un template [code]
{
    "data": {
        "filters": [{"operation": "=", "field": "code", "value": "Code 1"}]
    },
    "header": {
        "FlowName": "lookups_inspection_template_list",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
    }
}
}
Respuesta a Solicitud Consulta/Lectura de talleres Satisfactoria 
(*) Valores de retorno de un Template de Inspecciones
{
    "ts": "1721924220",
    "_id": "113659528",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 25,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": "553721E6-A27D-4D3D-914B-79CCE0EB889C",
                "inspection_type_id": 1,
                "inspection_type_code": "Code 1",
                "inspection_type_name": "Inspección Tipo 1",
                "name": "Verifica puertas",
                "code": "Code 1",
                "description": "Verifica las puertas",
                "company_id": 1,
                "business_entity_id": 5,
                "created_dt": "2024-01-17T21:09:28.650",
                "created_user_id": 11535,
                "created_user_fullname": "Marcela Molero",
                "updated_dt": "2024-07-22T20:14:36",
                "updated_user_id": 11535,
                "updated_user_fullname": "Marcela Molero",
                "deleted_dt": null,
                "deleted_user_id": null,
                "deleted_user_fullname": null,
                "deleted_flag": null
            }
        ]
    }
}
Ejemplo de Respuesta con error (al consultar/leer talleres por ‘company_code’ inexistente en la muestra)
(al listar una inspección por un id que no existe)
{
    "ts": "1721926804",
    "_id": "113678449",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 0,
            "rows_count": 0,
            "rows_per_page": 25,
            "rows_in_page": 0,
            "rows_remaining": 25
        },
        "entitydata": []
    }
}
}
Control de Cambios
18 Julio 2024
Documento creado
Updated on 04/20/2025

### Listar tipos de inspecciones - API CRM
Listar tipos de inspecciones - API CRM
POST
/v2/lookups/workshops/appointments/inspections/types/list.php
Este servicio permite:
listar los Tipos de Inspección que se pueden utilizar para clasificar un Template de Inspecciones. 
(*) Nota:
 Tipo de Inspección es un Dato Maestro en el esquema de Inspecciones. El Tipo de Inspección identifica al Template de Inspección según su alcance de aplicación.
Parámetros para listar los Tipos de Inspección
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
NO
texto
100
Cantidad de registros por página.
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
NO
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
NO
NO
NO
estructura
texto
texto
texto
“”
“”
“”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“lookups_inspection_template_list”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un set de Templates de Inspección
Filtros de selección
NINGUNO
En caso de no especificar ningún filtro se obtiene la lista completa de Tipos de Inspección
VALORES de RETORNO (*)
Los nodos de retorno son ‘filtros de selección’
(*) Valores de retorno de Tipo de Inspecciones
Parámetros para listar los Tipos de Inspección
Nombre del Parámetro
Tipo
Comentario
id
número (10)
ID – Identificador único del Tipo de Inspección (valor técnico)
code
texto (50)
Código del Tipo de Inspección
name
texto (100)
Nombre del Tipo de Inspección
deleted
flag
Nombre del Tipode Inspección
description
texto (1000)
Descripción del Tipo de Inspección
created_dt
fecha
Fecha en la que se crea el registro del Tipo de Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
updated_dt
fecha
Fecha de última modificación del registro de Tipo de Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
deleted_dt
fecha
Fecha de borrado (baja lógica) del registro de Tipo de Inspección
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
created_user_id
número (10)
Id – Identificador único del operador que ingresa el registro del Tipo  de Inspección (valor técnico)
updated_user_id
número (10)
Id – Identificador único del operador que modifica el registro de Tipo  de Inspección (valor técnico)
deleted_user_id
número (10)
Id del Usuario que borra (baja lógica) el registro del Tipo de Inspección
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para Consultar/Leer la Lista de Tipo de Inspecciones
{
    "data": {
    },
    "header": {
        "FlowName": "lookups_workshops_inspection_type_list",
        "SequenceId": [],
        "TimeStamp": [],
        "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
        "access_token": "{{token}}"
    }
}
Respuesta a Solicitud Consulta/Lectura de Tipos de Inspección Satisfactoria 
(*) Valores de retorno de Tipo de Inspecciones
{
    "ts": "1721944237",
    "_id": "113814979",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 25,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "id": 1,
                "code": "Code 1",
                "name": "Inspección Tipo 1",
                "deleted": 0,
                "company_id": 1,
                "description": "Inspección que se realiza al ingreso del taller",
                "created_user_id": 11535,
                "updated_user_id": null,
                "deleted_user_id": null,
                "created_dt": "2024-01-17T21:08:02.470",
                "updated_dt": null,
                "deleted_dt": null
            }
        ]
    }
}
Ejemplo de Respuesta cuando la el resultado de la búsqueda es nulo
{
    "ts": "1721926804",
    "_id": "113678449",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 0,
            "rows_count": 0,
            "rows_per_page": 25,
            "rows_in_page": 0,
            "rows_remaining": 25
        },
        "entitydata": []
    }
}
}
Control de Cambios
Control de Cambios
Fecha
Cambio
23 Julio 2024
Documento creado
Updated on 04/20/2025

### Entidad Taller - API CRM
Entidad Taller - API CRM
Valores de retorno para todos los servicios de taller
Nombre del Parámetro
Tipo
Comentario
code
texto
Código del Taller 
NOTA:
El valor correspondiente a este campo se obtiene consultando el dato maestro  
branches  
Ver más
name
texto
Nombre del Taller
NOTA:
Los valores correspondientes a esta estructura se obtienen consultando el dato maestro  
branches  
Ver más
deleted
flag
Marca que indica si el Taller se encuentra dado de baja
Valores posibles:
 0 = No dado de baja ; 1 = Dado de baja
Valor por defecto:
 0
visible
flag
Flag que indica si el Taller es visible en una consulta
Valores posibles:
 0 = Visible ; 1 = No Visible
Valor por defecto:
 0
visual_order
número
Orden en el cual se visualiza el Taller en una lista de consulta
company
id
code
name
estructura
número
texto
texto
Empresa a la que pertenece el taller
Identificador técnico interno
Código de la empresa
Nombre de la empresa
headers
texto
Descripción del Taller
phone
texto
Número de teléfono delTtaller
branch_type
branch_type_code
branch_type_name
estructura
texto
texto
Tipo de Sucursal
Código
Nombre
Valores posibles:
 Salón ; Grupo ; Taller
commercial_brand
code
name
estructura
texto
texto
Marca con la que opera el Taller
Código de marca
Nombre de la marca
NOTA:
Los valores correspondientes a esta estructura se obtienen consultando el dato maestro  
workshop_brand  
Ver más
address
texto
Domicilio del Taller
address_latitude
texto
Latitud del domicilio del taller
address_longitude
texto
Longitud del domicilio del taller
audit_dt
fecha
Fecha de última acción registrada sobre el registro
audit_usr
texto
Id del Usuario que realizara la última acción
Control de Cambios
Fecha
Cambio
17 Diciembre 2018
Documento creado
Updated on 04/20/2025

### Listar Talleres - API CRM
Listar Talleres - API CRM
POST
/v1/workshop/list.php
Este servicio permite:
listar el conjunto de talleres por Código de la Marca (que atiende el taller), mediante la aplicación de 
filtros
. 
ordenar los resultados
Parámetros para listar un conjunto de talleres en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
SI
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
workshop_brand_code
SI
texto
“VW”
Código de la Marca de vehículo que atiende el taller
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
workshop_brand
Ver más
filters
field
operation
value
NO
SI
SI
SI
estructura
texto
texto
texto
“”
“”
“”
Filtro a aplicar
nombre del campo por el que se selecciona
operador
valor
sorts
field
order
NO
SI
SI
estructura
texto
texto
 “”
“DESC” “ASC”
Ordenamiento a aplicar
nombre del campo por el que se ordena
Sentido del ordenamiento
Valores posibles:
DESC
 = Descendente ; 
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“List_workshops”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de talleres
Filtros de selección
company_code
Código identificador de la Empresa a la que pertenece el taller
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
companies
Ver más
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Ejemplo de solicitud para Consultar/Leer talleres considerando: company_code ordenados en modo ascendente según su fecha de auditoría
{
	"data": {
		"workshop_brand_code":"VW",
		"filters":[
			{
				"field": "company_code",
				"operation": "=",
				"value": "1"
			}
		],
		"sort": [
			{
				"field": "audit_dt",
				"order": "ASC"
			}
		],
		"limit": 25,
		"page": 1
	},
	"header": {
		"FlowName": "list_workshops",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "token"
	}
}
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Respuesta a Solicitud Consulta/Lectura de talleres Satisfactoria 
Especificación de la entidad “taller”
{
  "ts": "1545056711",
  "_id": "11610",
  "result": {
    "status": "success",
    "aditional_data": {
      "page": 1,
      "page_count": 0,
      "rows_count": 0,
      "rows_per_page": 25,
      "rows_in_page": 2,
      "rows_remaining": -2
    },
    "entitydata": [
      {
        "code": "t1",
        "name": "Taller 1",
        "deleted": "0",
        "visible": "1",
        "visual_order": "1",
        "company": {
          "code": "1",
          "name": "Default"
        },
        "headers": "",
        "phone": "",
        "branch_type": {
          "branch_type_code": "3",
          "branch_type_name": "Taller"
        },
        "commercial_brand": {
          "code": "FORD",
          "name": "Ford"
        },
        "address": "",
        "address_latitude": null,
        "address_longitude": null,
        "audit_dt": "2018-03-08T07:54:44-0300",
        "audit_usr": "3314"
      },
      {
        "code": "t2",
        "name": "Taller 2",
        "deleted": "0",
        "visible": "1",
        "visual_order": "1",
        "company": {
          "code": "1",
          "name": "Default"
        },
        "headers": "sucursal taller 3",
        "phone": "1178789091",
        "branch_type": {
          "branch_type_code": "3",
          "branch_type_name": "Taller"
        },
        "commercial_brand": {
          "code": "FORD",
          "name": "Ford"
        },
        "address": "Av. Maipú 1200",
        "address_latitude": null,
        "address_longitude": null,
        "audit_dt": "2018-03-08T08:05:39-0300",
        "audit_usr": "3314"
      }
    ]
  }
}
Ejemplo de Respuesta con error (al consultar/leer talleres por ‘company_code’ inexistente en la muestra)
{
    "ts": "1545057014",
    "_id": "11611",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "business_error",
        "message": "company_code not found: 3"
  }
}
Control de Cambios
Fecha
Cambio
17 Diciembre 2018
Documento creado
28 Marzo 2024
Agregado de Consideraciones
Updated on 04/20/2025

### Entidad Vehículo - API CRM
Entidad Vehículo - API CRM
Valores de retorno para todos los vehículos
Nombre del Parámetro
Tipo
Comentario
domain
texto
Dominio del vehículo
vin
texto
VIN universal del vehículo
kms_year
número
Cantidad de kilómetros por año que tiene el vehículo
kms_actual
número
Cantidad total de kilómetros que tiene el vehículo
visual_order
número
Orden en el cual se visualiza el Taller en una lista de consulta
brand
code
name
estructura
texto
texto
Marca del vehículo
Código
Nombre
model
code
name
estructura
texto
texto
Modelo del vehículo
Código
Nombre
version
texto
Versión del vehículo
sold_by
texto
Concesionario/Agencia que vendió el vehículo
prospect
id
estructura
texto  (de 32 bits en formato GUID)
prospecto
Identificador único (del prospecto) de PILOT
NOTA:
Se recomienda preservar este valor en su sistema ya que es la ÚNICA forma de acceder al prospecto.
Control de Cambios
Fecha
Cambio
17 Diciembre 2018
Documento creado
Updated on 04/20/2025

### Buscar Vehículo - API CRM
Buscar Vehículo - API CRM
POST
/v1/workshop/appointment/vehicle_search.php
Este servicio permite buscar un vehículo en una cita de taller por su Dominio o su VIN 
Parámetros para buscar un vehículo
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
vehicle_domain
SI 
(*)
texto
“ABC123”
 Dominio del vehículo
vehicle_vin
SI 
(*)
texto
“11112222222”
 VIN Universal del vehículo
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“workshop_vehicle_search”
1
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
(*) Al menos uno de los dos parámetros debe ser completado
Ejemplo de solicitud para Buscar un vehículo en una Cita de Taller considerando su dominio – vehicle_domain
{
	"data": {
		"vehicle_domain": "ABC123"
	},
	"header": {
		"FlowName": "workshop_vehicle_search",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "token"
	}
}
Retorno de una solicitud – Su estructura
Valores de retorno
ts
timestamp
timestamp
id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
entidad vehículo
Respuesta a Solicitud de Búsqueda de un vehículo  Satisfactoria 
Especificación de la entidad “vehículo”
{
  "ts": "1545061805",
  "_id": "11614",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "domain": "ABC123",
      "vin": "3KPFL511BJE186429",
      "kms_year": "12000",
      "kms_actual": "30000",
      "brand": {
        "code": "FD",
        "name": "Ford"
      },
      "model": {
        "code": "FDFC",
        "name": "Focus"
      },
      "version": "1.6L Sigma TiVCT, 125CV",
      "sold_by": "Concesionario",
      "prospect": {
        "id": "FGD457-HYU786-KIL098-RTY675"
      }
    }
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1545062147",
  "_id": "11615",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "technical_error",
    "message": "No se recibió ningún parámetro para realizar la búsqueda"
  }
}
Control de Cambios
Fecha
Cambio
17 Diciembre 2018
Documento creado
3 Abril 2024
Actualización de ejemplo
Updated on 04/20/2025

### Entidad Responable de Cliente - API CRM
Entidad Responable de Cliente - API CRM
Ejemplo en JSON valores de retorno de una entidad responsable de cliente.
 "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
        "name": "Desa Local"
Valores de retorno
id
string
Identificador del usuario responsable de cliente
name
string
Nombre del usuario responsable de cliente
Updated on 04/20/2025

### Responsables de Cliente - API CRM
Responsables de Cliente - API CRM
POST
/v1/workshop/appointment/available_rc.php
Se utiliza para 
consultar/leer
 los Responsables de Recepción de Clientes [RC] disponibles en un taller en un rango de fechas
Parámetro para consultar/leer 
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
data
workshop_code
date_from
date_to
SI
SI
SI
SI
estructura
texto
fecha
fecha
t1
“2018-12-08T00:00:00.000”
“2018-12-09T00:00:00.000”
Estructura que contiene datos del alcance de la consulta
Código de Taller
Fecha desde
Fecha hasta
header
Flow_name
Sequencedid
TimeStamp
TrackingId
access_token
SI
SI
SI
NO
SI
estructura
texto
número
fecha
número
texto
“rc_workshop”
“1”
“1513352637”
“2018-12-09T00:00:00.000”
“{{token}}”
Nombre descriptivo del servicio
Número de secuencia
Fecha de llamado del servicio
Número de tracking que puede utilizar el cliente para hacer seguimiento
Token válido de 
autorización
Ejemplo de solicitud para Consultar/Leer la disponibilidad de [RC] en un taller en un rango de fechas
{
	"data": {
		"workshop_code": "t1",
		"date_from": "2018-12-08T00:00:00.000",
		"date_to": "2018-12-09T00:00:00.000"
	},
	"header": {
		"FlowName": "rc_workshops",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "{{token}}"
	}
}
Ejemplo respuesta JSON
{
  "ts": "1545069221",
  "_id": "11618",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": [
      {
        "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FEF",
        "name": "Desa Local"
      }
    ]
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1545069349",
  "_id": "11619",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Required parameter not defined: workshop_code"
  }
}
Valores de retorno
id
timestamp
timestamp
id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
entidad responsable de cliente
Updated on 04/20/2025

### Entidad Agenda Disponibilidad Diaria
Entidad Agenda Disponibilidad Diaria
Ejemplo en JSON valores de retorno de una entidad disponibilidad diaria.
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-10",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 0,
        "available_appointments_qty": 17,
        "total_technical_units": ".0",
        "scheduled_technical_units": "0",
        "available_technical_units": "0"
Valores de retorno
workshop
struct
code
string
Código del taller
name
string
Nombre del taller
date
string
Fecha en formato yyyy-mm-dd
user
struct
id
string
Identificador del usuario responsable de cliente
name
string
Nombre del usuario responsable de cliente
total_appointments_qty
numeric
Cantidad total de citas que se pueden agendar en la fecha
scheduled_appointments_qty
numeric
Cantidad de citas agendadas en la fecha
available_appointments_qty
numeric
Cantidad de citas disponibles para agendar
total_technical_units
numeric
Total de unidades técnicas de taller para la fecha
scheduled_technical_units
numeric
Cantidad de unidades técnicas de taller agendadas para la fecha
available_technical_units
numeric
Cantidad de unidades técnicas de taller disponibles para la fecha
Updated on 04/20/2025

### Agenda Disponibilidad Diaria - API CRM
Agenda Disponibilidad Diaria - API CRM
POST
/v1/workshop/appointment/daily_schedule.php
Este servicio permite listar la disponibilidad diaria para agendar citas de taller. Lista la disponibilidad según taller, fecha y responsable de cliente.
Ejemplo solicitud JSON
{
	"data": {
		"workshop_code": "t1",
		"date_from": "2018-12-10T00:00:00.000",
		"date_to": "2018-12-15T00:00:00.000"
	},
	"header": {
		"FlowName": "workshop_daily_schedule",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "token"
	}
}
Ejemplo respuesta JSON
{
  "ts": "1545139507",
  "_id": "11728",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": [
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-10",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 0,
        "available_appointments_qty": 17,
        "total_technical_units": ".0",
        "scheduled_technical_units": "0",
        "available_technical_units": "0"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-11",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 0,
        "available_appointments_qty": 17,
        "total_technical_units": ".0",
        "scheduled_technical_units": "0",
        "available_technical_units": "0"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-12",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 0,
        "available_appointments_qty": 17,
        "total_technical_units": "20.0",
        "scheduled_technical_units": "0",
        "available_technical_units": "20"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-13",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 1,
        "available_appointments_qty": 16,
        "total_technical_units": "20.0",
        "scheduled_technical_units": "2",
        "available_technical_units": "18"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-14",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 2,
        "available_appointments_qty": 15,
        "total_technical_units": "20.0",
        "scheduled_technical_units": "5",
        "available_technical_units": "15"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-15",
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "total_appointments_qty": 17,
        "scheduled_appointments_qty": 0,
        "available_appointments_qty": 17,
        "total_technical_units": ".0",
        "scheduled_technical_units": "0",
        "available_technical_units": "0"
      }
    ]
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1545139703",
  "_id": "11729",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Required parameter not defined: date_from"
  }
}
Parámetros
data
struct
required
date_from
isodatetime
required
Fecha desde la cual se busca la disponibilidad
date_to
isodatetime
required
Fecha hasta la cual se busca la disponibilidad
workshop_code
string
required
Código del taller para el que se busca disponibilidad
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de
autorización
Valores de retorno
ts
timestamp
timestamp
id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
struct
page
numeric
Número de la página que se muestra
page_count
numeric
Cantidad total de páginas
rows_count
numeric
Cantidad total de registros
rows_per_page
numeric
Cantidad de registros por página
rows_in_page
numeric
Cantidad de registros en la página actual
rows_remaining
numeric
 Cantidad total de registros restantes
entitydata
struct
entidad disponibilidad diaria
Updated on 04/20/2025

### Entidad Agenda Disponibilidad Horaria - API CRM
Entidad Agenda Disponibilidad Horaria - API CRM
Ejemplo en JSON valores de retorno de una entidad disponibilidad horaria.
 "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "09:00",
          "name": "09:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
Valores de retorno para la agenda de disponibilidad diaria
workshop
struct
code
string
Código del taller
name
string
Nombre del taller
date
string
Fecha en formato yyyy-mm-dd
hour
struct
code
string
Código del horario
name
string
Nombre del horario
user
struct
id
string
Código del horario
name
string
Nombre del horario
user
struct
id
string
Identificador del usuario responsable de cliente
name
string
Nombre del usuario responsable de cliente
workshop_appointment_guid
string
Identificador de la cita que ocupa el horario
workshop_appointment_technical_units
numeric
Cantidad de unidades técnicas de taller que requiere la cita que ocupa el horario

### Agenda Disponibilidad Horaria - API CRM
Agenda Disponibilidad Horaria - API CRM
POST
/v1/workshop/appointment/time_schedule.php
Este servicio permite listar la disponibilidad horaria para agendar citas de taller. Lista la disponibilidad según taller, fecha y responsable de cliente.
Ejemplo solicitud JSON
{
	"data": {
		"date_from": "2018-11-27T00:00:00.000",
		"date_to": "2018-11-27T00:00:00.000",
		"workshop_code": "PV",
		"user_id": "27E7AE7B-B4FA-4384-93CD-001D757270A9"
	},
	"header": {
		"FlowName": "workshop_time_schedule",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "token"
	}
}
Ejemplo respuesta JSON
{
  "ts": "1545141931",
  "_id": "11733",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": [
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "09:00",
          "name": "09:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "0850",
          "name": "08:50"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "0930",
          "name": "09:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "1000",
          "name": "10:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "1030",
          "name": "10:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "1100",
          "name": "11:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "11:30",
          "name": "11:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "12:00",
          "name": "12:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "12:30",
          "name": "12:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "14:00",
          "name": "14:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "14:30",
          "name": "14:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "15:00",
          "name": "15:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "15:30",
          "name": "15:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "16:00",
          "name": "16:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": "A36D631B-33C3-41A2-959A-06AECC249DE7",
        "workshop_appointment_technical_units": "4"
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "16:30",
          "name": "16:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "17:00",
          "name": "17:00"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      },
      {
        "workshop": {
          "code": "t1",
          "name": "Taller 1"
        },
        "date": "2018-12-19",
        "hour": {
          "code": "17:30",
          "name": "17:30"
        },
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38FFF",
          "name": "Desa Local"
        },
        "workshop_appointment_guid": null,
        "workshop_appointment_technical_units": null
      }
    ]
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1545142632",
  "_id": "11734",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Required parameter not defined: date_from"
  }
}
Parámetros
data
struct
required
date_from
isodatetime
required
Fecha desde la cual se busca la disponibilidad
date_to
isodatetime
required
Fecha hasta la cual se busca la disponibilidad
workshop_code
string
required
Código del taller para el que se busca disponibilidad
user_id
string
Identificador del usuario responsable de cliente
header
struct
required
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha de pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
timestamp
id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
struct
page
numeric
Número de la página que se muestra
page_count
numeric
Cantidad total de páginas
rows_count
numeric
Cantidad total de registros
rows_per_page
numeric
Cantidad de registros por página
rows_in_page
numeric
Cantidad de registros en la página actual
rows_remaining
numeric
 Cantidad total de registros restantes
entitydata
struct
entidad disponibilidad diaria
Updated on 04/20/2025

## Webhooks  - API CRM
Webhooks  - API CRM

### Webhooks - API CRM
Webhooks
POST
/webhooks/welcome.php
Se utiliza para crear una cita en un taller.
Permite
Conectar Pilot con su sitio web o programa particular
.
Crear integraciones que conecten Pilot® con sus landings, sitio web de su empresa, o programas que recolectan datos y necesita enviarlos a Pilot® para que sean gestionados por sus vendedores.
Consideraciones
¿No sos un programador?
Revisa la integración vía mail 
acá
, puede que estés trabajando con algún proveedor de datos el cual ya esta integrado con Pilot®.
Si estas trabajando con un proveedor de datos del estilo de Mercado Libre, De Motores, etc, que no este actualmente integrado con Pilot, enviá tu necesidad de integración a nuestro soporte para que sea evaluada.
Primeros pasos
Nuestra documentación explica las nociones básicas del uso de llamadas Web/HTTP y Pilot® en particular. Si no estás familiarizado con estas técnicas o no has trabajado antes con llamadas Web/HTTP, por favor dedicale un momento para hacerlo antes de comenzar con el trabajo.
Punto de partida de la API Restful
POST
/webhooks/welcome.php
IMPORTANTE:
 cualquier respuesta que no sea status 200 HTTP es un error.
NOTA:
Toda vez que intente ingresar un Lead a PILOT, que hubiera sido creado (en PILOT) en el transcurso de los últimos 6 meses (desde la fecha de su creación) PILOT le indicará que éste ya existe, con un mensaje del tipo:
“success”: false,
“message”: “duplicated_lead”,
“data”: “Lead duplicado hash[c30a16ae7d5f8b6f9767442e3f5d3f70]”, donde hash[……] representa una referencia al conjunto de datos del lead enviados a PILOT.
Un lead es considerado igual a otro cuando ambos presentan los mismos campos con los mismos valores.
Descripción de parámetros
Cada “lead” ingresado en Pilot® tiene que cumplir con una determinada estructura de parámetros. No todos son requeridos:
Parámetros para crear un Lead/prospecto
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
action
SI
texto
create
Valor Fijo: “create”
appkey
SI
texto
9715fc4b-17a8-4e56-ac7a-6deb5fd46u71
Key de la instancia en la que se crea el Lead. Se puede solicitar a la cuenta de soporte de Pilot u obtenerlo de la configuración de Pilot
debug
NO
flag
0
Código numérico (flag) que permite testear el servicio sin ingresar el “dato” en Pilot®.
Valores posibles:
0 – no debug (el servicio se ejecuta en modo normal
1 – debugus valore 
notification_email
NO
texto (250)
 Cuenta de mail para recibir una copia del dato ingresado.
pilot_firstname
SI
texto (50)
Nombre/s del lead/prospecto
pilot_lastname
NO
texto (50)
Apellido paterno
pilot_second_last_name
NO
texto (50)
Aplicable para segundos apellidos o apellidos maternos
pilot_phone
SI 
(*)
texto (50)
Teléfono fijo del Lead/prospecto
pilot_cellphone
SI 
(*)
texto (50)
Teléfono móvil del Lead/prospecto
pilot_email
SI 
(*)
texto (250)
Dirección de correo electrónico del Lead/prospecto
pilot_contact_type_id
pilot_contact_type_code
SI
SI
número
texto
1
“electronico”
Medio por el cual se contacta a la persona.
Valores Posibles: Ej:
1: electronico, 2: telefonico , 3: entrevista
NOTA:
Puede completarse su identificador (valor técnico) – 
pilot_contact_type_id
Puede completarse su código – 
pilot_contact_type_code
Para la recepción de los webhooks es obligatorio recibir por lo menos 1 de los 2 campos 
En caso de completarse ambos campos, el lead se creará tomando como mandante el campo del ID y no el del CODE.
Ambos valores se obtienen consultando el Maestro 
welcome_contact_type 
Ver contact_type
pilot_business_type_id
pilot_business_type_code
SI
SI
número
texto
1
“Nuevo”
Tipo de negocio (1) Nuevo / 0km | (2) Usados |(3) Plan de Ahorro
NOTA:
Puede completarse su identificador (valor técnico) – 
pilot_business_type_id
Puede completarse su código – 
pilot_business_type_code
Para la recepción de los webhooks es obligatorio recibir por lo menos 1 de los 2 campos 
En caso de completarse ambos campos, el lead se creará tomando como mandante el campo del ID y no el del CODE.
Ambos valores se obtienen consultando el Maestro 
Business_type
pilot_notes
SI
texto (4000)
1
Comentarios, Observaciones de interés que el ‘actor’ agrega al momento de ingresar el Lead.
NOTA:
En el caso de un eCommerce como De Motores, De Autos, Autofoco, Autocosmos, otros se sugiere completarlo con el interés de la persona (ej: vehículo/financiación/ … )
pilot_origin_id
 NO
número
Agrupador que identifica de dónde se obtiene el Lead.Sólo se usa en la interfaz gráfica de Pilot®, y su uso esta 
deprecado
 en las interfaces automáticas.
pilot_suborigin_id
 SI
dato maestro
Identifica el origen primario del Lead.Se obtiene de la lista de los suborígenes de la instancia de cada cliente. Se puede consultar en el informe de las tablas del sistema llamado “Origen de los datos” 
Ver más
pilot_car_brand
NO
texto (50)
FORD
Marca del vehículo de interés
pilot_car_modelo
NO
texto (50)
FIESTA
Modelo del vehículo de interés
pilot_assigned_user
 NO
texto (50)
cuentausuario@dominio.com
Identificación del Comercial al que se le asigna el Lead/prospecto.
NOTA:
En este caso la asignación manual del dato tiene prelación por sobre los grupos de captura de datos Ej: cuentausuario@dominio.com
pilot_city
 NO
texto (50)
“Capital Federal”
Ciudad de ubicación del Lead/prospect
pilot_province
 NO
texto (100)
“Buenos Aires”
Provincia de ubicación del Lead/prospecto
pilot_country
 NO
texto (50)
“Argentina
País de ubicación del Lead/prospecto
pilot_vendor_name
 NO
texto (50)
Nombre del proveedor
pilot_vendor_email
 NO
texto (250)
Dirección de correo electrónico
pilot_vendor_phone
 NO
texto (50)
Teléfono del proveedor
pilot_provider_service
 NO
texto
Nombre del servicio que provee el dato. Es un descriptivo del origen.Permite identificar al proveedor del servicio o al patrón de ruteo en caso de necesitar asignaciones dinámicas a diferentes grupos de captura.
pilot_provider_url
 NO
texto
URL del servicio que recolectó el dato (Lead/prospecto)
pilot_client_company
 NO
texto (100)
Lugar de trabajo del Lead
pilot_client_identity_document
 NO
texto
Documento de identidad del Lead/prospecto
pilot_tracking_id
 NO
texto
Código de seguimiento: GUID o ID único que identifica al Lead en el origen.
pilot_client_ip
 NO
texto (4000)
IP del lead al momento de la captura
pilot_best_contact_time
 NO
texto
Horario de contacto preferido por el Lead
pilot_product_code
 NO
texto
Código de Producto según la lista de precios de Pilot.
NOTA:
El valor del código se producto corresponde al código ingresado en la lista de productos  
Ver más
Los productos y códigos pueden variar de mes a mes según el alta o baja de las marcas y la agencia,
La completitud del Código de Producto provoca la generación de un Presupuesto en forma automática
pilot_product_of_interest
 NO
texto (200)
Describe el Producto de Interés.
NOTA:
Texto Libre, que en caso de no estar informado es completado como la concatenación de Marca y Modelo
pilot_notifications_opt_in_consent_flag
 NO
flag
0
Opt In Notificaciones
 – Valor que indica si el Lead acepta recibir notificaciones a través de cualquier medio de contacto.
NOTA:
Sus valores posibles son: 0 = no; 1 = si
Valor por defecto: 0 (no)
pilot_publicity_opt_in_consent_flag
 NO
flag
0
Opt In Publicitario
 – Valor que indica si el Lead acepta recibir material publicitario a través de cualquier medio de contacto.
NOTA:
Sus valores posibles son: 0 = no; 1 = si
Valor por defecto: 0 (no)
pilot_address_street
 NO
texto (50)
Nombre de la Calle de la dirección del Lead/prospecto
pilot_addresss_number
 NO
texto (10)
Numeración en la calle del Lead/prospecto
pilot_addresss_floor
 NO
texto (10)
 PB , 4
Piso del departamento del Lead
pilot_address_department
 NO
texto (10)
 C
Departamento del Lead
pilot_address_postal_code
 NO
texto (50)
Código postal del Lead
pilot_birth_date
 NO
texto
 1967/07/27
Fecha de nacimiento del Lead
NOTA:
Se expresa de la siguiente forma: AAAA/MM/DD (año/mes/día)
pilot_gender_code
 NO
dato maestro
Código del género del Lead.
NOTA:
Valor declarado en el Maestro de Género 
Ver más
(*)
 Al menos uno de los tags de contacto debe ser declarado
Formato de Salida
Cada invocación a la API retorna un mensaje en formato JSON con información de la ejecución de ésta.
Valores de retorno
success
string
Indica si la integración fue exitosa o no. Sus valores posibles son: True – False
message
string
Mensaje de texto que indica si el alta del Lead fue exitosa o no.
Ej.: alta exitosa:
 ‘
El servicio de carga de datos se ejecutó correctamente’
alta errónea
:
‘El parámetro requerido appkey no fue seteado’
data
struct
Integración Exitosa:
 Despliega cada uno de los datos integrados
Integración Erronea:
 Describe el error.
Respuesta para consulta errónea – Ejemplo
{
        "success":false,
        "message":"Error",
        "data":"El parámetro requerido appkey no fue declarado"
}
Respuesta para consulta exitosa – Ejemplo
Ejemplo genérico de devolución en caso de ejecución correcta
{
	"success":valor boolean - true o false,
	"message":mensaje del resultado,
	"data":{
		"message": resultado,
		"assigned_user_id": identificador del responsable de venta. Si no se asigna un responsable de venta, el tag no es enviado,
		"success":valores posibles: true : el lead se insertó correctamente en CRM PILOT ; false : el lead no pudo agregarse en CRM PILOT,
		"id": identificador del lead ingresado a CRM PILOT. Es un valor numerico
	}
}
Ejemplo con datos
{
    "success": true,
    "message": "(3.2) - El servicio de carga de datos se ejecuto correctamente.",
    "data": {
        "welcome_id": "3039",
        "welcome_contact_type_id": "1",
        "welcome_contact_type": "Electronico",
        "welcome_contact_type_code": "1",
        "welcome_business_type_id": "1",
        "welcome_business_type": "0KM",
        "welcome_business_type_code": "Nuevo",
        "welcome_delay": 0,
        "welcome_assigned_flag": 0,
        "welcome_prospect_id": "5084",
        "welcome_asigned_user_id": null,
        "assigned_user_guid": null,
        "welcome_assigned_user_fullname": null,
        "welcome_assigned_user_email": null,
        "welcome_assigned_user_signature": null,
        "welcome_user_integration_reference_code": null,
        "welcome_asigned_branch_id": null,
        "welcome_asigned_branch": null,
        "welcome_asigned_branch_code": null,
        "welcome_asigned_branch_desc": null,
        "welcome_asigned_branch_phone": null,
        "welcome_asigned_branch_address": null,
        "welcome_open_dt": null,
        "welcome_status_id": "100",
        "welcome_status": "Sin Gestion",
        "welcome_status_code": "100",
        "welcome_origin_id": "93",
        "welcome_origin": "AGRUPADOR DE TESTING PILOT",
        "welcome_origin_code": "AGRUPADORSOPORTE",
        "welcome_suborigin_id": "374",
        "welcome_suborigin": "ORIGEN DE TEST PILOT - NO BORRAR",
        "welcome_suborigin_code": "ORIGENSOPORTE",
        "welcome_desist_dt": null,
        "welcome_desist_comments": null,
        "welcome_source_link": "",
        "welcome_source_publication_name": "",
        "welcome_source_mail_format_id": null,
        "welcome_source_mail_format": null,
        "welcome_source_type_id": 2,
        "welcome_source_type_name": "API Web",
        "welcome_created_user_id": "21298",
        "welcome_created_user_fullname": "Admin soporte",
        "welcome_created_dt": {
            "date": "2022-09-30 14:39:50.563000",
            "timezone_type": 3,
            "timezone": "UTC"
        },
        "welcome_modified_dt": null,
        "welcome_modified_user_id": null,
        "welcome_modified_user_fullname": null,
        "welcome_desist_user_id": null,
        "welcome_desist_user_fullname": null,
        "welcome_reassign_qty": 0,
        "welcome_guid": "29508483-D44D-4D01-B2BB-5A01788DCBD1",
        "welcome_desist_status_id": null,
        "welcome_desist_status": null,
        "welcome_notes": "",
        "welcome_assigned_dt": null,
        "welcome_contact_events_qty": 0,
        "welcome_last_priority_event_dt": {
            "date": "2022-09-30 14:39:50.563000",
            "timezone_type": 3,
            "timezone": "UTC"
        },
        "welcome_delay_code": "7EF0EBA5",
        "welcome_delay_color": "#000000",
        "prospect_id": "5084",
        "prospect_guid": "556CE599-1A7E-4989-9E9A-76E6C3B492CE",
        "welcome_firstname": "Fabian",
        "welcome_lastname": "Perez",
        "welcome_phone": "",
        "welcome_cellphone": "2113311932",
        "welcome_email": "cperez@pilotsolution.net",
        "prospect_provincia_id": null,
        "prospect_direccion_localidad": "",
        "prospect_repeated_qty": "1",
        "prospect_empresa": "",
        "prospect_customer_type_id": null,
        "prospect_customer_type": null,
        "prospect_customer_type_physical_person_flag": null,
        "prospect_provincia": null,
        "prospect_direccion_calle": "",
        "prospect_direccion_piso": "",
        "prospect_direccion_numero": "",
        "prospect_direccion_departamento": "",
        "prospect_pais_id": null,
        "prospect_direccion_codigo_postal": "",
        "prospect_cuit": "",
        "prospect_birth_date": null,
        "prospect_sexo_id": "3",
        "prospect_sexo_name": "Indefinido",
        "prospect_direccion_comments": null,
        "prospect_address_latitude": "",
        "prospect_address_longitude": "",
        "welcome_suborigin_delivery_type_code": "EQ",
        "interest_level_code": null,
        "interest_level": null,
        "interest_level_color": null,
        "welcome_product_of_interest": "",
        "welcome_notifications_opt_in_consent_flag": "0",
        "welcome_publicity_opt_in_consent_flag": "0",
        "prospect_second_lastname": "",
        "prospect_tracking_id": "",
        "current_user_id": "21298",
        "possible_owners": []
    }
}
Código de Ejemplo llamada PHP Curl
Copiar y pegar el siguiente código en un archivo con extensión 
.PHP
Luego modificar los parámetros de configuración y probar con un formulario que tenga como acción esta página
También puedes bajar un ejemplo de código de formulario para agregar la creatividad 
aquí
&lt;?php
//VARIABLES DE CONFIGURACION
$serviceURL = "//api.pilotsolution.net/webhooks/welcome.php";
$appKey = "aqui la key de la instancia correspondiente"; 
$tipoNegocio = "1";  
$origendeldato = "7A2E4184"; 
$landing_link = "Landing Promo Mes"; 
//CAPTURA DE PARAMETROS que pueden venir de un formulario
$encoded = "";
$encoded .= urlencode('action').'=create&';
$encoded .= urlencode('appkey').'='.urlencode($appKey).'&';
$encoded .= urlencode('pilot_firstname').'='.urlencode(request("nombre",false,"n/a")).'&';
$encoded .= urlencode('pilot_lastname').'='.urlencode(request("apellido",false,"")).'&';
$encoded .= urlencode('pilot_phone').'='.urlencode(request("telefono",false,"n/a")).'&';
$encoded .= urlencode('pilot_cellphone').'='.urlencode(request("celular",false,"")).'&';
$encoded .= urlencode('pilot_email').'='.urlencode(request("email",false,"")).'&';
$encoded .= urlencode('pilot_contact_type_id').'='.urlencode('1').'&'; //electronico 
o
$encoded .= urlencode('pilot_contact_type_code').'='.urlencode('electronico').'&'; //electronico
$encoded .= urlencode('pilot_business_type_id').'='.urlencode($tipoNegocio).'&'; 
o
$encoded .= urlencode('pilot_business_type_code').'='.urlencode($tipoNegocio).'&'; 
$encoded .= urlencode('pilot_notes').'='.urlencode(request("comentarios",false,"Sin comentarios");).'&';
$encoded .= urlencode('pilot_suborigin_id').'='.urlencode($origendeldato).'&';
$encoded .= urlencode('pilot_provider_url').'='.urlencode($landing_link).'&';
$ch = curl_init($serviceURL);
curl_setopt($ch, CURLOPT_FAILONERROR, true); 
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,  $encoded);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);       
curl_close($ch);
echo $output;
die() ;
// Levanta los parámetros por post o get
function request($param, $required=true, $default="") {
	$result = $default;
	//veo si esta seteado el parametro POST
	if (isset($_POST[$param])) {
		if($_POST[$param]!="") {
			$result = $_POST[$param];
		} else {
			if ($required) {
				throw new Exception("El parametro requerido ".$param." no fue seteado");
			}
		}
	}
	else if(isset($_GET[$param])) {
		if($_GET[$param]!="") {
			$result = $_GET[$param];
		} else {
			if ($required) {
				throw new Exception("El parametro requerido ".$param." no fue seteado");
			}
		}
	}
	else {
		if ($required) {
			throw new Exception("El parametro requerido ".$param." no fue seteado");
		} 
	}
	return $result;
}
?&gt;
Código de Ejemplo llamada JavaScript
Copiar y pegar el siguiente código en un archivo con extensión 
.PHP
 Para probarlo completar el formulario con los parámetros requeridos y ejecutarlo.
&lt;html&gt;
	&lt;head&gt;
		&lt;meta http-equiv="Content-type" content="text/html;charset=utf-8"&gt;
		&lt;!-- LIBRERIA JQUERY PARA EFECTUAR LLAMADA AJAX CONTRA SERVICIO --&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"&gt;&lt;/script&gt;
		&lt;script type="text/javascript"&gt;
			var sobreDatos = 'El "Nombre" es un dato obligatorio, los teléfonos y mail no lo son, pero al menos 1 tiene que figurar, ' +
				'sino no es posible contacto alguno con el potencial cliente. Los datos de los selectores también son obligatorios ' +
				'y se supone que son parámetros de valor fijo según corresponda por landing. En el campo notas sería ideal que incluya ' +
				'datos sobre el modelo de vehículo por el cual se está haciendo la consulta';
			function sendData () {
				var apiurl = $('[name=apiurl]').val();
				var action = 'create';
				var key = $('[name=pilot_key]').val();
				var notification_email = $('[name=pilot_notification_email]').val();
				var nombre = $('[name=pilot_firstname]').val();
				var apellido = $('[name=pilot_lastname]').val();
				var telefono = $('[name=pilot_phone]').val();
				var celular = $('[name=pilot_cellphone]').val();
				var email = $('[name=pilot_email]').val();
				var tipo_contacto = $('[name=pilot_contact_type_id]').val();
				var tipo_negocio = $('[name=pilot_business_type_id]').val();
				var notas = $('[name=pilot_notes]').val();
				var origen = $('[name=pilot_origin_id]').val();
				var suborigen = $('[name=pilot_suborigin_id]').val();
				//se puede indicar a Pilot que le asigne el dato a un usuario especifico
				//enviando la cuenta de ingreso del usuario 
				//var usuario_asignado = 'cuentadeusuario@dominio.com';
				var usuario_asignado = '';
				var debug = ($('[name=pilot_debug]').prop('checked') ? 1 : 0);
				if (
					$.trim(nombre).length == 0 ||
						($.trim(telefono).length == 0 && $.trim(celular).length == 0 && $.trim(email).length == 0)
				) {
					alert(sobreDatos);
				} else {
					var datos = [];
					datos.push({ name: 'pilot_firstname', value: nombre });
					datos.push({ name: 'pilot_lastname', value: apellido });
					datos.push({ name: 'pilot_phone', value: telefono });
					datos.push({ name: 'pilot_cellphone', value: celular });
					datos.push({ name: 'pilot_email' , value: email });
					datos.push({ name: 'pilot_contact_type_id', value: tipo_contacto });
					datos.push({ name: 'pilot_business_type_id', value: tipo_negocio });
					datos.push({ name: 'pilot_notes', value: notas });
					datos.push({ name: 'pilot_origin_id', value: origen });
					datos.push({ name: 'pilot_suborigin_id', value: suborigen });
					datos.push({ name: 'appkey', value: key });
					datos.push({ name: 'action', value: action });
					datos.push({ name: 'notification_email', value: notification_email });
					datos.push({ name: 'pilot_assigned_user', value: usuario_asignado });
					datos.push({ name: 'debug', value: debug });
					$.ajax({
						url: apiurl,
						type: 'POST',
						dataType: 'jsonp',
						data: datos,
						crossDomain: true,
						success: function (results) {
							if (results.error != undefined) {
								alert(results.error.message);
							} else {
								alert(results.message);
							}
						}
					});
				}
			}
		&lt;/script&gt;
		&lt;style type="text/css"&gt;
			p {
				text-align:justify;
			}
		&lt;/style&gt;
	&lt;/head&gt;
	&lt;body&gt;
		&lt;center&gt;
			&lt;table width="600" border="0" cellspacing="0" cellpadding="0"&gt;
				&lt;tr&gt;
					&lt;td&gt;
						&lt;table width="600" cellpadding="5" cellspacing="0"&gt;
							&lt;tr&gt;
								&lt;td colspan="3" align="left" valign="top"&gt;
									&lt;p&gt;
										&lt;b&gt;PÁGINA DE EJEMPLO INTEGRACIO PILOT API 1.0&lt;/b&gt;
									&lt;/p&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="apiurl"&gt;API:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="apiurl" id="apiurl" style="text-align:center;color:blue;font-weight:bold;width:500px;" value="http://instancia.pilotsolution.com.ar/servicios/welcome_webhook.asp" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_firstname"&gt;appkey:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_key" style="text-align:center;color:blue;font-weight:bold;width:500px;" value="" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_firstname"&gt;pilot_notification_email:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_notification_email" style="text-align:center;color:blue;font-weight:bold;width:500px;" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_firstname"&gt;pilot_debug:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="checkbox" name="pilot_debug" id="pilot_debug" checked /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_firstname"&gt;pilot_firstname:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_firstname" id="pilot_firstname" style="width:300px;" maxlength="50" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_lastname"&gt;pilot_lastname:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_lastname" id="pilot_lastname" style="width:300px;" maxlength="50" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_phone"&gt;pilot_phone:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_phone" id="pilot_phone" style="width:300px;" maxlength="100" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_cellphone"&gt;pilot_cellphone:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_cellphone" id="pilot_cellphone" style="width:300px;" maxlength="100" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_email"&gt;pilot_email:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_email" id="pilot_email" style="width:300px;" maxlength="250" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_notes"&gt;pilot_notes:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;textarea rows="3" cols="35" name="pilot_notes" id="pilot_notes" maxlength="4000"&gt;&lt;/textarea&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_contact_type_id"&gt;pilot_contact_type_id:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_contact_type_id" id="pilot_contact_type_id" style="width:300px;" maxlength="250" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_business_type_id"&gt;pilot_business_type_id:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_business_type_id" id="pilot_business_type_id" style="width:300px;" maxlength="250" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td align="right" valign="top"&gt;
									&lt;label for="pilot_suborigin_id"&gt;pilot_suborigin_id:&lt;/label&gt;
								&lt;/td&gt;
								&lt;td align="left" valign="top"&gt;
									&lt;input type="text" name="pilot_suborigin_id" id="pilot_suborigin_id" style="width:300px;" maxlength="250" /&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td colspan="3"&gt;
									&lt;center&gt;&lt;input type="button" value="Enviar" onclick="javascript:sendData();" /&gt;&lt;/center&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
							&lt;tr&gt;
								&lt;td colspan="3" align="left" valign="top"&gt;
									&lt;p&gt;&lt;b&gt;PILOT TEAM&lt;/b&gt;&lt;/p&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
						&lt;/table&gt;
					&lt;/td&gt;
				&lt;/tr&gt;
				&lt;tr&gt;
					&lt;td&gt;
						&lt;table width="600" cellpadding="20" cellspacing="0" id=""&gt;
							&lt;tr&gt;
								&lt;td align="left" valign="top" id="footer"&gt;
									&lt;p&gt;
										Copyright (C) 2013. Powered by &lt;a href="//www.pilotsolution.com.ar"&gt;Pilot Solution&lt;/a&gt;. Todos los derechos reservados.
									&lt;/p&gt;
								&lt;/td&gt;
							&lt;/tr&gt;
						&lt;/table&gt;
					&lt;/td&gt;
				&lt;/tr&gt;
			&lt;/table&gt;
		&lt;/center&gt;
		&lt;span style="padding: 0px;"&gt;&lt;/span&gt;
	&lt;/body&gt;
&lt;/html&gt;
Control de Cambios
Nombre del Parámetro
Comentario
01 Diciembre 2018
Documento creado
14 Abril 2025
Se reemplazó 
https/api.pilotsolution.com.ar
 por 
https/api.pilotsolution.net
6 Mayo 2025
Se agregaron los campos: contact_type_code y business_type_code
Updated on 02/10/2026

## Integraciones  - API CRM
Integraciones  - API CRM

### Integración Vía Email - API CRM
Integración Vía Email - API CRM
Este mecanismo tiene como objetivo la carga de datos mediante el envío de un mail a una casilla de correo de Pilot®. La casilla de correo deben solicitarla a soporte, quien la dará de alta.
Mail formato Pilot
El formato del mail es un ADF (XML de información) que tiene el siguiente contenido. En este caso la información que se puede enviar en el mail es más amplia y con mayor información.
Formato del mail: preferentemente texto plano.
Los datos consignados son a modo de ejemplo para que se entienda el contenido.
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
                &lt;?adf version="1.0"?&gt;
                &lt;adf&gt;
                &lt;prospect&gt;
 &lt;requestdate&gt;2013-06-27 11:26:24&lt;/requestdate&gt;
                   &lt;vehicle&gt;
&lt;brand&gt;PEUGEOT&lt;/brand&gt;
                        &lt;model&gt;207&lt;/model&gt;
                    &lt;/vehicle&gt;
                    &lt;customer&gt;
                        &lt;contact&gt;
&lt;name part="full"&gt;nombre complete del prospecto&lt;/name&gt;
&lt;name part="first"&gt;nombre&lt;/name&gt;
                            &lt;name part="last"&gt;apellido&lt;/name&gt;
  &lt;email&gt;mail@domionio.com&lt;/email&gt;
                            &lt;phone&gt;1147899000&lt;/phone&gt;
                            &lt;cellphone&gt;1160403456&lt;/cellphone&gt;
                            &lt;address&gt;
 &lt;city&gt;Cuidad Autónoma de Buenos Aires&lt;/city&gt;
                                &lt;province&gt;Buenos Aires&lt;/province&gt;
                                &lt;country&gt;Argentina&lt;/country&gt;
                            &lt;/address&gt;
                        &lt;/contact&gt; 
&lt;comments&gt;
                            &lt;![CDATA["Estoy interesado en comprar un Ford Fiesta"]]&gt;
                        &lt;/comments&gt;
                    &lt;/customer&gt;
                    &lt;vendor&gt;
                        &lt;contact&gt;
 &lt;name part="full"&gt;&lt;/name&gt;
                            &lt;email&gt;&lt;/email&gt;
                            &lt;phone&gt;&lt;/phone&gt;
                        &lt;/contact&gt;
                    &lt;/vendor&gt;
                    &lt;provider&gt;
&lt;name&gt;proveedor de datos&lt;/name&gt;
                        &lt;service&gt;Landing Venta Ford Fiesta&lt;/service&gt;
                        &lt;notification_email&gt;&lt;/notification_email &gt;
 &lt;debug&gt;0&lt;/debug &gt;
                        &lt;url&gt;
http://servicio.com/landingfordfiesta.php&lt;/url&gt
;
                    &lt;/provider&gt;
                &lt;/prospect&gt;
                &lt;format&gt;
&lt;formtype&gt;pilot&lt;/formtype&gt;
                    &lt;formversion&gt;1&lt;/formversion&gt;
                    &lt;key&gt;&lt;/key&gt;
                &lt;/format&gt;
            &lt;/adf&gt;
Los parámetros informados en 
azul
 son constantes y no deben cambiarse.
Los parámetros informados en 
verde
 son opcionales y sirven para ampliar la información para el vendedor.
Los parámetros informados en 
rojo
 son los básicos del mensaje y son obligatorios.
Si algún dato no se envía, el tag tiene que informarse en blanco. O sea, el mensaje debe ser completo
Ej: 
&lt;make&gt;&lt;/make&gt;
Descripción de los parámetros del proveedor del “dato”.
&lt;name&gt;
Nombre del proveedor del dato
&lt;service&gt;
Nombre del proveedor del dato
&lt;name&gt;
Nombre del servicio que originó el dato. Ej: nombre de la landing
&lt;notification_email&gt;
Cuenta de mail para recibir una copia del dato ingresado
&lt;debug&gt;
Código numérico, flag, que permite testear el servicio sin ingresar el “dato” en Pilot.
0 = no debug, se ejecuta el servicio en modo normal.
1 = en modo debug, no se ingresa el “dato” en Pilot.
Ej: 0 (no debug)
&lt;url&gt;
Es la cuenta que envía el mail
&lt;?php
                        enviar_a_Pilot();
                        die(); 
                        function enviar_a_Pilot()
                        {
                            $REQUERIDO  = true; 
                            $NO_REQUERIDO = false; 
                            $nombre         = request("nombre",$REQUERIDO);
                            $apellido       = request("apellido", $NO_REQUERIDO);
                            $telefono       = request("telefono", $NO_REQUERIDO);
                            $celular        = request("celular", $NO_REQUERIDO);
                            $email          = request("email",$REQUERIDO);
                            $modeloAuto     = request("modelo",$NO_REQUERIDO);
                            $comentarios    = "Comentario:".request("comentarios", $NO_REQUERIDO);
                            $provider       = "Nombre del proveedor de datos"; 
                            $landing        = "Formulario de Contacto Tipo";
                            $linkLanding    = "
http://www.misitio.com/landing.php
";
                            $provincia      = request("region",$NO_REQUERIDO);
                            $to             = "...";  //esta cuenta se configura en PILOT CRM
                            $subject        = "Nuevo conctacto de ".$nombre;
                            $cuerpoDelMail = armarCuerpoDelMail($nombre, $apellido, $telefono, $celular, $email, $modeloAuto, $comentarios, $landing, $linkLanding, $provincia, $provider);
                            //aqui se puede usar 
                            if (enviarElMail("mi_cuenta@mail.com", $to, $subject, $cuerpoDelMail)){
                                echo "Su consulta fue enviada satisfactoriamente."; 
                            }else{
                                echo "No hemos podido enviar su consulta. Intente m&aacute;s tarde por favor."; 
                            }
                            return true; 
                        }
                    // Levanta los parámetros por post o get
                    function request($param, $required=true, $default="")
                    {
                        $result = $default;
                        //veo si esta seteado el parametro POST
                        if (isset($_POST[$param])) {
                            if($_POST[$param]!="")
                            {
                                $result = $_POST[$param];
                            } else {
                                if ($required)
                                {
                                    throw new Exception("El parametro requerido ".$param." no fue seteado");
                                }
                            }
                        }
                        else if(isset($_GET[$param]))
                        {
                            if($_GET[$param]!="")
                            {
                                $result = $_GET[$param];
                            } else {
                                if ($required)
                                {
                                    throw new Exception("El parametro requerido ".$param." no fue seteado");
                                }
                            }
                        }
                        else 
                        {
                            if ($required)
                            {
                                throw new Exception("El parametro requerido ".$param." no fue seteado");
                            } 
                        }
                        return $result;
                    }
                    //Funcion para el envio de mails 
                    function enviarElMail($de, $para, $asunto, $cuerpodelmail)
                    {
                        //aqui implementar la funcion de envio de mail que se disponga en el servidor.
                        }
                    //Esta funcion retorna el contenido del cuerpo del mail con los valores ya reemplazados 
                    function armarCuerpoDelMail($nombre, $apellido, $telefono, $celular, $email, $modeloAuto, $comentarios, $landing, $linkLanding, $provincia, $provider)
                    {
                        $result = '
                            &lt;?xml version="1.0" encoding="UTF-8"?&gt;
                            &lt;?adf version="1.0"?&gt;
                                &lt;adf&gt;
                                &lt;prospect&gt;
                                   &lt;requestdate&gt;'.date("Y-d-m H:i:s").'&lt;/requestdate&gt;
                                   &lt;vehicle&gt;
                                        &lt;id&gt;&lt;/id&gt;
                                        &lt;year&gt;&lt;/year&gt;
                                        &lt;make&gt;RENAULT&lt;/make&gt;
                                        &lt;model&gt;'.$modeloAuto.'&lt;/model&gt;
                                        &lt;vin&gt;&lt;/vin&gt;
                                        &lt;stock&gt;&lt;/stock&gt;
                                        &lt;trim&gt;&lt;/trim&gt;
                                        &lt;price type="asking"&gt;&lt;/price&gt;
                                    &lt;/vehicle&gt;
                                    &lt;customer&gt;
                                        &lt;contact&gt;
                                            &lt;name part="full"&gt;&lt;/name&gt;
                                            &lt;name part="first"&gt;'.$nombre.'&lt;/name&gt;
                                            &lt;name part="last"&gt;'.$apellido.'&lt;/name&gt;
                                            &lt;email&gt;'.$email.'&lt;/email&gt;
                                            &lt;phone&gt;'.$telefono.'&lt;/phone&gt;
                                            &lt;cellphone&gt;'.$celular.'&lt;/cellphone&gt;
                                            &lt;international_phone&gt;&lt;/international_phone&gt;
                                            &lt;address&gt;
                                                &lt;street&gt;&lt;/street&gt;
                                                &lt;city&gt;'.$provincia.'&lt;/city&gt;
                                                &lt;regioncode&gt;&lt;/regioncode&gt;
                                                &lt;postalcode&gt;&lt;/postalcode&gt;
                                                &lt;country&gt;Argentina&lt;/country&gt;
                                            &lt;/address&gt;
                                        &lt;/contact&gt;
                                        &lt;comments&gt;
                                                &lt;![CDATA["'.$comentarios.'"]]&gt;
                                          &lt;/comments&gt;
                                    &lt;/customer&gt;
                                    &lt;vendor&gt;
                                        &lt;vendorname&gt;&lt;/vendorname&gt;
                                        &lt;contact&gt;
                                            &lt;name part="full"&gt;&lt;/name&gt;
                                            &lt;email&gt;&lt;/email&gt;
                                            &lt;phone&gt;&lt;/phone&gt;
                                        &lt;/contact&gt;
                                    &lt;/vendor&gt;
                                    &lt;provider&gt;
                                        &lt;name&gt;'.$provider.'&lt;/name&gt;
                                        &lt;service&gt;'.$landing.'&lt;/service&gt;
                                        &lt;notification_email&gt;&lt;/notification_email &gt;
                                        &lt;debug&gt;0&lt;/debug &gt;
                                        &lt;url&gt;&lt;![CDATA["'.$linkLanding.']]&gt;&lt;/url&gt;
                                    &lt;/provider&gt;
                                &lt;/prospect&gt;
                                &lt;format&gt;
                                    &lt;formtype&gt;pilot&lt;/formtype&gt;
                                    &lt;formversion&gt;1&lt;/formversion&gt;
                                    &lt;key&gt;&lt;/key&gt;
                                &lt;/format&gt;
                            &lt;/adf&gt;';
                        return $result;
                    }
                ?&gt;
Updated on 07/07/2025

## Presupuestos Interactivos  - API CRM
Presupuestos Interactivos  - API CRM

### Entidad presupuestos interactivos - API CRM
Entidad presupuestos interactivos - API CRM
Ejemplo en JSON valores de retorno de una entidad de presupuesto interactivo.
{
      "id": "D3CCDDE7-DB82-4C3D-9015-2B208E0BX4F6",
      "public_uri": "http:\/\/dominio.com\/50y1jgy0tx0yjzzsd",
      "quotation_uri": "https:\/\/cdn.pilotsolution.net\/crm\/electronicquotations\/test\/18067555\/5c811cc82afg4.html",
      "views": "2",
      "quotation": {
        "id": "B5AF2056-A381-4E3B-A323-08E78C004TYR"
      },
      "lead": {
        "id": "E777C4B9-828B-47F7-A92A-674813B875334"
      },
      "config": {
        "id": "5c8114358d5fv"
      },
      "template": {
        "code": "001",
        "name": "Presupuesto Interactivo 0Km"
      },
      "expiration_dt": "2019-03-14T13:29:44+0000",
      "created_dt": "2019-03-07T13:29:44+0000",
      "created_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60EHY630",
        "name": "User Name"
      },
      "deleted": "1",
      "deleted_dt": "2019-03-07T13:36:43+0000",
      "deleted_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60ENJ764",
        "name": "User Name"
      }
    }
Valores de retorno para todos los servicios de prespuesto interactivo
id
string
Id del presupuesto interactivo
public_uri
string
Url pública para visualizar el prespuesto interactivo
quotation_uri
string
Url hacia el contenido html del presupuesto interactivo
views
numeric
Cantidad de visualizaciones que tiene el prespuesto interactivo
quotation
struct
id
string
Identificador del presupuesto al que pertenece el presupuesto interactivo
lead
struct
id
string
Identificador del Lead al que pertenece el presupuesto interactivo
config
struct
id
string
Identificador de la configuración utilizada para el presupuesto interactivo
template
struct
code
string
Código del template utilizado para el presupeusto electrónico
name
string
Nombre del template utilizado para el presupeusto electrónico
expiration_dt
isodatetime
Fecha en la cual expira el presupesto interactivo
created_dt
isodatetime
Fecha en la cual se creó 
created_user
struct
id
string
Identificador del usuario que creó el presupuesto interactivo
name
string
Nombre del usuario que creó el presupuesto interactivo
deleted
numeric
Indica si el presupesto interactivo se encuentra eliminado
deleted_dt
isodatetime
Fecha en la cual se eliminó el presupesto interactivo
deleted_user
struct
id
string
Identificador del usuario que eliminó el presupuesto interactivo
name
string
Nombre del usuario que eliminó el presupuesto interactivo
Updated on 04/15/2019

### Filtros - API CRM
Filtros - API CRM
Parámetros para listar presupuestos interactivos
sale_id
Código de la venta
deleted
Boolean para indicar si se muestran o no los presupuestos interactivos eliminados
Updated on 04/16/2019

### Leer - API CRM
Leer - API CRM
POST
/v1/electronicquotations/read.php
Este servicio permite leer un presupuesto interactivo.
Ejemplo solicitud JSON
{
    "data": {
        "id": "D3CCDDE7-DB82-4C3D-9015-2B208E0BX4F6"
    },
    "header": {
        "FlowName": "electronicquotation_read",
        "SequenceId": [],
        "TimeStamp": [],
        "access_token": "{{ token }}"
    }
}
Ejemplo respuesta JSON
{
  "ts": "1551967420",
  "_id": "7400",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "id": "D3CCDDE7-DB82-4C3D-9015-2B208E0BX4F6",
      "public_uri": "http:\/\/dominio.com\/50y1jgy0tx0yjzzsd",
      "quotation_uri": "https:\/\/cdn.pilotsolution.net\/crm\/electronicquotations\/test\/18067555\/5c811cc82afg4.html",
      "views": "2",
      "quotation": {
        "id": "B5AF2056-A381-4E3B-A323-08E78C004TYR"
      },
      "lead": {
        "id": "E777C4B9-828B-47F7-A92A-674813B875334"
      },
      "config": {
        "id": "5c8114358d5fv"
      },
      "template": {
        "code": "001",
        "name": "Presupuesto Interactivo 0Km"
      },
      "expiration_dt": "2019-03-14T13:29:44+0000",
      "created_dt": "2019-03-07T13:29:44+0000",
      "created_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60EHY630",
        "name": "User Name"
      },
      "deleted": "1",
      "deleted_dt": "2019-03-07T13:36:43+0000",
      "deleted_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60ENJ764",
        "name": "User Name"
      }
    }
  }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1494623926",
	"_id": "5405",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "El id XyX no es válido."
	}
}
Updated on 04/15/2019

### Listar - API CRM
Listar - API CRM
POST
/v1/electronicquotations/list.php
Este servicio permite listar presupuestos interactivos mediante filtros. Ver todos los posibles filtros para los presupuestos interactivos 
acá
.
Ejemplo solicitud JSON
{
	"data": {
		"_filters": [
			{
				"field": "sale_id",
				"operation": "=",
				"value": "46359156-8ED3-4C43-A959-698FAFBGH182"
			},
			{
				"field": "deleted",
				"operation": "=",
				"value": "false"
			}
		],
		"limit": 1,
		"page": 1
	},
	"header": {
		"FlowName": "list_electronic_quotation",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "{{token}}"
	}
}
Ejemplo respuesta JSON
  "ts": "1554395823",
  "_id": "13331",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": [
      {
        "id": "859629B3-D177-4C40-9F42-B30AAFD8C667",
        "public_uri": "http:\/\/shorturl.test.local\/9xjg1yzxzct005jyagtzg",
        "quotation_uri": "https:\/\/cdn.pilotsolution.net\/crm\/electronicquotations\/zzz\/11432\/5c66f5a078wed.html",
        "views": "22",
        "quotation": {
          "id": "3E7AFDE7-8F8B-4AC9-9115-6ED6F035TY76"
        },
        "lead": {
          "id": "E5DAE15C-E47F-484A-8CD1-7DEC910NJM89"
        },
        "config": {
          "id": "5c65aa9b10cfe"
        },
        "template": {
          "code": "A1",
          "name": "Plantilla 0km"
        },
        "expiration_dt": "",
        "created_dt": "2019-02-15T14:23:50-0200",
        "created_user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38GHT",
          "name": "User Name"
        },
        "deleted": "0",
        "deleted_dt": "",
        "deleted_user": {
          "id": null,
          "name": null
        }
      },
      {
        "id": "8C54768D-792A-4EEC-BD95-E9AE26A078YU",
        "public_uri": "http:\/\/shorturl.test.local\/9xjh3jhc5kty1ajsukwz5g",
        "quotation_uri": "https:\/\/cdn.pilotsolution.net\/crm\/electronicquotations\/localdesa\/21461\/5c61a6ff35tsy.html",
        "views": "3",
        "quotation": {
          "id": "46359156-8ED3-4C43-A959-698FAFBFHYU6"
        },
        "lead": {
          "id": "D3263CCF-F425-4F6E-AD87-6DEFD183JK78"
        },
        "config": {
          "id": "5c374f24da6ty"
        },
        "template": {
          "code": "B1",
          "name": "Prueba Usado"
        },
        "expiration_dt": "2019-02-16T13:47:01-0200",
        "created_dt": "2019-02-11T13:47:01-0200",
        "created_user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD38MKL",
          "name": "Usuario Nombre"
        },
        "deleted": "0",
        "deleted_dt": "",
        "deleted_user": {
          "id": null,
          "name": null
        }
      }
    ]
  }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1494623926",
	"_id": "5405",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "El id  jku no es válido."
	}
}
Filtros soportados por el end-point
Campo
Descripción
sale_id
Código de la venta
deleted
Boolean (“true” o “false”) para incluir los presupuestos interactivos eliminados o listar solo los activos
Updated on 04/15/2019

### Crear - API CRM
Crear - API CRM
POST
/v1/electronicquotations/create.php
Este servicio permite crear un presupuesto interactivo.
Ejemplo solicitud JSON
{
    "data": {
        "opportunity_id": "D3CCDDE7-DB82-4C3D-9015-2B208E0BX4F6",
        "template_code": "000"
    },
    "header": {
        "FlowName": "electronicquotation_create",
        "SequenceId": [],
        "TimeStamp": [],
        "access_token": "{{ token }}"
    }
}
Ejemplo respuesta JSON
{
  "ts": "1551967420",
  "_id": "7400",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "id": "D3CCDDE7-DB82-4C3D-9015-2B208E0BX4F6",
      "public_uri": "http:\/\/dominio.com\/50y1jgy0tx0yjzzsd",
      "quotation_uri": "https:\/\/cdn.pilotsolution.net\/crm\/electronicquotations\/test\/18067555\/5c811cc82afg4.html",
      "views": "2",
      "quotation": {
        "id": "B5AF2056-A381-4E3B-A323-08E78C004TYR"
      },
      "lead": {
        "id": "E777C4B9-828B-47F7-A92A-674813B875334"
      },
      "config": {
        "id": "5c8114358d5fv"
      },
      "template": {
        "code": "001",
        "name": "Presupuesto Interactivo 0Km"
      },
      "expiration_dt": "2019-03-14T13:29:44+0000",
      "created_dt": "2019-03-07T13:29:44+0000",
      "created_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60EHY630",
        "name": "User Name"
      },
      "deleted": "1",
      "deleted_dt": "2019-03-07T13:36:43+0000",
      "deleted_user": {
        "id": "50E6ACC4-E495-4497-948A-12ED60ENJ764",
        "name": "User Name"
      }
    }
  }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1494623926",
	"_id": "5405",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "El template_code XyX no es válido."
	}
}
Updated on 09/17/2021

## Usuarios  - API CRM
Usuarios  - API CRM

### Leer - API CRM
Leer - API CRM
GET
/v1/users/read.php
Se utiliza para 
consultar/leer
 el perfil de un usuario que opera en 
CRM PILOT
Ejemplo de solicitud para Consultar/Leer el perfil de un usuario que opera en CRM PILOT
{
    "data": {
        "id":""id":"AE5CEF35-4B5D-B60D-273C979A942D"
},
    "header": {
        "FlowName": "my_profile",
        "SequenceId": [],
        "TimeStamp": [],
        "access_token": "{{ token }}"
    }
}
Respuesta a Solicitud Consulta/Lectura del avatar de un usuario 
satisfacción
    "ts": "1667340550",
    "_id": "204855859",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "internal_id": "24574",
            "id": "AE5CEF35-4B5D-4E5B-B60D-273C979A942D",
            "integration_reference_code": "",
            "name": "api.soporte@myworkplace.com.ar",
            "fullname": "API Pilot",
            "locked": "0",
            "created_dt": "2019-10-28T14:54:57+0000",
            "created_by_user_id": "21298",
            "parent_user_id": {
                "id": "E3FCEFCD-B622-4BAA-B592-03BFAF6774EC",
                "integration_reference_code": "",
                "name": "soporte.admin@pilotsolution.com.ar",
                "fullname": "Admin soporte"
            },
            "notification_email": "api.soporte@myworkplace.com.ar",
            "notification_email_code": "1",
            "phone": "1",
            "cellphone": "",
            "description": "",
            "deleted": "0",
            "delete_by_user_id": null,
            "delete_dt": "",
            "dateEntry": "2019-10-28T00:00:00+0000",
            "signature": "API Pilot
1
api.soporte@myworkplace.com.ar
Sucursal Olivos
SOPORTE",
            "time_zone": "America/Argentina/Buenos_Aires",
            "time_zone_dst": "0",
            "pbx_extension": "0",
            "integration_email": null,
            "branch": {
                "id": "2",
                "code": "2",
                "name": "Olivos"
            },
            "roles": [
                {
                    "role_id": "9128",
                    "role_name": "00. Api - Integrador",
                    "is_free": "1"
                }
            ],
            "instance_name": "SOPORTE",
            "modules": [
                {
                    "id": "222",
                    "name": "crm_home",
                    "description": "Inicio",
                    "parent_id": "0",
                    "title": "Inicio",
                    "url": "/home/index.php",
                    "icon": "icon-pilot-home pilot-3x pilot-round pilot-color-no"
                },
                {
                    "id": "4",
                    "name": "crm_leads",
                    "description": "Seguimiento de Leads",
                    "parent_id": "0",
                    "title": "Leads",
                    "url": "/welcomes/index.php",
                    "icon": "icon-pilot-lead pilot-color-ventas pilot-round pilot-3x"
                },
                {
                    "id": "12",
                    "name": "crm_ventas",
                    "description": "Ventas",
                    "parent_id": "0",
                    "title": "Ventas",
                    "url": "/sales/index.php",
                    "icon": "icon-pilot-ventas pilot-color-ventas pilot-round pilot-3x"
                },
                {
                    "id": "10",
                    "name": "crm_legajos",
                    "description": "Legajos de administracion",
                    "parent_id": "0",
                    "title": "Legajos",
                    "url": "/adminfiles/index.php",
                    "icon": "icon-pilot-legajos pilot-color-legajos pilot-round pilot-3x"
                },
                {
                    "id": "9",
                    "name": "crm_tareas",
                    "description": "Agenda de Tareas",
                    "parent_id": "0",
                    "title": "Tareas",
                    "url": "/tasks/index.php",
                    "icon": "icon-pilot-tareas pilot-color-taller pilot-round pilot-3x"
                },
                {
                    "id": "145",
                    "name": "crm_price_list",
                    "description": "Lista de precios",
                    "parent_id": "0",
                    "title": "Precios",
                    "url": "/pricelist/index.php",
                    "icon": "icon-pilot-precios pilot-color-ventas pilot-round pilot-3x"
                },
                {
                    "id": "11",
                    "name": "crm_taller_agenda",
                    "description": "Agenda de citas ",
                    "parent_id": "0",
                    "title": "Citas Taller",
                    "url": "/tallerAgenda/index.php",
                    "icon": "icon-pilot-citas pilot-color-taller pilot-round pilot-3x"
                },
                {
                    "id": "950",
                    "name": "crm_stock",
                    "description": "Stock de venta",
                    "parent_id": "0",
                    "title": "Stock",
                    "url": "/stock/index.php",
                    "icon": "icon-pilot-stock pilot-color-ventas pilot-round pilot-3x"
                },
                {
                    "id": "14",
                    "name": "crm_documentos",
                    "description": "Documentos compartidos",
                    "parent_id": "0",
                    "title": "Documentos",
                    "url": "/documents/index.php",
                    "icon": "icon-pilot-drive pilot-color-no pilot-3x pilot-round"
                },
                {
                    "id": "2",
                    "name": "crm_rqr",
                    "description": "GestiÃ³n de Calidad ",
                    "parent_id": "0",
                    "title": "Calidad",
                    "url": "/customercare/index.php",
                    "icon": "icon-pilot-calidad pilot-color-ventas pilot-round pilot-3x"
                },
                {
                    "id": "17",
                    "name": "crm_chat",
                    "description": "Chat",
                    "parent_id": "0",
                    "title": "Chat",
                    "url": "/chat/index.php",
                    "icon": "icon-pilot-chat pilot-round pilot-3x"
                },
                {
                    "id": "223",
                    "name": "crm_report",
                    "description": "Reportes",
                    "parent_id": "0",
                    "title": "Reportes",
                    "url": "/reports/index.php",
                    "icon": "icon-pilot-icono pilot-3x pilot-round icon-pilot-no"
                },
                {
                    "id": "225",
                    "name": "crm_fca",
                    "description": "Integración FCA",
                    "parent_id": "0",
                    "title": "Integración FCA",
                    "url": "/fca/index.php",
                    "icon": "icon-pilot-integracion pilot-3x pilot-round icon-pilot-no"
                },
                {
                    "id": "19",
                    "name": "crm_surveys",
                    "description": "Contact Center - Encuestas",
                    "parent_id": "0",
                    "title": "Contact Center",
                    "url": "/surveys/index.php",
                    "icon": "icon-pilot-contact pilot-color-contact pilot-round pilot-3x"
                },
                {
                    "id": "5260",
                    "name": "crm_product_advertising",
                    "description": "Publicador de productos",
                    "parent_id": "0",
                    "title": "Publicador",
                    "url": "/productadvertising/index.php",
                    "icon": "icon-pilot-rocket pilot-color-taller pilot-round pilot-3x"
                }
            ],
            "locale": "es_AR",
            "security_objects": [
                {
                    "name": "FV01",
                    "description": "Ventas - Aprobacion de Ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV02",
                    "description": "Ventas - Cierre Final de Ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP01",
                    "description": "Prospectos - Baja de prospectos",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV03",
                    "description": "Ventas - Baja de ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP02",
                    "description": "Prospectos - Reasignacion de prospectos",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV04",
                    "description": "Ventas - Reasignacion de ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW13",
                    "description": "Welcome - No aplica regla de restriccion de apertura",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW10",
                    "description": "Welcome - Envio whatsapp",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW09",
                    "description": "Welcome - Envio sms",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW08",
                    "description": "Welcome - Venta en Frio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW07",
                    "description": "Welcome - Modificar origen del dato",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW06",
                    "description": "Welcome - Ver datos sin asignar",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW05",
                    "description": "Welcome - editar welcome",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW01",
                    "description": "Welcome - alta nuevo welcome",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW02",
                    "description": "Welcome - convertir el welcome en negocio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW03",
                    "description": "Welcome - asignar el welcome",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW04",
                    "description": "Welcome - desistir el welcome",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP03",
                    "description": "Prospectos - modificar contacto",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FB01",
                    "description": "Negocios - nuevo negocio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP04",
                    "description": "Prospectos - crear negocio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV05",
                    "description": "Ventas - Administracion de venta",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV06",
                    "description": "Ventas - Cambiar estado",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FB02",
                    "description": "Negocios - editar negocio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV07",
                    "description": "Ventas - Editar ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP05",
                    "description": "Prospectos - Alta de prospecto",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FB03",
                    "description": "Negocios - Reasignar negocio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FB04",
                    "description": "Negocios - Permiso para enviar WhatsApp",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW00",
                    "description": "Welcome - Shortcut",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FP00",
                    "description": "Prospectos - Shortcut",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FB00",
                    "description": "Negocios - Shortcut",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW12",
                    "description": "Welcome - Ver Leads no propios, asignados a otro usuario",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS01",
                    "description": "Stock - Reservar unidad",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS02",
                    "description": "Stock - Liberar reserva",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS03",
                    "description": "Stock - Agregar",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS04",
                    "description": "Stock - Editar",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS05",
                    "description": "Stock - Eliminar",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS08",
                    "description": "Stock - Activar",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FC01",
                    "description": "Clientes - Crear Cliente",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FC02",
                    "description": "Clientes - Editar Cliente",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FWS05",
                    "description": "Welcome Scope - Toda la instancia",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FBS05",
                    "description": "Negocios Scope - Toda la instancia",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FVS05",
                    "description": "Ventas Scope - Toda la instancia",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV08",
                    "description": "Ventas - Permiso para enviar sms",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV09",
                    "description": "Ventas - Permiso para enviar WhatsApp",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV10",
                    "description": "Ventas - Venta en frio",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW14",
                    "description": "Welcome - Permitir exportar leads",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FV11",
                    "description": "Ventas - Permitir exportar ventas",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FW15",
                    "description": "Welcome - Ocultar el origen del dato",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "1"
                },
                {
                    "name": "FS82",
                    "description": "Stock - Permiso para editar Accesorios",
                    "param_1": null,
                    "param_2": null,
                    "param_3": null,
                    "param_4": null,
                    "param_5": null,
                    "param_6": null,
                    "isPublic": "0",
                    "isEnabled": "1",
                    "type_id": "2",
                    "type_name": "Comandos",
                    "visual_order": "982"
                }
            ]
        }
    }
}
Ejemplo de Respuesta con 
error 
(al consultar/leer el perfil de usuario indicando un identificador de usuario no válido)
{
    "ts": "1667341799",
    "_id": "204863609",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "business_error",
        "sub-code": null,
        "message": "El id  '' no es válido."
    }
}
Control de Cambios
Fecha
Cambio
   15 Abril 2019
Documento creado

### Mi usuario - API CRM
Mi usuario - API CRM
 POST
 /v1/users/me.php 
Se utiliza para 
consultar/leer
 el perfil del usuario conectado a la sesión
Ejemplo de solicitud para Consultar/Leer el perfil del usuario conectado a la sesión
{
    "data": {},
    "header": {
        "FlowName": "my_profile",
        "SequenceId": [],
        "TimeStamp": [],
        "access_token": "{{ token }}"
    }
}
Respuesta a Solicitud Consulta/Lectura del avatar de un usuario Satisfactoria
{
  "ts": "1555506034",
  "_id": "13725",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "id": "CE703666-4810-4B85-A8AF-4E1D6AHY678U",
      "integration_reference_code": null,
      "name": "user@pilotsolution.com.ar",
      "fullname": "Usuario Nombre",
      "locked": "0",
      "created_dt": "2017-11-14T03:10:21-0200",
      "created_by_user_id": null,
      "parent_user_id": null,
      "notification_email": "user@pilotsolution.com.ar",
      "notification_email_code": "1",
      "phone": "1124243535",
      "cellphone": "1124364747",
      "description": null,
      "deleted": "0",
      "delete_by_user_id": null,
      "delete_dt": "",
      "dateEntry": "",
      "signature": null,
      "time_zone": "America\/Argentina\/Buenos_Aires",
      "time_zone_dst": "0",
      "pbx_extension": null,
      "integration_email": null,
      "branch": {
        "code": "default",
        "name": "Default"
      },
      "roles": [],
      "security_objects": [
        {
          "name": "FV01",
          "description": "Ventas - Aprobación de Ventas",
          "param_1": null,
          "param_2": null,
          "param_3": null,
          "param_4": null,
          "param_5": null,
          "param_6": null,
          "isPublic": "0",
          "isEnabled": "1",
          "type_id": "2",
          "type_name": "Comandos",
          "visual_order": "1"
        },
        {
          "name": "FV02",
          "description": "Ventas - Cierre Final de Ventas",
          "param_1": null,
          "param_2": null,
          "param_3": null,
          "param_4": null,
          "param_5": null,
          "param_6": null,
          "isPublic": "0",
          "isEnabled": "1",
          "type_id": "2",
          "type_name": "Comandos",
          "visual_order": "1"
        }
      ]
    }
  }
}
Ejemplo de Respuesta con 
error
(al consultar/leer el perfil de usuario en sesión cuando ésta no existe)
{
"ts": "1494623926",
"_id": "5405",
"result": {
"status": "error",
"aditional_data": [],
"code": "business_error",
"message": "No hay una sesión de usuario."
}
}
Control de Cambios
Fecha
Cambio
   15 Abril 2019
Documento creado

### Avatar - API CRM
Avatar - API CRM
 POST 
 /v1/users/avatar.php 
Se utiliza para 
consultar/leer el avatar de un usuario de CRM PILOT
Parámetro para consultar/leer el avatar de un usuario de CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
ID
SI
texto (de 32 bits en formato GUID)
409F0198-51AC-4B78-9BEF-CF2B22DAF317
Identificador único del usuario de CRM PILOT
Ejemplo de solicitud para Consultar/Leer el avatar de un usuario
{
	"data": {
		"id": "CE703666-4810-4B85-A8AF-4E1D6AD36Y6Y"
	},
	"header": {
		"FlowName": "user_avatar",
		"SequenceId": "1",
		"TimeStamp": "1513352637",
		"access_token": "{{token}}"
	}
}
Respuesta a Solicitud Consulta/Lectura del avatar de un usuario 
Satisfactoria
{
  "ts": "1555336624",
  "_id": "13711",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "avatar": "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA20lEQVR4nO3aMQ7CMBAFUYJoOQc34hyhpqbmHpy
ShtIuvmQrZnZeGQkloy1WDtmut\/3U8ro\/mtefn3fz+lHS5zzPfJgVGUxnMJ3BdJf0B0ft5959U+UmbDCdwXQG022983Bq1J7sGbXny03YYDqD6Qymi8\/DqXR\/zt7n5SZ
sMJ3BdAbTTd\/Ds\/dqqtyEDaYzmM5guu4e9jstCIPpDKYzmC7+f3i177TS+5absMF0BtMZTNfdw6u9T055Hv4xmM5gOoPphn0v\/S\/KTdhgOoPpDKYzmM5gOoPpDKb7AmE
uJHAX6uoxAAAAAElFTkSuQmCC"
    }
  }
}
Ejemplo de Respuesta con 
error
 (al consultar/leer el avatar de un usuario inexistente)
{
  "ts": "1549043988",
  "_id": "6740",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "User CE703666-4810-4B85-A8AF-4E1D6AD38FFF not found"
  }
}
Valor de retorno
Comentario
avatar
Archivo binario del avatar del usuario 'encoded' en base64
Control de Cambios
Fecha
Cambio
   15 Abril 2019
Documento creado

## Notificaciones - API CRM
Notificaciones - API CRM

### Crear - API CRM
Crear - API CRM
POST
/v1/notifications/create.php
Este servicio permite enviar una notificación a un usuario del sistema.
Ejemplo solicitud JSON
{
  "data": {
    "to_user_id": "CE703666-4810-4B85-A8AF-4E1D6AD38HUY",
    "notification_type_code": "events.welcome.request.testdrive",
    "message": "Notificacion desde la api",
    "entity_id": "D3263CCF-F425-4F6E-AD87-6DEFD1834534"
  },
  "header": {
    "FlowName": "notification_create",
    "SequenceId": [],
    "TimeStamp": [],
    "TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
    "access_token":"{{token}}"
  }
}
Ejemplo respuesta JSON
{
  "ts": "1555341531",
  "_id": "13714",
  "result": {
    "status": "success",
    "additional_data": []
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1549043453",
  "_id": "6738",
  "result": {
    "status": "error",
    "additional_data": [],
    "code": "business_error",
    "message": "Notification Type 40 not found"
  }
}
Parámetros
data
struct
requerido
to_user_id
string
requerido
Identificador del usuario al cual se envía la notificación. Es único para cada usuario.
notification_type_code
string
requerido
Código del tipo de notificación que se envía al usuario. Notificaciones disponibles:
events.welcome.contact.representative: Contacto a Representante
events.welcome.contact.supervisor: Contacto a Supervisor
events.welcome.request.testdrive: Solicitud de testdrive
message
string
requerido
Texto del mensaje del evento
entity_id
string
requerido
Identificador de la entidad a la que se relaciona el evento. Ejemplo: Identificador del presupuesto interactivo
header
struct
requerido
FlowName
string
Nombre descriptivo del servicio
SequenceId
numeric
Número de secuencia
TimeStamp
timestamp
Fecha del pedido
TrackingId
numeric
Número de tracking que puede utilizar el cliente para hacer seguimiento
access_token
string
Token válido de 
autorización
Valores de retorno
ts
timestamp
Fecha de la respuesta del servicio
_id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
Sin datos
Updated on 04/17/2019

## Catálogo de Productos - API CRM
Catálogo de Productos - API CRM

### Entidad Producto - API CRM
Entidad Producto - API CRM
Ejemplo en JSON valores de retorno de una entidad producto del catálogo.
{
      "id": "20005",
      "code": "GOLGTI1",
      "name": "Gol Gti",
      "created": {
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Usuario Name"
        },
        "dt": "2019-03-28T16:12:18-0300"
      },
      "modified": {
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Usuario Name"
        },
        "dt": "2019-03-28T16:12:18-0300"
      },
      "deleted": {
        "flag": "0",
        "user": null,
        "dt": ""
      },
      "companies": [
        {
          "code": "1",
          "name": "Empresa1"
        },
        {
          "code": "5c867f6500",
          "name": "Empresa 2"
        }
      ],
      "catalog": {
        "code": "5c938d376a865",
        "name": "Vehículos"
      },
      "categories": [
        {
          "code": "5c94f8b57c19e",
          "name": "Hatchback",
          "visual_order": "1",
          "is_leaf": "1",
          "is_root": 0
        },
        {
          "code": "5c94f875c08fb",
          "name": "Deportivos",
          "visual_order": "2",
          "is_leaf": "0",
          "is_root": 0
        },
        {
          "code": "5c94f85ccce4e",
          "name": "Autos",
          "visual_order": "3",
          "is_leaf": "0",
          "is_root": 1
        }
      ],
      "characteristics": [
        {
          "code": "5c951b8b04a95",
          "name": "Motor",
          "visual_order": "1",
          "attributes": [
            {
              "code": "5c951ba713ebd",
              "name": "Potencia",
              "description": "potencia del motor",
              "show_in_quotations": "0",
              "visual_order": "1",
              "value": "155cc"
            },
            {
              "code": "5c9cd28e0a812",
              "name": "Descripción",
              "description": "Descripción del motor",
              "show_in_quotations": "0",
              "visual_order": "3",
              "value": "Descripción del motor"
            }
          ]
        },
        {
          "code": "5cadee816ea02",
          "name": "Ficha Técnica",
          "visual_order": "2",
          "attributes": [
            {
              "code": "5cadefcc5978c",
              "name": "Combustible",
              "description": "Tipo de combustible",
              "show_in_quotations": "1",
              "visual_order": "1",
              "value": "Nafta"
            }
          ]
        }
      ],
      "resources": [
        {
          "type": "image",
          "description": "imagen gol 1",
          "visual_order": "1",
          "resource": [
            {
              "size": "thumbnail",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_thumbnail.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phone",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phone.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phablet",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phablet.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "desktop",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_desktop.jpeg",
              "mime_type": "image\/jpeg"
            }
          ]
        },
        {
          "type": "image",
          "description": "imagen gol 2",
          "visual_order": "2",
          "resource": [
            {
              "size": "thumbnail",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_thumbnail.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phone",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phone.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phablet",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phablet.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "desktop",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_desktop.jpeg",
              "mime_type": "image\/jpeg"
            }
          ]
        },
        {
          "type": "link",
          "description": "Link x",
          "visual_order": "3",
          "resource": [
            {
              "uri": "http:\/\/app.pilotsolution.local\/dominio\/dominio\/list.php"
            }
          ]
        },
        {
          "type": "video",
          "description": "video youtube",
          "visual_order": "4",
          "resource": [
            {
              "uri": "https:\/\/
www.youtube.com
\/watch?v=A8YAKTLPGpw"
            }
          ]
        },
        {
          "type": "video",
          "description": "video vimeo",
          "visual_order": "5",
          "resource": [
            {
              "uri": "https:\/\/vimeo.com\/326042381"
            }
          ]
        }
      ],
      "upselling": [
        {
          "categroy": {
            "code": "5c94f8b57c19e",
            "name": "Accesorios",
            "visual_order": "1",
            "is_leaf": "1",
            "is_root": 0
          }
        },
        {
          "categroy": {
            "code": "5c9e4aa81c7de",
            "name": "Repuestos",
            "visual_order": "1",
            "is_leaf": "1",
            "is_root": 0
          }
        }
      ]
    }
Valores de retorno para todos los servicios de catálogo de productos
id
numeric
Id del producto del catálogo
code
string
Código del producto del catálogo
name
string
Nombre del producto del catálogo
created
struct
User
struct
id
string
Identificador del usuario que creó el producto
integration_reference_code
string
Código de integración del usuario que creó el producto
name
string
Nick del usuario que creó el producto
fullname
string
Nombre del usuario que creó el producto
dt
isodatetime
Fecha de la creación
deleted
struct
flag
struct
Indica si se encuentra eliminado o no. 1 = Eliminado, 0 = No eliminado
user
struct
id
z
string
Identificador del usuario que eliminó el producto
integration_reference_code
string
Código de integración del usuario que eliminó el producto
name
string
Nick del usuario que eliminó el producto
fullname
string
Nombre del usuario que eliminó el producto
dt
isodatetime
Fecha de la eliminación
companies
struct
code
struct
Código de la Empresa que utiliza el catálogo
name
string
Nombre de la Empresa que utiliza el catálogo
categories
struct
code
struct
Código de la Categoría a la que pertenece el producto
name
string
Nombre de la Categoría a la que pertenece el producto
visual_order
numeric
Orden visual de la Categoría a la que pertenece el producto
is_leaf
numeric
 Indica si la Categoría es hoja (última categoría del árbol de categorías)
is_root
numeric
Indica si la Categoría es raíz (primera categoría del árbol de categorías)
characteristics
struct
code
struct
Código del grupo de características
name
string
Nombre del grupo de características
attributes
struct
code
string
 Código del atributo
name
string
 Nombre del atributo
description
string
 Descripción del atributo
show_in_quotations
numeric
 Indica si el atributo se muestra en el presupuesto interactivo
visual_order
numeric
 Orden visual del atributo
value
string
 Valor del atributo para el producto
resources
struct
type
string
Tipo de recurso (image, link o video)
description
string
Texto descriptivo del recurso
visual_order
numeric
Orden visual del recurso
resource
struct
uri
string
Url del recurso
size
extension
Indica el tamaño del recurso, solo para recursos de type image
extension
string
Extensión del recurso, solo para recursos de type image
mime_type
string
Indica en tipo y formato del recurso, solo para recursos de type image
 upselling
struct
 category
struct
 code
struct
 Código de la categoría
 name
string
 Nombre de la categoría
 visual_order
string
 Orden visual de la categoría
 is_leaf
numeric
 Indica si la Categoría es hoja (última categoría del árbol de categorías)
 is_root
numeric
 Indica si la Categoría es raíz (primera categoría del árbol de categorías)
Updated on 05/08/2026

### Filtros - API CRM
Filtros - API CRM
Parámetros de Filtros
code
Código del producto
company_code
Código de la empresa a la que pertenece el producto
catalog_code
Código del catálogo al que pertenece el producto
Updated on 05/08/2026

### Leer - API CRM
Leer - API CRM
POST
/v1/catalog/product/read.php
Este servicio permite leer un producto del catálogo de productos
Ejemplo solicitud JSON, donde id – representa el identificador (numérico) del producto en el catálogo
{
	"data": {
		"id" : "1"
	},
	"header": {
		"FlowName": "product_catalog_read",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo respuesta JSON
{
  "ts": "1555342675",
  "_id": "13717",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": {
      "id": "1",
      "code": "GOLGTI1",
      "name": "Gol Gti",
      "created": {
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Usuario Name"
        },
        "dt": "2019-03-28T16:12:18-0300"
      },
      "modified": {
        "user": {
          "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
          "integration_reference_code": null,
          "name": "usuario@pilotsolution.com.ar",
          "fullname": "Usuario Name"
        },
        "dt": "2019-03-28T16:12:18-0300"
      },
      "deleted": {
        "flag": "0",
        "user": null,
        "dt": ""
      },
      "companies": [
        {
          "code": "1",
          "name": "Empresa1"
        },
        {
          "code": "5c867f6500",
          "name": "Empresa 2"
        }
      ],
      "catalog": {
        "code": "5c938d376a865",
        "name": "Vehículos"
      },
      "categories": [
        {
          "code": "5c94f8b57c19e",
          "name": "Hatchback",
          "visual_order": "1",
          "is_leaf": "1",
          "is_root": 0
        },
        {
          "code": "5c94f875c08fb",
          "name": "Deportivos",
          "visual_order": "2",
          "is_leaf": "0",
          "is_root": 0
        },
        {
          "code": "5c94f85ccce4e",
          "name": "Autos",
          "visual_order": "3",
          "is_leaf": "0",
          "is_root": 1
        }
      ],
      "characteristics": [
        {
          "code": "5c951b8b04a95",
          "name": "Motor",
          "visual_order": "1",
          "attributes": [
            {
              "code": "5c951ba713ebd",
              "name": "Potencia",
              "description": "potencia del motor",
              "show_in_quotations": "0",
              "visual_order": "1",
              "value": "155cc"
            },
            {
              "code": "5c9cd28e0a812",
              "name": "Descripción",
              "description": "Descripción del motor",
              "show_in_quotations": "0",
              "visual_order": "3",
              "value": "Descripción del motor"
            }
          ]
        },
        {
          "code": "5cadee816ea02",
          "name": "Ficha Técnica",
          "visual_order": "2",
          "attributes": [
            {
              "code": "5cadefcc5978c",
              "name": "Combustible",
              "description": "Tipo de combustible",
              "show_in_quotations": "1",
              "visual_order": "1",
              "value": "Nafta"
            }
          ]
        }
      ],
      "resources": [
        {
          "type": "image",
          "description": "imagen gol 1",
          "visual_order": "1",
          "resource": [
            {
              "size": "thumbnail",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_thumbnail.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phone",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phone.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phablet",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phablet.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "desktop",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_desktop.jpeg",
              "mime_type": "image\/jpeg"
            }
          ]
        },
        {
          "type": "image",
          "description": "imagen gol 2",
          "visual_order": "2",
          "resource": [
            {
              "size": "thumbnail",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_thumbnail.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phone",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phone.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "phablet",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phablet.jpeg",
              "mime_type": "image\/jpeg"
            },
            {
              "size": "desktop",
              "extension": "jpeg",
              "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_desktop.jpeg",
              "mime_type": "image\/jpeg"
            }
          ]
        },
        {
          "type": "link",
          "description": "Link x",
          "visual_order": "3",
          "resource": [
            {
              "uri": "http:\/\/app.pilotsolution.local\/dominio\/dominio\/list.php"
            }
          ]
        },
        {
          "type": "video",
          "description": "video youtube",
          "visual_order": "4",
          "resource": [
            {
              "uri": "https:\/\/
www.youtube.com
\/watch?v=A8YAKTLPGpw"
            }
          ]
        },
        {
          "type": "video",
          "description": "video vimeo",
          "visual_order": "5",
          "resource": [
            {
              "uri": "https:\/\/vimeo.com\/326042381"
            }
          ]
        }
      ],
      "upselling": [
        {
          "categroy": {
            "code": "5c94f8b57c19e",
            "name": "Accesorios",
            "visual_order": "1",
            "is_leaf": "1",
            "is_root": 0
          }
        },
        {
          "categroy": {
            "code": "5c9e4aa81c7de",
            "name": "Repuestos",
            "visual_order": "1",
            "is_leaf": "1",
            "is_root": 0
          }
        }
      ]
    }
  }
}
Ejemplo estructura error de respuesta JSON
{
	"ts": "1494623926",
	"_id": "5405",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "business_error",
		"message": "El id XyX no es válido."
	}
}
Updated on 05/08/2026

### Buscar por código - API CRM
Buscar por código - API CRM
POST
/v1/catalog/product/list.php
Este servicio permite listar productos del catálogo mediante el código de producto.
Un producto puede repetirse en distintos catálogos y estos catálogos pertenecer a distintas empresas.
Por este motivo este endpoint brinda la posibilidad de listar los productos mediante un código único y retorna los productos que contienen el código pero pertenecen a distintos catálogos.
Brinda la posibilidad de filtrar por empresa, lo cual podría resultar en la obtención de productos con el mismo código que figuran en distintos catálogos.
Otra opción es filtrar por catálogo, que retornaría el producto con el código para el catálogo solicitado.
Filtros soportados por el end-point
Nombre filtro
Descripción del filtro
code
Código del producto
company_code
Código de la empresa a la que pertenece el producto
catalog_code
Código del catálogo a la que pertenece el producto
Ejemplo búsqueda de código de producto para una empresa, donde:
code
 – representa al código de producto
company_code
 – representa ala código de la empresa
{
	"data": {
		"code" : "0001",
		"company_code" : "B91F87A8"
	},
	"header": {
		"FlowName": "product_catalog_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo solicitud de codigo de producto para un catálogo específico donde:
code
 – representa al código de producto
catalog_code
 – representa al código de catálogo
{
	"data": {
		"code" : "0001",
		"catalog_code" : "5c8f9a43ca062"
	},
	"header": {
		"FlowName": "product_catalog_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo solicitud para obtener todos los items cargados para un código de producto donde:
code
 – representa al código de producto
Nota:
 Esta consulta  puede retornar mas de un item si el producto ha sido declarado  en más de un catálogo
{
	"data": {
		"code" : "0001"
	},
	"header": {
		"FlowName": "product_catalog_list",
		"SequenceId": [],
		"TimeStamp": [],
		"TrackingId": "2B50DDB4-14C5-4249-82AB-049E6E735AA1",
		"access_token":"{{token}}"
	}
}
Ejemplo respuesta JSON
{
  "ts": "1555416819",
  "_id": "13723",
  "result": {
    "status": "success",
    "aditional_data": [],
    "entitydata": [
      {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
        "id": "20005",
        "code": "GOLGTI1",
        "name": "Gol Gti",
        "created": {
            "user": {
            "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
            "integration_reference_code": null,
            "name": "usuario@pilotsolution.com.ar",
            "fullname": "Usuario Name"
            },
            "dt": "2019-03-28T16:12:18-0300"
        },
        "modified": {
            "user": {
            "id": "CE703666-4810-4B85-A8AF-4E1D6AD35RTS",
            "integration_reference_code": null,
            "name": "usuario@pilotsolution.com.ar",
            "fullname": "Usuario Name"
            },
            "dt": "2019-03-28T16:12:18-0300"
        },
        "deleted": {
            "flag": "0",
            "user": null,
            "dt": ""
        },
        "companies": [
            {
            "code": "1",
            "name": "Empresa1"
            },
            {
            "code": "5c867f6500",
            "name": "Empresa 2"
            }
        ],
        "catalog": {
            "code": "5c938d376a865",
            "name": "Vehículos"
        },
        "categories": [
            {
            "code": "5c94f8b57c19e",
            "name": "Hatchback",
            "visual_order": "1",
            "is_leaf": "1",
            "is_root": 0
            },
            {
            "code": "5c94f875c08fb",
            "name": "Deportivos",
            "visual_order": "2",
            "is_leaf": "0",
            "is_root": 0
            },
            {
            "code": "5c94f85ccce4e",
            "name": "Autos",
            "visual_order": "3",
            "is_leaf": "0",
            "is_root": 1
            }
        ],
        "characteristics": [
            {
            "code": "5c951b8b04a95",
            "name": "Motor",
            "visual_order": "1",
            "attributes": [
                {
                "code": "5c951ba713ebd",
                "name": "Potencia",
                "description": "potencia del motor",
                "show_in_quotations": "0",
                "visual_order": "1",
                "value": "155cc"
                },
                {
                "code": "5c9cd28e0a812",
                "name": "Descripción",
                "description": "Descripción del motor",
                "show_in_quotations": "0",
                "visual_order": "3",
                "value": "Descripción del motor"
                }
            ]
            },
            {
            "code": "5cadee816ea02",
            "name": "Ficha Técnica",
            "visual_order": "2",
            "attributes": [
                {
                "code": "5cadefcc5978c",
                "name": "Combustible",
                "description": "Tipo de combustible",
                "show_in_quotations": "1",
                "visual_order": "1",
                "value": "Nafta"
                }
            ]
            }
        ],
        "resources": [
            {
            "type": "image",
            "description": "imagen gol 1",
            "visual_order": "1",
            "resource": [
                {
                "size": "thumbnail",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_thumbnail.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "phone",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phone.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "phablet",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_phablet.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "desktop",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_13_desktop.jpeg",
                "mime_type": "image\/jpeg"
                }
            ]
            },
            {
            "type": "image",
            "description": "imagen gol 2",
            "visual_order": "2",
            "resource": [
                {
                "size": "thumbnail",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_thumbnail.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "phone",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phone.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "phablet",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_phablet.jpeg",
                "mime_type": "image\/jpeg"
                },
                {
                "size": "desktop",
                "extension": "jpeg",
                "uri": "https:\/\/cdn.pilotsolution.net\/crm\/productcatalog\/dominio\/20005\/20005_14_desktop.jpeg",
                "mime_type": "image\/jpeg"
                }
            ]
            },
            {
            "type": "link",
            "description": "Link x",
            "visual_order": "3",
            "resource": [
                {
                "uri": "http:\/\/app.pilotsolution.local\/dominio\/dominio\/list.php"
                }
            ]
            },
            {
            "type": "video",
            "description": "video youtube",
            "visual_order": "4",
            "resource": [
                {
                "uri": "https:\/\/
www.youtube.com
\/watch?v=A8YAKTLPGpw"
                }
            ]
            },
            {
            "type": "video",
            "description": "video vimeo",
            "visual_order": "5",
            "resource": [
                {
                "uri": "https:\/\/vimeo.com\/326042381"
                }
            ]
            }
        ],
        "upselling": [
            {
            "categroy": {
                "code": "5c94f8b57c19e",
                "name": "Accesorios",
                "visual_order": "1",
                "is_leaf": "1",
                "is_root": 0
            }
            },
            {
            "categroy": {
                "code": "5c9e4aa81c7de",
                "name": "Repuestos",
                "visual_order": "1",
                "is_leaf": "1",
                "is_root": 0
            }
            }
        ]
        }
      }
    ]
  }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1555416688",
  "_id": "13722",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Required parameter not defined: code"
  }
}
Updated on 05/08/2026

## Tareas - API CRM
Tareas - API CRM

### Motivos de cierre - API CRM
Motivos de cierre - API CRM
POST 
 /v1/tasks/close_reasons/list.php 
Listado de motivos de cierre de las tareas
Cuando se cierra una tarea es necesario indicar el motivo de cierre. Para cada tipo de tarea, existe una lista de motivos de cierre disponibles.
Ejemplo solicitud JSON por tipo de tarea
{
    "data": {
        "filters": [
            {
                "field": "task_type_code",  // código de tipo de tarea
                "operation": "=",
                "value": "2"
            }
        ],
        "sort": [
            {
                "field": "created",
                "order": "ASC"
            }
        ],
        "limit": 10,
        "page": 1
    },
    "header": {
        "FlowName": "list_opportunities",
        "SequenceId": "1",
        "TimeStamp": "1513352637",
        "access_token": "{{token}}"
    }
}
Ejemplo respuesta JSON
{
    "ts": "1565316601",
    "_id": "4320535",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 1,
            "rows_count": 1,
            "rows_per_page": 10,
            "rows_in_page": 1,
            "rows_remaining": 0
        },
        "entitydata": [
            {
                "code": "301",
                "name": "Mail no enviado",
                "task_type": {
                    "code": "2",
                    "name": "Enviar eMail",
                    "icon": "fa fa-envelope"
                },
                "deleted": "0",
                "visible": "1",
                "visual_order": "301",
                "audit_dt": "2012-11-16T01:44:10+0000",
                "audit_usr": "2"
            }
        ]
    }
}
Ejemplo estructura error de respuesta JSON
{
  "ts": "1549043453",
  "_id": "6738",
  "result": {
    "status": "error",
    "aditional_data": [],
    "code": "business_error",
    "message": "Event Type 50 not found"
  }
}
Valores de retorno
ts
timestamp
Fecha de la respuesta del servicio
_
id
numeric
result
struct
status
string
estado de la respuesta: “success” o “error”
aditional_data
array
información adicional
entitydata
struct
code
name
task_type (struct)
code
name
icon
Código de Motivo de Cierre
Nombre del Motivo de Cierre
Tipo de Tarea
Código de Tipo de Tarea
Nombre de Tipo de Tarea
Ícono de Tipo de Tarea

## Encuestas - API CRM
Encuestas - API CRM

### Actualizar Encuesta - API CRM
Actualizar Encuesta - API CRM
POST
/api.dms.pilotcrm.io/surveys/survey_id/complete
 Toda vez que se necesite Grabar una encuesta en 
CRM PILOT
 se debe invocar la API provista.
IMPORTANTE:
 cualquier respuesta que no sea status 200 HTTP es un error.
Descripción de parámetros
Parámetros para obtener una Encuesta
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
survey_id
SI
texto
9715fc4b-17a8-4e56-ac7a-6deb5fd46u71
Identificador de la encuesta
Solicitud para la completitud de una encuesta – Ejemplo
POST 
https://api.dms.pilotcrm.io/surveys/59ACF001-05A1-4E2C-8706-32EC1A5EC313/complete
{
  “given-answers”: [
{
“question_code”: “P1”,
“answer”: “Esto es un comentario”
},
{
“question_code”: “P0”,
“answer”: “2”
},
{
“question_code”: “P2”,
“answer”: “SI”
},
{
“question_code”: “P3”,
“answer”: “Comments P3”
}
]
}
Formato de Salida
Cada invocación a la API retorna un mensaje en formato JSON con información de la ejecución de ésta.
Valores de retorno
success
string
Indica si la integración fue exitosa o no. Sus valores posibles son: True – False
code
string
Código que Indica si la integración fue exitosa o no. Ej: 200: record found; 404 : record not found
subcode
string
“record found”
message
string
Si Code = 200 , no se informa mensaje alguno
Si Code &lt;&gt; 200, describe el error 
result
estructura
Integración Exitosa:
 Despliega cada uno de los datos integrados
Integración Erronea:
 Describe el error.
Respuesta para consulta correcta – Ejemplo
  {
   “success”: true,
    “code”: 200,
    “subCode”: “record-found”,
    “message”: “”,
    “result”: [
        {
            “id”: 7,
            “guid”: “59ACF001-05A1-4E2C-8706-32EC1A5EC313”,
            “form_id”: 10000,
            “calls_qty”: null,
            “type”: “Encuesta”,
            “internal_proof”: “1429”,
            “sales_type”: “”,
            “sales_rep”: “”,
            “receptionist”: “”,
            “mechanic”: “”,
            “location”: “Taller 1”,
            “event_date”: “2026-01-22T00:00:00.000Z”,
            “car_position”: “”,
            “car_model”: “”,
            “license_plate”: “”,
            “created_dt”: “2026-01-22T22:22:51.623Z”,
            “status_dt”: “2026-01-22T22:22:51.623Z”,
            “status_id”: 1,
            “status”: “Pendiente”,
            “status_user_id”: 39402,
            “status_user”: “Luis Acosta”,
            “desist_reason_id”: null,
            “desist_reason”: null,
            “desist_comment”: null,
            “desist_dt”: null,
            “desist_user_id”: null,
            “desist_user”: null,
            “audio_record”: null,
            “administrative_rep1”: “”,
            “administrative_rep2”: “”,
            “administrative_rep3”: “”,
            “generic_field_1”: “”,
            “generic_field_2”: “”,
            “generic_field_3”: “”,
            “generic_field_4”: “”,
            “generic_field_5”: “”,
            “prospect_id”: 1366,
            “customer_id”: null,
            “sale_id”: null,
            “customer_firstname”: “Marcela”,
            “customer_lastname”: “N/A”,
            “customer_phone”: “06896884512”,
            “customer_cellphone”: “06896884512”,
            “customer_email”: “mm@gmail.com”,
            “customer_alter_phone_1”: null,
            “customer_alter_phone_2”: null,
            “customer_alter_phone_3”: null,
            “customer_alter_phone_4”: null,
            “customer_alter_phone_5”: null,
            “customer_alter_phone_6”: null,
            “reference_code”: “”,
            “source_request_id”: null,
            “modified_dt”: null,
            “modified_user_id”: null,
            “weight”: 0,
            “weight_modified_user_id”: null,
            “weight_modified_dt”: null,
            “permalink”: null
        }
    ]
}
Respuesta para consulta errónea – Ejemplo
 {
    “success”: false,
    “code”: 404,
    “subCode”: “record-not-found”,
    “message”: “Survey record not found”
}
Control de Cambios
Fecha
Cambio
2-Febrero-2026
Documento creado
Updated on 03/31/2026

### Crear Encuesta - API CRM
Crear Encuesta - API CRM
POST
/v1/webhooks/survey.php
Toda vez que se necesite crear una encuesta (para un encuestado) en 
CRM PILOT
 se debe invocar el Webhook provisto.
IMPORTANTE:
 cualquier respuesta que no sea status 200 HTTP es un error.
Descripción de parámetros
Cada “Encuesta”  ingresada en Pilot® tiene que cumplir con una determinada estructura de parámetros. No todos son requeridos.
Parámetros para crear una Encuesta
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
action
SI
texto
create
Valor Fijo: “create”
appkey
NO
texto
9715fc4b-17a8-4e56-ac7a-6deb5fd46u71
Identificador de la instancia,  que se puede solicitar a la cuenta de soporte de Pilot u obtenerlo de la configuración de Pilot, en la que se desea crear la encuesta
survetype
SI
texto
ID de Encuesta (valor técnico)
NOTA:
Los valores para este campo se obtienen consultando el Listado de Encuestas
nombre_contacto
SI
texto
Nombre/s del encuestado
apellido_contacto
NO
texto
Apellido paterno del encuestado
celular_contacto
SI
texto
Teléfono móvil del encuestado
telefono_contacto
NO
texto
Teléfono fijo del encuestado
email_contacto
NO
texto
Dirección de correo electrónico del encuestado
comprobante_interno
 SI
texto
Código Interno – Referencia interna de la operación Ej Número de boleto, orden de reparación, otros
fecha_evento
 SI
fecha
Fecha del Evento
En Ventas, puede ser la fecha de entrega del auto, en post-venta la fecha de salida del taller
sucursal
SI
dato maestro
Locación de entrega/Sucursal de venta/Taller
NOTA:
Se obtiene de la lista de sucursales de la instancia.
fecha_inicio_gestion
SI
fecha
Fecha en la que se quiere comenzar a realizar la encuesta
asesor
SI
texto
Encuestador
vehiculo
 NO
texto
posicion_vehiculo
 NO
texto
Identificador del Vehículo en el sistema origen
dominio
NO
texto
Patente / Matrícula del vehículo
tipo_venta
NO
texto
Nombre del tipo de la venta. Ej Particular/Reventa/Otros
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
sales_type
Ver más
vendedor
 NO
texto
Nombre del Vendedor
administrativo1
 NO
texto
Administrativo que atendió al cliente
administrativo2
 NO
texto
Administrativo que atendió al cliente
administrativo3
 NO
texto
Administrativo que atendió al cliente
asesor_taller
 NO
texto
Responsable de Clientela que recibió al cliente
mecanico_taller
 NO
texto
Mecánico asignado a la reparación principal de post venta.
generico_1
 NO
texto
Información Adicional
generico_2
 NO
texto
Información Adicional
generico_3
 NO
texto
Información Adicional
generico_4
 NO
texto
Información Adicional
generico_5
 NO
texto
Información Adicional
checkrepited
 NO
flag
 1
Flag que activa o no (según su valor) la verificación de duplicidad. Una encuesta se considera repetida cuando : misma fecha de evento & id interno del evento
Valores posibles: 0 = No detectar repetida / 1 = Detectar repetida
test
 NO
texto
Horario de contacto preferido por el Lead
vin_vehiculo
 NO
texto
 “VF7DDNFP0HJ524051”
Número Identificador  del vehículo
id_venta_pilot
 NO
número
 ID numérico de la venta en PILOT. .Uso 
INTERNO
 PILOT
identificador_lote_carga
  NO
texto
 ID Único que se usa para identificar la carga por lotes de las encuestas desde sistemas externos.
Normalmente se codifica aplicando el siguiente criterio: YYYYMMDDHHMMSS.
Los sistemas externos integran por lotes. Ej: Los pases de taller para encuestar a los clientes que fueron al taller. Se obtienen diariamente (los del día anterior) y se cargan masivamente.
Formato de Salida
Cada invocación a la API retorna un mensaje en formato JSON con información de la ejecución de ésta.
Valores de retorno
success
boolean
Indica si la integración fue exitosa o no. Sus valores posibles son: True – False
message
string
Mensaje de texto que indica si el alta del Lead fue exitosa o no.
Ej.: alta exitosa:
 ‘
El servicio de carga de datos se ejecuto correctamente’
alta errónea
:
‘El parámetro requerido appkey no fue seteado’
data
struct
Integración Exitosa:
 Despliega cada uno de los datos integrados
Integración Erronea:
 Describe el error.
Respuesta para consulta errónea – Ejemplo
{
        "success":false,
        "message":"Error",
        "data":"El parametro requerido appkey no fue seteado"
}
Control de Cambios
Fecha
Cambio
06 Abril 2023
Documento creado
Updated on 05/30/2024

### Leer Encuesta - API CRM
Leer Encuesta - API CRM
GET
/api.dms.pilotcrm.io/surveys/survey_id
Toda vez que se necesite obtener 
la cabecera de una encuesta
  en 
CRM PILOT
 se debe invocar la API provista.
IMPORTANTE:
 cualquier respuesta que no sea status 200 HTTP es un error.
Descripción de parámetros
Parámetros para obtener una Encuesta
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
survey_id
SI
texto
9715fc4b-17a8-4e56-ac7a-6deb5fd46u71
Identificador de la encuesta
Solicitud de una encuesta – Ejemplo
GET
https://api.dms.pilotcrm.io/surveys/59ACF001-05A1-4E2C-8706-32EC1A5EC313
Formato de Salida
Cada invocación a la API retorna un mensaje en formato JSON con información de la ejecución de ésta.
Valores de retorno
success
texto
Indica si la integración fue exitosa o no. Sus valores posibles son: True – False
code
texto
Código que Indica si la integración fue exitosa o no. Ej: 200: record found; 404 : record not found
subcode
texto
“record found”
message
texto
Si Code = 200 , no se informa mensaje alguno
Si Code &lt;&gt; 200, describe el error 
result
estructura
Integración Exitosa:
 Despliega cada uno de los datos integrados
Integración Erronea:
 Describe el error.
Respuesta para consulta correcta – Ejemplo
 {
   “success”: true,
    “code”: 200,
    “subCode”: “record-found”,
    “message”: “”,
    “result”: [
        {
            “id”: 7,
            “guid”: “59ACF001-05A1-4E2C-8706-32EC1A5EC313”,
            “form_id”: 10000,
            “calls_qty”: null,
            “type”: “Encuesta”,
            “internal_proof”: “1429”,
            “sales_type”: “”,
            “sales_rep”: “”,
            “receptionist”: “”,
            “mechanic”: “”,
            “location”: “Taller 1”,
            “event_date”: “2026-01-22T00:00:00.000Z”,
            “car_position”: “”,
            “car_model”: “”,
            “license_plate”: “”,
            “created_dt”: “2026-01-22T22:22:51.623Z”,
            “status_dt”: “2026-01-22T22:22:51.623Z”,
            “status_id”: 1,
            “status”: “Pendiente”,
            “status_user_id”: 39402,
            “status_user”: “Luis Acosta”,
            “desist_reason_id”: null,
            “desist_reason”: null,
            “desist_comment”: null,
            “desist_dt”: null,
            “desist_user_id”: null,
            “desist_user”: null,
            “audio_record”: null,
            “administrative_rep1”: “”,
            “administrative_rep2”: “”,
            “administrative_rep3”: “”,
            “generic_field_1”: “”,
            “generic_field_2”: “”,
            “generic_field_3”: “”,
            “generic_field_4”: “”,
            “generic_field_5”: “”,
            “prospect_id”: 1366,
            “customer_id”: null,
            “sale_id”: null,
            “customer_firstname”: “Marcela”,
            “customer_lastname”: “N/A”,
            “customer_phone”: “06896884512”,
            “customer_cellphone”: “06896884512”,
            “customer_email”: “mm@gmail.com”,
            “customer_alter_phone_1”: null,
            “customer_alter_phone_2”: null,
            “customer_alter_phone_3”: null,
            “customer_alter_phone_4”: null,
            “customer_alter_phone_5”: null,
            “customer_alter_phone_6”: null,
            “reference_code”: “”,
            “source_request_id”: null,
            “modified_dt”: null,
            “modified_user_id”: null,
            “weight”: 0,
            “weight_modified_user_id”: null,
            “weight_modified_dt”: null,
            “permalink”: null
        }
    ]
}
Respuesta para consulta errónea – Ejemplo
 {
    “success”: false,
    “code”: 404,
    “subCode”: “record-not-found”,
    “message”: “Survey record not found”
}
Control de Cambios
Fecha
Cambio
2-Febrero-2026
Documento creado
Updated on 02/13/2026

### Obtener formulario de encuestas - API CRM
Obtener formulario de encuestas - API CRM
GET
 /api.dms.pilotcrm.io/surveys/forms/survey_form_id
Toda vez que se necesite obtener un formulario de encuesta  en 
CRM PILOT
 se debe invocar la API provista.
IMPORTANTE:
 cualquier respuesta que no sea status 200 HTTP es un error.
Descripción de parámetros
Parámetro para obtener una Encuesta
Nombre del Parámetro
Requerido
Tipo
Ejemplo
Comentario
survey_form_id
SI
texto
10000
Identificador de formulario
Solicitud para Obtener un formulario de encuesta – Ejemplo
GET
https://api.dms.pilotcrm.io/surveys/forms/10000
Formato de Salida
Cada invocación a la API retorna un mensaje en formato JSON con información de la ejecución de ésta.
Valores de retorno
success
texto
Indica si la integración fue exitosa o no. Sus valores posibles son: True – False
code
texto
Código que Indica si la integración fue exitosa o no. Ej: 200: record found; 404 : record not found
subcode
texto
“record found”
message
texto
Si Code = 200 , no se informa mensaje alguno
Si Code &lt;&gt; 200, describe el error 
result
estructura
Integración Exitosa:
 Despliega cada uno de los datos integrados
Integración Erronea:
 Describe el error.
Respuesta para consulta correcta – Ejemplo
{
    “success”: true,
    “code”: 200,
    “result”: [
        {
            “id”: 10000,
            “name”: “Encuesta”,
            “headerHTML”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
            “footerHTML”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
            “lastUpdate”: “2021-09-28T19:52:31.167Z”,
            “questions”: [
                {
                    “id”: 10000,
                    “code”: “P0”,
                    “description”: “&lt;p&gt;&lt;span style=\”color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 14px; letter-spacing: -0.07px; white-space: pre-wrap;\”&gt;
¿Realizó el recall?
 &lt;/span&gt;&lt;br&gt;&lt;/p&gt;”,
                    “title”: “”,
                    “comment_1”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_2”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_3”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “type_id”: 9,
                    “type”: “Botonera”,
                    “visualOrder”: 1,
                    “required”: 1,
                    “answers”: [
                        {
                            “id”: 1,
                            “code”: “1”,
                            “description”: “SI”,
                            “visualOrder”: 1,
                            “weight”: 0
                        },
                        {
                            “id”: 2,
                            “code”: “2”,
                            “description”: “NO”,
                            “visualOrder”: 2,
                            “weight”: 0
                        }
                    ]
                },
                {
                    “id”: 10001,
                    “code”: “P1”,
                    “description”: “&lt;p&gt;&lt;span style=\”color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 14px; letter-spacing: -0.07px; white-space: pre-wrap;\”&gt;
¿Dónde?
 &lt;/span&gt;&lt;br&gt;&lt;/p&gt;”,
                    “title”: “”,
                    “comment_1”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_2”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_3”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “type_id”: 5,
                    “type”: “Comentarios”,
                    “visualOrder”: 2,
                    “required”: 1
                },
                {
                    “id”: 10002,
                    “code”: “P2”,
                    “description”: “&lt;p&gt;&lt;span style=\”color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 14px; letter-spacing: -0.07px; white-space: pre-wrap;\”&gt;
¿Le gustaría agendar ahora?
&lt;/span&gt;&lt;br&gt;&lt;/p&gt;”,
                    “title”: “”,
                    “comment_1”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_2”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_3”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “type_id”: 9,
                    “type”: “Botonera”,
                    “visualOrder”: 3,
                    “required”: 1,
                    “answers”: [
                        {
                            “id”: 3,
                            “code”: “1”,
                            “description”: “SI”,
                            “visualOrder”: 1,
                            “weight”: 0
                        },
                        {
                            “id”: 4,
                            “code”: “2”,
                            “description”: “NO”,
                            “visualOrder”: 2,
                            “weight”: 0
                        }
                    ]
                },
                {
                    “id”: 10003,
                    “code”: “P3”,
                    “description”: “&lt;p&gt;Observaciones&lt;/p&gt;”,
                    “title”: “”,
                    “comment_1”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_2”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “comment_3”: “&lt;p&gt;&lt;br&gt;&lt;/p&gt;”,
                    “type_id”: 5,
                    “type”: 
“Comentarios”
,
                    “visualOrder”: 4,
                    “required”: 1
                }
            ]
        }
    ]
}
Respuesta para consulta errónea – Ejemplo
{
    “success”: false,
    “code”: 404,
    “subCode”: “record-not-found”,
    “message”: “Form record not found”
}
Control de Cambios
Fecha
Cambio
2-Febrero-2026
Documento creado
Updated on 02/13/2026

## Lista de Precios - API CRM
Lista de Precios - API CRM

### Entidad Lista de precios - API CRM
Entidad Lista de precios - API CRM
Parámetros para obtener una Encuesta
Nombre del Parámetro
Tipo
Comentario
code
texto(50)
Código del Producto
name
texto(50)
Versión
price
número (18,2)
Precio de ListaSe expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
commercial_condition
número (18,2)
Condición comercial.Se expresa sin separador de miles y con punto decimal (sólo 2 decimales)
valid_date
fecha
Fecha de vigencia del precio – 
yyyy-mm-dd
rep_authorized_discount
número (18,2)
Descuento autorizado para el  responsable  de la venta.Se expresa como un porcentaje
manager_authorized_discount
número (18,2)
Descuento autorizado para el  gerente.Se expresa como un porcentaje
savingplan_first_share_amount
número (18,2)
Valor de la primera cuota.Se expresa, sin separador de miles y con punto decimal (s´olo 2 decimales)
model
code
name
brand
code
name
estructura
texto (50)
texto (50)
estructura
texto (10)
texto (50)
Describe el Modelo y Marca del producto
Código del Modelo del productoNombre del Modelo del producto
Describe la Marca del producto
Código de Marca del producto
Nombre de Marca del producto
is_saving_plan
flag
Flag que identifica la existencia de Plan de Ahorro (valor técnico)
Valores posibles:
 0 = Sin  Plan de Ahorro ; 1 = Con  Plan de Ahorro
Valor por defecto:
 0
saving_plan_type
code
name
estructura
número (10,0)
texto (50)
Describe el Tipo de Plan de Ahorro
Identificador únicoNombre
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
saving_plan  
Ver más
visible
flag
Indica si el producto está activo o no
Valores posibles:
 0 = No activo ; 1 = Activo
Valor por defecto:
 1
visual_order
número (10,0)
Indica el número de orden del item en una lista de visualización
Valor por defecto:
 999
audit_dt
fecha/hora
Fecha de auditoría
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
audit_user
número (10,0)
Identificador único del usuario responsable de ejecutar la novedad (creación, modificación del item en la lista) – (valor técnico)
deleted
flag
Flag que indica el borrado lógico del item en la lista de precio
Valores posibles:
 0 = Sin Borrado Lógico ; 1 = Con Borrado Lógico
Valor por defecto:
 0
deleted_dt
fecha/hora
Fecha del borrado lógico del item en la lista de precio
NOTA: 
su formato es UTC   yyyy-mm-ddThh:mm:sss en formato 24 hs
business_type
id
code
name
estructura
número (10,0)
texto (50)
texto (100)
Describe el Tipo de negocio
Identificador único del tipo de negocio (valor técnico)
Código del tipo de negocio
Nombre del tipo de negocio
full_name
texto (205)
Concatenación de Nombre de la Marca   – Nombre del Modelo  – Versión del Producto – Código del producto
description
texto (4000)
Descripción del Producto
integration_code
texto (50)
Código de referencia del producto del sistema que se integra
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de stock:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar las unidades en PILOT.
No es obligatorio aunque se recomienda su completitud
deleted_user_id
número (10,0)
Identificador único del usuario responsable de la baja lógica del item en la lista de precio – (valor técnico)
savingplan_shares
número (5,0)
Cantidad de cuotas
id
número (10,0)
Identificador único de un item en la lista de precio  (valor técnico)
Control de Cambios
Fecha
Cambio
3 Junio 2024
Documento creado
Updated on 05/19/2025

### Leer - API CRM
Leer - API CRM
GET
/v2/lookups/price_list/read.php
Se utiliza para 
consultar/leer
 un item de la lista de precios a partir del 
ID – Identificador Único en CRM PILOT
Parámetros para consultar/leer un item de la lista de precios en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI/NO
texto
1
Identificador único (de un precio) en CRM PILOT – Valor Técnico
Nota:
Si se declara ID no debe declararse el parámetro Code
code
SI/NO
texto
“WV05”
Código único (de un precio) en CRM PILOT
Nota:
Si se declara Code no debe declararse el parámetro ID
Ejemplo de solicitud para Consultar/Leer un item de la lista de precio según ID
curl --location --request GET '
https://api.pilotsolution.net/v2/lookups/price_list/read.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "id": 7868
    },
    "header": {
        "FlowName": "pricelist_read",
        "SequenceId": 2,
        "TimeStamp": 1248377,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token}}"
    }
}'
Respuesta a Solicitud Consulta/Lectura de un item de la lista de precio  Satisfactoria   
Especificación de la entidad “lista de precio”
{
    "ts": "1725470059",
    "_id": "83595",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "code": "TESTPRODUCT_1002332",
            "name": "Producto TEST",
            "price": "150000.00",
            "commercial_condition": "100.00",
            "valid_date": "2024-12-30T00:00:00",
            "rep_authorized_discount": "3.00",
            "manager_authorized_discount": "10.00",
            "savingplan_first_share_amount": "3000.00",
            "model": {
                "code": "RENAULT-123-2025",
                "name": "RENAULT 2025",
                "brand": {
                    "code": "F2CDF0C8",
                    "name": "RENAULT"
                }
            },
            "is_saving_plan": "0",
            "saving_plan_type": {
                "code": null,
                "name": null
            },
            "visible": "1",
            "visual_order": "1",
            "audit_dt": "2024-09-03T21:51:00.760",
            "audit_user": "Admin Test",
            "deleted": "0",
            "deleted_dt": "",
            "business_type": {
                "id": "1",
                "code": "convencional2",
                "name": "0KM"
            },
            "full_name": "RENAULT RENAULT 2025 Producto TEST - TESTPRODUCT_1002332",
            "description": "Esto es un producto con Plan de Ahorro",
            "integration_code": null,
            "deleted_user_id": null,
            "savingplan_shares": "10",
            "id": "7868"
        }
    }
}
Ejemplo de Respuesta con error 
(al consultar/leer un item de la lista precio inexistente)
{
"ts": "1495546597",
"_id": "6145",
"result": {
"status": "error",
"aditional_data": [],
"code": "500",
                "subcode": ""
"message": "entity_not_found"
}
}
Control de Cambios
Fecha
Cambio
3 Junio 2024
Documento creado
Updated on 11/26/2025

### Actualizar - API CRM
Actualizar - API CRM
POST 
/v2/lookups/price_list/update.ph
Toda vez que se modifica uno o más atributos de  un item en la lista de precios del Sistema Externo [SE], éstos se replica en 
Pilot CRM 
mediante la invocación de la API provista.
Parámetros para modificar atributos de  un item en la lista de precios
Nombre del Parámetro
Requerido
Tipo
Ejemplo
Comentario
id
SI
texto
“7754”
Identificador único (de un precio) en CRM PILOT (Valor técnico)
code
SI
texto (50)
“TESTPRODUCT_100230”
Código de producto.
NOTA:
En caso de modificarse, no puede ser un valor que ya exista como Dato Maestro
name
SI
texto (50)
“Producto TEST”
Versión
model_code
SI
dato maestro
“444”
Código de Modelo del vehículo.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
price_list_model  
Ver más
price
SI
número (18,2)
“125000.23”
Precio de lista del productoSe expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
commercial_condition
  NO
número (18,2)
 “0.00″
Condición comercialSe expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
valid_date
  NO
fecha
“2024-07-16”
Fecha de vigencia – 
yyyy-mm-dd
rep_authorized_discount
  NO
número (18,2)
  “5.00” ; “”
Descuento autorizado para el  responsable  de la venta.Se expresa como un porcentaje
manager_authorized_discount
 NO
número (18,2)
“7.00” ; “”
Descuento autorizado para el  gerente.Se expresa como un porcentaje
savingplan_first_share_amount
NO
número (18,2)
“0.00 ; “” ; ” 1500.00″
Valor de la primera cuota.
NOTA:
Se expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
Se completa con un valor distinto a cero, cuando el Tipo de Negocio es Plan de Ahorro
Se puede completar con “” o “0.00”, cuando el Tipo de Negocio no es Plan de Ahorro
savingplan_type_code
NO
número (10,0)
“”
Identificador único del Tipo de Negocio cuyo comportamiento sea Plan de Ahorro
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
saving_plan  
Ver más
Se completa toda vez que el ‘comportamiento’ del tipo de negocio sea Plan de Ahorro
visible
NO
flag
 1
Indica si el producto está activo o no.
Valores posibles:
 0 = No activo ; 1 = Activo
Valor por defecto:
 1
visual_order
NO
número (10,0)
“”
Indica el número de orden del producto en una lista de visualización
Valor por defecto:
 999
business_type_id
SI/NO
número (10)
 “1”
Identificador único del tipo de negocio (valor técnico)
Nota:
Si se informa 
business_type_id
, no se considera 
business_type_code
 en caso que estuviera declarado
Los valores para este campo se obtienen consultando el dato maestro 
 business_type_code  
Ver business_type
business_type_code
SI/NO
texto (50)
 “convencional”
Código de referencia del tipo de negocio (valor técnico)
Nota:
Si se informa 
business_type_code
, NO se debe declarar 
business_type_id
Los valores para este campo se obtienen consultando el dato maestro 
 business_type_code  
Ver business_type
description
NO
texto (4000)
“Esto es un producto 0KM”
Descripción del vehículo
integration_code
NO
texto (50)
“”
Código de referencia del item de precio del sistema que se integra
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de lista de precio:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar los items en PILOT.
No es obligatorio aunque se recomienda su completitud
savingplan_shares
NO
número (5,0)
 “” ; “0” ; “5”
Cantidad de cuotas – Se completa sólo si el Tipo de negocio declarado se corresponde a Plan de Ahorro
Ejemplo de solicitud para modificar datos de un item de la lista de precio (se modifican los datos “code”; “price”; “valid_date”)
curl --location --request POST '
https://api.pilotsolution.net/v2/lookups/price_list/update.php'
 \
--header 'content-type: application/json' \
--data-raw '{
	"data": {
        "id": "7782",
        "code": "Producto TEST PA (Plan de Ahorro)",
        "price": "1900000.00",
        "valid_date": "2024-12-30"
    },
	"header": {
		"FlowName": "update",
		"SequenceId": 1,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}
    }
}
Respuesta a Solicitud de modificación de un item de una lista de precios  Satisfactoria.  
Especificación de la entidad “lista de precios”
{
    "ts": "1721069199",
    "_id": "71794",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "code": "Producto TEST PA (Plan de Ahorro)",
            "name": "Producto TEST",
            "price": "1900000.00",
            "commercial_condition": "100.00",
            "valid_date": "2024-12-30",
            "rep_authorized_discount": "100.00",
            "manager_authorized_discount": "5.00",
            "savingplan_first_share_amount": "7.00",
            "model": {
                "code": "0036E446-5DF9-498E-82F8-28B42F2E5FF0              ",
                "name": "TECHO Y LONAS",
                "brand": {
                    "code": "F516C25F",
                    "name": "SEMIRREMOLQUE"
                }
            },
            "is_saving_plan": "0",
            "saving_plan_type": {
                "id": null,
                "name": null
            },
            "visible": "1",
            "visual_order": "999",
            "audit_dt": "2024-07-15T18:46:39.360",
            "audit_user": "Admin Test",
            "deleted": "0",
            "deleted_dt": "",
            "business_type": {
                "id": "1",
                "code": "convencional2",
                "name": "0KM"
            },
            "full_name": "SEMIRREMOLQUE TECHO Y LONAS Producto TEST - Producto TEST PA (Plan de Ahorro)",
            "description": "Esto es un producto OK",
            "integration_code": null,
            "deleted_user_id": null,
            "savingplan_shares": null,
            "id": "7782"
        }
    }
}
Ejemplo de Respuesta con error 
(al modificar en un item de la lista de precio, el valor del campo business_type_id y éste no existe)
{
    "ts": "1719345496",
    "_id": "67353",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "500",
        "sub-code": "",
        "message": "entity_not_found"
    }
}
Control de Cambios
Fecha
Cambio
12 Junio 2024
Documento creado
26 Diciembre 2024
Se agrega el atributo business_type_code en el update
Updated on 11/04/2025

### Crear - API CRM
Crear - API CRM
POST
/v2/lookups/price_list/create.php
Toda vez que se ingresa (crea) un item en la lista de precios del Sistema Externo [SE], el mismo se replica en 
Pilot CRM 
mediante la invocación de la API provista.
Parámetros para modificar atributos de  un item en la lista de precios
Nombre del Parámetro
Requerido
Tipo
Ejemplo
Comentario
code
SI
texto (50)
“TESTPRODUCT_100230”
Código de producto. Su valor no puede repetirse.
name
SI
texto (50)
“Producto TEST”
Versión
model_code
SI
dato maestro
“444”
Código de Modelo del vehículo.
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
price_list_model  
Ver más
price
SI
número (18,2)
“125000.23”
Precio de lista del producto
Se expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
commercial_condition
  NO
número (18,2)
 “0.00″
Condición comercial
Se expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
valid_date
  NO
fecha
“2024-07-16”
Fecha de vigencia – 
yyyy-mm-dd
rep_authorized_discount
  NO
número (18,2)
 “5.00” ; “”
Descuento autorizado para el  responsable  de la venta.
Se expresa como un porcentaje
manager_authorized_discount
 NO
número (18,2)
“7.00” ; “”
Descuento autorizado para el  gerente.
Se expresa como un porcentaje
savingplan_first_share_amount
NO
número (18,2)
“0.00” ; “”; “1500.00”
Valor de la primera cuota.
NOTA:
Se expresa, sin separador de miles y con punto decimal (sólo 2 decimales)
Se completa con un valor distinto a cero, cuando el Tipo de Negocio es Plan de Ahorro
Se puede completar con “” o “0.00”, cuando el Tipo de Negocio no es Plan de Ahorro
savingplan_type_code
NO
número (10,0)
“”
Código del Tipo de Plan de Ahorro
NOTA:
Los valores para este campo se obtienen consultando el dato maestro  
saving_plan  
Ver más
Se completa toda vez que el ‘comportamiento’ del tipo de negocio sea Plan de Ahorro
visible
NO
flag
 1
Indica si el producto está activo o no.
Valores posibles:
 0 = No activo ; 1 = Activo
Valor por defecto:
 1
visual_order
NO
número (10,0)
“”
Indica el número de orden del producto en una lista de visualización
Valor por defecto:
 999
business_type_id
SI/NO
número (10)
 “1”
Identificador único del tipo de negocio (valor técnico)
Nota:
Si se informa 
business_type_id
, no se considera 
business_type_code
 en caso que estuviera declarado
Los valores para este campo se obtienen consultando el dato maestro 
 business_type_code  
Ver business_type
business_type_code
SI/NO
texto (50)
 “convencional”
Código de referencia del tipo de negocio (valor técnico)
Nota:
Si se informa 
business_type_code
, NO se debe declarar 
business_type_id
Los valores para este campo se obtienen consultando el dato maestro 
 business_type_code  
Ver business_type
description
NO
texto (4000)
“Esto es un producto 0KM”
Descripción del vehículo
integration_code
NO
texto (50)
“”
Código de referencia del item de precio del sistema que se integra
Por lo general representa al 
ID
 o la 
PK (Primary Key) 
 del sistema que se integra
Debería ser único para cada unidad de lista de precio:
 es importante que el valor de este campo 
NO
 se repita (en la Base de Datos) porque puede ser utilizado para identificar los items en PILOT.
No es obligatorio aunque se recomienda su completitud
savingplan_shares
NO
número (5,0)
 “” ; “0” ; “5”
Cantidad de cuotas – Se completa sólo si el Tipo de negocio declarado se corresponde a Plan de Ahorro
Ejemplo de solicitud para crear un item 0 KM en la lista de precio
curl --location --request POST '
https://api.pilotsolution.net/v2/lookups/price_list/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
{
	"data": {
        "code": "TESTPRODUCT_3000990",
        "name": "Producto TEST",
        "model_code": "RENAULT-123-2025",
        "price": "150000.00",
        "commercial_condition": "100.00",
        "valid_date": "",
        "rep_authorized_discount": "3.00",
        "manager_authorized_discount": "10.00",
        "savingplan_first_share_amount": "",
        "savingplan_type_code": "",
        "visble": "1",
        "visual_order": "1",
        "business_type_id": "1",
        "business_type_code": "",
        "description": "Esto es un producto con Plan de Ahorro",
        "integration_code": "",
        "savingplan_shares": ""
    },
	"header": {
		"FlowName": "pricelist_create",
		"SequenceId": 1,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud creación de un item 0KM  en la lista de precios Satisfactoria.  
Especificación de la entidad “lista de precios”
{
    "ts": "1725461492",
    "_id": "83427",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "code": "TESTPRODUCT_3000990",
            "name": "Producto TEST",
            "price": "150000.00",
            "commercial_condition": "100.00",
            "valid_date": "",
            "rep_authorized_discount": "3.00",
            "manager_authorized_discount": "10.00",
            "savingplan_first_share_amount": null,
            "model": {
                "code": "RENAULT-123-2025",
                "name": "RENAULT 2025",
                "brand": {
                    "code": "F2CDF0C8",
                    "name": "RENAULT"
                }
            },
            "is_saving_plan": "0",
            "saving_plan_type": {
                "code": null,
                "name": null
            },
            "visible": "1",
            "visual_order": "1",
            "audit_dt": "2024-09-04T14:51:32.653",
            "audit_user": "Admin Test",
            "deleted": "0",
            "deleted_dt": "",
            "business_type": {
                "id": "1",
                "code": "convencional2",
                "name": "0KM"
            },
            "full_name": "RENAULT RENAULT 2025 Producto TEST - TESTPRODUCT_3000990",
            "description": "Esto es un producto con Plan de Ahorro",
            "integration_code": null,
            "deleted_user_id": null,
            "savingplan_shares": null,
            "id": "7877"
        }
    }
}
Ejemplo de solicitud para crear un item Plan de Ahorro en la lista de precio
curl --location --request POST '
https://api.pilotsolution.net/v2/lookups/price_list/create.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "code": "TESTPRODUCT_1002332",
        "name": "Producto TEST",
        "model_code": "RENAULT-123-2025",
        "price": "150000.00",
        "commercial_condition": "100.00",
        "valid_date": "2024-12-30",
        "rep_authorized_discount": "3.00",
        "manager_authorized_discount": "10.00",
        "savingplan_first_share_amount": "3000.00",
        "savingplan_type_code": "D300B99F",
        "visble": "1",
        "visual_order": "1",
        "business_type_id": "",
        "business_type_code": "plan_ahorro",
        "description": "Esto es un producto con Plan de Ahorro",
        "integration_code": "",
        "savingplan_shares": "10"
    },
	"header": {
		"FlowName": "pricelist_create",
		"SequenceId": 1,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud creación de un item con Plan de Ahorro 
en la lista de precios 
Satisfactoria.  
Especificación de la entidad “lista de precios”
{
    "ts": "1725400856",
    "_id": "83212",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "code": "TESTPRODUCT_1002789",
            "name": "Producto TEST",
            "price": "150000.00",
            "commercial_condition": "100.00",
            "valid_date": "2024-12-30T00:00:00",
            "rep_authorized_discount": "3.00",
            "manager_authorized_discount": "10.00",
            "savingplan_first_share_amount": "3000.00",
            "model": {
                "code": "RENAULT-123-2025",
                "name": "RENAULT 2025",
                "brand": {
                    "code": "F2CDF0C8",
                    "name": "RENAULT"
                }
            },
            "is_saving_plan": "1",
            "saving_plan_type": {
                "code": "D300B99F",
                "name": "Pre Adjudicado"
            },
            "visible": "1",
            "visual_order": "1",
            "audit_dt": "2024-09-03T22:00:55.733",
            "audit_user": "Admin Test",
            "deleted": "0",
            "deleted_dt": "",
            "business_type": {
                "id": "3",
                "code": "plan_ahorro",
                "name": "Plan de Ahorro"
            },
            "full_name": "RENAULT RENAULT 2025 Producto TEST - TESTPRODUCT_1002789",
            "description": "Esto es un producto con Plan de Ahorro",
            "integration_code": null,
            "deleted_user_id": null,
            "savingplan_shares": "10",
            "id": "7869"
        }
    }
}
Ejemplo de Respuesta con error 
(al crear un item en la lista de precios y  el valor del campo business_type_id no existe)
{
    "ts": "1719345496",
    "_id": "67353",
    "result": {
        "status": "error",
        "aditional_data": [],
        "code": "500",
        "sub-code": "",
        "message": "business_type_entity_not_found"
    }
}
Control de Cambios
Fecha
Cambio
11 Junio 2024
Documento creado
27 Diciembre 2024
Se agrega el atributo business_type_code en la solicitud
Updated on 12/27/2024

### Eliminar - API CRM
Eliminar - API CRM
GET
//v2/lookups/price_list/delete.php
Se utiliza para 
eliminar (baja lógica)
 un item de la lista de precios a partir del 
ID – Identificador Único en CRM PILOT
Parámetro para baja lógica de un item en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
id
SI
texto
7754
Identificador único (de un precio) en CRM PILOT – Valor Técnico
Ejemplo de solicitud para Baja lógica de un item de la lista de precio
curl --location --request GET '
https://api.pilotsolution.net/v2/lookups/price_list/delete.php'
 \
--header 'content-type: application/json' \
--data-raw '{
    "data": {
        "id": 7782
    },
    "header": {
        "FlowName": "pricelist_delete",
        "SequenceId": 2,
        "TimeStamp": 1248377,
        "TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
        "access_token": "{{access_token}}"
    }
}'
Respuesta a Solicitud Baja lógica de un item de la lista de precio Satisfactoria   
Especificación de la entidad “lista de precio”
{
    "ts": "1725470761",
    "_id": "83599",
    "result": {
        "status": "success",
        "aditional_data": [],
        "entitydata": {
            "code": "TESTPRODUCT_10023897",
            "name": "Producto TEST",
            "price": "125000.23",
            "commercial_condition": ".00",
            "valid_date": "2024-07-15T00:00:00",
            "rep_authorized_discount": "100.00",
            "manager_authorized_discount": "5.00",
            "savingplan_first_share_amount": "7.00",
            "model": {
                "code": "0036E446-5DF9-498E-82F8-28B42F2E5FF0              ",
                "name": "TECHO Y LONAS",
                "brand": {
                    "code": "F516C25F",
                    "name": "SEMIRREMOLQUE"
                }
            },
            "is_saving_plan": "0",
            "saving_plan_type": {
                "code": null,
                "name": null
            },
            "visible": "1",
            "visual_order": "999",
            "audit_dt": "2024-09-04T17:26:02.020",
            "audit_user": "Admin Test",
            "deleted": "1",
            "deleted_dt": "2024-09-04T17:26:01",
            "business_type": {
                "id": "1",
                "code": "convencional2",
                "name": "0KM"
            },
            "full_name": "SEMIRREMOLQUE TECHO Y LONAS Producto TEST - TESTPRODUCT_10023897",
            "description": "Esto es un producto OK",
            "integration_code": null,
            "deleted_user_id": "5170",
            "savingplan_shares": null,
            "id": "7782"
        }
    }
}
Ejemplo de Respuesta con error 
(al eliminar (baja lógica) ) de un item inexistente )
{
	"ts": "1495546597",
	"_id": "6145",
	"result": {
		"status": "error",
		"aditional_data": [],
		"code": "500",
                "subcode": ""
		"message": "entity_not_found"
	}
}
Control de Cambios
Fecha
Cambio
3 Junio 2024
Documento creado
Updated on 11/26/2025

### Listar - API CRM
Listar - API CRM
POST
/v2/lookups/price_list/list.php
Este servicio permite:
listar items de la lista de precios mediante la aplicación de filtros
especificar el orden en el cual se necesita que los resultados sean listados
Parámetros para listar un lead/prospecto en CRM PILOT
Nombre del Parámetro
Obligatorio
Tipo
Ejemplo
Comentario
limit
SI
texto
100
Cantidad de registros por página
NOTA:
La cantidad máxima de registros permitida por página es de 100.
page
SI
texto
1
Número de página en curso
NOTA:
El máximo valor que se le puede asignar es 50.
filters
field
operation
value
NO
SI
SI
SI
estructura
texto
texto
texto
“product_code”
“=”
“BUAEKKA”
Filtro a aplicar
nombre del campo por el que se seleccionaoperadorvalor
sorts
field
order
NO
SI
SI
estructura
texto
texto
 “product_code”
“DESC”
Ordenamiento a aplicar
nombre del campo por el que se ordenaSentido del ordenamiento
Valores posibles:
DESC
 = Descendente
ASC
 = Ascendente
header
Flowname
SequencedId
TimeStamp
TrackingId
access_token
SI
NO
NO
NO
SI
estructura
texto
número
timestamp
texto
texto
“masterdata_products”
1493991052
“55A6BCD4-0857-4A86-85FB-09A228B641B4”
“{{token}}”
nombre descriptivo del servicio
número de secuencia
fecha en la que se realiza la solicitud
número de seguimiento
Token válido de 
autorización
Lista de ‘
filtros de selección’
 que pueden aplicarse para elegir un conjunto de items de la lista de precios
Filtros de selección
id
Identificador único de un item en la lista de precio
code
Código del producto
model_code
Código del Modelo del producto
brand_code
Código de Marca del producto
business_type_code
Código del tipo de negocio
visible
Indica si el producto está activo o no
is_saving_plan
Flag que identifica la existencia de Plan de Ahorro (valor técnico)
saving_plan_type
Tipo de Plan de Ahorro
commercial_condition
Condición comercial
deleted
Flag que indica el borrado lógico del item en la lista de precio
audit_user_id
Identificador único del usuario responsable de ejecutar la novedad (creación, modificación del item en la lista) – (valor técnico)
audit_dt
Fecha de auditoría
Lista de parámetros  por los cuales puede 
ordenarse
 la lista de items de la lista de precios a seleccionar
Parámetros
code
Código del Producto
name
Versión
price
Precio del Producto
commercial_condition
Condición comercial
valid_date
Fecha de vigencia
rep_authorized_discount
Descuento autorizado para el  responsable  de la venta
manager_authorized_discount
Descuento autorizado para el  gerente
savingplan_first_share_amount
Valor de la primera cuota
is_saving_plan
Flag que identifica la existencia de Plan de Ahorro (valor técnico)
visible
Indica si el producto está activo o no
visual_order
Indica el número de orden del item en una lista de visualización
business_type_id
Identificador único del tipo de negocio (valor técnico)
description
Descripción del Producto
integration_code
Código de referencia del producto del sistema que se integra
savingplan_shares
Cantidad de cuotas
Operadores
 Igualdad
 =
 Set de valores
 INNota: Aplica solamente al parámetro IdEj.
{
“field”: “id”,
“operation”: “IN”,
“value”: “114929, 114965”
}
Consideraciones Solicitud
Limit
 admite como máximo valor : 100
Page
 admite como máximo valor: 50.
En caso de declarar un valor para 
Page
 superior a 50 se despliega el siguiente mensaje de error: 
“This API is limited to 100 records per page with a total of 50 pages.”
Si la cantidad de registros por página (limit) contiene a todos los registros que existen en la entidad y el Nro. de página en curso (page) que se indica ya no va a contener registros de la entidad, la API no devuelve información en la estructura entidad
La concatenación de filtros en una misma solicitud se ejecuta como una condición lógica AND
Consideraciones Retorno
Page:
 Número de página que se retorna
Page_count:
 Cantidad total de páginas
Rows_count:
 Cantidad total de registros
Rows_per_page:
 Cantidad de registros por página (son los indicados en el parámetro Page de la solicitud)
Rows_in_page:
 Cantidad de registros desplegados en la página en curso
Rows_remaining:
 Cantidad de registros que restan
Ejemplo de solicitud para seleccionar items de la lista de precios considerando: business_type_code y visible
{
	"data": {
		"filters": [
				{
				"field": "business_type_code",
				"operation": "=",
				"value": "plan_ahorro"
			},
			{
				"field": "visible",
				"operation": "=",
				"value": "1"
			}
		],
		"sort": [
			{
				"field": "name",
				"order": "ASC"
			}
		],
		"limit": 2,
		"page": 1
	},
	"header": {
		"FlowName": "stock_list",
		"SequenceId": 2,
		"TimeStamp": 1248377,
		"TrackingId": "55A6BCD4-0857-4A86-85FB-09A228B641B4",
		"access_token":"{{token}}"
	}
}
Respuesta a Solicitud de items de la lista de precios considerando: business_type_code y visible Satisfactoria 
Especificación de la entidad “lista de precios”
{
    "ts": "1721141881",
    "_id": "71946",
    "result": {
        "status": "success",
        "aditional_data": {
            "page": 1,
            "page_count": 21,
            "rows_count": 42,
            "rows_per_page": 2,
            "rows_in_page": 2,
            "rows_remaining": 40
        },
        "entitydata": [
            {
                "code": "productSaving1290",
                "name": "1",
                "price": "12345687.00",
                "commercial_condition": null,
                "valid_date": "2024-07-31",
                "rep_authorized_discount": ".40",
                "manager_authorized_discount": null,
                "savingplan_first_share_amount": "1234.00",
                "model": {
                    "code": "F6D2A26D-8952-40D8-AC8F-13F6BF76F3B4              ",
                    "name": "BARANDA VOLCABLE",
                    "brand": {
                        "code": "39294748",
                        "name": "ACOPLADO"
                    }
                },
                "is_saving_plan": "1",
                "saving_plan_type": {
                    "code": "51",
                    "name": "70/30"
                },
                "visible": "1",
                "visual_order": "1",
                "audit_dt": "2024-07-15T17:44:32.700",
                "audit_user": "Admin Test",
                "deleted": "0",
                "deleted_dt": "",
                "business_type": {
                    "id": "3",
                    "code": "plan_ahorro",
                    "name": "Plan de Ahorro"
                },
                "full_name": "ACOPLADO BARANDA VOLCABLE 1 - productSaving1290",
                "description": "",
                "integration_code": null,
                "deleted_user_id": null,
                "savingplan_shares": "1234",
                "id": "7795"
            },
            {
                "code": "importProduct4",
                "name": "1",
                "price": "12345687.00",
                "commercial_condition": ".00",
                "valid_date": "2024-07-31",
                "rep_authorized_discount": ".40",
                "manager_authorized_discount": ".00",
                "savingplan_first_share_amount": ".00",
                "model": {
                    "code": "F6D2A26D-8952-40D8-AC8F-13F6BF76F3B4              ",
                    "name": "BARANDA VOLCABLE",
                    "brand": {
                        "code": "39294748",
                        "name": "ACOPLADO"
                    }
                },
                "is_saving_plan": "1",
                "saving_plan_type": {
                    "id": "57",
                    "name": "0"
                },
                "visible": "1",
                "visual_order": "1",
                "audit_dt": "2024-07-15T18:02:00",
                "audit_user": "Admin Test",
                "deleted": "0",
                "deleted_dt": "",
                "business_type": {
                    "id": "3",
                    "code": "plan_ahorro",
                    "name": "Plan de Ahorro"
                },
                "full_name": "ACOPLADO BARANDA VOLCABLE 1 - importProduct4",
                "description": "",
                "integration_code": null,
                "deleted_user_id": null,
                "savingplan_shares": "0",
                "id": "7800"
            }
        ]
    }
}
Control de Cambios
Fecha
Cambio
3 Junio 2024
Documento creado
Updated on 11/05/2025
Asistente Pilot University
Preguntá sobre cualquier contenido
&#x2715;
&#127891;
&#161;Hola! Soy tu asistente de contenido
        Preguntame sobre cualquier tema de los cursos y te ayudo a encontrar la informaci&#243;n que necesit&#225;s.
                    Deja una valoración
Contáctanos
Síganos
Contactar con el soporte del sitio
Usted se ha identificado como 
PATRICIO LOPEZ PALACIOS
 (
Cerrar sesión
)
Resumen de retención de datos
Descargar la app para dispositivos móviles
Descargar la app para dispositivos móviles
Desarrollado por 
Moodle
Este tema fue desarrollado por
Canal de denuncias
Código de ética
Aviso legal
Política de cookies
Política de privacidad
Política de calidad
        Política de Seguridad y Privacidad de la Información
© Pilot Solution
Mensajería
                            Contactos
                            Mensajes seleccionados:
1
