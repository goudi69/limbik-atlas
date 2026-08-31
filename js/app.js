/* Limbik·Atlas — Interaktivität */
(function () {
  "use strict";

  var LEVELS = ["basis", "fortgeschritten", "profi"];
  var LS_KEY = "limbik-level";

  /* ============ Lernstufe ============ */
  function setLevel(level, opts) {
    if (LEVELS.indexOf(level) === -1) return;
    document.documentElement.setAttribute("data-level", level);
    document.querySelectorAll(".lvl-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.level === level));
    });
    document.querySelectorAll(".level-card").forEach(function (c) {
      c.classList.toggle("is-active", c.dataset.setLevel === level);
    });
    var label = document.getElementById("quizLevelLabel");
    if (label) label.textContent = levelName(level);
    try { localStorage.setItem(LS_KEY, level); } catch (e) { /* egal */ }
    renderQuiz(level);
    if (opts && opts.scrollTo) {
      var el = document.querySelector(opts.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function levelName(level) {
    return level === "basis" ? "Basis" : level === "fortgeschritten" ? "Fortgeschritten" : "Profi";
  }

  document.querySelectorAll(".lvl-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setLevel(b.dataset.level); });
  });
  document.querySelectorAll("[data-set-level]").forEach(function (b) {
    b.addEventListener("click", function () {
      var target = b.classList.contains("level-card") ? "#intro" : null;
      setLevel(b.dataset.setLevel, target ? { scrollTo: target } : undefined);
    });
  });

  var saved = null;
  try { saved = localStorage.getItem(LS_KEY); } catch (e) { /* egal */ }
  setLevel(saved && LEVELS.indexOf(saved) !== -1 ? saved : "basis");

  /* ============ Gehirn-Tafel: Hover/Klick-Highlight ============ */
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
    document.querySelectorAll(".s-card").forEach(function (card) {
      card.classList.toggle("is-active", !!(s && card.dataset.s === s));
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
  document.querySelectorAll(".s-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () { if (!currentS) highlight(card.dataset.s); });
    card.addEventListener("mouseleave", function () { if (!currentS) highlight(null); });
  });

  /* ============ Papez-Kreis ============ */
  var papezSvg = document.getElementById("papezSvg");
  var papezDetail = document.getElementById("papezDetail");
  var toggleMerk = document.getElementById("toggleMerk");

  var PAPEZ_INFO = {
    hippocampus: {
      step: "Station 1 & 7", name: "Hippocampus",
      text: "Hier startet (und endet) die Schleife. Alles, was dauerhaft gespeichert werden soll, kreist zunächst im Hippocampus selbst — und verlässt ihn dann nach hinten über den Fornix."
    },
    fornix: {
      step: "Station 2", name: "Fornix — das Gewölbe",
      text: "Der große Faserbogen: Er zieht unter dem Balken entlang nach vorn. Fast alle Informationen, die den Hippocampus verlassen, nehmen diesen Weg — Endstation Mamillarkörper."
    },
    mamillaria: {
      step: "Station 3", name: "Corpora mamillaria",
      text: "Zwei kugelige Kerne am Hypothalamus (Zwischenhirn), direkt hinter der Hypophyse. Hier kommt die Information aus dem Fornix an und wird zum Thalamus weitergereicht."
    },
    thalamus: {
      step: "Station 4", name: "Nuclei anteriores thalami",
      text: "Die vorderen Thalamuskerne — der fürs limbische System reservierte Teil des „Türstehers zum Bewusstsein“. Von hier will die Information zurück zum Hippocampus. Aber: Der Kreis ist eine Einbahnstraße — der Rückweg durch den Fornix ist versperrt."
    },
    cinguli: {
      step: "Station 5", name: "Gyrus cinguli",
      text: "Also obenrum: Die „Gürtelwindung“ über dem Balken trägt die Information in einem weiten Bogen nach hinten. Erster Teil des „Doppel-Gyros“."
    },
    parahippo: {
      step: "Station 6", name: "Gyrus parahippocampalis",
      text: "Hinten um den Balken herum geht der Gyrus cinguli in diese Windung über — sie liegt direkt am Hippocampus und führt die Information wieder in ihn hinein. Der Kreis ist geschlossen; die Konsolidierung kann rotieren."
    }
  };

  if (papezSvg && papezDetail) {
    papezSvg.querySelectorAll(".station").forEach(function (st) {
      function activate() {
        var key = st.dataset.st;
        var info = PAPEZ_INFO[key];
        if (!info) return;
        papezSvg.querySelectorAll(".station").forEach(function (o) {
          o.classList.toggle("is-active", o === st);
        });
        papezDetail.innerHTML =
          '<p class="pd-title"><span class="pd-step">' + info.step + "</span>" + info.name + "</p>" +
          "<p>" + info.text + "</p>";
      }
      st.addEventListener("click", activate);
      st.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      });
    });
  }
  if (toggleMerk && papezSvg) {
    toggleMerk.addEventListener("click", function () {
      var on = papezSvg.classList.toggle("show-merk");
      toggleMerk.setAttribute("aria-pressed", String(on));
      toggleMerk.textContent = on ? "Merkworte ausblenden" : "Merkworte einblenden";
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

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

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
    // Nie in bereits korrekter Reihenfolge starten
    if (pool.every(function (p, i) { return p.key === SG_ORDER[i].key; })) {
      pool.reverse();
    }
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
          ? "Kreis geschlossen — fehlerfrei! Hipster wären stolz."
          : "Kreis geschlossen! (" + sgErrors + " Fehlversuch" + (sgErrors === 1 ? "" : "e") + " — nochmal mischen?)";
      } else {
        sgStatus.textContent = "Richtig — weiter geht's.";
      }
    } else {
      sgErrors++;
      chip.classList.remove("wrong");
      void chip.offsetWidth; // Animation neu starten
      chip.classList.add("wrong");
      sgStatus.textContent = "Nicht ganz — denk an den Merkspruch.";
    }
  }

  if (sgReset) sgReset.addEventListener("click", sgInit);
  sgInit();

  /* ============ Quiz ============ */
  var QUIZ = {
    basis: [
      {
        q: "Was ist die wichtigste Aufgabe des Hippocampus?",
        opts: [
          "Er überführt Erinnerungen vom Kurzzeit- ins Langzeitgedächtnis.",
          "Er speichert das gesamte Langzeitgedächtnis.",
          "Er steuert unsere Bewegungen.",
          "Er verarbeitet, was wir sehen."
        ],
        correct: 0,
        expl: "Der Hippocampus ist der „Schreibvorgang“ des Gedächtnisses: Ohne ihn wird nichts Neues dauerhaft gespeichert. Der Speicher selbst liegt verteilt in der Großhirnrinde."
      },
      {
        q: "Wie lange behält das Kurzzeitgedächtnis eine Telefonnummer — ohne Abspeichern?",
        opts: ["Etwa 30 Sekunden bis 2 Minuten", "Ungefähr eine Stunde", "Einen ganzen Tag", "Nur 1–2 Sekunden"],
        correct: 0,
        expl: "Mit ständigem Wiederholen hält der präfrontale Kortex eine Info etwa 30 Sekunden bis 2 Minuten. Für alles darüber hinaus braucht es die Gedächtniskonsolidierung."
      },
      {
        q: "Welche Struktur scannt ständig alle Sinneseindrücke nach Gefahr?",
        opts: ["Die Amygdala (der Mandelkern)", "Der Fornix", "Das Kleinhirn", "Der Balken"],
        correct: 0,
        expl: "Die Amygdala bekommt direkte Meldungen von allen Sinnesarealen und prüft pausenlos: Ist da etwas Gefährliches? Wenn ja, löst sie die Angstreaktion aus."
      },
      {
        q: "Im Merkspruch „Hipster fordern Mamas antiken Doppel-Gyros“ — wofür steht „Hipster“?",
        opts: ["Hippocampus", "Hypothalamus", "Hypophyse", "Hirnstamm"],
        correct: 0,
        expl: "Hipster = Hippocampus, der Start der Schleife. Danach: fordern = Fornix, Mamas = Mamillarkörper, antiken = vordere Thalamuskerne, Doppel-Gyros = die zwei Gyri."
      },
      {
        q: "Warum merken wir uns emotionale Ereignisse besser als langweilige?",
        opts: [
          "Die Amygdala hat einen direkten Draht zum Hippocampus und verstärkt das Abspeichern.",
          "Emotionen machen das Kurzzeitgedächtnis größer.",
          "Der Balken leitet Emotionen schneller weiter.",
          "Das stimmt gar nicht — wir merken uns alles gleich gut."
        ],
        correct: 0,
        expl: "Amygdala und Hippocampus sind direkte Nachbarn mit direkter Verbindung: Löst ein Ereignis starke Emotionen aus, wird es besonders fest konsolidiert — Säbelzahntiger-Prinzip."
      },
      {
        q: "Patient H.M. konnte nach seiner Operation …",
        opts: [
          "… keine neuen Erinnerungen mehr dauerhaft abspeichern.",
          "… sich an gar nichts mehr erinnern, auch nicht an früher.",
          "… nicht mehr sprechen.",
          "… keine Angst mehr empfinden."
        ],
        correct: 0,
        expl: "H.M. fehlten beide Hippocampi — neue Erinnerungen hielten nur noch Minuten. Seine alten Erinnerungen und sein Kurzzeitgedächtnis blieben dagegen erhalten."
      }
    ],
    fortgeschritten: [
      {
        q: "Über welche Struktur verlassen Informationen den Hippocampus im Papez-Kreis?",
        opts: ["Fornix", "Stria terminalis", "Gyrus cinguli", "Balken (Corpus callosum)"],
        correct: 0,
        expl: "Der Fornix („Gewölbe“) ist der Hauptausgang: Er zieht im Bogen unter dem Balken nach vorn zu den Mamillarkörpern."
      },
      {
        q: "Die Corpora mamillaria gehören zu welcher übergeordneten Struktur?",
        opts: ["Hypothalamus (Zwischenhirn)", "Thalamus", "Temporallappen", "Hirnstamm"],
        correct: 0,
        expl: "Die Mamillarkörper sind Kerne des Hypothalamus, der wiederum zum Zwischenhirn gehört — sie liegen direkt hinter der Hypophyse."
      },
      {
        q: "Welcher Teil des Thalamus ist in den Papez-Kreis eingebunden?",
        opts: ["Die vorderen Kerne (Nuclei anteriores)", "Der gesamte Thalamus", "Die hinteren Kerne", "Der Thalamus ist nicht beteiligt"],
        correct: 0,
        expl: "Der Thalamus ist der „Türsteher zum Bewusstsein“ — seine vorderen Kerne hat er dauerhaft ans limbische System abgestellt."
      },
      {
        q: "Warum läuft der Rückweg der Schleife „obenrum“ über den Gyrus cinguli?",
        opts: [
          "Der Kreis funktioniert wie eine Einbahnstraße — rückwärts durch den Fornix geht es nicht.",
          "Der Fornix ist zu langsam für den Rückweg.",
          "Der Gyrus cinguli ist die kürzeste Verbindung.",
          "Das ist nur bei Linkshändern so."
        ],
        correct: 0,
        expl: "Die Verschaltung ist gerichtet: Von den vorderen Thalamuskernen führt der Weg über Gyrus cinguli und Gyrus parahippocampalis zurück zum Hippocampus."
      },
      {
        q: "Was blieb bei Patient H.M. nach der OP erhalten?",
        opts: [
          "Kurzzeitgedächtnis, alte Langzeiterinnerungen und implizites Lernen",
          "Nur das Kurzzeitgedächtnis",
          "Nur die Erinnerungen der letzten Woche vor der OP",
          "Nichts — sein Gedächtnis war komplett gelöscht"
        ],
        correct: 0,
        expl: "Die Läsion trennt sauber: Verloren ging nur das Neu-Abspeichern deklarativer Inhalte. KZG, alte Erinnerungen und Bewegungslernen (z. B. Radfahren) funktionierten weiter."
      },
      {
        q: "Über welche Faserverbindung alarmiert die Amygdala den Hypothalamus?",
        opts: ["Stria terminalis", "Fornix", "Tractus opticus", "Corpus callosum"],
        correct: 0,
        expl: "Die Stria terminalis zieht — ähnlich bogenförmig wie der Fornix — direkt und ohne weitere Umschaltung von der Amygdala zum Hypothalamus."
      },
      {
        q: "Welche Stoffe schüttet die Nebenniere bei der Angstreaktion aus?",
        opts: ["Adrenalin und Cortisol", "Insulin und Glukagon", "Dopamin und Serotonin", "Melatonin und Histamin"],
        correct: 0,
        expl: "Der Hypothalamus aktiviert den Sympathikus und — über die Hypophyse — die Nebenniere: Adrenalin und Cortisol versetzen den Körper in Alarmbereitschaft."
      }
    ],
    profi: [
      {
        q: "Welcher zelluläre Mechanismus stabilisiert Gedächtnisinhalte im Hippocampus?",
        opts: ["Langzeitpotenzierung (LTP)", "Laterale Inhibition", "Saltatorische Erregungsleitung", "Neurogenese im Kortex"],
        correct: 0,
        expl: "Wiederholte Aktivierung derselben Synapsen verstärkt deren Übertragung langfristig — LTP gilt als zelluläres Korrelat des Lernens und der Konsolidierung."
      },
      {
        q: "Papez-Kreis: Welche Station folgt auf den Gyrus cinguli?",
        opts: ["Gyrus parahippocampalis", "Fornix", "Corpora mamillaria", "Nuclei anteriores thalami"],
        correct: 0,
        expl: "Reihenfolge: Hippocampus → Fornix → Corpora mamillaria → Ncll. anteriores → Gyrus cinguli → Gyrus parahippocampalis → Hippocampus."
      },
      {
        q: "Was wurde bei H.M. operativ entfernt?",
        opts: [
          "Beidseits mediale Temporallappenanteile einschließlich Hippocampus",
          "Der präfrontale Kortex beidseits",
          "Einseitig der linke Temporallappen",
          "Der Thalamus"
        ],
        correct: 0,
        expl: "Die beidseitige mediale Temporallappenresektion (inkl. Hippocampus) gegen therapieresistente Epilepsie erzeugte seine anterograde Amnesie (Corkin, 2002)."
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
        expl: "Neue deklarative Inhalte (semantisch + episodisch) konnten nicht mehr konsolidiert werden; non-deklaratives (prozedurales) Lernen blieb intakt — die klassische Dissoziation."
      },
      {
        q: "Beidseitige Verkalkung der Amygdala (Urbach-Wiethe-Syndrom) führt typischerweise zu …",
        opts: [
          "… fehlender Furchtreaktion bei zugleich eingeschränktem Gefühls- und Sozialleben.",
          "… kompletter anterograder Amnesie.",
          "… gesteigerter Angst und Panikattacken.",
          "… Verlust des Kurzzeitgedächtnisses."
        ],
        correct: 0,
        expl: "Betroffene kennen praktisch keine Angst — objektiv gefährlich, und weil die Amygdala weitere Aufgaben hat, leiden auch Emotionalität und Sozialverhalten."
      },
      {
        q: "Orientierung im Gehirnschnitt: Welche limbischen Strukturen folgen dem Bogen der Seitenventrikel?",
        opts: [
          "Hippocampus und Fornix (die Stria terminalis läuft am Ncl. caudatus mit)",
          "Amygdala und Hypophyse",
          "Gyrus cinguli und Balken",
          "Kleinhirn und Hirnstamm"
        ],
        correct: 0,
        expl: "Der Trick: erst die Seitenventrikel suchen. Ihr C-Bogen führt direkt zu Hippocampus (Unterhorn) und Fornix; die Stria terminalis zieht mit Ventrikel bzw. Ncl. caudatus nach vorn."
      },
      {
        q: "Wer prägte den Begriff des limbischen „Saums“ — und wer beschrieb den Konsolidierungskreis?",
        opts: [
          "Paul Broca den Limbus, James Papez den Kreis",
          "James Papez beides",
          "Korbinian Brodmann den Limbus, Paul Broca den Kreis",
          "Santiago Ramón y Cajal beides"
        ],
        correct: 0,
        expl: "Broca fiel vor ~150 Jahren der „Saum“ (Limbus) um Balken und Zwischenhirn auf; Papez beschrieb 1937 den nach ihm benannten Neuronenkreis."
      }
    ]
  };

  var quizRoot = document.getElementById("quizRoot");
  var quizScore = document.getElementById("quizScore");
  var quizReset = document.getElementById("quizReset");
  var quizState = { level: null, answered: 0, right: 0 };

  function renderQuiz(level) {
    if (!quizRoot || quizState.level === level && quizRoot.childElementCount) return;
    quizState = { level: level, answered: 0, right: 0 };
    quizRoot.innerHTML = "";
    updateScore();
    var qs = QUIZ[level] || [];
    qs.forEach(function (item, qi) {
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

      // Antworten mischen, korrekte Position merken
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
          var isRight = oi === item.correct;
          if (isRight) quizState.right++;
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
    var total = (QUIZ[quizState.level] || []).length;
    if (quizState.answered === 0) {
      quizScore.innerHTML = total + " Fragen — Stufe " + levelName(quizState.level) + ".";
    } else if (quizState.answered < total) {
      quizScore.innerHTML = "<strong>" + quizState.right + "</strong> / " + quizState.answered + " richtig — noch " + (total - quizState.answered) + " offen.";
    } else {
      var msg = quizState.right === total ? " Perfekt — Kreis geschlossen!"
        : quizState.right >= Math.ceil(total * 0.7) ? " Stark. Der Rest kommt mit dem Merkspruch."
        : " Lies nochmal Kapitel 04 — der Merkspruch trägt dich durchs Meiste.";
      quizScore.innerHTML = "Ergebnis: <strong>" + quizState.right + " / " + total + "</strong> ·" + msg;
    }
  }

  if (quizReset) {
    quizReset.addEventListener("click", function () {
      var lvl = quizState.level || document.documentElement.getAttribute("data-level");
      quizState.level = null;
      quizRoot.innerHTML = "";
      renderQuiz(lvl);
    });
  }

  // Initiales Rendern (setLevel lief vor der Quiz-Definition)
  renderQuiz(document.documentElement.getAttribute("data-level"));

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
