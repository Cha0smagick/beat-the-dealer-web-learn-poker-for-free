/* ============================================================
   I18N · Spanish pack (Español)
   Carries ui + page shells + blackjack glossary + tutorial.
   Chapter prose arrives in es-chapters.js, quizzes in
   es-quizzes.js (deep-merged into this pack on load).
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};

  window.BTD.I18N.register("es", {
    meta: { name: "Español" },

    ui: {
      "brand.tagline": "El Estudio Interactivo — un curso gratuito de cha0smagicklabs.com",
      "lang.label": "Idioma",

      "nav.story": "Historia", "nav.rules": "Reglas", "nav.why": "Matemáticas",
      "nav.basic": "Estrategia", "nav.counts": "Conteos", "nav.money": "Dinero",
      "nav.labs": "Laboratorios", "nav.glossary": "Glosario", "nav.pokerpedia": "Pokerpedia",
      "nav.tutorial": "Empieza aquí", "nav.about": "Acerca de",

      "footer.l1": "<strong>Beat the Dealer — El Estudio Interactivo.</strong> Una exposición educativa original de <em>Beat the Dealer</em> de Edward O. Thorp (1962; rev. 1966). No se reproduce ningún texto del libro.",
      "footer.l2": "Sitio, motor, laboratorios y currículo construidos gratis por <a href=\"https://cha0smagicklabs.com\" rel=\"noopener\">cha0smagicklabs.com</a>. Arte de cartas: <em>SVG-cards</em> de código abierto de David Bellot. Las tablas de estrategia se calculan en vivo en tu navegador — nada está copiado.",
      "footer.l3": "Solo educativo. Sin dinero real. Las matemáticas son honestas; los casinos también. +21.",

      "c.deal": "REPARTIR", "c.hit": "Pedir", "c.stand": "Plantarse", "c.double": "Doblar",
      "c.split": "Dividir", "c.next": "Siguiente", "c.restart": "Reiniciar", "c.start": "Empezar",
      "c.cancel": "Cancelar", "c.reset": "Reiniciar", "c.check": "Comprobar", "c.compute": "Calcular",
      "c.run": "Ejecutar", "c.close": "Cerrar", "c.retry": "Reintentar",

      "quiz.header": "Ponte a prueba",
      "quiz.score": "Puntuación",
      "quiz.newBest": "¡nuevo récord!",
      "quiz.best": "récord",
      "quiz.retry": "Repetir el quiz",
      "quiz.mark": "Marcar capítulo completado",
      "quiz.markDone": "✔ Capítulo completado",
      "quiz.allchapters": "todos los capítulos",
      "quiz.labLink": "Ir al Laboratorio →",
      "quiz.toastDone": "Capítulo completado. Adelante.",
      "quiz.toastKept": "Progreso guardado.",

      "gloss.ph": "Buscar términos…",
      "count.lab.sys": "Sistema:", "count.lab.mode": "Modo:", "count.lab.speed": "Velocidad:",
      "count.lab.guided": "Guiado — valora cada carta",
      "count.lab.speedtest": "Contrarreloj — cuenta en silencio",
      "count.lab.note0": "Elige un sistema y pulsa <b>Empezar mazo</b>. Un mazo completo siempre vuelve a cero — úsalo para autocorregirte.",
      "count.lab.ask": "¿Cuál es el valor {SYS} de esta carta?",
      "count.lab.silent": "Cuenta en silencio — las cartas se voltearán solas.",
    },

    pages: {
      home: {
        heroTitle: "Aprende a vencer al crupier — como se hizo de verdad.",
        heroText: "Un curso interactivo gratuito basado en <em>Beat the Dealer</em> de Edward O. Thorp: nueve capítulos, de la historia a las matemáticas y al oficio, con un motor de cálculo exacto en vivo, seis laboratorios, quizzes que te puntúan — y una Pokerpedia completa.",
        ctaCourse: "Empezar el curso →",
        ctaTutorial: "¿Nuevo aquí? Haz el tutorial",
        ctaLabs: "Ir directo a los laboratorios",
        secCourse: "El curso",
        secLabs: "El laboratorio",
        secRecord: "Tu expediente",
        reset: "Borrar todo el progreso",
        completed: "✔ completado",
        chaptersWord: "capítulos",
        badgesWord: "medallas",
        levelWord: "Nivel",
      },
      labs: {
        title: "El Laboratorio",
        lede: "Seis máquinas que convierten lectura en reflejo. Cada número lo calcula el motor en tu navegador — nada aquí es una respuesta enlatada.",
      },
      glossary: {
        title: "Glosario",
        lede: "De “ricos en ases” a “varianza” — el vocabulario del libro y de las mesas.",
        none: "Nada coincide — prueba otra palabra.",
      },
      notfound: {
        title: "Carta no encontrada",
        text: "Esa ruta se cayó del zapato. Vuelve al curso:",
        cta: "← Inicio",
      },
      about: {
        title: "Sobre este sitio",
        html: `
        <p class="lede">Un compañero de estudio gratuito y abierto de <em>Beat the Dealer</em> de Edward O. Thorp
        (1962; revisado 1966) — el libro que convirtió el blackjack de pasatiempo en frontera resuelta
        y lanzó la era de los cuantitativos. Construido y regalado por
        <a href="https://cha0smagicklabs.com" rel="noopener">cha0smagicklabs.com</a>.</p>

        <h2>La garantía anti-slop</h2>
        <p>La mayoría de los sitios de blackjack copia sus tablas de estrategia de otros sitios, con erratas —
        y sin forma de comprobarlas. Este sitio incluye un pequeño motor de cálculo exacto
        (<code>engine.js</code>): computa valores esperados por recursión sobre la composición exacta del mazo
        restante (modo de un mazo) o un modelo de zapato fresco (modo multidez), verificado en desarrollo contra
        una implementación independiente de fuerza bruta. Cada tabla de estrategia, gráfica de quiebra, VE y
        veredicto de laboratorio de este sitio se calcula <em>en vivo, en tu navegador, al cargar</em>. Nada está
        transcrito.</p>
        <p>Las aproximaciones que no pueden hacerse exactas (la regla del medio punto por conteo, el umbral de
        seguro en +3, la desviación típica por mano) están etiquetadas como aproximaciones en el texto.</p>

        <h2>Créditos</h2>
        <ul>
          <li><b>Edward O. Thorp</b> — autor de <em>Beat the Dealer</em>. Este sitio explica las ideas del libro;
          no se reproduce ningún texto del mismo. Lee el original.</li>
          <li><b>Julian Braun</b> — cuyas simulaciones en IBM afinaron las tablas de la segunda edición, y cuyo
          método imita en miniatura este motor.</li>
          <li><b>David Bellot</b> — el arte de código abierto <em>SVG-cards</em> usado en cada carta del sitio.</li>
          <li><b>cha0smagicklabs.com</b> — sitio, currículo, motor, laboratorios y diseño, publicados bajo
          licencia MIT.</li>
        </ul>

        <h2>Juega limpio</h2>
        <p>Solo educativo: sin juego con dinero real, sin apuestas, sin afiliaciones. Contar cartas es pensamiento
        legal; los casinos igual pueden negarte la acción — los últimos capítulos del libro explican exactamente
        por qué y cómo eran los juegos amañados de aquella época. Si apuestas en algún sitio, por algo: +21, dentro
        de tus medios, y nunca como plan de inversión.</p>`,
      },
      tutorial: {
        title: "Empieza Aquí",
        lede: "Siete pasos de cero a un jugador que el pit respeta. Cada paso se marca solo al terminar capítulos y ganar medallas: tu progreso, tu ritmo.",
        stepsTitle: "El camino",
        tipsTitle: "Diez consejos de profesionales del libro",
        steps: [
          { title: "Aprende el tapete", text: "Primero las reglas: totales, la doble vida del As, los naturales, cuándo puedes doblar o dividir. Diez minutos aquí ahorran cien errores después.", links: [["Capítulo 2 — Reglas", "#/chapter/rules"]], check: "chapter:rules" },
          { title: "Ve por qué se le puede vencer", text: "Una idea lo desbloquea todo: las cartas repartidas salen del juego, así que las probabilidades se mueven. Observa la gráfica de quiebra del crupier y la calculadora de naturales.", links: [["Capítulo 3 — Las Matemáticas", "#/chapter/why"]], check: "chapter:why" },
          { title: "Deja de perder dinero innecesario", text: "La estrategia básica es el arreglo de varios puntos porcentuales. Perfora hasta que el motor te gradúe con 90%+ en veinte manos.", links: [["Capítulo 4 — Estrategia Básica", "#/chapter/basic"], ["Laboratorio: Entrenamiento de Estrategia", "#/lab/drill"]], check: "chapter:basic", badge: "basic-adept" },
          { title: "Conoce el Ten-Count", text: "El original de 1962: +4 y −9, una razón, una decisión de apuesta. Cuenta un mazo completo en el entrenador.", links: [["Capítulo 5 — Ten-Count", "#/chapter/tencount"], ["Laboratorio: Entrenador de Conteo", "#/lab/count"]], check: "chapter:tencount", badge: "ten-counter" },
          { title: "Pásate al Hi-Lo moderno", text: "+1 / 0 / −1 y el recuento verdadero. El sistema del que desciende casi todo profesional.", links: [["Capítulo 6 — Hi-Lo", "#/chapter/hilo"]], check: "chapter:hilo", badge: "hilo-counter" },
          { title: "Aprende a apostar como Kelly", text: "La ventaja no significa nada sin tamaño. El criterio de Kelly, la rampa y por qué los supervivientes apuestan menos de lo que quieren.", links: [["Capítulo 8 — Dinero", "#/chapter/money"]], check: "chapter:money" },
          { title: "Juega en la mesa — y sobrevive a ella", text: "Siéntate en la mesa de laboratorio de un mazo con el conteo en pantalla, y luego lee el capítulo de trampas de la época para que nadie te posea jamás.", links: [["Laboratorio: Juega en la Mesa", "#/lab/table"], ["Capítulo 9 — Supervivencia", "#/chapter/survival"]], check: "chapter:survival", badge: "cheat-detective" },
        ],
        tips: [
          ["Cuenta en parejas", "Lee dos cartas como un solo número. A,4 se cancela (+4 luego −1)… reducirás a la mitad tu carga mental en un día."],
          ["Nunca asegures un mazo fresco", "El seguro exige densidad de dieces superior a 1/3. Un zapato fresco queda por debajo. Solo el conteo te cruza al otro lado."],
          ["Doblar antes que dividir", "Doblar es lo más rentable y lo más fácil de la estrategia básica. Aprende primero las filas de doblar."],
          ["Dilo en voz alta", "Verbalizar «16 contra diez: pedir» mientras entrenas graba el reflejo más rápido que el clic silencioso."],
          ["Aposta desde el presupuesto, no del humor", "Kelly dimensiona la apuesta desde la ventaja y la varianza. Las rachas malas no son información."],
          ["Con 16 contra 10, plantéate solo cuando estés rico", "La famosa desviación de jugada solo se activa con conteos altos. A cero, el motor sigue diciendo pedir."],
          ["El As vale más que un diez", "Los ases alimentan naturales (pagados 3:2); los dieces solo alimentan doblajes. Los sistemas avanzados los tratan distinto — acuérdate al llegar a los conteos secundarios."],
          ["Vete de los zapatos negativos", "Mínimo de mesa, o fuera. Caminar es una apuesta correcta de cero."],
          ["Parece un jugador, piensa como un contable", "El camuflaje es personalidad, no aritmética. Charla, propina, pierde pequeño a propósito — solo a apuesta mínima."],
          ["No juzgues nada por un fin de semana", "La ventaja aflora a miles de manos. La varianza gobierna el corto plazo; la disciplina, el largo."],
        ],
      },
      pokerpedia: {
        title: "La Pokerpedia",
        lede: "Toda la cultura del póker en cuatro salas: qué gana a qué, cómo se llaman las manos, qué significan las palabras y las historias que construyeron el juego.",
        hands: "Ranking de manos",
        names: "Nombres de las manos",
        terms: "Glosario de póker",
        lore: "Lore y leyendas",
        handsNote: "Las probabilidades son exactas para póker de cinco cartas (draw). En juegos de siete cartas como Texas Hold'em las frecuencias cambian — una pareja aparece en ~58% de las manos — pero el orden del ranking nunca cambia.",
        namesNote: "Los nombres que usan los jugadores de verdad. Aprende una docena y entenderás la mitad de cualquier conversación de póker.",
        termsPh: "Buscar términos de póker…",
        none: "Nada coincide — prueba otra palabra.",
      },
      welcome: {
        title: "Bienvenido a la mesa",
        text: "Tres puertas: un camino guiado, el curso completo o el laboratorio. Tu progreso y tu idioma quedan guardados en este dispositivo.",
        bTutorial: "🎓 Haz el tutorial",
        bChapter: "📖 Empieza el curso",
        bExplore: "🔬 Directo a los laboratorios",
        dismiss: "Prefiero explorar por mi cuenta",
      },
    },

    /* ---------- Blackjack glossary (39 terms, same order as EN) ---------- */
    glossary: [
      { term: "Mazo rico en ases", def: "Un mazo restante que conserva proporcionalmente más ases que un mazo fresco. Potente para naturales y doblajes blandos; es la razón por la que los sistemas avanzados llevan un conteo secundario de ases.", tag: "composición" },
      { term: "Barring (expulsión)", def: "La negativa de un casino a dejar que un jugador continúe: la respuesta estándar y legal ante un contador sospechoso. A los jugadores 'barrados' los escoltan amablemente y les hacen una foto.", tag: "oficio" },
      { term: "Estrategia básica", def: "La forma matemáticamente óptima de jugar cada total contra cada carta vista del crupier sin conocer el mazo restante. Se calcula por comparación exacta de valores esperados — nunca se memoriza por folklore.", tag: "sistema" },
      { term: "Rampa de apuestas", def: "La tabla que asigna a cada recuento verdadero un tamaño de apuesta. Su forma debería ser lógica de Kelly; su techo lo marcan el presupuesto y la tolerancia del casino.", tag: "dinero" },
      { term: "Bust (pasarse)", def: "Una mano que supera 21: derrota automática. El jugador puede pasarse; el crupier también — y está obligado a intentarlo siempre que deba pedir con 12–16.", tag: "reglas" },
      { term: "Camuflaje", def: "Comportamiento deliberado (juego suelto, propinas, charla, pequeños 'errores' a propósito a apuesta mínima) que hace que un contador parezca un jugador cualquiera. Cambia un poco de ventaja por un montón de anonimato.", tag: "oficio" },
      { term: "Mazo frío (cold deck)", def: "Un mazo preparado u ordenado que se introduce en el barajado, diseñado para producir rachas perdedoras. Documentado por Thorp como trampa estándar de la época. Firma: rachas de resultados imposibles.", tag: "trampas" },
      { term: "Dependiente de la composición", def: "Una estrategia cuyas jugadas cambian con las cartas exactas restantes (las tablas de un mazo del libro). Contrasta con la dependiente del total (solo importa el conteo).", tag: "composición" },
      { term: "Carta de corte", def: "Una carta de color que inserta un jugador y define el punto de barajado. La 'penetración superficial' (corte temprano) es la defensa principal del casino moderno contra los contadores.", tag: "juego moderno" },
      { term: "Penetración del mazo", def: "Cuán profundamente reparte el crupier antes de barajar. Cuanto más profunda la penetración, más información ve jamás un contador.", tag: "juego moderno" },
      { term: "Doblar (double down)", def: "Opción con las dos primeras cartas: doblas tu apuesta a cambio de exactamente una carta más, y te plantas. La mayor arma suelta de la estrategia básica.", tag: "reglas" },
      { term: "Valor esperado (VE)", def: "El resultado medio de una decisión por unidad apostada en la repetición infinita, expresado como fracción de la apuesta (p. ej. −0,18 significa perder 18 céntimos por dólar de media). Todas las celdas de estrategia son comparaciones de VE.", tag: "matemáticas" },
      { term: "Primera base", def: "El asiento que recibe las cartas primero. Irrelevante para la estrategia, aunque muy querido por la charla de los crupieres.", tag: "mesa" },
      { term: "Apuesta plana", def: "Apostar lo mismo en cada mano, al margen del conteo. Garantiza que jamás monetizarás el conteo — la ventaja de la casa acaba ganando igualmente.", tag: "dinero" },
      { term: "Mano dura", def: "Una mano sin ningún As contado como 11 (o cuyo As ya cuenta obligatoriamente como 1). Las manos duras pueden pasarse con una carta.", tag: "reglas" },
      { term: "Heat (sospecha)", def: "La atención del casino dirigida a un contador sospechoso: miradas, pit bosses conversadores, barajados tempranos y, al final, la expulsión. Se gestiona con camuflaje y disciplina de sesión.", tag: "oficio" },
      { term: "Hi-Lo", def: "El conteo balanceado de nivel uno adoptado en la segunda edición de 1966 tras las simulaciones de Julian Braun: 2–6 = +1, 7–9 = 0, dieces/ases = −1. La plantilla de casi todos los sistemas prácticos posteriores.", tag: "sistema" },
      { term: "Carta oculta (hole card)", def: "La carta boca abajo del crupier. Todo el problema de información del blackjack es que debes actuar antes de verla.", tag: "reglas" },
      { term: "Seguro (insurance)", def: "Una apuesta secundaria (hasta la mitad de tu apuesta) de que la carta oculta del crupier es un diez, ofrecida solo cuando muestra un As. Paga 2:1; es correcta exactamente cuando la densidad de dieces supera 1/3 — la primera jugada que los contadores 'poseyeron'.", tag: "reglas" },
      { term: "Criterio de Kelly", def: "El resultado de John Kelly Jr. (1956): la fracción de capital de riesgo óptima para crecer es f* = ventaja ÷ varianza. Thorp lo importó al blackjack y más tarde a las finanzas.", tag: "dinero" },
      { term: "Cartas marcadas", def: "Cartas alteradas (pinchazos, sombreado, brillos) para que un cómplice lea sus dorsos. Trampa estándar de la época que apunta a todos los de la mesa.", tag: "trampas" },
      { term: "Natural (blackjack)", def: "As + carta de valor diez en las dos primeras cartas. Paga 3 a 2 — el mayor privilegio permanente del jugador y el más sensible a la densidad de dieces.", tag: "reglas" },
      { term: "Peek (vistazo)", def: "El vistazo del crupier a su carta oculta buscando un natural cuando muestra As o diez. En los juegos modernos el jugador no pierde ante naturales del crupier tras doblar o dividir — la 'convención peek' del motor condiciona los VE igual.", tag: "reglas" },
      { term: "Penetración", def: "Véase 'Penetración del mazo'. El número más importante de cualquier mesa moderna que estés evaluando.", tag: "juego moderno" },
      { term: "Recuento corrido (running count)", def: "La suma acumulada de los valores de conteo de todas las cartas vistas desde el barajado. Materia prima; hay que convertirla a recuento verdadero para apostar.", tag: "sistema" },
      { term: "Segunda carta (second dealing)", def: "Servir la segunda carta del mazo fingiendo servir la primera: el movimiento clásico del crupier tramposo de la época. Mira el agarre, no los resultados.", tag: "trampas" },
      { term: "Zapato (shoe)", def: "La caja que contiene varios mazos (4–8 en los juegos modernos) de la que se reparte. Los zapatos multidez se adoptaron por culpa de este libro.", tag: "juego moderno" },
      { term: "Mano blanda", def: "Una mano con un As aún contado como 11. No puede pasarse con la siguiente carta — el As se degrada a 1. La estrategia de manos blandas es la parte más contraintuitiva de la estrategia básica.", tag: "reglas" },
      { term: "Spotter (observador)", def: "Miembro de un equipo que apuesta plano y cuenta en una mesa concurrida, señalando a un 'gran jugador' para que se sume solo cuando el mazo está rico.", tag: "oficio" },
      { term: "Plantarse (stand)", def: "Dejar de pedir. Todo lo que el crupier haga después ocurre a ciegas por el destino de tu apuesta.", tag: "reglas" },
      { term: "Mano rígida (stiff)", def: "Un total duro de 12–16: demasiado débil para plantarse tranquilo, demasiado fuerte para pedir seguro. El dolor del jugador y la trampa del pedido forzado del crupier.", tag: "mesa" },
      { term: "Densidad de dieces", def: "La fracción de cartas de valor diez entre las restantes. Por encima de 1/3, el seguro pasa al lado del jugador.", tag: "composición" },
      { term: "Rico / pobre en dieces", def: "Un mazo restante con (respectivamente) más o menos cartas de valor diez que la proporción de un mazo fresco. Rico en dieces es el día de cobro del contador: naturales, doblajes y quiebros del crupier.", tag: "composición" },
      { term: "Tercera base", def: "El último asiento en actuar, con más información antes de que juegue el crupier. La sabiduría popular dice que 'toma la carta de quiebro del crupier' — no hace tal cosa; reordenar los asientos no cambia nada.", tag: "mesa" },
      { term: "Recuento verdadero (true count)", def: "Recuento corrido ÷ mazos restantes. La medida de densidad que realmente pone precio a apuestas y desviaciones de jugada.", tag: "sistema" },
      { term: "Umbral de recuento verdadero", def: "El TC en el que una jugada cambia de bando (p. ej. el seguro en ≈ +3 con Hi-Lo multidez). Los umbrales difieren entre el juego de 1962 de un mazo y los zapatos modernos — otra razón por la que aquí las tablas se calculan, no se copian.", tag: "sistema" },
      { term: "Unidad", def: "Un incremento estándar de apuesta, definido por tu presupuesto y el tamaño de Kelly (una ventaja del 1% → una apuesta de ≈ 1% del presupuesto). Todos los VE de este curso se citan en unidades.", tag: "dinero" },
      { term: "Carta vista (up-card)", def: "La única carta expuesta del crupier. La cabecera de columna de todas las tablas de estrategia.", tag: "reglas" },
      { term: "Varianza", def: "La dispersión estadística de los resultados por apuesta (blackjack: DE ≈ 1,15 unidades por mano, varianza ≈ 1,15–1,3). La varianza es la razón de que el tamaño del presupuesto, y no solo la ventaja, decida la supervivencia.", tag: "matemáticas" },
    ],
  });

  /* ---- inject Spanish names into labs & badges (loaded before packs) ---- */
  const labsEs = {
    count:  ["Entrenador de conteo", "Cuenta mazos completos en Ten-Count o Hi-Lo, a velocidad de casino y con autocorrección total."],
    drill:  ["Entrenamiento de estrategia", "El motor te gradúa mano a mano contra la estrategia básica exacta. Objetivo: 90%+ en veinte manos."],
    table:  ["Juega en la mesa", "Una mesa de un mazo con el conteo en pantalla: reparte, decide y siente la varianza en tus manos."],
    monte:  ["Simulación Monte Carlo", "Millones de manos simuladas para verificar el motor exacto. No confíes: verifica."],
    prob:   ["Máquina de probabilidades", "Distribuciones del crupier, densidades y probabilidades de natural, calculadas al instante."],
    compute:["Calculadora de VE", "El valor esperado exacto de cualquier jugada sobre cualquier composición de mazo."],
  };
  Object.keys(labsEs).forEach((id) => {
    const lab = (window.BTD.Labs || {})[id];
    if (lab) { lab.name__es = labsEs[id][0]; lab.blurb__es = labsEs[id][1]; }
  });
  const badgesEs = {
    "first-deal":      ["Primer Reparto", "Termina el capítulo de Reglas"],
    "storyteller":     ["Cuentista", "Termina el capítulo de la Historia"],
    "rules-lawyer":    ["Abogado de las Reglas", "100% en el quiz de Reglas"],
    "basic-adept":     ["Adepto de la Básica", "90%+ en 20+ manos de entrenamiento"],
    "ten-counter":     ["Contador del Diez", "Cuenta un mazo completo en Ten-Count"],
    "hilo-counter":    ["Contador Hi-Lo", "Cuenta un mazo completo en Hi-Lo"],
    "card-sense":      ["Sentido de las Cartas", "Mazo perfecto: cero errores de conteo"],
    "kelly-heir":      ["Heredero de Kelly", "Termina Gestión del Dinero"],
    "cheat-detective": ["Detective de Trampas", "80%+ en Atrapa al Tramposo"],
    "bookworm":        ["Bibliófilo", "Completa los nueve capítulos"],
  };
  (window.BTD.BADGES || []).forEach((b) => {
    const e = badgesEs[b.id];
    if (e) { b.name__es = e[0]; b.desc__es = e[1]; }
  });
})();
