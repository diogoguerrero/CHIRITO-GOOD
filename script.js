/* MetalZero interactivo: imagen tuya, idiomas, dark mode, barras, comparacion mundial, 6 problemas */

/* ---------- Elementos UI ---------- */
const inputPhoto = document.getElementById('input-photo');
const useSampleBtn = document.getElementById('use-sample');
const personPhoto = document.getElementById('person-photo');
const personSVG = document.getElementById('person-svg');
const bubble = document.getElementById('bubble');
const arm = document.getElementById('arm-right');
const modeBtn = document.getElementById('modeBtn');
const langSelect = document.getElementById('langSelect');
const paletteDiv = document.getElementById('palette');

const optButtons = document.querySelectorAll('.opt');
const expTitle = document.getElementById('exp-title');
const expText = document.getElementById('exp-text');
const expList = document.getElementById('exp-list');
const expPeru = document.getElementById('exp-peru');
const barsDiv = document.getElementById('bars');
const worldBars = document.getElementById('world-bars');
const simulateMit = document.getElementById('simulateMit');
const quizContainer = document.getElementById('quizContainer');
const quizResult = document.getElementById('quizResult');

/* ---------- Default sample image (if user taps 'usar ejemplo') ---------- */
const SAMPLE_IMG = 'https://images.unsplash.com/photo-1531123414780-f436b1b8a4d0?w=800&q=60&auto=format&fit=crop';

/* ---------- Image handling ---------- */
inputPhoto.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  personPhoto.src = url;
  personPhoto.style.display = 'block';
  personSVG.style.display = 'none';
  bubble.textContent = '¡Foto cargada! Ahora elige una opción.';
});
useSampleBtn.addEventListener('click', ()=>{
  personPhoto.src = SAMPLE_IMG;
  personPhoto.style.display = 'block';
  personSVG.style.display = 'none';
  bubble.textContent = 'Usando imagen de ejemplo.';
});

/* ---------- Theme toggle ---------- */
modeBtn.addEventListener('click', ()=>{
  const html = document.documentElement;
  if(html.getAttribute('data-theme') === 'dark'){ html.removeAttribute('data-theme'); modeBtn.textContent='Modo oscuro'; }
  else { html.setAttribute('data-theme','dark'); modeBtn.textContent='Modo claro'; }
  renderPalette();
});

/* ---------- Small person talk animation ---------- */
function setPersonTalking(text){
  bubble.textContent = text;
  arm.classList.remove('wave'); void arm.offsetWidth; arm.classList.add('wave');
}

/* ---------- I18N minimal (UI labels) ---------- */
const I18N = {
  es: { title:'Huella de carbono — Industria metalúrgica (Perú)', lead:'Tu guía interactiva: selecciona una fuente, compara y resuelve casos prácticos.' },
  en: { title:'Carbon footprint — Metallurgical industry (Peru)', lead:'Interactive guide: select a source, compare and solve case studies.' },
  it: { title:'Impronta di carbonio — Industria metallurgica (Perù)', lead:'Guida interattiva: seleziona una fonte, confronta e risolvi casi.' },
  fr: { title:'Empreinte carbone — Industrie métallurgique (Pérou)', lead:'Guide interactive: sélectionnez une source, comparez et résolvez des cas.' },
  zh: { title:'碳足迹 — 冶金工业（秘鲁）', lead:'交互指南：选择来源，比较并解决案例。' },
  ru: { title:'Углеродный след — Металлургическая промышленность (Перу)', lead:'Интерактивный гид: выберите источник, сравните и решите кейсы.' },
  de: { title:'CO₂-Fußabdruck — Metallindustrie (Peru)', lead:'Interaktiver Leitfaden: Quelle wählen, vergleichen und Fälle lösen.' }
};

/* change language UI */
langSelect.addEventListener('change', e=>{
  const L = e.target.value;
  document.getElementById('ui-title').textContent = I18N[L].title;
  document.getElementById('ui-lead').textContent = I18N[L].lead;
});

