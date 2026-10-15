# Casos de uso manuales: Un litro para Carpoolear

Checklist para probar a mano que **Un litro para Carpoolear** (antes *Sellado de viaje*) funciona de punta a punta: creación, pago, visibilidad, edición, cupo gratis y crédito por viaje vacío.

Usá este documento en el entorno de prueba (staging o un build de prueba). Los pagos de Un litro van a **Mercado Pago de producción**: se debitan en cuentas reales, no hay cuentas de test. Marcá cada caso al completarlo. Si algo falla, anotá cuenta, ruta, fecha, plataforma y captura.

---

## 1. Qué estamos cubriendo

Un litro es el equivalente a **1 litro de nafta** que se suma a los gastos en algunos trayectos. Lo paga quien publica el viaje y se reparte entre quienes viajan, como un peaje.

Mientras el pago no esté acreditado:

- el viaje **queda creado**, pero **no aparece en búsquedas** (tampoco para una admin)
- quien lo publicó lo ve en **Mis viajes** y en el detalle, con el aviso para pagar
- una admin **no** lo ve en el listado; **sí** puede abrir el detalle por **URL directa** y ve una tarjeta de que necesita el pago (sin botón para pagarlo ella)
- no se puede invitar amistades
- no se mandan alertas de “tu amistad publicó un viaje”

En la app el nombre visible es **Un litro para Carpoolear**. En código y en Mercado Pago todavía puede aparecer como *sellado*.

---

## 2. Preparación

### Cuentas

Necesitás al menos:

| Rol | Para qué |
| --- | --- |
| Conductora A (cuenta nueva o con pocos viajes) | Probar cupo de viajes bonificados |
| Conductora B (ya superó el cupo gratis) | Probar cobro, pago MP, QR y crédito |
| Otra persona C (sin relación o amistad, según el caso) | Verificar que el viaje impago no se ve |
| Admin | Verificar que el impago no sale en el listado y que por URL directa ve la tarjeta de pago pendiente |
| Amistad D de B, con alertas de viaje activas | Verificar que la alerta sale recién cuando el viaje se publica |

Hace falta una cuenta de **Mercado Pago real**. Este flujo usa las credenciales de **producción** de Carpoolear: el cobro de 1 L se debita de verdad. No uses cuentas de test de MP (ni tarjetas de prueba): no van a acreditar el viaje.

Antes de pagar, confirmá el monto en pantalla. Si un caso no necesita acreditar (por ejemplo “pagar después” o “volver atrás del checkout”), no completes el pago.

### Plataformas

Repetí los casos críticos en:

- [ ] Web (escritorio)
- [ ] Web (celular, navegador)
- [ ] App Android
- [ ] App iOS

Los pagos (Mercado Pago y QR) son los que más cambian entre web y app.

### Datos que conviene anotar antes

- Monto de Un litro que muestra la app (equivale a 1 L de nafta configurado).
- Cupo de viajes bonificados (por defecto **2**).
- Si el QR está habilitado en ese entorno.

---

## 3. Reglas que hay que tener en la cabeza

### 3.1 Cuándo aplica Un litro

Aplica cuando el viaje tiene paradas (origen, destino o intermedias) en **dos o más zonas de cobro distintas**.

Zonas de cobro actuales:

- Buenos Aires (polígono de CABA / AMBA)
- Rosario (incluye localidades pegadas, por ejemplo Funes)
- Córdoba
- Mar del Plata

**Sí aplica** (ejemplos):

- Rosario ↔ Buenos Aires
- Córdoba ↔ Buenos Aires
- Rosario ↔ Córdoba
- Mar del Plata ↔ Buenos Aires
- Rosario ↔ Mar del Plata
- Córdoba ↔ Mar del Plata
- Rosario → Santa Fe → Buenos Aires (hay dos zonas distintas: Rosario y Buenos Aires)

**No aplica** (ejemplos):

