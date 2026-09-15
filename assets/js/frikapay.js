/* FrikaPay — interactions et animations partagées
   Principes : transform/opacity uniquement, une animation dominante par zone,
   respect de prefers-reduced-motion, aucune animation hors du viewport. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("fp-js");

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------ alignement contenu public P1 */
  var applyPublicSiteCorrections = function () {
    var style = document.createElement("style");
    style.setAttribute("data-fp-public-fixes", "2026-09-15");
    style.textContent =
      ".fp-proof-links{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem}" +
      ".fp-proof-links a,.fp-faq-shortcuts a{color:#0B3D91;font-weight:700;text-decoration:none;background:#F0F7FF;border:1px solid #BFDBFE;border-radius:999px;padding:.55rem .85rem}" +
      ".fp-proof-links a:hover,.fp-faq-shortcuts a:hover{text-decoration:underline}" +
      ".fp-faq-shortcuts{display:flex;flex-wrap:wrap;gap:.6rem;margin:0 0 1.25rem}" +
      "@media(max-width:640px){.hero-buttons{display:grid;grid-template-columns:1fr;gap:.75rem}.hero-buttons .btn{width:100%;min-height:48px;white-space:normal;text-align:center}.fp-proof-links,.fp-faq-shortcuts{display:grid;grid-template-columns:1fr}.fp-proof-links a,.fp-faq-shortcuts a{text-align:center;border-radius:14px;min-height:44px;display:flex;align-items:center;justify-content:center}#faq{scroll-margin-top:100px}.faq-item{padding:1.1rem 0}.faq-question{font-size:1.02rem;line-height:1.45}}";
    document.head.appendChild(style);

    var processSteps = document.querySelector("#fonctionnement .steps");
    if (processSteps) {
      processSteps.innerHTML =
        '<div class="step"><div class="step-num">1</div><div><strong>Création et conditions finales</strong><p class="text-secondary">Le client ou le commerçant crée la transaction. Les deux parties clarifient le montant, la description, la livraison et les conditions finales.</p></div></div>' +
        '<div class="step"><div class="step-num">2</div><div><strong>Acceptation et paiement sécurisé</strong><p class="text-secondary">Les deux parties acceptent la même version des conditions. Le paiement est ensuite confirmé par le prestataire et les fonds sont sécurisés avant toute expédition.</p></div></div>' +
        '<div class="step"><div class="step-num">3</div><div><strong>Expédition et preuve de livraison</strong><p class="text-secondary">Après sécurisation des fonds, le commerçant expédie ou exécute la commande et ajoute une preuve vérifiable.</p></div></div>' +
        '<div class="step"><div class="step-num">4</div><div><strong>Réception, contestation ou litige</strong><p class="text-secondary">Le client confirme la réception ou signale un problème dans le délai prévu. Une réclamation applicable bloque la libération concernée.</p></div></div>' +
        '<div class="step"><div class="step-num">5</div><div><strong>Libération selon les règles</strong><p class="text-secondary">Les fonds sont libérés après confirmation de réception ou, lorsque les règles applicables le prévoient, après expiration du délai de contestation sans signalement, ou après résolution d’un litige.</p></div></div>';
    }

    var updateDesktopSlide = function (slide, data) {
      if (!slide) return;
      var labels = slide.querySelectorAll(".demo-label");
      var products = slide.querySelectorAll(".demo-product");
      var amounts = slide.querySelectorAll(".demo-amount");
      var safe = slide.querySelector(".safe-mini-card");
      var heading = slide.querySelector(".step-content h4");
      var copy = slide.querySelector(".step-content p");
      var tag = slide.querySelector(".step-tag");
      if (data.label1 && labels[0]) labels[0].textContent = data.label1;
      if (data.product1 && products[0]) products[0].textContent = data.product1;
      if (data.label2 && labels[1]) labels[1].textContent = data.label2;
      if (data.amount2 && amounts[0]) amounts[0].textContent = data.amount2;
      if (data.safe && safe) safe.textContent = data.safe;
      if (data.heading && heading) heading.textContent = data.heading;
      if (data.copy && copy) copy.textContent = data.copy;
      if (data.tag && tag) tag.textContent = data.tag;
    };

    var desktopSlides = document.querySelectorAll(".desktop-slide-stage .transaction-slide");
    updateDesktopSlide(desktopSlides[0], {
      label2: "Montant prévu",
      amount2: "125 000 FCFA",
      safe: "Le montant, les frais, le commerçant et les conditions sont affichés avant paiement.",
      heading: "Transaction créée et conditions à valider",
      copy: "La transaction est créée avec le montant, la description et la livraison. La partie invitée reçoit le lien pour accepter les mêmes conditions finales.",
      tag: "Étape 1 · Conditions à accepter"
    });
    updateDesktopSlide(desktopSlides[1], {
      label1: "Paiement",
      product1: "Confirmé par le prestataire",
      label2: "Montant sécurisé",
      amount2: "125 000 FCFA",
      safe: "Aucune expédition avant confirmation du paiement et sécurisation des fonds.",
      heading: "Conditions acceptées et paiement confirmé",
      copy: "Les deux parties acceptent la même version des conditions. Le paiement est ensuite confirmé par le prestataire avant toute expédition.",
      tag: "Étape 2 · Fonds sécurisés"
    });
    updateDesktopSlide(desktopSlides[2], {
      safe: "La livraison intervient après sécurisation des fonds et les preuves restent visibles dans l’historique.",
      heading: "Expédition et preuve enregistrée",
      copy: "Après sécurisation des fonds, le commerçant expédie ou exécute la commande puis ajoute une preuve vérifiable.",
      tag: "Étape 3 · Livraison documentée"
    });
    updateDesktopSlide(desktopSlides[3], {
      safe: "Le client confirme la réception ou signale un problème dans le délai prévu.",
      heading: "Réception ou contestation",
      copy: "Le client confirme la réception. En cas de problème, il peut demander une vérification ou ouvrir un litige selon les règles applicables.",
      tag: "Étape 4 · Décision client"
    });
    updateDesktopSlide(desktopSlides[4], {
      safe: "La libération intervient selon les règles prévues et reste bloquée lorsqu’un litige ou un hold applicable est actif.",
      heading: "Fonds libérés selon les règles",
      copy: "Les fonds sont libérés après confirmation de réception ou, lorsque les règles applicables le prévoient, après expiration du délai de contestation sans signalement, ou après résolution d’un litige.",
      tag: "Étape 5 · Transaction clôturée"
    });

    var updateMobileSlide = function (slide, heading, copy, status) {
      if (!slide) return;
      var h4 = slide.querySelector("h4");
      var p = slide.querySelector("p");
      var amount = slide.querySelector(".mobile-amount-card");
      if (h4) h4.textContent = heading;
      if (p) p.textContent = copy;
      if (amount) amount.textContent = status;
    };

    var mobileSlides = document.querySelectorAll(".mobile-slide-stage .mobile-transaction-slide");
    updateMobileSlide(
      mobileSlides[0],
      "Transaction créée et conditions à valider",
      "Le montant, la livraison et les conditions finales sont présentés à la partie invitée.",
      "Montant prévu : 125 000 FCFA"
    );
    updateMobileSlide(
      mobileSlides[1],
      "Conditions acceptées et paiement confirmé",
      "Les deux parties acceptent la même version. Le prestataire confirme ensuite le paiement avant toute expédition.",
      "Statut : fonds sécurisés"
    );
    updateMobileSlide(
      mobileSlides[2],
      "Expédition et preuve enregistrée",
      "Après sécurisation des fonds, le commerçant expédie et ajoute une preuve vérifiable.",
      "Preuve : reçu, bordereau ou suivi"
    );
    updateMobileSlide(
      mobileSlides[3],
      "Réception ou contestation",
      "Le client confirme la réception ou signale un problème dans le délai prévu.",
      "Action : confirmer ou contester"
    );
    updateMobileSlide(
      mobileSlides[4],
      "Fonds libérés selon les règles",
      "La libération intervient après confirmation, délai applicable sans signalement ou résolution d’un litige.",
      "Final : versement commerçant"
    );

    var securityCards = document.querySelectorAll("#securite .card");
    [].forEach.call(securityCards, function (card) {
      var title = card.querySelector("h3");
      var copy = card.querySelector("p");
      if (title && copy && title.textContent.trim() === "Confirmation de réception") {
        copy.textContent =
          "La réception, le délai de contestation ou la résolution d’un litige détermine la libération selon les règles applicables.";
      }
    });

    var merchantCards = document.querySelectorAll("#commercants .card");
    [].forEach.call(merchantCards, function (card) {
      var title = card.querySelector("h3");
      var copy = card.querySelector("p");
      if (title && copy && title.textContent.trim() === "Fonds libérés selon les règles") {
        copy.textContent =
          "Après confirmation de réception, expiration du délai de contestation sans signalement, ou résolution d’un litige selon les règles applicables.";
      }
    });

    var faq = document.getElementById("faq");
    if (faq) {
      var faqItems = faq.querySelectorAll(".faq-item");
      [].forEach.call(faqItems, function (item) {
        var question = item.querySelector(".faq-question");
        var answer = item.querySelector("p");
        if (!question || !answer) return;
        var q = question.textContent.trim();
        if (
          q === "Quand les fonds sont-ils libérés au commerçant ?" ||
          q === "Quand vais-je recevoir mon argent ?"
        ) {
          answer.textContent =
            "Après confirmation de réception ou, lorsque les règles applicables le prévoient, après expiration du délai de contestation sans signalement, ou après résolution d’un litige.";
        }
      });

      var faqHeadings = faq.querySelectorAll("h2.section-title");
      var faqIds = ["faq-diaspora", "faq-client", "faq-commercant"];
      [].forEach.call(faqHeadings, function (heading, index) {
        if (faqIds[index]) heading.id = faqIds[index];
      });
      if (faqHeadings.length && !faq.querySelector(".fp-faq-shortcuts")) {
        var shortcuts = document.createElement("nav");
        shortcuts.className = "fp-faq-shortcuts";
        shortcuts.setAttribute("aria-label", "Accès rapide à la FAQ");
        shortcuts.innerHTML =
          '<a href="#faq-client">FAQ Client</a>' +
          '<a href="#faq-commercant">FAQ Commerçant</a>' +
          '<a href="#faq-diaspora">FAQ Diaspora</a>';
        faq.querySelector(".container").insertBefore(shortcuts, faqHeadings[0]);
      }
    }

    var trustGrid = document.querySelector(".hero .trust-grid");
    if (trustGrid && !document.querySelector(".fp-proof-links")) {
      var proofLinks = document.createElement("div");
      proofLinks.className = "fp-proof-links";
      proofLinks.setAttribute("aria-label", "Preuves et informations de confiance");
      proofLinks.innerHTML =
        '<a href="documents.html">Vérifier nos documents officiels</a>' +
        '<a href="#faq">Lire la FAQ</a>' +
        '<a href="confiance-conformite.html">Centre de confiance</a>';
      trustGrid.insertAdjacentElement("afterend", proofLinks);
    }
  };

  applyPublicSiteCorrections();

  /* ---------------------------------------------------------------- header */
  var header = document.querySelector("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("fp-header-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ menu mobile */
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-controls", "navLinks");
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");

    var setMenu = function (open) {
      navLinks.classList.toggle("fp-mobile-open", open);
      navLinks.removeAttribute("style");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };

    // Neutralise l'ancien gestionnaire à styles inline en le remplaçant.
    var freshBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(freshBtn, menuBtn);
    menuBtn = freshBtn;

    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!navLinks.classList.contains("fp-mobile-open"));
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", function (e) {
      if (
        navLinks.classList.contains("fp-mobile-open") &&
        !navLinks.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------ hero */
  var hero = document.querySelector(".hero");
  if (hero && !reduced) {
    requestAnimationFrame(function () {
      hero.classList.add("fp-hero-in");
    });
  }

  /* --------------------------------------------------- apparitions au scroll */
  var revealTargets = [].slice.call(
    document.querySelectorAll(
      ".card, .faq-item, .quote-block, .step, .partner-logo-card, " +
        ".note-box, .transparency-note, .founder-card, .security-reassurance, " +
        ".transaction-visual-section, .legal-content"
    )
  );

  if (revealTargets.length && "IntersectionObserver" in window && !reduced) {
    revealTargets.forEach(function (el) {
      el.classList.add("fp-reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var group = entry.target.parentElement
            ? [].slice.call(entry.target.parentElement.children).indexOf(entry.target)
            : 0;
          entry.target.style.transitionDelay =
            Math.min(Math.max(group, 0) % 4, 3) * 0.07 + "s";
          entry.target.classList.add("fp-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------- animation de flux du hero */
  var flow = document.querySelector("[data-fp-flow]");
  if (flow) {
    var nodes = [].slice.call(flow.querySelectorAll(".fp-flow-node"));
    var tracks = [].slice.call(flow.querySelectorAll(".fp-flow-track"));
    var caption = flow.querySelector(".fp-flow-caption");
    var captions = [
      "<strong>Le client paie.</strong> Le montant est envoyé dans le cadre FrikaPay, pas directement au commerçant.",
      "<strong>Paiement confirmé et fonds sécurisés.</strong> Aucune expédition avant confirmation du prestataire.",
      "<strong>Le commerçant est payé.</strong> Les fonds sont libérés lorsque les conditions prévues sont remplies.",
    ];
    var flowTimers = [];

    var setFlowStep = function (i) {
      nodes.forEach(function (n, k) {
        n.setAttribute("data-state", k <= i ? "on" : "off");
      });
      tracks.forEach(function (t, k) {
        t.setAttribute("data-state", k < i ? "on" : "off");
      });
      if (caption) caption.innerHTML = captions[Math.min(i, captions.length - 1)];
    };

    var runFlow = function () {
      flowTimers.forEach(clearTimeout);
      flowTimers = [];
      setFlowStep(0);
      if (reduced) {
        setFlowStep(2);
        return;
      }
      flowTimers.push(setTimeout(function () { setFlowStep(1); }, 900));
      flowTimers.push(setTimeout(function () { setFlowStep(2); }, 2100));
    };

    setFlowStep(reduced ? 2 : 0);

    if ("IntersectionObserver" in window) {
      var flowSeen = false;
      var flowObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !flowSeen) {
              flowSeen = true;
              runFlow();
            }
          });
        },
        { threshold: 0.4 }
      );
      flowObserver.observe(flow);
    } else {
      runFlow();
    }

    // Relance à la demande, jamais en boucle permanente.
    flow.addEventListener("mouseenter", runFlow);
    flow.addEventListener("focusin", runFlow);
  }

  /* ------------------------------------- séquence « comment ça marche » */
  var stages = [].slice.call(
    document.querySelectorAll(".desktop-slide-stage, .mobile-slide-stage")
  );

  stages.forEach(function (stage) {
    if (stage.dataset.fpSequence === "on") return; // pas de double init
    stage.dataset.fpSequence = "on";

    var slides = [].slice.call(
      stage.querySelectorAll(".transaction-slide, .mobile-transaction-slide")
    );
    if (!slides.length) return;

    var bars = [].slice.call(stage.querySelectorAll(".slide-progress span"));
    var index = 0;
    var timer = null;
    var visible = false;

    var show = function (i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("fp-slide-on", k === index);
        s.setAttribute("aria-hidden", k === index ? "false" : "true");
      });
      bars.forEach(function (b, k) {
        b.classList.toggle("fp-step-done", k <= index);
      });
    };

    var stop = function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    var queue = function () {
      stop();
      if (reduced || !visible || document.hidden) return;
      timer = setTimeout(function () {
        timer = null;
        show(index + 1);
        queue();
      }, 4200);
    };

    var reset = function () {
      stop();
      show(0);
    };

    show(0);

    if ("IntersectionObserver" in window) {
      var stageObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!visible) {
                visible = true;
                reset();
                queue();
              }
            } else if (visible) {
              visible = false;
              reset();
            }
          });
        },
        { threshold: 0.3 }
      );
      stageObserver.observe(stage);
    } else {
      visible = true;
      queue();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else queue();
    });

    // Navigation manuelle par les segments de progression.
    bars.forEach(function (bar, k) {
      bar.setAttribute("role", "button");
      bar.setAttribute("tabindex", "0");
      bar.setAttribute("aria-label", "Voir l'étape " + (k + 1));
      bar.style.cursor = "pointer";
      var go = function () {
        stop();
        show(k);
        queue();
      };
      bar.addEventListener("click", go);
      bar.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  });
})();

