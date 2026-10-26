document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('[data-current-year]').forEach(function (element) {
        element.textContent = currentYear;
    });

    initNetworkAnimation();

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (!burger || !nav) return;

    function setMenuOpen(open) {
        nav.classList.toggle('nav-active', open);
        burger.classList.toggle('toggle', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }

    burger.addEventListener('click', function () {
        setMenuOpen(!nav.classList.contains('nav-active'));
    });

    nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && nav.classList.contains('nav-active')) {
            setMenuOpen(false);
            burger.focus();
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('nav')) setMenuOpen(false);
    });

    document.addEventListener('focusin', function (event) {
        if (!event.target.closest('nav')) setMenuOpen(false);
    });

    window.matchMedia('(max-width: 768px)').addEventListener('change', function () {
        setMenuOpen(false);
    });
});

function initNetworkAnimation() {
    const visual = document.querySelector('[data-network-animation]');
    if (!visual) return;

    const button = visual.querySelector('.animation-toggle');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let pausedByVisitor = false;

    function updateAnimation() {
        const canAnimate = !reducedMotion.matches;
        visual.classList.toggle('is-animating', canAnimate && inView && !document.hidden && !pausedByVisitor);
        button.hidden = !canAnimate;
        button.textContent = pausedByVisitor ? 'play animation' : 'pause animation';
    }

    button.addEventListener('click', function () {
        pausedByVisitor = !pausedByVisitor;
        updateAnimation();
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            updateAnimation();
        }, { threshold: 0 });
        observer.observe(visual);
    } else {
        inView = true;
    }

    document.addEventListener('visibilitychange', updateAnimation);
    reducedMotion.addEventListener('change', updateAnimation);
    updateAnimation();
}
