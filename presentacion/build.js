// Genera la presentacion de la Evaluación Final: node build.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme.js");

const OUT = path.join(__dirname, "EvaluacionFinal-GestionCompras.pptx");
const EV = (f) => path.join(__dirname, "..", "evidencias", f);
const IMG = (f) => path.join(__dirname, "img", f);

const THEME = {
  name: "Gestión de Compras",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2A37", lt1: "FFFFFF", dk2: "0F4C5C", lt2: "EEF4F5",
    accent1: "F2A541", accent2: "2E8B57", accent3: "C8553D",
    accent4: "5B8C9A", accent5: "BFD4D9", accent6: "6B7280",
    hlink: "0F4C5C", folHlink: "5B8C9A",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "Gestión de Solicitudes de Compra - Evaluación Final BPM";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const W = 13.333, M = 0.6;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "PORTADA",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: 9.5, h: 1.6, fontSize: 44, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 4.05, w: 9.5, h: 1.0, fontSize: 20, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENIDO",
  background: { color: C.background1 },
  margin: [0.5, M, 0.6, M],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: W - 2 * M, h: 0.8, fontSize: 32, bold: true, color: C.text2, align: "left", valign: "middle", margin: 0 }, text: "" } },
    { text: { text: "Gestión de Solicitudes de Compra  |  Evaluación Final BPM - SOA", options: { x: M, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
});
pres.defineSlideMaster({
  title: "CIERRE",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.5, w: W - 2 * M, h: 0.9, fontSize: 34, bold: true, color: C.background1, align: "left", valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
});

// ---------- helpers ----------
const slideOf = (master, section, title) => {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  if (title) s.addText(title, { placeholder: "title" });
  return s;
};
const shot = (s, file, x, y, w, name) => {
  // capturas de Business Central: 800x500 (1.6:1), con marco suave
  const h = w / 1.6;
  s.addShape(pres.shapes.RECTANGLE, { x: x - 0.04, y: y - 0.04, w: w + 0.08, h: h + 0.08, fill: { color: C.background2 }, line: { color: C.accent5, width: 0.75 }, objectName: name + " marco" });
  s.addImage({ path: EV(file), x, y, w, h, altText: name, objectName: name });
  return h;
};
const caption = (s, text, x, y, w) =>
  s.addText(text, { x, y, w, h: 0.35, fontSize: 11, italic: true, color: C.accent6, margin: 0, isTextBox: true });
const circleNum = (s, n, x, y, d, fill) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill || C.accent1 }, line: { color: fill || C.accent1 } });
  s.addText(String(n), { x, y, w: d, h: d, fontSize: d > 0.6 ? 20 : 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
};
const card = (s, x, y, w, h, fill) =>
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || C.background2 }, line: { color: fill || C.background2 } });