/* ---------- Data content (expanded) ---------- */
const SECTIONS = {
  direct: {
    title: 'Fuentes directas',
    text: 'Combustión en hornos, procesos termoquímicos (sinter, tostación) y uso de cal y carbón: emisiones por combustión y por reacciones.',
    points: [
      'Causas: quema de carbón/coque; reacciones químicas de minerales; uso de cal.',
      'Consecuencias: emisiones directas de CO₂, SO₂ y partículas; afectación respiratoria; depósito en suelos y aguas.',
      'En Perú: complejos históricos (La Oroya, Ilo) han mostrado impactos; existe fiscalización (OEFA) y programas de monitoreo, pero la modernización es desigual.'
    ],
    bars: [
      {label:'Combustión en hornos', value:90, note:'Fuente principal de CO₂ directo.'},
      {label:'Procesos termoquímicos', value:75, note:'Reacciones químicas liberan CO₂.'},
      {label:'Uso de cal y carbón', value:65, note:'Combustión + emisiones químicas.'}
    ]
  },
  indirect: {
    title: 'Fuentes indirectas',
    text: 'Electricidad de matriz fósil, transporte de concentrados/productos y residuos industriales (scope 2 y 3).',
    points:[
      'Causas: mix eléctrico con hidrocarburos, largas rutas logísticas, manejo de residuos.',
      'Consecuencias: ampliación de huella (scope 2/3), riesgos de derrames, costes logísticos.',
      'En Perú: crecimiento de renovables reduce intensidad en ciertos años pero sigue habiendo zonas con matriz fósil.'
    ],
    bars:[
      {label:'Electricidad (matriz fósil)', value:80, note:'Scope 2 depende del mix.'},
      {label:'Transporte (camiones/puertos)', value:60, note:'Emisiones por flete largo.'},
      {label:'Residuos industriales', value:45, note:'Emisiones difusas y manejo.'}
    ]
  },
  regional: {
    title: 'Impacto por regiones',
    text: 'Diferencias en Costa, Sierra y Selva según localización de plantas, cuencas hídricas y transporte.',
    points:[
      'Sierra: elevada minería/fundición; sensibilidad hídrica y poblaciones andinas.',
      'Costa: plantas cerca de puertos (Ilo, Arequipa) con impacto logístico y costero.',
      'Selva: menor industria directa, impactos indirectos por transporte.'
    ],
    bars:[
      {label:'Sierra (minería+fundición)', value:55, note:'Alta exposición local y riesgo hídrico.'},
      {label:'Costa (puertos y plantas)', value:30, note:'Impactos logísticos y portuarios.'},
      {label:'Selva (impacto indirecto)', value:15, note:'Menor actividad directa.'}
    ]
  }
};

/* ---------- World comparison (didáctico) ---------- */
const WORLD = [
  {label:'China', value:100},
  {label:'USA', value:70},
  {label:'EU (avg)', value:60},
  {label:'Brazil', value:50},
  {label:'Peru (estimado)', value:55}
];

