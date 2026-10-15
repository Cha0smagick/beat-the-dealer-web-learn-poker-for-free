/* ============================================================
   I18N · Spanish — chapter prose (9 chapters)
   Deep-merged into the "es" pack. Widget divs mirror the
   English chapters exactly; a pro tip per chapter included.
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};

  window.BTD.I18N.register("es", {
    chapters: {

      /* ============ 1 · LA HISTORIA ============ */
      story: {
        title: "El hombre que venció al crupier",
        kicker: "La Historia",
        book: "Prólogo e introducción",
        tagline: "Cómo un joven matemático con un IBM 704 rompió el juego favorito del casino — y encendió una revolución.",
        html: `
<p class="lede">En 1958, el blackjack se consideraba invencible. Las reglas del crupier parecían
diseñadas para que la casa acabara ganando siempre. A un matemático de 26 años llamado
<b>Edward Oakley Thorp</b> no le convencía el folklore — él creía en el cálculo. Esta es la historia
que cuenta el libro, y es la razón de que hoy estés leyendo una web sobre ella.</p>

<div class="keyideas">
  <div class="keyidea"><strong>La idea</strong>El blackjack no es un juego de intentos independientes.
  Las cartas salen del mazo y no vuelven: las probabilidades de cada mano futura dependen de
  qué cartas se han ido.</div>
  <div class="keyidea"><strong>El método</strong>Thorp no adivinó. Programó un ordenador IBM 704
  para jugar millones de manos y extrajo una estrategia exacta.</div>
  <div class="keyidea"><strong>La prueba</strong>Probó la estrategia en Nevada con dinero real —
  y ganó.</div>
  <div class="keyidea"><strong>La consecuencia</strong>Los casinos reescribieron su propio juego
  para sobrevivir. Toda la industria moderna del "juego con ventaja" nace de este libro.</div>
</div>

<h2>La línea del tiempo</h2>
<div class="timeline">
  <div class="tl-item"><span class="tl-year">1956</span><p>El matemático de Bell Labs
  John L. Kelly Jr. publica <em>"A New Interpretation of Information Rate"</em>: una fórmula
  para el tamaño óptimo de apuesta que más tarde alimentará la gestión del dinero del libro.</p></div>
  <div class="tl-item"><span class="tl-year">1958–60</span><p>Thorp, profesor joven en el MIT,
  lee los primeros análisis matemáticos del blackjack, encuentra agujeros en ellos y consigue
  horas de cómputo en un IBM 704. Simula el juego con las reglas exactas y calcula el valor
  esperado de cada jugada posible.</p></div>
  <div class="tl-item"><span class="tl-year">1962</span><p>Se publica <em>Beat the Dealer</em>.
  El sistema estrella es el <b>Ten-Count</b>: suficientemente simple para un ser humano bajo
  presión, suficientemente exacto para vencer al casino. Las salas de cartas de Nevada se
  vacían de matemáticos con maletín.</p></div>
  <div class="tl-item"><span class="tl-year">1964</span><p>Los casinos reaccionan: barajados
  anticipados, nuevas reglas, incluso un intento de "conferencia de prensa" para ridiculizar el
  conteo. La mayoría de los cambios se revierte: los jugadores normales dejan de venir. El
  blackjack queda alterado para siempre.</p></div>
  <div class="tl-item"><span class="tl-year">1966</span><p>Segunda edición: Julian Braun refina
  las tablas con más cómputo y Thorp adopta el <b>Hi-Lo</b>, el sistema que usarán desde entonces
  casi todos los profesionales.</p></div>
  <div class="tl-item"><span class="tl-year">Después</span><p>Kelly vuelve a aparecer cuando
  Thorp lleva la gestión del dinero a Wall Street. El mismo razonamiento que venció a los
  casinos acabará valorando derivados financieros. Todo empezó con un mazo de cartas.</p></div>
</div>

<h2>Por qué esta historia importa para aprender</h2>
<p>Porque la moraleja no es "haz trampas": es <b>mide</b>. Thorp venció porque tradujo un juego
de opiniones en un juego de números — y entonces los números se pudieron entrenar. Cada
capítulo de esta web sigue el mismo camino: primero la regla, luego por qué la matemática la
permite, después cómo se entrena y al final cómo se sobrevive a los humanos que te vigilan.</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>El orden de aprendizaje importa más
que la velocidad. Reglas → estrategia básica → conteo → apuestas. Saltarse la básica para "ir
directo al conteo" es construir un tejado sin paredes: el conteo solo monetiza lo que la básica
protege.</span></div>` },

      /* ============ 2 · LAS REGLAS ============ */
      rules: {
        title: "Veintiuno: las reglas del juego",
        kicker: "Fundamentos",
        book: "Capítulo 2 · Las reglas del blackjack",
        tagline: "No puedes vencer un juego que no entiendes al nivel de sus restricciones.",
        html: `
<p class="lede">Veintiuno se juega contra el <b>crupier</b>, no contra los otros jugadores. Cada
uno recibe dos cartas; el crupier muestra una y guarda otra boca abajo. Tu objetivo: un total
más cerca de 21 que el suyo — <b>sin pasarse</b>. El error clásico del principiante es creer que
debe acercarse a 21. No. Debe <b>vencer al crupier</b>, y a veces 14 basta.</p>

<div class="keyideas">
  <div class="keyidea"><strong>Valor de las cartas</strong>2–10 valen su número. J, Q, K valen 10.
  El As vale <b>11 o 1</b> — lo que más te convenga, decidido en cada mano.</div>
  <div class="keyidea"><strong>El natural</strong>As + carta de valor 10 en las dos primeras cartas:
  "blackjack", pagado <b>3 a 2</b>. El crupier también puede hacerlo.</div>
  <div class="keyidea"><strong>Mano dura / blanda</strong>Con un As contado como 11 la mano es
  <em>blanda</em> y no puede pasarse con la siguiente carta. Sin As-11, la mano es <em>dura</em>
  y cada carta puede hundirla.</div>
</div>

<h2>Las jugadas que puedes hacer</h2>
<ul>
  <li><b>Pedir (hit)</b> — tomar otra carta. Repite hasta plantarte o pasarte.</li>
  <li><b>Plantarse (stand)</b> — detenerse. El crupier revela su carta oculta y juega su mano.</li>
  <li><b>Doblar (double)</b> — solo con las dos primeras cartas: duplicas tu apuesta a cambio de
  <b>exactamente una</b> carta más y te plantas. Arma de alto voltaje.</li>
  <li><b>Dividir (split)</b> — con dos cartas iguales: las separas en dos manos y apostando lo
  mismo en cada una. El As dividido suele admitir una sola carta más.</li>
  <li><b>Seguro (insurance)</b> — si el crupier muestra un As, puedes asegurar hasta la mitad de
  tu apuesta de que su carta oculta es un diez (paga 2 a 1). Capítulo 3 demuestra cuándo es
  matemática y cuándo deseo.</li>
</ul>

<h2>Las reglas del crupier</h2>
<p>El crupier no elige: <b>debe pedir con 16 o menos y plantarse con 17 o más</b> (o pedir con
soft 17 en las variantes "H17" — esta web calcula ambas). Esta obligación es la grieta por la
que entrará todo el ventaja del libro: el crupier juega a ciegas y a la fuerza, tú juegas con
información y elección.</p>

<div class="panel" data-widget="dealDemo"></div>

<h2>Las dos primeras lecciones de las manos</h2>
<p><span class='tcard'>10</span><span class='tcard red'>7</span> = 17 duro — plantarse; pedir solo
puede hundirte. <span class='tcard'>A</span><span class='tcard red'>7</span> = 18 blando: el As
puede convertirse en 1, así que pedir aquí <em>no puede romper</em> la mano. Y
<span class='tcard'>A</span><span class='tcard red'>7</span> + <span class='tcard red'>K</span>
sigue siendo 18 blando tras pedir — el As se degrada y la mano respira. Domina esta mecánica
antes de tocar una sola tabla.</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Antes de tu primera mano de
verdad, observa una mesa treinta minutos. Cuenta los totales de los demás en voz baja. Cuando
puedas anticipar el paso del crupier antes de que lo haga, estás listo para el capítulo 3.</span></div>` },

      /* ============ 3 · LAS MATEMÁTICAS ============ */
      why: {
        title: "Por qué el juego se puede vencer",
        kicker: "Las Matemáticas",
        book: "Introducción y apéndices",
        tagline: "La ruleta no tiene memoria. El blackjack lo recuerda todo.",
        html: `
<p class="lede">La ruleta gira sobre un cilindro sin memoria: cada tiro es el primero de siempre.
El blackjack no. <b>Las cartas repartidas quedan fuera del juego</b>, así que el mazo restante
cambia su composición — y las probabilidades de cada mano futura se mueven con él. Esa es la
memoria del blackjack, y toda la ventaja del libro vive en explotarla.</p>

<h2>El primer efecto visible: la quiebra del crupier</h2>
<p>Como el crupier está obligado a pedir con 16 o menos, su destino depende en gran medida de
cuántas dieces quedan por salir. Compruébalo con datos calculados en vivo:</p>

<div class="panel" data-widget="bustChart"></div>

<p>El patrón es brutal: contra un <span class='tcard red'>6</span> el crupier quiebra alrededor de
un 42% de las veces; contra un <span class='tcard'>A</span>, menos de la mitad de eso. La
estrategia básica del capítulo 4 no es un catálogo de opiniones — es esta gráfica convertida
en decisiones.</p>

<h2>El segundo efecto: los naturales se amontonan</h2>
<p>El natural paga 3 a 2, pero el crupier no recibe bono por el suyo. Cuantos más ases y dieces
floten en el mazo restante, más naturales tuyos y menos suyos. Los mazos ricos en dieces son
el día de cobro del contador:</p>

<div class="panel" data-widget="naturalCalc"></div>

<h2>El seguro, la primera jugada "de contador"</h2>
<p>El seguro es una apuesta de que la carta oculta es un diez. Con un mazo fresco, la densidad
de dieces es 16/52 ≈ 30,8% — por debajo del punto de equilibrio del 1/3, así que el seguro es
una apuesta perdedora. Pero la densidad <b>se mueve</b>: cuando los diez-valores vistos quedan
atrás y la densidad supera 1/3, el seguro se convierte en la primera jugada que el conteo
"posee". El umbral práctico multidez es ≈ +3 en recuento verdadero Hi-Lo.</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Memoriza un solo número de esta
lección: contra el 6, el crupier quiebra ~42%. Cada vez que dudes de una decisión básica,
pregúntate: "¿estoy ayudando o estorbando a la obligación del crupier de pedir?" La mayoría de
las respuestas de la tabla salen solas.</span></div>` },

      /* ============ 4 · LA ESTRATEGIA BÁSICA ============ */
      basic: {
        title: "La estrategia básica",
        kicker: "Sistema núcleo",
        book: "Capítulo 3 · La estrategia básica",
        tagline: "Antes de contar una sola carta, deja de perder dinero que no tienes que perder.",
        html: `
<p class="lede">La estrategia básica responde a una pregunta para cada combinación posible: tu
total contra la carta vista del crupier. No es un consejo — es una <b>comparación de valores
esperados</b>. El motor de esta web calcula cada celda en vivo: pide, plantarse, doblar o
dividir, gana lo que gana. La tabla de abajo <em>no está copiada</em>; se computa en tu
navegador al cargar la página.</p>

<div class="panel" data-widget="strategyTable"></div>

<h2>Cómo leerla</h2>
<p>Filas: tu total (duro, blando, parejas). Columnas: la carta vista del crupier, del
<span class='tcard'>A</span> al <span class='tcard'>10</span>. La celda te dice la jugada con
mayor valor esperado. Las diferencias entre la era de Thorp (un mazo, el crupier se planta con
soft 17, doblar tras dividir prohibido) y el juego moderno multidez están <em>calculadas</em> —
cambia el preajuste de la tabla y mira moverse las celdas.</p>

<h2>Las tres regiones que debes dominar primero</h2>
<ul>
  <li><b>Manos duras de 12 a 16</b> — el territorio del dolor. Contra cartas débiles del crupier
  (4, 5, 6) casi siempre te plantas y dejas que el crupier se ahogue en su obligación de pedir.
  Contra 7, 8, 9, 10 o As pides: necesitas mejorar porque él probablemente mejorará.</li>
  <li><b>Manos blandas</b> — aquí la intuición de la gente muere. Con
  <span class='tcard'>A</span><span class='tcard red'>7</span> (18 blando) el juego moderno dice
  <em>doblar</em> contra 3–6 y pedir contra 9, 10 y As: 18 fijo no gana lo bastante a menudo.
  Como el As se degrada, nunca puedes romper la mano — la agresión es gratuita.</li>
  <li><b>Parejas</b> — casi todo se juega con "divide Ases y ochos, nunca dieces". Los
  <span class='tcard'>A</span><span class='tcard'>A</span> buscan el natural que paga 3:2; los
  <span class='tcard'>10</span><span class='tcard'>10</span> ya son 20, una mano que gana sola.</li>
</ul>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Aprende por orden de rentabilidad:
doblar, luego manos duras, luego parejas, luego blandas. Doble es la fila que más puntos
porcentuales te devuelve y la más fácil de memorizar — y verbaliza cada jugada mientras
entrenas: "12 contra 4: plantarse". La boca enseña al dedo.</span></div>` },

      /* ============ 5 · EL TEN-COUNT ============ */
      tencount: {
        title: "El Ten-Count",
        kicker: "Sistema I",
        book: "Primera edición · la estrategia ganadora de 1962",
        tagline: "El sistema que vació un centenar de salas de cartas: cuenta solo lo que importa — los dieces.",
        html: `
<p class="lede">El sistema original de 1962 es un monumento a la economía. Un mazo tiene 20
cartas que valen diez (10, J, Q, K) y 32 que no. Thorp asigna a cada grupo un peso:
<b>+4</b> por cada carta <em>no</em>-diez vista, <b>−9</b> por cada diez vista. Cuando las no-dieces
restantes superan 2 a 1 a las dieces — el mazo está rico — el contador apuesta grande. Esa es
toda la máquina: una razón, dos números, un triggered.</p>

<div class="panel" data-widget="countWalkthrough" data-sys="tencount"></div>

<h2>Por qué funciona</h2>
<p>La razón entre no-dieces y dieces es todo lo que necesitas: decide la densidad de dieces, y
la densidad de dieces decide los naturales (tu ventaja del 3:2), las quiebras del crupier y la
rentabilidad de los doblajes. El Ten-Count es "total-dependiente": no necesita las cartas
exactas, solo el cociente. Un contador entrenado lleva el mazo completo en ~30 segundos —
y cada mazo vuelve exactamente a cero, que es la autocorrección más elegante jamás diseñada.</p>

<h2>La apuesta</h2>
<p>El libro escala la apuesta con la ventaja: mientras la razón se mantenga cerca de la neutra
(2,0), apuesta una unidad; a medida que el mazo se hace rico, sube por escalones. El detalle
genial del Ten-Count es que <em>la razón es la apuesta</em>: no hay recuento verdadero, no hay
división de mazos, no hay aritmética bajo presión — solo ¿son las no-dieces más del doble de
las dieces?</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Entrena contando en parejas: dos
cartas vistas, un solo paso mental. Una A y un 4 son +4 y −1: tres de golpe. Un mazo se vuelve
16 pasos, no 52 — y ahí empieza el conteo a velocidad de casino.</span></div>` },

      /* ============ 6 · HI-LO ============ */
      hilo: {
        title: "El conteo Hi-Lo",
        kicker: "Sistema II",
        book: "Segunda edición (1966) · el conteo de puntos simple",
        tagline: "El ordenador de Julian Braun, la simplificación de Thorp: el sistema de conteo que conquistó el mundo.",
        html: `
<p class="lede">La segunda edición cambió el sistema por uno que un humano podía sostener durante
una sesión de seis horas: <b>Hi-Lo</b>, balanceado y de nivel uno. Cada carta vale −1, 0 o +1:
2–6 son <b>+1</b>, 7–9 son <b>0</b>, dieces y ases son <b>−1</b>. Suma todos los valores y el mazo
completo vuelve a cero — por eso se llama balanceado.</p>

<div class="panel" data-widget="tcConverter"></div>

<h2>Del recuento corrido al recuento verdadero</h2>
<p>El <b>recuento corrido</b> (running count) es la suma desde el último barajado. Pero un +6 en
la primera docena de un zapato de ocho mazos no significa nada — apenas se ha gastado el mazo.
Divide por los <b>mazos restantes estimados</b> y obtienes el <b>recuento verdadero</b>: la
densidad real que pone precio a tu apuesta y a tus jugadas. La conversión es la única
división del sistema y la fuente número uno de errores de principiante: estima los mazos
restantes por el descarte, no por la esperanza.</p>

<h2>Qué hace el recuento verdadero</h2>
<ul>
  <li><b>Precia la apuesta</b> — la regla práctica multidez: cada punto de TC añade ~0,5% de
  ventaja al jugador (aproximación documentada). TC −2: apuesta mínima o fuera de la mesa.
  TC +4: apuesta grande.</li>
  <li><b>Mueve jugadas</b> — el seguro se activa cerca de +3; algunas jugadas rígidas como
  16 contra 10 se plantan a TC altos. Los umbrales exactos <em>difieren</em> entre el juego de
  un mazo de 1962 y los zapatos modernos — aquí se calculan, no se copian.</li>
</ul>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Practica la conversión aparte: pide a
alguien que grite un recuento corrido y un número de mazos ("+11, tres mazos") y responde el
verdadero en un segundo (+3,7 ≈ +4). El conteo es memoria; la conversión es matemática
de quirófano. Entrénalas por separado.</span></div>` },

      /* ============ 7 · EL CONTEO COMPLETO ============ */
      complete: {
        title: "El conteo de puntos completo",
        kicker: "Sistema III",
        book: "Segunda edición · las tablas refinadas de Braun",
        tagline: "Más precisión, más categorías de peso, más trabajo. Sabe lo que compra — y lo que cuesta.",
        html: `
<p class="lede">Entre el Ten-Count y el Hi-Lo hay todo un zoológico de conteos de nivel dos y
tres: más pesos, más precisión por carta, más carga mental. El "punto completo" del libro
representa esa familia. Su premisa: no todas las cartas importan igual — <b>el As</b> alimenta
naturales (pagados 3:2) mientras que <b>el 5</b> es el combustible favorito del crupier (le evita
la quiebra y bloquea doblajes débiles).</p>

<div class="panel" data-widget="cardValueCompare"></div>

<h2>Lo que compra la precisión extra</h2>
<p>Un conteo de nivel dos extrae más ventaja por unidad de densidad y permite desviaciones de
jugada más finas — algunas decisiones de manos blandas y de doblaje cambian con la
composición exacta, no solo con la densidad agregada. La comparación de arriba lo enseña: dale
a la misma composición a dos sistemas y mira cómo difieren sus veredictos.</p>

<h2>Lo que cuesta</h2>
<p>Cada peso adicional es un canal mental más. Los errores de conteo cuestan más que la
precisión gana: un contador de nivel dos con un 2% de error es <em>peor</em> que un contador
Hi-Lo impecable. Thorp lo sabía — y por eso el libro recomendó el Hi-Lo a casi todos los
lectores. La lección no es "más complejo, mejor": es <b>el mejor sistema es el que ejecutas sin
fallar a velocidad de mesa</b>.</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Si algún día escalas a un conteo con
pesos distintos, cuenta primero los ases aparte (conteo secundario de ases). Los ases deciden
la rentabilidad de la apuesta; los dieces, la de las jugadas. Separarlos es más barato que
fusionarlos.</span></div>` },

      /* ============ 8 · DINERO ============ */
      money: {
        title: "Apuestas y gestión del dinero",
        kicker: "Capital",
        book: "Capítulos de apuestas · el criterio de Kelly",
        tagline: "Una ventaja mal apostada es una ventaja que no tienes. El tamaño es la mitad del sistema que nadie filma.",
        html: `
<p class="lede">Contar cartas produce una ventaja pequeña y débilmente señalada: alrededor de un
0,5% por punto de recuento verdadero en el juego moderno (aproximación), y una desviación
típica de <b>1,15 apuestas por mano</b>. La varianza domina el corto plazo con saña: con
ventaja del 1%, tu posición negativa más probable a 100 manos sigue siendo una racha que
parece una mala noche. La pregunta del capítulo no es "¿tengo ventaja?" sino <b>"¿sobreviviré
hasta que la ventaja hable?"</b></p>

<h2>La respuesta: el criterio de Kelly</h2>
<p>En 1956, John Kelly Jr. derivó la fracción de capital que maximiza el crecimiento a largo
plazo: <b>f* = ventaja ÷ varianza</b>. Thorp la importó al blackjack en la misma década y
después a Wall Street. Su consecuencia incómoda: la fracción correcta es casi siempre
<em>menor</em> que la que tu estómago pide, y sobreapostar no es valiente — matemáticamente es
idéntico a subapostar un enemigo que no existe: quema crecimiento sin recompensa.</p>

<div class="panel" data-widget="kellyCalc"></div>

<h2>La rampa</h2>
<p>La apuesta practica la teoría: mínimo de mesa (o nada) en recuentos negativos, y sube por
escalones con el TC, con un techo dictado por tu presupuesto y tu tolerancia al heat. El
resultado parece una rampa, no un cuchillo — porque el objetivo no es impresionar a nadie, es
<em>componer</em> crecimiento geométrico con supervivencia.</p>

<div class="panel" data-widget="fluctChart"></div>

<p>La gráfica enseña la lección de las mil noches: dos jugadores con la misma ventaja y
distinto tamaño de apuesta viven carreras distintas. El agresivo muestra picos y pozos que
rompen presupuestos; el Kelly mantiene el zigzag dentro de lo tolerable y compone. Cuando el
cruce de ventaja y suerte llega (~13.225 manos al 1% de ventaja), el jugador sobreviviente es
el que sigue ahí.</p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Dimensiona la apuesta desde el
presupuesto, nunca desde el humor. Las rachas malas no son información sobre tu ventaja — son
varianza ejecutando su oficio. Si tu presupuesto no aguanta 100 apuestas máximas, tu techo de
Kelly es más bajo de lo que crees.</span></div>` },

      /* ============ 9 · SUPERVIVENCIA ============ */
      survival: {
        title: "Supervivencia en el casino: camuflaje, heat y trampas",
        kicker: "Oficio",
        book: "Capítulos de camuflaje y trampas",
        tagline: "La última lección del libro no es matemática. Son las personas.",
        html: `
<p class="lede">El libro termina donde los libros de matemáticas no llegan: en la mesa, con gente
mirando. La ventaja cuenta solo si el casino te deja cobrarla — y los casinos tienen dos
herramientas: <b>el heat</b> (sospecha) y <b>la historia</b> de los juegos amañados. Thorp dedica
capítulos enteros a ambas, y sesenta años después siguen siendo el manual.</p>

<h2>Heat y barring</h2>
<p>Contar cartas es legal: es pensar. Pero un casino es un negocio privado y puede negarse a tu
acción — desde barajados anticipados hasta la expulsión cortés ("barring"). Los contadores
experimentados gestionan el heat como gestionan la varianza: con presupuesto. Sesiones cortas,
pits rotativos, apuestas que no gritan.</p>

<h2>Camuflaje</h2>
<p>El camuflaje es personalidad, no aritmética: parecer un jugador y no un ordenador. Charla,
propinas, errores deliberados y pequeños <em>a apuesta mínima</em>, historias de mala suerte.
Cada gesto compra anonimato pagado en ventaja — el camuflaje también tiene su curva de Kelly.</p>

<h2>El lado oscuro de la época: los juegos amañados</h2>
<p>Las salas de 1962 no solo temían a los matemáticos: albergaban tramposos. Thorp documenta
los tres clásicos — y esta web los convierte en un juego de entrenamiento:</p>
<ul>
  <li><b>El mazo frío</b> — un mazo preparado entra en el barajado para fabricar rachas
  perdedoras. Firma: resultados imposibles en racha.</li>
  <li><b>Cartas marcadas</b> — pinchazos, sombras y brillos leen los dorsos desde la silla de
  enfrente.</li>
  <li><b>La segunda carta</b> — el crupier sirve la segunda fingiendo servir la primera. Se mira
  en el agarre, no en los resultados.</li>
</ul>

<div class="panel" data-widget="spotTheCheat"></div>

<p>La defensa moderna existe y es estructural: reglas publicadas, mazos visibles, auditoría,
cámaras. Pero la lección del libro no caduca: <b>si el juego te paga de forma que no puedes
verificar, no es un juego — es una historia.</b></p>

<div class="protip"><span class="pt-tag">💡 Consejo pro</span> <span>Parece un jugador, piensa como un
contable. El camuflaje más barato es el tipo de jugador: apuesta mínima, propina, charla, y
salir cuando el conteo cae sin suspiro dramático. Nadie fotografía a los que se van aburriendo.</span></div>` },
    },
  });
})();
