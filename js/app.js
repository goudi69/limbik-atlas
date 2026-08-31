/* Limbik·Atlas — Interaktivität (Profi-Ausgabe) */
(function () {
  "use strict";

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ============ Tafel I: Hover/Klick-Highlight ============ */
  var plate = document.getElementById("brainPlate");
  var legend = document.getElementById("plateLegend");

  function highlight(s) {
    if (!plate) return;
    var any = false;
    plate.querySelectorAll(".pl-s").forEach(function (el) {
      var on = s && el.dataset.s === s;
      el.classList.toggle("is-active", !!on);
      if (on) any = true;
    });
    plate.querySelectorAll(".pl-label").forEach(function (el) {
      el.classList.toggle("is-active", !!(s && el.dataset.s === s));
    });
    plate.classList.toggle("has-active", !!(s && any));
    if (legend) {
      legend.querySelectorAll("li").forEach(function (li) {
        var btn = li.querySelector("button");
        li.classList.toggle("is-active", !!(s && btn && btn.dataset.s === s));
      });
    }
    document.querySelectorAll(".s-item").forEach(function (item) {
      item.classList.toggle("is-active", !!(s && item.dataset.s === s));
    });
  }

  var currentS = null;
  function toggleHighlight(s) {
    currentS = currentS === s ? null : s;
    highlight(currentS);
  }

  if (plate) {
    plate.querySelectorAll(".pl-s, .pl-label:not(.pl-label-passive)").forEach(function (el) {
      el.addEventListener("click", function () { toggleHighlight(el.dataset.s); });
    });
  }
  if (legend) {
    legend.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () { toggleHighlight(btn.dataset.s); });
    });
  }
  document.querySelectorAll(".s-item").forEach(function (item) {
    var dt = item.querySelector("dt");
    if (dt) dt.addEventListener("click", function () { toggleHighlight(item.dataset.s); });
    item.addEventListener("mouseenter", function () { if (!currentS) highlight(item.dataset.s); });
    item.addEventListener("mouseleave", function () { if (!currentS) highlight(null); });
  });

  /* ============ Tafel V: Papez-Stationen ============ */
  var papezPlate = document.getElementById("papezPlate");
  var papezDetail = document.getElementById("papezDetail");

  var PAPEZ_INFO = {
    hippocampus: {
      step: "Station 1 & 7", name: "Hippocampus",
      text: "Start und Ziel der Schleife. Der Inhalt kreist zunächst intern (Cornu ammonis, Gyrus dentatus — Tafel IV) und verlässt den Hippocampus dann nach hinten über den Fornix."
    },
    fornix: {
      step: "Station 2", name: "Fornix — das Gewölbe",
      text: "Der große Efferenzbogen: unter dem Balken entlang nach rostral. Fast alle Informationen, die den Hippocampus verlassen, nehmen diesen Weg — Endstation Corpora mamillaria."
    },
    mamillaria: {
      step: "Station 3", name: "Corpora mamillaria",
      text: "Paarige Kerne des kaudalen Hypothalamus, direkt hinter der Hypophyse. Hier kommt der Fornix an; weiter geht es über das Vicq-d'Azyr-Bündel (Tractus mamillothalamicus) nach oben."
    },
    thalamus: {
      step: "Station 4", name: "Nuclei anteriores thalami",
      text: "Der fürs limbische System reservierte Teil des Thalamus. Von hier will die Information zurück zum Hippocampus — aber der Kreis ist eine Einbahnstraße: Der Rückweg durch den Fornix ist versperrt."
    },
    cinguli: {
      step: "Station 5", name: "Gyrus cinguli",
      text: "Also obenrum: Die Gürtelwindung über dem Balken trägt die Information im weiten Bogen nach hinten — der erste Teil des „Doppel-Gyros“."
    },
    parahippo: {
      step: "Station 6", name: "Gyrus parahippocampalis",
      text: "Hinten um das Splenium herum geht der Gyrus cinguli in diese Windung über; sie liegt direkt am Hippocampus und führt die Information wieder hinein. Kreis geschlossen — die Konsolidierung rotiert."
    }
  };

  function showStation(key) {
    var info = PAPEZ_INFO[key];
    if (!info || !papezPlate || !papezDetail) return;
    papezPlate.querySelectorAll(".loop-st").forEach(function (o) {
      o.classList.toggle("is-active", o.dataset.st === key);
    });
    papezDetail.innerHTML =
      '<p class="pd-title"><span class="pd-step">' + info.step + "</span>" + info.name + "</p>" +
      "<p>" + info.text + "</p>";
  }

  if (papezPlate && papezDetail) {
    papezPlate.querySelectorAll(".loop-st").forEach(function (st) {
      st.addEventListener("click", function () { stopLoopPlay(); showStation(st.dataset.st); });
      st.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stopLoopPlay(); showStation(st.dataset.st); }
      });
    });
  }

  /* --- Schleife abspielen: ein Impuls durchläuft den Papez-Kreis --- */
  var loopPlayBtn = document.getElementById("loopPlay");
  var loopState = { raf: null, timer: null, pulse: null, playing: false };
  var STATION_SEQ = ["hippocampus", "fornix", "mamillaria", "thalamus", "cinguli", "parahippo"];

  function stopLoopPlay() {
    if (!loopState.playing) return;
    if (loopState.raf) cancelAnimationFrame(loopState.raf);
    if (loopState.timer) clearInterval(loopState.timer);
    if (loopState.watchdog) clearTimeout(loopState.watchdog);
    if (loopState.pulse && loopState.pulse.parentNode) loopState.pulse.parentNode.removeChild(loopState.pulse);
    loopState = { raf: null, timer: null, watchdog: null, pulse: null, playing: false };
    if (loopPlayBtn) loopPlayBtn.textContent = "▶ Schleife abspielen";
  }

  function finishLoopPlay() {
    stopLoopPlay();
    papezPlate.querySelectorAll(".loop-st").forEach(function (o) { o.classList.remove("is-active"); });
    papezDetail.innerHTML =
      '<p class="pd-title"><span class="pd-step">Kreis geschlossen</span>Zurück im Hippocampus</p>' +
      "<p>Die Information ist einmal komplett rotiert — und startet von hier die nächste Runde, bis der Inhalt kortikal verankert ist. Genau diese Rotation ist die Konsolidierung.</p>";
  }

  function startLoopPlay() {
    if (!papezPlate || loopState.playing) return;
    var svg = papezPlate.querySelector("svg");
    var segs = Array.prototype.slice.call(papezPlate.querySelectorAll(".loop .loop-path"));
    if (!svg || segs.length !== 3) return;
    loopState.playing = true;
    loopPlayBtn.textContent = "◼ Stopp";

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Ohne Bewegung: Stationen nacheinander durchschalten
      var i = 0;
      showStation(STATION_SEQ[0]);
      loopState.timer = setInterval(function () {
        i++;
        if (i < STATION_SEQ.length) { showStation(STATION_SEQ[i]); }
        else { finishLoopPlay(); }
      }, 1600);
      return;
    }

    var l1 = segs[0].getTotalLength(), l2 = segs[1].getTotalLength(), l3 = segs[2].getTotalLength();
    var total = l1 + l2 + l3;
    // Auslösepunkte der Stationen entlang der Gesamtstrecke
    var marks = [
      { key: "hippocampus", at: 0 },
      { key: "fornix", at: l1 * 0.45 },
      { key: "mamillaria", at: l1 * 0.97 },
      { key: "thalamus", at: l1 + l2 * 0.14 },
      { key: "cinguli", at: l1 + l2 * 0.62 },
      { key: "parahippo", at: l1 + l2 + l3 * 0.55 }
    ];
    var nextMark = 0;

    var pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pulse.setAttribute("r", "8");
    pulse.setAttribute("class", "loop-pulse");
    svg.appendChild(pulse);
    loopState.pulse = pulse;

    var DURATION = 9500; // ms für eine Runde
    var t0 = performance.now();
    loopState.watchdog = setTimeout(function () { if (loopState.playing) finishLoopPlay(); }, DURATION + 800);
    function frame(now) {
      if (!loopState.playing) return;
      var p = Math.min((now - t0) / DURATION, 1);
      var d = p * total;
      var pt;
      if (d <= l1) pt = segs[0].getPointAtLength(d);
      else if (d <= l1 + l2) pt = segs[1].getPointAtLength(d - l1);
      else pt = segs[2].getPointAtLength(Math.min(d - l1 - l2, l3));
      pulse.setAttribute("cx", pt.x);
      pulse.setAttribute("cy", pt.y);
      while (nextMark < marks.length && d >= marks[nextMark].at) {
        showStation(marks[nextMark].key);
        nextMark++;
      }
      if (p < 1) { loopState.raf = requestAnimationFrame(frame); }
      else { finishLoopPlay(); }
    }
    loopState.raf = requestAnimationFrame(frame);
  }

  if (loopPlayBtn) {
    loopPlayBtn.addEventListener("click", function () {
      if (loopState.playing) { stopLoopPlay(); } else { startLoopPlay(); }
    });
  }

  /* ============ Sortierspiel ============ */
  var SG_ORDER = [
    { key: "hippocampus", label: "Hippocampus" },
    { key: "fornix", label: "Fornix" },
    { key: "mamillaria", label: "Corpora mamillaria" },
    { key: "thalamus", label: "Ncll. anteriores thalami" },
    { key: "cinguli", label: "Gyrus cinguli" },
    { key: "parahippo", label: "G. parahippocampalis" }
  ];
  var sgSlots = document.getElementById("sgSlots");
  var sgPool = document.getElementById("sgPool");
  var sgStatus = document.getElementById("sgStatus");
  var sgReset = document.getElementById("sgReset");
  var sgNext = 0, sgErrors = 0;

  function sgInit() {
    if (!sgSlots || !sgPool) return;
    sgNext = 0; sgErrors = 0;
    sgStatus.textContent = "";
    sgStatus.classList.remove("ok");
    sgSlots.innerHTML = "";
    sgPool.innerHTML = "";
    SG_ORDER.forEach(function () {
      var slot = document.createElement("div");
      slot.className = "sg-slot";
      sgSlots.appendChild(slot);
    });
    var pool = shuffle(SG_ORDER);
    if (pool.every(function (p, i) { return p.key === SG_ORDER[i].key; })) pool.reverse();
    pool.forEach(function (item) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sg-chip";
      chip.textContent = item.label;
      chip.dataset.key = item.key;
      chip.addEventListener("click", function () { sgPick(chip, item); });
      sgPool.appendChild(chip);
    });
  }

  function sgPick(chip, item) {
    if (item.key === SG_ORDER[sgNext].key) {
      chip.classList.add("used");
      var slot = sgSlots.children[sgNext];
      slot.textContent = item.label;
      slot.classList.add("filled");
      sgNext++;
      if (sgNext === SG_ORDER.length) {
        sgStatus.classList.add("ok");
        sgStatus.textContent = sgErrors === 0
          ? "Kreis geschlossen — fehlerfrei. Hipster wären stolz."
          : "Kreis geschlossen! (" + sgErrors + " Fehlversuch" + (sgErrors === 1 ? "" : "e") + " — nochmal mischen?)";
      } else {
        sgStatus.textContent = "Richtig — weiter geht's.";
      }
    } else {
      sgErrors++;
      chip.classList.remove("wrong");
      void chip.offsetWidth;
      chip.classList.add("wrong");
      sgStatus.textContent = "Nicht ganz — denk an den Merkspruch.";
    }
  }

  if (sgReset) sgReset.addEventListener("click", sgInit);
  sgInit();

  /* ============ Testat ============ */
  var QUIZ = [
    {
      q: "Welcher zelluläre Mechanismus stabilisiert Gedächtnisinhalte im Hippocampus?",
      opts: ["Langzeitpotenzierung (LTP)", "Laterale Inhibition", "Saltatorische Erregungsleitung", "Neurogenese im Kortex"],
      correct: 0,
      expl: "Wiederholte Aktivierung derselben Synapsen verstärkt deren Übertragung langfristig — LTP gilt als zelluläres Korrelat des Lernens und der Konsolidierung."
    },
    {
      q: "Papez-Kreis: Über welche Struktur verlassen Informationen den Hippocampus?",
      opts: ["Fornix", "Stria terminalis", "Gyrus cinguli", "Corpus callosum"],
      correct: 0,
      expl: "Der Fornix („Gewölbe“) ist der Hauptausgang: im Bogen unter dem Balken nach rostral zu den Corpora mamillaria — „Hipster fordern …“."
    },
    {
      q: "Die Corpora mamillaria gehören zu welcher übergeordneten Struktur?",
      opts: ["Hypothalamus (Diencephalon)", "Thalamus", "Temporallappen", "Mesencephalon"],
      correct: 0,
      expl: "Die Mamillarkörper sind Kerne des kaudalen Hypothalamus, direkt hinter der Hypophyse — und Hauptzielgebiet des Fornix."
    },
    {
      q: "Welche Station folgt im Papez-Kreis auf den Gyrus cinguli?",
      opts: ["Gyrus parahippocampalis", "Fornix", "Corpora mamillaria", "Nuclei anteriores thalami"],
      correct: 0,
      expl: "Reihenfolge: Hippocampus → Fornix → Corpora mamillaria → Ncll. anteriores → Gyrus cinguli → Gyrus parahippocampalis → Hippocampus."
    },
    {
      q: "Warum nimmt die Schleife den Rückweg „obenrum“ über den Gyrus cinguli?",
      opts: [
        "Die Verschaltung ist gerichtet — rückwärts durch den Fornix geht es nicht.",
        "Der Fornix ist zu langsam für den Rückweg.",
        "Der Gyrus cinguli ist die kürzeste Verbindung.",
        "Wegen der Kreuzung zur Gegenseite im Balken."
      ],
      correct: 0,
      expl: "Der Kreis funktioniert als Einbahnstraße: Von den vorderen Thalamuskernen führt der Weg über Gyrus cinguli und Gyrus parahippocampalis zurück."
    },
    {
      q: "Was wurde bei Patient H.M. operativ entfernt?",
      opts: [
        "Beidseits mediale Temporallappenanteile einschließlich Hippocampus",
        "Der präfrontale Kortex beidseits",
        "Einseitig der linke Temporallappen",
        "Der vordere Thalamus"
      ],
      correct: 0,
      expl: "Die beidseitige mediale Temporallappenresektion (1953, gegen therapieresistente Epilepsie) durchtrennte die Konsolidierungsschleife — Corkin, 2002."
    },
    {
      q: "Wie klassifiziert man H.M.s Gedächtnisstörung präzise?",
      opts: [
        "Anterograde Amnesie für deklarative Inhalte bei erhaltenem implizitem Gedächtnis",
        "Retrograde Amnesie für episodische Inhalte",
        "Globale Amnesie einschließlich prozeduraler Fertigkeiten",
        "Semantische Demenz"
      ],
      correct: 0,
      expl: "Neue deklarative Inhalte (semantisch + episodisch) konnten nicht mehr konsolidiert werden; prozedurales Lernen blieb intakt — die klassische Dissoziation (Tafel VII)."
    },
    {
      q: "Über welche Faserbahn alarmiert die Amygdala den Hypothalamus?",
      opts: ["Stria terminalis", "Fornix", "Tractus mamillothalamicus", "Fasciculus longitudinalis medialis"],
      correct: 0,
      expl: "Die Stria terminalis zieht — bogenförmig wie der Fornix, aber ohne weitere Umschaltung — von der Amygdala zum Hypothalamus, der Steuerzentrale des vegetativen Nervensystems."
    },
    {
      q: "Beidseitige Verkalkung der Amygdala (Urbach-Wiethe-Syndrom) führt typischerweise zu …",
      opts: [
        "… fehlender Furchtreaktion bei eingeschränktem Gefühls- und Sozialleben.",
        "… kompletter anterograder Amnesie.",
        "… gesteigerter Angst und Panikattacken.",
        "… Verlust des Kurzzeitgedächtnisses."
      ],
      correct: 0,
      expl: "Betroffene kennen praktisch keine Angst — objektiv gefährlich; und weil die Amygdala weitere Aufgaben trägt, leiden auch Emotionalität und Sozialverhalten."
    },
    {
      q: "Orientierung im Gehirnschnitt: Welche limbischen Strukturen folgen dem C-Bogen der Seitenventrikel?",
      opts: [
        "Hippocampus und Fornix — die Stria terminalis läuft am Ncl. caudatus mit",
        "Amygdala und Hypophyse",
        "Gyrus cinguli und Indusium griseum",
        "Corpora mamillaria und Septum"
      ],
      correct: 0,
      expl: "Der Trick von Tafel X: erst die Seitenventrikel suchen. Ihr Bogen führt zu Hippocampus (Unterhorn) und Fornix; die Stria terminalis zieht mit dem Ncl. caudatus."
    }
  ];

  var quizRoot = document.getElementById("quizRoot");
  var quizScore = document.getElementById("quizScore");
  var quizReset = document.getElementById("quizReset");
  var quizState = { answered: 0, right: 0 };

  function renderQuiz() {
    if (!quizRoot) return;
    quizState = { answered: 0, right: 0 };
    quizRoot.innerHTML = "";
    updateScore();
    QUIZ.forEach(function (item, qi) {
      var card = document.createElement("article");
      card.className = "q-item";

      var h = document.createElement("h3");
      h.className = "q-q";
      var idx = document.createElement("span");
      idx.className = "q-idx";
      idx.textContent = String(qi + 1).padStart(2, "0");
      h.appendChild(idx);
      h.appendChild(document.createTextNode(item.q));
      card.appendChild(h);

      var optsWrap = document.createElement("div");
      optsWrap.className = "q-opts";

      var order = shuffle(item.opts.map(function (_, i) { return i; }));
      order.forEach(function (oi) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.textContent = item.opts[oi];
        btn.addEventListener("click", function () {
          if (card.classList.contains("answered")) return;
          card.classList.add("answered");
          quizState.answered++;
          if (oi === item.correct) quizState.right++;
          optsWrap.querySelectorAll(".opt").forEach(function (b) {
            b.disabled = true;
            var bIdx = order[Array.prototype.indexOf.call(optsWrap.children, b)];
            if (bIdx === item.correct) b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          var ex = document.createElement("p");
          ex.className = "q-expl";
          ex.textContent = item.expl;
          card.appendChild(ex);
          updateScore();
        });
        optsWrap.appendChild(btn);
      });
      card.appendChild(optsWrap);
      quizRoot.appendChild(card);
    });
  }

  function updateScore() {
    if (!quizScore) return;
    var total = QUIZ.length;
    if (quizState.answered === 0) {
      quizScore.textContent = total + " Fragen — viel Erfolg.";
    } else if (quizState.answered < total) {
      quizScore.innerHTML = "<strong>" + quizState.right + "</strong> / " + quizState.answered + " richtig — noch " + (total - quizState.answered) + " offen.";
    } else {
      var msg = quizState.right === total ? " Bestanden mit Auszeichnung — Kreis geschlossen!"
        : quizState.right >= 7 ? " Bestanden. Der Rest kommt mit dem Merkspruch."
        : " Nochmal Tafel V ansehen — der Merkspruch trägt dich durchs Meiste.";
      quizScore.innerHTML = "Ergebnis: <strong>" + quizState.right + " / " + total + "</strong> ·" + msg;
    }
  }

  if (quizReset) quizReset.addEventListener("click", renderQuiz);
  renderQuiz();

  /* ============ Kino: eingebettetes Original ============ */
  var VIDEO_ID = "vIXBW-a9BWY";
  var kino = document.getElementById("kino");
  var kinoStage = document.getElementById("kinoStage");

  function kinoPlay(t) {
    if (!kinoStage) return;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + VIDEO_ID + "?start=" + t + "&autoplay=1&rel=0";
    iframe.title = "Video: Das limbische System — Neurologie mit Dr. Janis";
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    kinoStage.innerHTML = "";
    kinoStage.appendChild(iframe);
    document.querySelectorAll(".kino-ch").forEach(function (b) {
      b.classList.toggle("is-active", Number(b.dataset.t) === t);
    });
  }

  var poster = document.querySelector(".kino-poster");
  if (poster) poster.addEventListener("click", function () { kinoPlay(Number(poster.dataset.t) || 61); });
  document.querySelectorAll(".kino-ch").forEach(function (b) {
    b.addEventListener("click", function () { kinoPlay(Number(b.dataset.t)); });
  });
  document.querySelectorAll(".kino-link").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!kino) return;
      kinoPlay(Number(b.dataset.t));
      kino.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ============ Scroll-Reveal ============ */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