- Rosario → Funes (misma zona)
- Buenos Aires → otra parada dentro del mismo polígono
- Córdoba → Santa Fe
- Rosario → Santa Fe
- Un viaje con una sola parada en zona de cobro y el resto afuera

El texto del modal todavía puede decir “por ahora Rosario ↔ Buenos Aires”. Las zonas reales son las de la lista de arriba: si el modal no coincide, anotarlo como hallazgo de copy, no como falla del cobro.

### 3.2 Cupo de viajes bonificados

Las primeras **N** publicaciones de la cuenta (N = umbral configurado, por defecto 2) **no se cobran**, aunque la ruta sí aplique.

Qué cuenta para el cupo:

- Viajes activos de conductora
- Viajes cancelados **si tenían pasajeras aceptadas**
- Viajes de “busco quien conduzca” (aunque se cancelen)

Qué **no** cuenta:

- Viaje de conductora cancelado **sin** pasajeras aceptadas

### 3.3 Crédito por viaje vacío

Si una conductora **pagó** Un litro y ese viaje **no tuvo pasajera aceptada**, Carpoolear no le vuelve a cobrar Un litro en los viajes siguientes **hasta que alguno sí lleve pasajera**.

La cadena se mantiene si publica varias veces y todos esos viajes quedan vacíos: el 2.º, el 3.º y los que sigan se publican sin pagar. Recién cuando un viaje tiene **al menos una pasajera aceptada**, el **próximo** viaje que aplique se cobra de nuevo, como siempre.

No arranca el crédito:

- Un viaje que todavía no salió (la fecha no pasó)
- Un viaje que nunca se pagó
- Un viaje cancelado
- Un viaje que sí tuvo pasajeras aceptadas

Pedidos de asiento pendientes (todavía no aceptados) **no cortan** el crédito: el viaje sigue contando como vacío.

### 3.4 No se cobra dos veces el mismo viaje

Si ya hay un pago acreditado de Un litro para ese viaje, editar la ruta para que deje de aplicar y después volver a una ruta que sí aplica **no** tiene que pedir el pago de nuevo.

---

## 4. Creación del viaje: copy, cálculo y estados

Hacé estos casos con el módulo prendido.

### 4.1 Modal “¿Qué es Un litro para Carpoolear?”

- [ ] En el paso de contribución aparece la tarjeta de Un litro y el link **¿Qué es esto?**
- [ ] El modal explica que es 1 L de nafta para sostener la plataforma, que lo paga quien conduce al publicar y que se reparte entre quienes viajan
- [ ] Menciona la cantidad de viajes bonificados
- [ ] Se puede cerrar y seguir creando el viaje

### 4.2 Ruta que no aplica (viaje bonificado)

Cuenta nueva o cuenta que ya superó el cupo. Ruta tipo Córdoba → Santa Fe.

- [ ] La tarjeta dice que el viaje es **Bonificado**
- [ ] El desglose de la contribución sugerida **no** suma Un litro al total (o lo muestra como bonificado, nunca como monto a pagar)
- [ ] El botón final dice **Publicar** (no “Continuar al pago”)
- [ ] Al publicar, el viaje queda visible de una
- [ ] En el detalle, otras personas pueden verlo y pedir asiento

### 4.3 Ruta que aplica, todavía hay cupo gratis

Cuenta con 0 viajes. Ruta Rosario → Buenos Aires.

- [ ] La tarjeta dice que el viaje es bonificado y cuántos viajes sin Un litro quedan (“Te queda 1 viaje…” / “Te quedan N viajes…”)
- [ ] El desglose puede mostrar Un litro en la ruta, pero **bonificado** (monto 0)
- [ ] El botón final es **Publicar**
- [ ] El viaje se publica sin Mercado Pago
- [ ] Repetir hasta agotar el cupo: el último gratis sigue sin cobrar; el siguiente ya cobra

### 4.4 Ruta que aplica, cupo agotado (hay que pagar)

Cuenta B. Rosario → Buenos Aires (o cualquier par de zonas distintas).

