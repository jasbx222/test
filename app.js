const PARTS = [
  { code: "58101D3A01", pretty: "58101-D3A01", name: "فلتر زيت المحرك", loc: "A-01", system: 10, count: 10, result: "متطابق، الفرق 0" },
  { code: "2435508000", pretty: "24355-08000", name: "بطانة الفرامل الأمامية", loc: "B-12", system: 6, count: 4, result: "نقص 2" },
  { code: "230602F930", pretty: "23060-2F930", name: "مصباح أمامي يمين", loc: "C-03", system: 2, count: 5, result: "زيادة 3" },
  { code: "58310BWA40", pretty: "58310-BWA40", name: "مساحات الزجاج", loc: "D-07", system: 8, count: 8, result: "متطابق الآن، ثم يُطلب تعديله إلى 9" }
];
const SKIP = { code: "S2630035505", pretty: "S2630-035505", name: "صواميل العجلة", loc: "F-02", system: 20 };
const UNKNOWN = { code: "976513X000", pretty: "97651-3X000", name: "حساس انتظار خلفي", loc: "E-01", count: 3 };
const VINS = [
  { vin: "TMAJB81D9VJ726816", model: "Hyundai", inFile: true, scan: true },
  { vin: "KMHCT41DBNU200002", model: "Tucson", inFile: true, scan: false },
  { vin: "TMAJU81DBMJ300003", model: "Sonata", inFile: false, scan: true }
];

const STEPS = {
  setup: [
    { id: "login", title: "ادخل لوحة التحكم", text: "الهاتف 07700000000 وكلمة المرور Admin123." },
    { id: "numbers", title: "انسخ رقم الفرع ورقم المخزن", text: "من صفحتي الفروع والمخازن، ثم اكتبهما في أعلى هذه الصفحة." },
    { id: "users", title: "أنشئ الحسابات الخمسة", text: "موظف التطبيق من صفحة المستخدمين. المشرفون الأربعة من صفحة المشرفين بالأدوار المكتوبة في الجدول." },
    { id: "file", title: "نزّل ملف الجلسة وارفعه", text: "جلسات الجرد ← بدء جلسة جرد جديدة، وارفع الملف الذي نزّلته من هذه الصفحة.", expect: "تبدأ الجلسة بلا رسالة خطأ عن رقم فرع أو مخزن غير موجود." }
  ],
  count: [
    { id: "c1", title: "امسح فلتر الزيت وسجّل 10 في A-01", text: "جرد قطع الغيار ← ابدأ الجرد. بعد المسح اختر فرع المنصور.", label: "58101D3A01", expect: "يظهر الوصف «فلتر زيت المحرك» ثم «تم إرسال الجرد»." },
    { id: "c2", title: "امسح بطانة الفرامل وسجّل 4 في B-12", text: "الكمية أقل من كمية النظام عمدًا.", label: "2435508000", expect: "يُقبل الجرد، والفرق لاحقًا نقص 2." },
    { id: "c3", title: "امسح المصباح وسجّل 5 في C-03", text: "الكمية أكبر من كمية النظام عمدًا.", label: "230602F930", expect: "يُقبل الجرد، والفرق لاحقًا زيادة 3." },
    { id: "c4", title: "امسح المساحات وسجّل 8 في D-07", text: "هذه مطابقة للنظام، والتعديل يأتي في الخطوة التالية.", label: "58310BWA40", expect: "يُقبل الجرد بكمية 8." },
    { id: "c5", title: "لا تمسح صواميل العجلة", text: "القطعة موجودة في ملف الجلسة حتى يظهر سطر «غير معدود» في الفروقات.", label: "S2630035505", quiet: true }
  ],
  requests: [
    { id: "unknown", title: "امسح حساسًا غير موجود في الملف", text: "عندما يقول التطبيق إن الرمز غير موجود، اضغط «إضافة قطعة للجرد». الوصف: حساس انتظار خلفي، الموقع E-01، الكمية 3، فرع المنصور ومخزنه.", label: "976513X000", expect: "رسالة «تم إرسال طلب الإضافة»، والقطعة لا تدخل الجرد قبل موافقة المالية." },
    { id: "qty", title: "اطلب تعديل كمية المساحات إلى 9", text: "من قائمة القطع في التطبيق افتح مساحات الزجاج، ثم «طلب تعديل الكمية». السبب: تصحيح كمية بعد إعادة النظر.", expect: "يظهر الطلب في «طلبات تعديل الكمية» بحالة بانتظار مدير المخزن." }
  ],
  cars: [
    { id: "vin1", title: "صوّر ملصق الشاصي على الزجاج", text: "جرد السيارات ← ابدأ الجرد. صوّر الملصق الأفقي: شعار هيونداي ثم رقم الشاصي في سطر واحد، كما على زجاج المركبة. ليس باركودًا.", label: "TMAJB81D9VJ726816", kind: "vin", expect: "يُقبل المسح برقم TMAJB81D9VJ726816." },
    { id: "vin2", title: "لا تمسح الملصق الثاني", text: "يبقى في الملف حتى يظهر ضمن VINs غير الموجودة عند التصدير.", label: "KMHCT41DBNU200002", kind: "vin", quiet: true },
    { id: "vin3", title: "صحّح الشاصي إلى سوناتا", text: "من السيارة التي مسحتها افتح إعادة تصحيح البيانات، والصق شاصي سوناتا. السبب: تصحيح قراءة الشاصي.", label: "TMAJU81DBMJ300003", kind: "vin", expect: "ينشأ طلب تصحيح VIN بانتظار موافقة أدمن الفرع أو مدير المخزن." }
  ],
  approve: [
    { id: "recount", title: "أعد العد لفلتر الزيت", text: "ادخل مدير المخزن. من قطع الغيار اضغط «إعادة العد» على فلتر الزيت وأرسله لأحمد. أحمد يكمل العد من الجرس بكمية 10.", expect: "تُغلق إعادة العد وتبقى الكمية 10." },
    { id: "qty-approve", title: "وافق على تعديل الكمية بمرحلتين", text: "مدير المخزن: طلبات التعديل ← قبول. ثم المحاسب ← قبول نهائي.", expect: "كمية المساحات المعدودة تصبح 9، ولا يستطيع المحاسب القبول قبل مدير المخزن." },
    { id: "part-approve", title: "وافق على القطعة الجديدة بمرحلتين", text: "مدير قطع الغيار: طلبات إضافة قطعة ← موافقة. ثم المحاسب ← تثبيت.", expect: "تُضاف القطعة بكمية نظام 0 وسعر 0، واسم الموظف الأصلي يبقى صاحب الجرد." },
    { id: "vin-approve", title: "وافق على تصحيح الشاصي", text: "أدمن الفرع أو مدير المخزن يفتح طلبات VIN ويوافق.", expect: "يصبح الشاصي المحفوظ TMAJU81DBMJ300003." }
  ],
  close: [
    { id: "finance", title: "راجع فروقات المخزون المالية", text: "ادخل المحاسب. صفِّ الفرق: نقص، زيادة، متطابق، غير معدود. ثم صدّر الملف.", expect: "البطانة نقص، المصباح زيادة، الصواميل غير معدودة. القيمة المالية 0 لأن هذا الملف بلا أسعار." },
    { id: "end", title: "أنهِ جلسة الجرد", text: "من جلسات الجرد، بعد اكتمال موافقة القطعة الجديدة، اضغط إنهاء الجلسة.", expect: "تتوقف الإرسالات من التطبيق. أي طلب إضافة ما زال مفتوحًا تصبح حالته «انتهت جلسة الجرد»." }
  ]
};

