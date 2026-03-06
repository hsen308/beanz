document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Screen Dismissal - Premium Timing
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        // Minimum display time for brand presence
        setTimeout(() => {
            loader.classList.add("hidden");
            
            // Trigger initial hero animations after load
            setTimeout(() => {
                const heroElements = document.querySelectorAll('.hero .fade-in-up');
                heroElements.forEach(el => el.classList.add('visible'));
            }, 300);
        }, 1200); 
    });

    // 2. Smooth Scrolling for all anchor links with dynamic header offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Determine offset based on screen size (pill nav sits differently on mobile vs desktop)
                const isMobile = window.innerWidth < 800;
                const headerOffset = isMobile ? 85 : 95; 
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        });
    });

    // 3. Precision Scroll Spy for Category Navigation
    const sections = document.querySelectorAll(".menu-section");
    const navLinks = document.querySelectorAll(".nav-item");
    const navContainer = document.querySelector(".category-nav");

    const observerOptions = {
        root: null,
        // Trigger earlier to feel more responsive when scrolling up
        rootMargin: "-20% 0px -75% 0px", 
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                        // Ensure active link is centered smoothly in horizontal scroll view
                        link.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                        });
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    // 4. Advanced Scroll Reveal Animations (Staggered Matrix)
    const revealElements = document.querySelectorAll(".menu-section, .bottom-graphic, .target-anim");
    
    const revealOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach((el) => {
        el.classList.add("fade-in-up");
        revealObserver.observe(el);
    });

    // 5. Floating Action Button Logic
    const fabBtn = document.getElementById("fab-btn");
    if (fabBtn) {
        fabBtn.addEventListener("click", () => {
            // Scroll back smoothly to the top of the menu grid
            const menuStart = document.getElementById("menu-start");
            if (menuStart) {
                const headerOffset = 80;
                const elementPosition = menuStart.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        });

        // Hide FAB in hero section, reveal boldly on scroll down
        const heroSection = document.querySelector(".hero");
        const fabObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        // We've scrolled past the hero
                        fabBtn.style.opacity = "1";
                        fabBtn.style.pointerEvents = "auto";
                        fabBtn.style.transform = "translateY(0) scale(1)";
                    } else {
                        // We are in the hero
                        fabBtn.style.opacity = "0";
                        fabBtn.style.pointerEvents = "none";
                        fabBtn.style.transform = "translateY(20px) scale(0.8)";
                    }
                });
            },
            { threshold: 0.1 }
        );

        fabObserver.observe(heroSection);

        // Intial state 
        fabBtn.style.opacity = "0";
        fabBtn.style.pointerEvents = "none";
        fabBtn.style.transform = "translateY(20px) scale(0.8)";
    }
});