/* ---------- Quiz (6 problemas) ---------- */
const QUIZ = [
  {
    q:'1) Fundición en la costa: reducir emisiones del horno. ¿Qué priorizarías?',
    choices:[
      {id:'a', text:'Filtros + seguir con carbón.', score:10, explain:'Reduce partículas pero no CO₂ significativamente.'},
      {id:'b', text:'Horno eléctrico + PPA solar.', score:90, explain:'Reduce scope 1/2; buena opción en sur del Perú.'},
      {id:'c', text:'Aumentar reciclaje sin cambiar hornos.', score:60, explain:'Ayuda, pero depende disponibilidad de chatarra.'}
    ], best:'b', why:'Electrificación con PPA reduce CO₂ y es viable donde hay recurso solar.'
  },
  {
    q:'2) Planta en sierra con escasez de agua: ¿priorizar?',
    choices:[
      {id:'a', text:'Circuito cerrado de agua.', score:85, explain:'Eficiente, protege procesos y comunidades.'},
      {id:'b', text:'Planta desalinizadora en costa.', score:50, explain:'Costosa y logística compleja.'},
      {id:'c', text:'Reducir producción en meses secos.', score:30, explain:'Daño económico y no es solución sostenible.'}
    ], best:'a', why:'Circuitos cerrados protegen recursos hídricos y son coste-efectivos.'
  },
  {
    q:'3) Reducir scope 2: ¿mejor estrategia?',
    choices:[
      {id:'a', text:'Comprar offsets.', score:30, explain:'Compensa pero no reduce emisiones reales.'},
      {id:'b', text:'Firmar PPA renovable.', score:90, explain:'Reducción real de scope 2.'},
      {id:'c', text:'Mejorar eficiencia sin cambiar matriz.', score:60, explain:'Ayuda pero limitado con matriz fósil.'}
    ], best:'b', why:'PPA asegura energía renovable directa.'
  },
  {
    q:'4) Transporte de concentrados: solución óptima?',
    choices:[
      {id:'a', text:'Optimizar rutas y consolidar cargas.', score:70, explain:'Reduce kms y emisiones a corto plazo.'},
      {id:'b', text:'Camiones eléctricos inmediatos.', score:50, explain:'Requiere infraestructura y energía limpia.'},
      {id:'c', text:'Construir ferrocarril privado.', score:80, explain:'Gran eficiencia tonelada-km a largo plazo.'}
    ], best:'c', why:'Ferrocarril es eficiente para tramos largos en minería.'
  },
  {
    q:'5) Escorias: ¿qué priorizar?',
    choices:[
      {id:'a', text:'Vertido controlado.', score:30, explain:'Mitiga pero desperdicia recursos.'},
      {id:'b', text:'Valorización / reciclaje escorias.', score:90, explain:'Convierte residuos en recursos y reduce extracción primaria.'},
      {id:'c', text:'Almacenamiento a largo plazo.', score:40, explain:'Precaución, no aporta beneficios.'}
    ], best:'b', why:'Valorización ofrece beneficio económico y ambiental.'
  },
  {
    q:'6) CCUS en fundición: ¿apuesta ahora?',
    choices:[
      {id:'a', text:'Instalar CCUS ya.', score:60, explain:'Reduce emisiones pero es costoso y complejo.'},
      {id:'b', text:'Electrificar + reciclar primero.', score:85, explain:'Mejor ROI y menos complejidad.'},
      {id:'c', text:'Pilotos y pruebas.', score:80, explain:'Recomendable antes de gran inversión.'}
    ], best:'b', why:'Electrificación y reciclaje suelen dar mayor impacto y retorno inicial en Perú.'
  }
];

/* ---------- Render palette squares ---------- */
function renderPalette(){
  paletteDiv.innerHTML = '';
  const s1 = document.createElement('div'); s1.className='sw'; s1.style.background=getComputedStyle(document.documentElement).getPropertyValue('--bad');
  const s2 = document.createElement('div'); s2.className='sw'; s2.style.background=getComputedStyle(document.documentElement).getPropertyValue('--neutral');
  const s3 = document.createElement('div'); s3.className='sw'; s3.style.background=getComputedStyle(document.documentElement).getPropertyValue('--good');
  const l = document.createElement('div'); l.className='label'; l.textContent='Paleta: ↑ emisiones · neutro · ↓ emisiones';
  paletteDiv.appendChild(s1); paletteDiv.appendChild(s2); paletteDiv.appendChild(s3); paletteDiv.appendChild(l);
}

/* ---------- Render world comparison ---------- */
function renderWorld(){
  worldBars.innerHTML = '';
  WORLD.forEach(w=>{
    const row = document.createElement('div'); row.className='world-row';
    const lbl = document.createElement('div'); lbl.className='w-label'; lbl.textContent = w.label;
    const vis = document.createElement('div'); vis.className='w-vis';
    const fill = document.createElement('div'); fill.className='w-fill';
    let color = getComputedStyle(document.documentElement).getPropertyValue('--neutral');
    if(w.value >= 80) color = getComputedStyle(document.documentElement).getPropertyValue('--bad');
    else if(w.value <= 50) color = getComputedStyle(document.documentElement).getPropertyValue('--good');
    fill.style.background = color;
    fill.style.width = '0%';
    fill.style.transition = 'width 900ms ease';
    vis.appendChild(fill); row.appendChild(lbl); row.appendChild(vis);
    worldBars.appendChild(row);
    setTimeout(()=> fill.style.width = w.value + '%', 80);
  });
}