const CODE128 = [
  "11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
  "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100",
  "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010",
  "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000",
  "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110",
  "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010",
  "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000",
  "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010",
  "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110",
  "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110",
  "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100", "1100011101011"
];

const $ = (sel) => document.querySelector(sel);
const checks = new Set(JSON.parse(localStorage.getItem("hyst-kit-checks") || "[]"));

function encode128(text) {
  const values = [104];
  for (const ch of text) {
    const v = ch.charCodeAt(0) - 32;
    if (v < 0 || v > 94) throw new Error(text);
    values.push(v);
  }
  let sum = values[0];
  for (let i = 1; i < values.length; i++) sum += i * values[i];
  values.push(sum % 103, 106);
  return values.map((v) => CODE128[v]).join("");
}

function paintBarcode(canvas, text, pretty, scale) {
  const bits = encode128(text);
  const quiet = 14;
  const module = scale;
  const barH = 42 * scale;
  canvas.width = (bits.length + quiet * 2) * module;
  canvas.height = barH + 28 * scale;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === "1") ctx.fillRect((quiet + i) * module, 8 * scale, module, barH);
  }
  ctx.fillStyle = "#0e1726";
  ctx.font = `600 ${8 * scale}px Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillText(pretty, canvas.width / 2, canvas.height - 6 * scale);
}

function paintVin(canvas, vin, scale) {
  const w = 360 * scale;
  const h = 72 * scale;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#efefef";
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 14 * scale);
  ctx.fill();
  const cx = 34 * scale;
  const cy = h / 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 18 * scale, 13 * scale, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = Math.max(1.5, scale * 0.8);
  ctx.stroke();
  ctx.fillStyle = "#1a1a1a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${16 * scale}px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillText("H", cx, cy + scale * 0.4);
  ctx.textAlign = "left";
  ctx.font = `700 ${18 * scale}px Consolas, "Courier New", monospace`;
  ctx.fillText(vin, 62 * scale, cy);
}

function itemByCode(code) {
  return [...PARTS, SKIP, UNKNOWN].find((p) => p.code === code) || VINS.find((v) => v.vin === code);
}

function drawLabel(canvas, code, scale) {
  const item = itemByCode(code);
  if (item.vin) paintVin(canvas, item.vin, scale);
  else paintBarcode(canvas, item.code, item.pretty, scale);
}

function labelCard(code, compact) {
  const item = itemByCode(code);
  const vin = Boolean(item.vin);
  const box = document.createElement("figure");
  box.className = "label";
  const canvas = document.createElement("canvas");
  drawLabel(canvas, code, compact ? 2 : 3);
  const cap = document.createElement("figcaption");
  cap.className = "caption";
  if (vin) {
    cap.textContent = `${item.model} · ${item.inFile ? "داخل ملف الجلسة" : "ليس في الملف"}`;
  } else {
    cap.innerHTML = `${item.name}<br><b class="mono" dir="ltr">${item.pretty}</b><br>الموقع ${item.loc} · النظام ${item.system ?? "غير موجود"}`;
  }
  const actions = document.createElement("div");
  actions.className = "actions";
  const zoom = document.createElement("button");
  zoom.className = "btn small";
  zoom.type = "button";
  zoom.textContent = "تكبير للمسح";
  zoom.addEventListener("click", () => openScan(code));
  const save = document.createElement("button");
  save.className = "btn small";
  save.type = "button";
  save.textContent = "تنزيل الصورة";
  save.addEventListener("click", () => downloadCanvas(canvas, vin ? item.vin : item.code));
  actions.append(zoom, save);
  box.append(canvas, cap, actions);
  return box;
}

function openScan(code) {
  const item = itemByCode(code);
  const canvas = $("#scan-canvas");
  drawLabel(canvas, code, item.vin ? 4 : 5);
  $("#scan-title").textContent = item.vin ? `شاصي ${item.model}` : item.name;
  $("#scan-foot").textContent = item.vin
    ? "صوّر الملصق كما على زجاج المركبة: الشعار ثم رقم الشاصي في سطر واحد."
    : "قرّب كاميرا جرد القطع حتى يملأ الباركود الإطار، واترك مسافة بيضاء حوله.";
  const scan = $("#scan");
  scan.hidden = false;
  $("#scan-close").focus();
}

function downloadCanvas(canvas, name) {
  const out = document.createElement("canvas");
  drawLabel(out, name.length === 17 ? name : [...PARTS, SKIP, UNKNOWN].find((p) => p.code === name || p.pretty.replace("-", "") === name).code, 5);
  out.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function renderSteps() {
  for (const [group, items] of Object.entries(STEPS)) {
    const list = document.querySelector(`[data-group="${group}"]`);
    items.forEach((step, index) => {
      const li = document.createElement("li");
      li.className = "step";
      li.dataset.id = step.id;
      const check = document.createElement("button");
      check.className = "check";
      check.type = "button";
      check.setAttribute("aria-label", `تعليم: ${step.title}`);
      check.textContent = "✓";
      const body = document.createElement("div");
      body.innerHTML = `<h4>${index + 1}. ${step.title}</h4><p>${step.text}</p>${step.expect ? `<p class="expect">النتيجة: ${step.expect}</p>` : ""}`;
      if (step.label && !step.quiet) body.append(labelCard(step.label, true));
      if (step.quiet && step.label) {
        const note = document.createElement("p");
        note.className = "caption";
        note.innerHTML = `<span class="tag">لا تمسحه</span> الصورة في قسم كل صور الجرد للمراجعة فقط.`;
        body.append(note);
      }
      check.addEventListener("click", () => toggle(step.id, li, check));
      li.append(check, body);
      list.append(li);
      if (checks.has(step.id)) setDone(li, check, true);
    });
  }
}

function setDone(li, check, on) {
  li.classList.toggle("done", on);
  check.setAttribute("aria-pressed", on ? "true" : "false");
}

function toggle(id, li, check) {
  if (checks.has(id)) checks.delete(id);
  else checks.add(id);
  localStorage.setItem("hyst-kit-checks", JSON.stringify([...checks]));
  setDone(li, check, checks.has(id));
  updateProgress();
}

function updateProgress() {
  const total = Object.values(STEPS).reduce((n, items) => n + items.length, 0);
  const done = [...checks].filter((id) => Object.values(STEPS).some((items) => items.some((s) => s.id === id))).length;
  $("#progress-label").textContent = `${done} من ${total}`;
  $("#progress-bar").style.width = `${Math.round((done / total) * 100)}%`;
}

function renderGallery() {
  const grid = $("#gallery-grid");
  for (const part of [...PARTS, SKIP, UNKNOWN]) grid.append(labelCard(part.code, false));
  for (const vin of VINS) grid.append(labelCard(vin.vin, false));
}

function xmlCell(col, row, value, text) {
  const ref = `${col}${row}`;
  if (text) return `<c r="${ref}" t="inlineStr"><is><t>${String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</t></is></c>`;
  return `<c r="${ref}"><v>${value}</v></c>`;
}

function sheetXml(rows) {
  const body = rows.map((row, r) => `<row r="${r + 1}">${row.join("")}</row>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

function workbook() {
  const branch = Number($("#branch-no").value);
  const warehouse = Number($("#warehouse-no").value);
  const head = ["Quantity", "Description", "Location", "Serial", "BranchNo."].map((h, i) => xmlCell("ABCDE"[i], 1, h, true));
  const partRows = [head];
  [...PARTS, SKIP].forEach((p, i) => {
    const r = i + 2;
    partRows.push([
      xmlCell("A", r, p.system, false),
      xmlCell("B", r, p.name, true),
      xmlCell("C", r, p.loc, true),
      xmlCell("D", r, p.code, true),
      xmlCell("E", r, branch, false)
    ]);
  });
  const vinHead = ["VIN", "WarehouseNo.", "VehicleType"].map((h, i) => xmlCell("ABC"[i], 1, h, true));
  const vinRows = [vinHead];
  VINS.filter((v) => v.inFile).forEach((v, i) => {
    const r = i + 2;
    vinRows.push([xmlCell("A", r, v.vin, true), xmlCell("B", r, warehouse, false), xmlCell("C", r, v.model, true)]);
  });
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Parts" sheetId="1" r:id="rId1"/><sheet name="Vins" sheetId="2" r:id="rId2"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="1"><xf/></cellXfs></styleSheet>`,
    "xl/worksheets/sheet1.xml": sheetXml(partRows),
    "xl/worksheets/sheet2.xml": sheetXml(vinRows)
  };
  return zipStore(files);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(text);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    parts.push(local);
    const cen = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    cen.set(nameBytes, 46);
    central.push(cen);
    offset += local.length;
  }
  const centralSize = central.reduce((n, b) => n + b.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, central.length, true);
  ev.setUint16(10, central.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  const total = offset + centralSize + end.length;
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const part of [...parts, ...central, end]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, 1800);
}