- [ ] En contribución: “Este viaje aporta Un litro para Carpoolear”
- [ ] El texto dice que es el equivalente a 1 L de nafta, que lo pagás al publicar y se reparte
- [ ] La contribución sugerida **incluye** Un litro en el total y en el monto por persona
- [ ] En revisión aparece el monto de Un litro y “Lo pagás al publicar. Ya está incluido en los $X por persona”
- [ ] El botón final dice **Continuar al pago**
- [ ] El subtítulo de revisión habla de chequear todo **antes de continuar**

### 4.5 Viaje de “busco quien conduzca”

Misma ruta que aplica, cupo agotado, publicando como pasajera.

- [ ] Confirmar si pide Un litro o no (hoy el backend cobra si la ruta aplica y el cupo está agotado)
- [ ] Si cobra: el aviso de viaje oculto y el pago se comportan igual que en un viaje de conductora
- [ ] Si no cobra: documentar la diferencia. No debería quedar a medias (oculto sin pantalla de pago)

---

## 5. Pago al publicar

### 5.1 Pantalla “Publicá tu viaje”

Después de **Continuar al pago**:

- [ ] El viaje ya existe (tiene ID / se ve en Mis viajes)
- [ ] Badge **Pendiente de pago**
- [ ] Aviso: el viaje está creado pero **solo lo ves vos**; se publica cuando se acredite el pago
- [ ] Se ve el nombre **Un litro para Carpoolear** y el monto
- [ ] Opciones: Mercado Pago y Código QR
- [ ] Botones **Pagar después** y **Pagar $X**

### 5.2 Pagar después

- [ ] **Pagar después** lleva al detalle del viaje
- [ ] Sigue sin ser público
- [ ] En el detalle hay un banner para pagar
- [ ] En Mis viajes la tarjeta propia muestra **Falta pagar Sellado** (o el copy vigente de Un litro)
- [ ] Se puede volver a pagar más tarde desde el detalle (modal **Publicá tu viaje**)

### 5.3 Pago con Mercado Pago (tarjeta / cuenta)

Es un cobro **real** (producción). El monto tiene que ser solo el de 1 L.

- [ ] **Pagar** abre el checkout de Mercado Pago de producción (web o app, según plataforma)
- [ ] Un pago **aprobado** con una cuenta MP real vuelve al detalle del viaje
- [ ] Mientras acredita, puede verse “El pago se está procesando…”
- [ ] Cuando acredita: banner verde “Pago acreditado. Tu viaje ya es visible…”
- [ ] El viaje pasa a verse en búsquedas de otras personas
- [ ] Quien publicó puede invitar amistades
- [ ] El monto cobrado en MP es el de Un litro, no la contribución del viaje
- [ ] En la cuenta de MP de quien pagó figura el débito; no alcanza con un sandbox de test

### 5.4 Pago con QR

Solo si el QR está habilitado en ese entorno.

- [ ] Si el QR está apagado, la opción aparece deshabilitada y no se puede elegir
- [ ] Si está prendido, al elegir QR y pagar se genera el código
- [ ] Hay instrucciones para escanear con la app de Mercado Pago
- [ ] Tras pagar el QR, la pantalla se actualiza sola (sin recargar a mano) y el viaje se publica
- [ ] Un QR no se puede usar para publicar el viaje de otra persona

### 5.5 Pago pendiente (RapiPago / Rapipago / “en proceso”)

- [ ] Si Mercado Pago deja el pago pendiente, el viaje **sigue oculto**
- [ ] Banner de Rapipago: se publica cuando pagues; hay acción **Ver código** si aplica
- [ ] Al acreditarse después, el viaje se publica sin crear un segundo cobro

### 5.6 Pago rechazado o fallido

- [ ] El viaje sigue oculto
- [ ] Banner rojo: no se pudo procesar, el viaje no se publicó, **Reintentar**
- [ ] Reintentar abre de nuevo el pago
- [ ] Un reintento aprobado publica el viaje una sola vez (no hay doble cobro)

