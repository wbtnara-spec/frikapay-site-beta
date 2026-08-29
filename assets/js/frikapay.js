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
      "<strong>Paiement sécurisé.</strong> La transaction est suivie : conditions, preuves et étapes restent visibles.",
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