// ======================================================================
// 1. Portada
pres.addSection({ title: "Introducción" });
{
  const s = slideOf("PORTADA", "Introducción", "Gestión de Solicitudes de Compra");
  s.addText("Proceso BPM en jBPM 7.74 con reglas Drools, servicio REST y notificación por Gmail", { placeholder: "body" });
  s.addText("Desarrollo de Aplicaciones aplicando BPM - SOA  |  Evaluación Final", { x: M, y: 6.6, w: 9, h: 0.4, fontSize: 14, color: C.accent5, margin: 0, isTextBox: true });
  // motivo: circulos numerados del recorrido
  ["Solicita", "Valida", "Aprueba", "Ordena", "Notifica"].forEach((t, i) => {
    const y = 1.2 + i * 1.05;
    circleNum(s, i + 1, 10.9, y, 0.62, i === 2 ? C.accent1 : C.accent4);
    s.addText(t, { x: 11.65, y, w: 1.4, h: 0.62, fontSize: 16, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
  });
  s.addNotes("Presentamos el proceso de gestion de solicitudes de compra modelado, desplegado y ejecutado en jBPM 7.74.");
}

// 2. Objetivo
{
  const s = slideOf("CONTENIDO", "Introducción", "Objetivo");
  s.addText([
    { text: "Automatizar la solicitud de compra de un producto, desde el registro hasta la notificación del resultado, ", options: {} },
    { text: "decidiendo con reglas de negocio", options: { bold: true, color: C.text2 } },
    { text: " si la compra pasa directo a Compras, requiere aprobación del jefe o se rechaza.", options: {} },
  ], { x: M, y: 1.6, w: 6.2, h: 1.9, fontSize: 20, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  s.addText([
    { text: "Precio y stock se consultan en un catálogo externo (REST)", options: { bullet: true, breakLine: true } },
    { text: "El umbral de aprobación es S/ 500", options: { bullet: true, breakLine: true } },
    { text: "El solicitante recibe el resultado por Gmail", options: { bullet: true } },
  ], { x: M, y: 3.8, w: 6.2, h: 1.6, fontSize: 16, color: C.text1, paraSpaceAfter: 8, margin: 0, isTextBox: true });
  const stats = [["4", "roles en carriles"], ["5", "escenarios ejecutados"], ["2", "integraciones externas"]];
  stats.forEach(([n, l], i) => {
    const y = 1.5 + i * 1.75;
    card(s, 7.6, y, 5.1, 1.5);
    s.addText(n, { x: 7.85, y, w: 1.4, h: 1.5, fontSize: 60, bold: true, color: C.accent1, fontFace: "Cambria", valign: "middle", margin: 0, isTextBox: true });
    s.addText(l, { x: 9.0, y, w: 3.5, h: 1.5, fontSize: 20, color: C.text2, valign: "middle", margin: 0, isTextBox: true });
  });
  s.addNotes("Objetivo del proceso y sus cifras principales.");
}

// 3. Diseño del proceso
pres.addSection({ title: "Diseño" });
{
  const s = slideOf("CONTENIDO", "Diseño", "Diseño del proceso");
  const steps = [
    ["Registrar solicitud", "El solicitante ingresa producto, cantidad, correo y motivo"],
    ["Consultar producto", "Tarea REST al catálogo externo: precio y stock"],
    ["Evaluar compra", "Reglas Drools validan datos y calculan la ruta"],
    ["Decidir ruta", "Gateway: rechazo, compra directa o aprobación"],
    ["Evaluar solicitud", "El jefe aprueba o rechaza si supera S/ 500"],
    ["Registrar orden", "Compras registra la orden autorizada"],
    ["Notificar", "Se envía el resultado por Gmail y termina"],
  ];
  const cw = 1.6, gap = 0.17, x0 = M;
  steps.forEach(([t, dsc], i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, 2.0, cw, 3.6, i === 2 || i === 3 ? C.background2 : "FFFFFF");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: cw, h: 3.6, rectRadius: 0.08, fill: { type: "none" }, line: { color: C.accent5, width: 1 } });
    circleNum(s, i + 1, x + cw / 2 - 0.3, 2.25, 0.6, i === 2 || i === 3 ? C.accent1 : C.accent4);
    s.addText(t, { x: x + 0.1, y: 3.0, w: cw - 0.2, h: 0.8, fontSize: 15, bold: true, color: C.text2, align: "center", valign: "top", margin: 0, isTextBox: true });
    s.addText(dsc, { x: x + 0.12, y: 3.85, w: cw - 0.24, h: 1.6, fontSize: 13, color: C.text1, align: "center", valign: "top", margin: 0, isTextBox: true });
  });
  s.addText("Pasos 3 y 4: las reglas deciden y el gateway solo lee la ruta calculada", { x: M, y: 5.95, w: 12, h: 0.4, fontSize: 14, italic: true, color: C.accent6, margin: 0, isTextBox: true });
  s.addNotes("Recorrido del proceso en siete pasos. Las decisiones de negocio están en las reglas, no en el diagrama.");
}

// 4. Actores y roles
{
  const s = slideOf("CONTENIDO", "Diseño", "Actores y roles");
  const roles = [
    ["Solicitante", "Grupo: solicitantes", "Usuario de prueba: solicitante1", "Registrar solicitud"],
    ["Jefe", "Grupo: jefes", "Usuario de prueba: jefe1", "Evaluar solicitud (total > S/ 500)"],
    ["Compras", "Grupo: compras", "Usuario de prueba: compras1", "Registrar orden de compra"],
    ["Sistema", "Motor jBPM + Drools", "Sin intervención humana", "REST, reglas, scripts y Gmail"],
  ];
  roles.forEach(([r, g, u, t], i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, 1.7, w, 4.6, i === 3 ? C.background2 : "FFFFFF");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.7, w, h: 4.6, rectRadius: 0.08, fill: { type: "none" }, line: { color: C.accent5, width: 1 } });
    circleNum(s, ["S", "J", "C", "M"][i], x + 0.3, 2.0, 0.75, i === 3 ? C.accent6 : C.text2);
    s.addText(r, { x: x + 0.3, y: 2.95, w: w - 0.6, h: 0.5, fontSize: 22, bold: true, color: C.text2, margin: 0, fontFace: "Cambria", isTextBox: true });
    s.addText([
      { text: g, options: { breakLine: true } },
      { text: u, options: { breakLine: true, color: C.accent6 } },
    ], { x: x + 0.3, y: 3.5, w: w - 0.5, h: 0.9, fontSize: 13, color: C.text1, margin: 0, valign: "top", isTextBox: true });
    s.addText("Tarea", { x: x + 0.3, y: 4.55, w: w - 0.5, h: 0.3, fontSize: 11, bold: true, color: C.accent1, margin: 0, isTextBox: true });
    s.addText(t, { x: x + 0.3, y: 4.85, w: w - 0.5, h: 1.2, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Cada rol es un carril (swimlane) del diagrama y cada tarea humana se asigna a su grupo", { x: M, y: 6.45, w: 12, h: 0.4, fontSize: 14, italic: true, color: C.accent6, margin: 0, isTextBox: true });
  s.addNotes("Cuatro carriles: Solicitante, Sistema, Jefe y Compras. Los grupos controlan quien puede tomar cada tarea.");
}

// 5. Diagrama BPMN
{
  const s = slideOf("CONTENIDO", "Diseño", "Diagrama BPMN");
  const w = W - 2 * M, h = w / (3340 / 992);
  s.addImage({ path: IMG("diagrama.png"), x: M, y: 1.55, w, h, altText: "Diagrama BPMN del proceso compras.solicitud con carriles Solicitante, Sistema, Jefe y Compras", objectName: "Diagrama BPMN" });
  s.addText([
    { text: "4 carriles", options: { bold: true, color: C.text2 } }, { text: "  |  3 tareas humanas  |  ", options: {} },
    { text: "2 tareas de reglas", options: { bold: true, color: C.text2 } }, { text: "  |  6 gateways exclusivos  |  ", options: {} },
    { text: "REST + Gmail", options: { bold: true, color: C.text2 } },
  ], { x: M, y: 1.55 + h + 0.35, w: 12, h: 0.45, fontSize: 16, color: C.text1, margin: 0, isTextBox: true });
  caption(s, "Proceso compras.solicitud dibujado a partir del archivo GestionProcesoCompra.bpmn (mismo diseño que Business Central)", M, 1.55 + h + 0.9, 12);
  s.addNotes("Diagrama completo. Las reglas se evaluan en 'Evaluar compra' y 'Liberar memoria'; despues el gateway 'Resultado de reglas' dirige la solicitud.");
}

// 6. Objeto de datos
{
  const s = slideOf("CONTENIDO", "Diseño", "Objeto de datos Solicitud");
  const rows = [
    ["productoId, cantidad, motivo, email", "Datos que ingresa el solicitante"],
    ["encontrado, producto, precio, stock", "Respuesta del catálogo REST"],
    ["total", "precio x cantidad (BigDecimal)"],
    ["ruta", "PENDIENTE, RECHAZAR, DIRECTA o APROBACION"],
    ["resultado, detalle", "Mensaje que llega por correo"],
  ];
  const hdr = { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 14 };
  s.addTable([[{ text: "Campos", options: hdr }, { text: "Uso", options: hdr }],
    ...rows.map(([a, b]) => [{ text: a, options: { bold: true, color: C.text2 } }, { text: b }])],
    { x: M, y: 1.6, w: 5.9, colW: [2.9, 3.0], fontSize: 13, color: C.text1, border: { type: "solid", pt: 0.75, color: THEME.colors.accent5 }, fill: { color: C.background1 }, rowH: 0.62, valign: "middle" });
  shot(s, "21-objeto-datos.jpg", 6.95, 1.65, 5.75, "Captura objeto de datos Solicitud");
  caption(s, "Business Central - editor de objetos de datos", 6.95, 5.35, 5.75);
  s.addNotes("Todas las reglas trabajan sobre el objeto Solicitud, que el proceso inserta en la sesión de reglas.");
}

// 7. Reglas de negocio
pres.addSection({ title: "Reglas e integraciones" });
{
  const s = slideOf("CONTENIDO", "Reglas e integraciones", "Reglas de negocio");
  const hdr = { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 13 };
  const data = [
    ["DatosInvalidos", "Regla con DSL", "100", "Producto, cantidad o motivo vacios o <= 0", "RECHAZAR"],
    ["ProductoInexistente", "Regla guiada", "90", "El catálogo responde 404", "RECHAZAR"],
    ["StockInsuficiente", "Regla con DSL", "80", "cantidad > stock", "RECHAZAR"],
    ["CompraDirecta", "Tabla de decisiones", "70", "total <= S/ 500", "DIRECTA"],
    ["AprobacionAdicional", "Tabla de decisiones", "60", "total > S/ 500", "APROBACION"],
    ["LiberarMemoria", "Regla guiada", "-", "Después de evaluar (grupo liberar-memoria)", "Retira el hecho"],
  ];
  const routeColor = (r) => r === "RECHAZAR" ? C.accent3 : r === "DIRECTA" ? C.accent2 : r === "APROBACION" ? C.accent1 : C.accent6;
  s.addTable([
    ["Regla", "Artefacto", "Prioridad", "Condición", "Ruta"].map((t) => ({ text: t, options: hdr })),
    ...data.map((r) => [
      { text: r[0], options: { bold: true, color: C.text2 } }, { text: r[1] }, { text: r[2], options: { align: "center" } }, { text: r[3] },
      { text: r[4], options: { bold: true, color: routeColor(r[4]) } },
    ]),
  ], { x: M, y: 1.55, w: 12.1, colW: [2.5, 2.1, 1.1, 4.4, 2.0], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.75, color: THEME.colors.accent5 }, rowH: 0.58, valign: "middle" });
  s.addText("Todas pertenecen al grupo evaluar-compra (salvo LiberarMemoria). La prioridad decide el orden: un rechazo siempre gana a la ruta por importe", { x: M, y: 5.85, w: 12.1, h: 0.6, fontSize: 14, italic: true, color: C.accent6, margin: 0, isTextBox: true });
  s.addNotes("Seis reglas en cuatro tipos de artefacto. Cada regla cambia la ruta de PENDIENTE a su resultado y deja de aplicar a las demas.");
}

// 8. Reglas en Business Central
{
  const s = slideOf("CONTENIDO", "Reglas e integraciones", "Regla guiada y lenguaje específico (DSL)");
  shot(s, "19-regla-guiada.jpg", M, 1.6, 5.9, "Captura regla guiada ProductoInexistente");
  caption(s, "Regla guiada ProductoInexistente: CUANDO ruta PENDIENTE y no encontrado, ENTONCES rechazar", M, 5.4, 5.9);
  shot(s, "20-regla-dsl.jpg", 6.83, 1.6, 5.9, "Captura regla DSL ValidacionesCompra");
  caption(s, "Reglas escritas con frases del DSL: \"Existe una solicitud de compra pendiente\"", 6.83, 5.4, 5.9);
  s.addNotes("El DSL traduce frases en lenguaje natural a DRL, para que el experto de negocio lea y escriba reglas.");
}

// 9. Tabla de decisiones y escenarios de prueba
{
  const s = slideOf("CONTENIDO", "Reglas e integraciones", "Tabla de decisiones y escenarios de prueba");
  shot(s, "22-tabla-decisiones-fuente.jpg", M, 1.6, 5.9, "Captura tabla de decisiones RutaPorImporte");
  caption(s, "RutaPorImporte.xlsx genera CompraDirecta (<= 500) y AprobacionAdicional (> 500)", M, 5.4, 5.9);
  shot(s, "18-escenarios-prueba-aprobados.jpg", 6.83, 1.6, 5.9, "Captura escenarios de prueba aprobados");
  caption(s, "EvaluarCompra.scesim: 8 escenarios, resultado APROBADA (100 %)", 6.83, 5.4, 5.9);
  s.addNotes("Los escenarios de prueba cubren los cinco caminos de las reglas, incluido el limite exacto de S/ 500 y S/ 500.01.");
}

// 10. Integraciones
{
  const s = slideOf("CONTENIDO", "Reglas e integraciones", "Integraciones con servicios externos");
  const blocks = [
    ["REST", "Consultar producto", ["GET https://dummyjson.com/products/{id}", "Devuelve título, precio y stock", "404 se trata como producto inexistente", "Timeouts: 10 s conexión, 15 s lectura"]],
    ["Gmail", "Enviar resultado", ["smtp.gmail.com:587 con TLS", "Contraseña de aplicación de Google", "Asunto: Solicitud de compra - RESULTADO", "Cuerpo HTML con estado, detalle y resumen"]],
  ];
  blocks.forEach(([tag, task, items], i) => {
    const x = M + i * 3.55, w = 3.35;
    card(s, x, 1.6, w, 4.5);
    circleNum(s, tag === "REST" ? "R" : "G", x + 0.3, 1.85, 0.7, tag === "REST" ? C.accent4 : C.accent3);
    s.addText(tag, { x: x + 1.15, y: 1.85, w: 2, h: 0.4, fontSize: 22, bold: true, color: C.text2, fontFace: "Cambria", margin: 0, isTextBox: true });
    s.addText("Tarea: " + task, { x: x + 1.15, y: 2.25, w: 2.1, h: 0.35, fontSize: 12, color: C.accent6, margin: 0, isTextBox: true });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1 } })),
      { x: x + 0.3, y: 2.95, w: w - 0.5, h: 3.0, fontSize: 14, color: C.text1, paraSpaceAfter: 6, margin: 0, valign: "top", isTextBox: true });
  });
  shot(s, "02-work-item-handlers.jpg", 7.85, 1.6, 4.85, "Captura manejadores de items de trabajo");
  caption(s, "Handlers Rest y Email registrados en el proyecto", 7.85, 4.75, 4.85);
  s.addNotes("Las dos integraciones son work item handlers de jBPM. La clave de Gmail se configura en Business Central, no en el repositorio.");
}