### 5.7 Cancelar el checkout sin pagar

- [ ] Volver atrás desde Mercado Pago no publica el viaje
- [ ] El viaje sigue en pendiente de pago
- [ ] Se puede pagar más tarde

---

## 6. Visibilidad y comunidad

Usá la conductora B (viaje impago Rosario → Buenos Aires) y la persona C.

### 6.1 Viaje impago

- [ ] B lo ve en **Mis viajes** y en el detalle
- [ ] C **no** lo ve en el buscador (mismos origen/destino/fecha)
- [ ] C no entra por el link directo del viaje (no hay detalle usable)
- [ ] Quien no inició sesión tampoco lo ve
- [ ] Una persona admin, si busca como el resto, **tampoco** ve el viaje ajeno impago en el listado
- [ ] La misma admin, con la **URL directa** del viaje, sí entra al detalle
- [ ] En ese detalle ve una tarjeta de que el viaje **necesita el pago** de Un litro (sin botón para pagarlo ella)
- [ ] No se pueden pedir asientos sobre un viaje impago
- [ ] **Invitar amistades** está bloqueado, con el aviso de que hay que pagar primero

### 6.2 Después de pagar

- [ ] C encuentra el viaje en el buscador
- [ ] C puede abrir el detalle y pedir asiento
- [ ] B puede invitar amistades
- [ ] Si D tenía alertas de viaje de B, la notificación llega **recién ahora**, no cuando se creó el viaje oculto
- [ ] No llega una segunda alerta al editar después (a menos que el producto mande otra cosa; no debería reenviar la misma de creación)

### 6.3 Compartir

- [ ] Con el viaje impago no está la pantalla de éxito con **Compartir** / **Cargar viaje de regreso** / **Guardar plantilla** (primero hay que pagar)
- [ ] Con el viaje ya publicado, compartir y el resto de acciones vuelven a estar

---

## 7. Detalle del viaje y contribución

Viaje publicado que sí aportó Un litro:

- [ ] En el detalle se ve la tarjeta “Este viaje aporta Un litro para Carpoolear”
- [ ] La contribución por persona muestra Un litro en el desglose
- [ ] Quien pide asiento ve el mismo precio por persona (ya incluye el litro)

Viaje publicado bonificado (cupo o ruta que no aplica):

- [ ] No pide pagar
- [ ] Si la ruta aplica pero está bonificado, el desglose puede decir **Bonificado**

---

## 8. Editar un viaje

Todos con cuenta que ya superó el cupo.

### 8.1 Impago → la ruta deja de aplicar

Crear Rosario → Buenos Aires, **no pagar**. Editar a Córdoba → Santa Fe.

- [ ] Deja de pedir Un litro
- [ ] El viaje pasa a **visible** sin pagar
- [ ] C ya puede encontrarlo

### 8.2 Impago → vuelve a aplicar

Seguir el caso anterior y editar otra vez a Rosario → Buenos Aires.

- [ ] Vuelve a pedir el pago (no se puede zafar cambiando la ruta)
- [ ] El viaje se oculta de nuevo hasta pagar

### 8.3 Pagado → deja de aplicar → vuelve a aplicar

Crear Rosario → Buenos Aires, **pagar**, editar a Córdoba → Santa Fe, después otra vez Rosario → Buenos Aires.

- [ ] No pide un segundo pago
- [ ] El viaje sigue publicado
- [ ] En Mercado Pago hay **un solo** cobro de Un litro para ese viaje

### 8.4 Editar otros datos sin tocar la ruta

Con viaje impago, cambiar horario, asientos o descripción.

- [ ] Sigue impago y oculto
- [ ] No se genera otro checkout ni se pierde el anterior

### 8.5 Parada intermedia

- [ ] Córdoba → Santa Fe: no cobra
- [ ] Agregar parada en Rosario o Buenos Aires de modo que haya **dos zonas distintas**: pasa a cobrar (si el cupo está agotado)
- [ ] Rosario → Funes → Santa Fe: **no** cobra (una sola zona de cobro)

