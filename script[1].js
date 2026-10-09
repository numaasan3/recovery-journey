(() => {
      const root = document.documentElement;
      const header = document.querySelector('[data-header]');
      const progress = document.querySelector('[data-progress]');
      const menuButton = document.querySelector('[data-menu-button]');
      const mobileNav = document.querySelector('[data-mobile-nav]');
      const seasonVideos = [...document.querySelectorAll('.season-panel video')];
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

      const playSeasonVideos = () => {
        seasonVideos.forEach((video) => video.play().catch(() => {}));
      };
      seasonVideos.forEach((video) => video.readyState >= 2 ? video.play().catch(() => {}) : video.addEventListener('canplay', playSeasonVideos, { once: true }));
      addEventListener('pageshow', playSeasonVideos);
      document.addEventListener('visibilitychange', () => document.hidden ? seasonVideos.forEach((video) => video.pause()) : playSeasonVideos());

      const onScroll = () => {
        const max = root.scrollHeight - innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        if (header) header.classList.toggle('is-scrolled', scrollY > 32);
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();

      if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; });
        mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }));
      }
      const params = new URLSearchParams(location.search); const source = params.get('utm_source') || params.get('src'); const contact = document.querySelector('[data-contact-link]');
      if (source && contact) { const url = new URL(contact.href); url.searchParams.set('body', `流入元: ${source}\n\n相談したい内容:\n`); contact.href = url.toString(); }

      if ('IntersectionObserver' in window && !reduceMotion.matches) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      } else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    })();