/* ---------- Render bars for a chosen section ---------- */
function renderBars(items){
  barsDiv.innerHTML = '';
  items.forEach(it=>{
    const row = document.createElement('div'); row.className='bar-row';
    const label = document.createElement('div'); label.className='bar-label'; label.textContent = it.label;
    const visual = document.createElement('div'); visual.className='bar-visual';
    const fill = document.createElement('div'); fill.className='bar-fill';
    const note = document.createElement('div'); note.className='bar-note'; note.textContent = it.note;
    let color = getComputedStyle(document.documentElement).getPropertyValue('--neutral');
    if(it.value > 70) color = getComputedStyle(document.documentElement).getPropertyValue('--bad');
    else if(it.value <= 40) color = getComputedStyle(document.documentElement).getPropertyValue('--good');
    fill.style.background = color;
    fill.style.width = '0%';
    fill.style.transition = 'width 850ms ease';
    visual.appendChild(fill);
    row.appendChild(label); row.appendChild(visual); row.appendChild(note);
    barsDiv.appendChild(row);
    setTimeout(()=> fill.style.width = it.value + '%', 80);
  });
}

/* ---------- Show section handler ---------- */
let lastSection = 'direct';
function showSection(k){
  lastSection = k;
  const s = SECTIONS[k];
  expTitle.textContent = s.title;
  expText.textContent = s.text;
  expList.innerHTML = '';
  s.points.forEach(p=>{
    const li = document.createElement('li'); li.textContent = p; expList.appendChild(li);
  });
  expPeru.textContent = 'Contexto Perú: ' + (s.points[2] || '');
  renderBars(s.bars);
  setPersonTalking('Te muestro lo que implica — mira el gráfico y el texto.');
}

/* ---------- Simulate mitigation (before/after) ---------- */
function simulateMitigation(){
  const s = SECTIONS[lastSection];
  if(!s) return;
  const original = s.bars.map(b => ({...b}));
  const reduced = s.bars.map(b => ({...b, value: Math.max(0, Math.round(b.value * 0.6))}));
  barsDiv.innerHTML = '';
  original.forEach((o,i)=>{
    const row = document.createElement('div'); row.className='bar-row';
    const label = document.createElement('div'); label.className='bar-label'; label.textContent = o.label;
    const visual = document.createElement('div'); visual.className='bar-visual';
    const beforeFill = document.createElement('div'); beforeFill.className='bar-fill';
    const afterFill = document.createElement('div'); afterFill.className='bar-fill';
    beforeFill.style.background = 'rgba(0,0,0,0.08)'; beforeFill.style.width = '0%';
    afterFill.style.background = getComputedStyle(document.documentElement).getPropertyValue('--good'); afterFill.style.width = '0%';
    visual.appendChild(beforeFill); visual.appendChild(afterFill);
    const note = document.createElement('div'); note.className='bar-note'; note.textContent = o.note;
    row.appendChild(label); row.appendChild(visual); row.appendChild(note);
    barsDiv.appendChild(row);
    setTimeout(()=> { beforeFill.style.width = o.value + '%'; afterFill.style.width = reduced[i].value + '%'; }, 80);
  });
  setPersonTalking('Simulación aplicada: compara antes y después.');
}

/* ---------- Quiz render & logic ---------- */
function renderQuiz(){
  quizContainer.innerHTML = '';
  QUIZ.forEach((q, idx) => {
    const qdiv = document.createElement('div'); qdiv.className='q-card';
    const qt = document.createElement('div'); qt.innerHTML = `<strong>${q.q}</strong>`;
    qdiv.appendChild(qt);
    q.choices.forEach(c=>{
      const btn = document.createElement('button'); btn.className='choice'; btn.textContent = c.text;
      btn.addEventListener('click', ()=>{
        quizResult.innerHTML = `<strong>Elección:</strong> ${c.text}<br><strong>Explicación:</strong> ${c.explain}<br><strong>Por qué es buena para Perú:</strong> ${q.why}`;
        if(c.id === q.best) quizResult.innerHTML += `<br><span style="color:var(--good)"><strong>Recomendado (score ${c.score})</strong></span>`;
        else quizResult.innerHTML += `<br><span style="color:var(--neutral)"><strong>Menos eficaz (score ${c.score})</strong></span>`;
        quizResult.scrollIntoView({behavior:'smooth'});
      });
      qdiv.appendChild(btn);
    });
    quizContainer.appendChild(qdiv);
  });
}

/* ---------- Attach handlers ---------- */
optButtons.forEach(b => b.addEventListener('click', ()=> showSection(b.dataset.key)));
simulateMit.addEventListener('click', simulateMitigation);