// 11. Escenarios - resumen
pres.addSection({ title: "Escenarios" });
{
  const s = slideOf("CONTENIDO", "Escenarios", "Escenarios ejecutados");
  const hdr = { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 13 };
  const data = [
    ["1", "Flujo exitoso", "CK One x 5 = S/ 249.95", "DIRECTA", "Orden OC-2026-001", "65"],
    ["2", "Aprobación adicional", "Chanel Coco Noir x 5 = S/ 649.95", "APROBACION", "Jefe aprueba, orden OC-2026-002", "66"],
    ["3", "Rechazo del jefe", "MacBook Pro x 1 = S/ 1999.99", "APROBACION", "Jefe rechaza", "67"],
    ["4", "Excepción: no encontrado", "Producto 9999 (HTTP 404)", "RECHAZAR", "Rechazada por reglas", "68"],
    ["5", "Excepción: sin stock", "MacBook Pro x 30, stock 24", "RECHAZAR", "Rechazada por reglas", "69"],
  ];
  const col = (r) => r === "RECHAZAR" ? C.accent3 : r === "DIRECTA" ? C.accent2 : C.accent1;
  s.addTable([
    ["#", "Escenario", "Datos (catálogo real)", "Ruta de reglas", "Resultado", "Instancia"].map((t) => ({ text: t, options: hdr })),
    ...data.map((r) => [
      { text: r[0], options: { align: "center", bold: true } }, { text: r[1], options: { bold: true, color: C.text2 } }, { text: r[2] },
      { text: r[3], options: { bold: true, color: col(r[3]) } }, { text: r[4] }, { text: r[5], options: { align: "center" } },
    ]),
  ], { x: M, y: 1.55, w: 12.1, colW: [0.5, 2.5, 3.3, 1.8, 3.0, 1.0], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.75, color: THEME.colors.accent5 }, rowH: 0.62, valign: "middle" });
  s.addText("Los 5 terminaron en estado Completado y enviaron el correo de resultado", { x: M, y: 5.6, w: 12, h: 0.45, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true });
  s.addNotes("Cinco circuitos: flujo exitoso, aprobación adicional, rechazo del jefe y dos excepciones detectadas por las reglas.");
}