function saveNumbers() {
  localStorage.setItem("hyst-kit-branch", $("#branch-no").value.trim());
  localStorage.setItem("hyst-kit-warehouse", $("#warehouse-no").value.trim());
}

$("#nums").addEventListener("submit", (event) => {
  event.preventDefault();
  const branch = $("#branch-no").value.trim();
  const warehouse = $("#warehouse-no").value.trim();
  if (!/^\d+$/.test(branch) || !/^\d+$/.test(warehouse)) {
    $("#file-hint").textContent = "اكتب رقم الفرع ورقم المخزن كما هما في لوحة التحكم.";
    return;
  }
  saveNumbers();
  const bytes = workbook();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  a.download = "inventory-test-session.xlsx";
  a.click();
  URL.revokeObjectURL(a.href);
  $("#file-hint").textContent = "تم تنزيل الملف. ارفعه من جلسات الجرد ← بدء جلسة جرد جديدة.";
});

$("#reset").addEventListener("click", () => {
  checks.clear();
  localStorage.removeItem("hyst-kit-checks");
  document.querySelectorAll(".step").forEach((li) => setDone(li, li.querySelector(".check"), false));
  updateProgress();
});

$("#scan-close").addEventListener("click", () => { $("#scan").hidden = true; });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $("#scan").hidden = true;
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    toast("تم نسخ الرقم");
  } catch {
    toast(button.dataset.copy);
  }
});

$("#branch-no").value = localStorage.getItem("hyst-kit-branch") || "";
$("#warehouse-no").value = localStorage.getItem("hyst-kit-warehouse") || "";
$("#branch-no").addEventListener("change", saveNumbers);
$("#warehouse-no").addEventListener("change", saveNumbers);

renderSteps();
renderGallery();
updateProgress();
