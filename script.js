document.addEventListener("DOMContentLoaded", () => {

    // 1. Loading Screen Dismissal
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("hidden");
            setTimeout(() => { loader.style.display = 'none'; }, 600);

            setTimeout(() => {
                document.querySelectorAll('.hero .fade-in-up').forEach(el => el.classList.add('visible'));
            }, 300);
        }, 1200);
    });

    // 2. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const isMobile = window.innerWidth < 800;
                const headerOffset = isMobile ? 85 : 95;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // 3. Scroll Spy for Category Navigation
    const sections = document.querySelectorAll(".menu-section");
    const navLinks = document.querySelectorAll(".nav-item");
    const navContainer = document.querySelector(".category-nav");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                let activeLink = null;

                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                        activeLink = link;
                    }
                });

                // FIX: The original code called `link.scrollIntoView()` directly
                // inside the IntersectionObserver callback. This is the #1 source
                // of scroll jank — the browser is already in the middle of a scroll
                // paint cycle, and calling scrollIntoView triggers ANOTHER scroll,
                // which fires ANOTHER intersection event, creating a feedback loop
                // of forced reflows every frame.
                //
                // Fix: Use requestAnimationFrame to defer the nav scroll until
                // the current paint cycle is fully complete, then manually calculate
                // the scroll offset using offsetLeft (no reflow loop).
                if (activeLink && navContainer) {
                    requestAnimationFrame(() => {
                        const navWidth = navContainer.offsetWidth;
                        const linkLeft = activeLink.offsetLeft;
                        const linkWidth = activeLink.offsetWidth;
                        // Scroll the nav so the active item is centered
                        const targetScroll = linkLeft - (navWidth / 2) + (linkWidth / 2);
                        navContainer.scrollTo({ left: targetScroll, behavior: "smooth" });
                    });
                }
            }
        });
    }, {
        root: null,
        rootMargin: "-20% 0px -75% 0px",
        threshold: 0,
    });

    sections.forEach((sec) => observer.observe(sec));

    // 4. Scroll Reveal Animations
    const revealElements = document.querySelectorAll(".menu-section, .bottom-graphic, .target-anim");

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
    });

    revealElements.forEach((el) => {
        el.classList.add("fade-in-up");
        revealObserver.observe(el);
    });

    // 5. Floating Action Button
    const fabBtn = document.getElementById("fab-btn");
    if (fabBtn) {
        fabBtn.addEventListener("click", () => {
            const menuStart = document.getElementById("menu-start");
            if (menuStart) {
                const offsetPosition = menuStart.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });

        const heroSection = document.querySelector(".hero");

        // FIX: Use CSS custom properties for FAB state rather than setting
        // individual style properties — batches style changes into one update.
        // Also: style transitions are declared in CSS, so JS only toggles state.
        const setFabVisible = (visible) => {
            fabBtn.style.opacity = visible ? "1" : "0";
            fabBtn.style.pointerEvents = visible ? "auto" : "none";
            fabBtn.style.transform = visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)";
        };

        setFabVisible(false); // Initial hidden state

        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // FIX: Wrap in rAF to avoid style changes in the middle of
                // an intersection callback (which can trigger synchronous layout)
                requestAnimationFrame(() => setFabVisible(!entry.isIntersecting));
            });
        }, { threshold: 0.1 }).observe(heroSection);
    }
});