// 12-15. Un escenario por diapositiva
const scen = (title, pid, shotFile, shotName, points, note) => {
  const s = slideOf("CONTENIDO", "Escenarios", title);
  const w = 11.2, h = w / (3340 / 992);
  s.addImage({ path: IMG(`recorrido-${pid}.png`), x: (W - w) / 2, y: 1.35, w, h, altText: `Recorrido de la instancia ${pid} resaltado en el diagrama`, objectName: `Recorrido ${pid}` });
  const y2 = 1.35 + h + 0.3;
  shot(s, shotFile, M, y2, 2.9, shotName);
  s.addText(points.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < points.length - 1 } })),
    { x: 3.95, y: y2, w: 8.8, h: 1.85, fontSize: 15, color: C.text1, paraSpaceAfter: 6, margin: 0, valign: "top", isTextBox: true });
  s.addNotes(note);
  return s;
};
scen("Escenario 1: flujo exitoso (hasta S/ 500)", 65, "13-esc1-variables.jpg", "Variables instancia 65", [
  "solicitante1 pide 5 Calvin Klein CK One: total S/ 249.95",
  "Regla CompraDirecta: ruta DIRECTA, sin pasar por el jefe",
  "compras1 registra la orden OC-2026-001",
  "Correo: Solicitud de compra - ORDEN_REGISTRADA",
], "Camino resaltado en naranja: el monto no supera S/ 500 y va directo a Compras.");
scen("Escenario 2: aprobación adicional del jefe", 66, "14-esc2-variables.jpg", "Variables instancia 66", [
  "5 Chanel Coco Noir: total S/ 649.95, mayor a S/ 500",
  "Regla AprobacionAdicional: la tarea va al grupo jefes",
  "jefe1 aprueba (aprobada = true) y compras1 registra OC-2026-002",
  "Correo: Solicitud de compra - ORDEN_REGISTRADA",
], "El gateway envía la solicitud al carril del jefe; tras aprobar, continua a Compras.");
scen("Escenario 3: el jefe rechaza", 67, "15-esc3-variables.jpg", "Variables instancia 67", [
  "1 MacBook Pro 14: total S/ 1999.99, requiere aprobación",
  "jefe1 rechaza (aprobada = false)",
  "Validar decision registra: Solicitud rechazada por el jefe",
  "Correo: Solicitud de compra - RECHAZADA",
], "Flujo alterno: la decisión humana lleva a la rama de rechazo.");
scen("Escenarios 4 y 5: excepciones detectadas por reglas", 68, "17-esc5-registros.jpg", "Registros instancia 69", [
  "Instancia 68: producto 9999, el catálogo responde 404 y ProductoInexistente rechaza",
  "Instancia 69: 30 MacBook Pro con stock 24 y StockInsuficiente rechaza",
  "No pasan por el jefe ni por Compras; Liberar memoria limpia la sesión",
  "Correo: Solicitud de compra - RECHAZADA, con el motivo",
], "Las dos excepciones siguen el mismo camino: reglas, liberar memoria, rechazo y correo. La captura muestra el registro de la instancia 69.");