---

## 9. Viaje de regreso, semanal y plantillas

- [ ] Publicar ida con Un litro, pagar, y cargar el **regreso** (Buenos Aires → Rosario): el regreso es otro viaje y, si el cupo está agotado, **vuelve a pedir** Un litro
- [ ] Un viaje **semanal** en corredor que aplica se cobra como cualquier otro (no se publica gratis por ser semanal)
- [ ] Crear desde una **plantilla** de Rosario → Buenos Aires con cupo agotado: muestra Un litro y pide pago
- [ ] Guardar plantilla recién está disponible cuando el viaje **no** está esperando el pago

---

## 10. Crédito por viaje vacío (bonificación)

La idea: no volver a cobrar Un litro mientras los viajes sigan sin pasajera. El cobro se retoma en el viaje **siguiente** al primero que sí tuvo a alguien aceptada.

### 10.1 Se genera el crédito

Con la cuenta B:

1. Publicar Rosario → Buenos Aires, pagar Un litro (cobro real de MP), **no aceptar a nadie**.
2. Esperar a que la fecha/hora del viaje haya pasado (en prueba se puede crear con fecha de ayer o ajustar el reloj/datos de prueba).

- [ ] En el detalle de ese viaje, **solo la dueña** ve “El próximo viaje invita Carpoolear”
- [ ] Otra persona no ve ese mensaje
- [ ] Si el viaje todavía no salió, **no** aparece el crédito
- [ ] Si hubo pasajera aceptada, **no** hay crédito
- [ ] Si solo hubo pedidos pendientes, **sí** hay crédito
- [ ] Si el viaje se canceló, **no** hay crédito

### 10.2 El siguiente viaje sale bonificado

El próximo viaje de B que **sí debería cobrarse** (misma ruta, cupo agotado):

- [ ] En creación: “Esta vez invita Carpoolear.” y el texto de que el viaje anterior no pudo compartir el gasto
- [ ] No hay pantalla de Mercado Pago
- [ ] El viaje se publica de una
- [ ] Un litro no se suma al costo de este viaje

### 10.3 Varios viajes seguidos sin pasajera

Seguir publicando Rosario → Buenos Aires **sin aceptar a nadie**, y dejar que cada uno pase vacío:

- [ ] El 2.º viaje (después del pago) sale bonificado
- [ ] El 3.º también sale bonificado (no vuelve a pedir Un litro)
- [ ] El 4.º igual, mientras ninguno haya tenido pasajera aceptada
- [ ] En cada uno de esos, la dueña puede ver que Carpoolear invita / que el próximo también queda bonificado si sigue vacío

### 10.4 Se corta cuando hay pasajera

En uno de esos viajes vacíos (el original pago o uno bonificado), **aceptar a alguien**. Después, crear otro Rosario → Buenos Aires:

- [ ] Ese viaje **siguiente** vuelve a pedir Un litro y Mercado Pago
- [ ] No se publica hasta pagar
- [ ] Si ese viaje pago otra vez queda vacío, la cadena de crédito **arranca de nuevo**

---

## 11. Cupo de viajes gratis (conteo)

Cuenta nueva. Umbral 2.

- [ ] 1.º viaje Rosario → Buenos Aires: gratis, queda 1
- [ ] 2.º viaje igual: gratis, cupo en 0
- [ ] 3.º viaje igual: cobra

Cancelaciones:

- [ ] Crear un viaje de conductora, cancelarlo **sin** pasajeras aceptadas: **no** consume el cupo
- [ ] Crear, aceptar a alguien y cancelar: **sí** consume el cupo
- [ ] Un “busco quien conduzca” cancelado: **sí** consume el cupo

---

## 12. Mis viajes y listados