/* Accessibility: person click repeats prompt */
const personVisual = document.getElementById('person-visual');
personVisual.setAttribute('tabindex',0);
personVisual.addEventListener('click', ()=> setPersonTalking('Elige una opción: Fuentes directas, Indirectas o Regiones.'));
personVisual.addEventListener('keydown', (e)=> { if(e.key === 'Enter') setPersonTalking('Elige una opción.') });

/* ---------- Initial render ---------- */
renderPalette();
renderWorld();
renderQuiz();
showSection('direct');
setPersonTalking('¿Qué quieres analizar?');
// -------------------
// MODO OSCURO
// -------------------
document.getElementById("modeToggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
};

// -------------------
// CAMBIO DE IDIOMA
// -------------------
const translations = {
    en: {
        title: "Carbon Footprint – Metallurgical Sector of Peru",
        legend: "Color Meaning",
        presenter: "Hi! I'm your presenter. Let's explore the carbon footprint of Peru's metallurgical sector.",
        data: "International Comparison",
        questions: "Interactive Questions"
    },
    es: {
        title: "Huella de Carbono del Sector Metalúrgico – Perú",
        legend: "Significado de Colores",
        presenter: "¡Hola! Soy tu presentador. Vamos a analizar la huella de carbono del sector metalúrgico peruano.",
        data: "Comparación Internacional",
        questions: "Preguntas Interactivas"
    },
    it: {
        title: "Impronta di Carbonio – Settore Metallurgico del Perù",
        legend: "Significato dei Colori",
        presenter: "Ciao! Sono il tuo presentatore.",
        data: "Confronto Internazionale",
        questions: "Domande Interattive"
    },
    fr: {
        title: "Empreinte Carbone – Secteur Métallurgique Péruvien",
        legend: "Signification des Couleurs",
        presenter: "Salut ! Je suis ton présentateur.",
        data: "Comparaison Internationale",
        questions: "Questions Interactives"
    },
    de: {
        title: "CO₂-Fußabdruck – Metallurgiesektor Perus",
        legend: "Bedeutung der Farben",
        presenter: "Hallo! Ich bin dein Präsentator.",
        data: "Internationaler Vergleich",
        questions: "Interaktive Fragen"
    },
    ru: {
        title: "Углеродный след – металлургия Перу",
        legend: "Значение цветов",
        presenter: "Привет! Я твой ведущий.",
        data: "Международное сравнение",
        questions: "Интерактивные вопросы"
    },
    ko: {
        title: "탄소 발자국 – 페루 금속 산업",
        legend: "색 의미",
        presenter: "안녕하세요! 발표자입니다.",
        data: "국제 비교",
        questions: "인터랙티브 질문"
    }
};

document.getElementById("languageSelector").onchange = e => {
    const lang = translations[e.target.value];
    document.getElementById("title").textContent = lang.title;
    document.getElementById("legendTitle").textContent = lang.legend;
    document.getElementById("presenterText").textContent = lang.presenter;
    document.getElementById("dataTitle").textContent = lang.data;
    document.getElementById("questionsTitle").textContent = lang.questions;
};

// -------------------
// GRÁFICO
// -------------------
new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
        labels: ["Perú", "China", "EE.UU.", "Alemania", "Brasil"],
        datasets: [{
            label: "Ton CO₂ por año (sector metalúrgico)",
            data: [9, 52, 28, 14, 11]
        }]
    }
});

// -------------------
// PREGUNTAS
// -------------------
function selectOption(q, option) {
    document.querySelectorAll(`.question:nth-child(${q+1}) .option`)
        .forEach(b => b.classList.remove("selected"));

    event.target.classList.add("selected");

    const answers = {
        1: {
            C: "Correcto: La combustión en hornos libera grandes cantidades de CO₂. Causa: quema de carbón/coke. Consecuencia: efecto invernadero y contaminación local."
        },
        2: {
            C: "Correcto: La Costa es donde se concentra mayor actividad industrial. Consecuencias: mala calidad del aire y estrés térmico."
        },
        3: {
            B: "Correcto: Usar energías renovables reduce emisiones indirectas. Perú podría reducir hasta un 18% en metalurgia."
        }
    };

    const answerBox = document.getElementById(`a${q}`);
    answerBox.style.display = "block";
    answerBox.textContent = answers[q][option];
}