// 16. Evidencias en Business Central
pres.addSection({ title: "Evidencias" });
{
  const s = slideOf("CONTENIDO", "Evidencias", "Despliegue y ejecución en Business Central");
  const w = 5.9, h = w / 1.6;
  shot(s, "04-build-exitoso.jpg", M, 1.45, w, "Captura build exitoso");
  caption(s, "Proyecto importado desde GitHub, compilado y desplegado", M, 1.45 + h + 0.1, w);
  shot(s, "10-instancias-completadas.jpg", 6.83, 1.45, w, "Captura instancias completadas");
  caption(s, "Instancias 65 a 69 completadas, sin errores", 6.83, 1.45 + h + 0.1, w);
  s.addNotes("Evidencia de despliegue del contenedor GestionCompras_1.0.0-SNAPSHOT y de las cinco instancias terminadas.");
}
{
  const s = slideOf("CONTENIDO", "Evidencias", "Tarea humana del jefe");
  const w = 5.9, h = w / 1.6;
  shot(s, "06-tareas-pendientes-jefe.jpg", M, 1.45, w, "Captura tareas pendientes del jefe");
  caption(s, "Dos solicitudes esperando la evaluación del jefe", M, 1.45 + h + 0.1, w);
  shot(s, "08-formulario-evaluar-solicitud.jpg", 6.83, 1.45, w, "Captura formulario Evaluar solicitud");
  caption(s, "Formulario con el resumen de la compra y la decisión Aprobada", 6.83, 1.45 + h + 0.1, w);
  s.addNotes("La tarea Evaluar solicitud tiene como propietario potencial al grupo jefes.");
}