- [ ] Un viaje impago se ve en Mis viajes de quien lo creó, con aviso de que falta pagar
- [ ] En un listado apilado (ida y vuelta, varios viajes juntos) la tarjeta impago **no se estira** a todo el ancho de la fila
- [ ] Al pagar, el aviso de “falta pagar” desaparece
- [ ] Los viajes viejos / historial no piden pagar de nuevo

---

## 13. Copy y monto

Revisar en **argentino (vos)**:

- [ ] Nombre: **Un litro para Carpoolear**, no “Sellado de viaje” (salvo textos viejos; si aparecen, anotarlos)
- [ ] “Pagá”, “tenés”, “podés”, “Hacé click” según el tono de la app
- [ ] El monto en la tarjeta, el botón Pagar y Mercado Pago coinciden
- [ ] El litro está incluido en la contribución por persona cuando corresponde, no se suma dos veces
- [ ] Locale español (España) e inglés, si se prueban: el flujo es el mismo, solo cambia el idioma

---

## 14. Casos que no tienen que pasar

Estos son regresiones. Si alguno ocurre, es un bug.

- [ ] Un viaje impago aparece en el buscador de otra persona o de una admin
- [ ] Una admin no puede abrir por URL un viaje ajeno impago
- [ ] Una admin ve el botón de pagar Un litro en un viaje que no es suyo
- [ ] Se cobra Un litro en Rosario → Funes o en un viaje dentro de la misma ciudad/zona
- [ ] Se cobra Un litro durante los viajes del cupo gratis
- [ ] Se cobra dos veces el mismo viaje por editar la ruta
- [ ] Se publica un viaje de corredor pago, cupo agotado, **sin** pagar y **sin** crédito de viaje vacío
- [ ] Queda un viaje oculto para siempre después de un pago aprobado
- [ ] Después de un viaje Un litro vacío, el siguiente cobra de nuevo (tendría que seguir bonificado)
- [ ] Varios viajes seguidos sin pasajera: el 3.º o 4.º vuelve a pedir pago
- [ ] Después de un viaje **con** pasajera aceptada, el siguiente se publica sin pagar
- [ ] Las amistades reciben la alerta antes de que el pago esté acreditado
- [ ] Un litro se cobra sobre la contribución total del viaje en vez del monto de 1 L
- [ ] El QR o Mercado Pago de Un litro acredita un Club / donación, o al revés

---

## 15. Recorrido mínimo (si hay poco tiempo)

En este orden, con una cuenta que ya superó el cupo y otra cuenta para buscar:

1. Rosario → Buenos Aires → continúa al pago → **Pagar después** → C no lo ve.
2. Pagar con Mercado Pago → el viaje se publica → C lo ve y puede pedir asiento.
3. Editar a una ruta que no aplica → sigue publicado, no pide pago.
4. Volver a Rosario → Buenos Aires → **no** cobra de nuevo.
5. Otro viaje Rosario → Buenos Aires → cobra de nuevo.
6. Un viaje pago que pasó vacío → el siguiente Rosario → Buenos Aires sale bonificado. Otro más, todavía sin pasajera, **también** sale bonificado. Recién después de aceptar a alguien, el que sigue cobra.
7. Rosario → Funes → **no** cobra.
8. Cuenta nueva: los dos primeros Rosario → Buenos Aires salen gratis; el tercero cobra.

Si esos ocho dan bien, el núcleo está sano. El resto de este documento cubre bordes (QR, Rapipago, fallo, semanal, regreso, cupo con cancelaciones). Los pagos de esta lista son cobros reales de Mercado Pago.

---

## 16. Cómo reportar un problema

Incluí:

- Entorno (staging / producción / local)
- Plataforma (web escritorio, web móvil, Android, iOS)
- Cuentas usadas
- Origen, destino y paradas
- Si la cuenta tenía cupo, crédito de viaje vacío (y cuántos vacíos seguidos) o ya había pagado ese viaje
- Qué viste vs. qué esperabas
- Capturas o ID del viaje
- Si el dinero se debitó en Mercado Pago (producción) aunque el viaje no se haya publicado
