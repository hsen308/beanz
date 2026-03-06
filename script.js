document.addEventListener("DOMContentLoaded", () => {

    // ─── 1. Loader ───────────────────────────────────────────────
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("hidden");
            setTimeout(() => { loader.style.display = "none"; }, 600);
            setTimeout(() => {
                document.querySelectorAll(".hero .fade-in-up").forEach(el => el.classList.add("visible"));
            }, 300);
        }, 1200);
    });

    // ─── 2. Smooth Scroll for anchor links ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;
            const offset = window.innerWidth < 800 ? 85 : 95;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                behavior: "smooth"
            });
        });
    });

    // ─── 3. Scroll Spy ───────────────────────────────────────────
    const sections    = document.querySelectorAll(".menu-section");
    const navLinks    = document.querySelectorAll(".nav-item");
    const navScroller = document.querySelector(".category-nav");

    // Tracks whether we're mid-programmatic nav scroll, so we can
    // skip re-triggering the centering logic during that scroll.
    let navScrolling = false;

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute("id");
            let activeLink = null;

            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#" + id) {
                    link.classList.add("active");
                    activeLink = link;
                }
            });

            // FIX: Original code called scrollIntoView() directly inside the
            // IntersectionObserver callback. The browser is already mid-scroll
            // when this fires — calling another scroll triggers another
            // intersection, which calls another scroll: a feedback loop that
            // drops frames on every scroll tick on mobile.
            //
            // Fix: defer to requestAnimationFrame (after current paint is done)
            // and calculate the target position with getBoundingClientRect,
            // which is reliable across all mobile browsers unlike offsetLeft.
            if (activeLink && navScroller && !navScrolling) {
                requestAnimationFrame(() => {
                    const navRect  = navScroller.getBoundingClientRect();
                    const linkRect = activeLink.getBoundingClientRect();
                    const target   = navScroller.scrollLeft
                                   + linkRect.left
                                   - navRect.left
                                   - (navRect.width  / 2)
                                   + (linkRect.width / 2);

                    navScrolling = true;
                    navScroller.scrollTo({ left: target, behavior: "smooth" });

                    // Reset flag after the smooth scroll settles (~400ms)
                    setTimeout(() => { navScrolling = false; }, 400);
                });
            }
        });
    }, {
        root: null,
        rootMargin: "-20% 0px -75% 0px",
        threshold: 0,
    });

    sections.forEach((sec) => spyObserver.observe(sec));

    // ─── 4. Scroll Reveal ────────────────────────────────────────
    const revealEls = document.querySelectorAll(".menu-section, .bottom-graphic, .target-anim");

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // fire once, then stop observing
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    revealEls.forEach((el) => {
        el.classList.add("fade-in-up");
        revealObserver.observe(el);
    });

    // ─── 5. FAB ──────────────────────────────────────────────────
    const fabBtn = document.getElementById("fab-btn");
    if (!fabBtn) return;

    fabBtn.addEventListener("click", () => {
        const menuStart = document.getElementById("menu-start");
        if (!menuStart) return;
        window.scrollTo({
            top: menuStart.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: "smooth"
        });
    });

    const hero = document.querySelector(".hero");

    // Batch all three style changes into one function so the browser
    // can apply them in a single style recalculation, not three.
    function setFab(visible) {
        fabBtn.style.cssText = visible
            ? "opacity:1; pointer-events:auto; transform:translateZ(0) scale(1)"
            : "opacity:0; pointer-events:none; transform:translateZ(0) translateY(20px) scale(0.8)";
    }

    setFab(false); // start hidden

    new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // rAF defers the style change out of the intersection callback,
            // preventing a synchronous forced layout on mobile.
            requestAnimationFrame(() => setFab(!entry.isIntersecting));
        });
    }, { threshold: 0.1 }).observe(hero);
});