// 18. Conclusiones
pres.addSection({ title: "Cierre" });
const closing = (title, items, note) => {
  const s = slideOf("CIERRE", "Cierre", title);
  items.forEach(([head, body], i) => {
    const y = 1.75 + i * 1.7;
    circleNum(s, i + 1, M, y, 0.75, C.accent1);
    s.addText(head, { x: M + 1.05, y: y - 0.05, w: 11, h: 0.5, fontSize: 22, bold: true, color: C.background1, fontFace: "Cambria", margin: 0, isTextBox: true });
    s.addText(body, { x: M + 1.05, y: y + 0.48, w: 11, h: 0.9, fontSize: 16, color: C.accent5, margin: 0, valign: "top", isTextBox: true });
  });
  s.addNotes(note);
};
closing("Conclusiones", [
  ["Las reglas separan la decisión del flujo", "El umbral de S/ 500 y las validaciones viven en reglas guiadas, DSL y una tabla de decisiones; el diagrama solo lee la ruta calculada."],
  ["Las integraciones quedan desacopladas", "REST y Gmail son work item handlers configurables; los 5 escenarios se ejecutaron de punta a punta con datos reales del catálogo."],
  ["Las reglas son verificables", "Los 8 escenarios de prueba pasan en Business Central y la tarea Liberar memoria deja la sesión sin hechos al terminar cada evaluación."],
], "Tres conclusiones del trabajo.");
closing("Recomendaciones", [
  ["Proteger las credenciales", "Guardar la clave de Gmail fuera del proyecto (propiedades del servidor o un gestor de secretos) y revocar la usada en las pruebas."],
  ["Robustecer las tareas", "Agregar manejo de errores y reintentos a la consulta REST, y formularios propios para las tareas humanas en lugar de los generados."],
  ["Escalar la política de aprobación", "Llevar la tabla a una tabla guiada con más niveles (por ejemplo gerencia) y usar la estrategia por instancia de proceso para mayor concurrencia."],
], "Tres recomendaciones para una siguiente versión.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("ok", OUT);
})();
