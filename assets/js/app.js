"use strict";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

// ---- Data ----
const readJSON = id => {
  const el = document.getElementById(id);
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    console.error('bad JSON', id, e);
    return null;
  }
};
const aboutme = readJSON('data-aboutme') || {};
const newsData = readJSON('data-news') || {
  news: []
};
const publicationsData = readJSON('data-publications') || [];
const projectsData = readJSON('data-projects') || [];
const experienceData = readJSON('data-experience') || [];
const skillsData = readJSON('data-skills') || {
  categories: []
};
const achievementsData = readJSON('data-achievements') || [];
const travelData = readJSON('data-travel') || {
  cities: []
};

// ---- Helpers ----
const renderMarkdownLinks = text => {
  if (!text) return '';
  return String(text)
  // [[text]](url): common in news YAML; render as [<a>text</a>] with brackets visible
  .replace(/\[\[([^\]]+)\]\]\(([^)]+)\)/g, '[<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>]')
  // [text](url): standard markdown link
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  // **bold**: used to highlight Rohit's name in author lists
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // *italic*: only when flanked by whitespace/boundaries (so author markers
  // like "Nayak*, Rawal*" stay as literal asterisks)
  .replace(/(^|\s)\*([^\s*](?:[^*]*[^\s*])?)\*(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');
};
const useInView = (threshold = 0) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, {
      threshold
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ---- Navigation ----
const NAV_SECTIONS = [{
  id: 'news',
  label: 'News'
}, {
  id: 'publications',
  label: 'Publications'
}, {
  id: 'experience',
  label: 'Experience'
}, {
  id: 'gallery',
  label: 'Recognition'
}, {
  id: 'skills',
  label: 'Skills'
}, {
  id: 'projects',
  label: 'UG Projects'
}, {
  id: 'travel',
  label: 'Travel'
}];
const Navigation = ({
  active,
  onNavigate
}) => {
  const logoRef = useRef(null);
  const navInnerRef = useRef(null);
  const linksMeasureRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [shutter, setShutter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [useHamburger, setUseHamburger] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dynamic Collision Detection
  useEffect(() => {
    const checkCollision = () => {
      if (!logoRef.current || !linksMeasureRef.current || !navInnerRef.current) return;
      const logoWidth = logoRef.current.getBoundingClientRect().width;
      const linksWidth = linksMeasureRef.current.getBoundingClientRect().width;
      const containerWidth = navInnerRef.current.getBoundingClientRect().width;
      const space = containerWidth - logoWidth - linksWidth;

      // Switch to hamburger if remaining space is less than 30px,
      // or if the viewport width is standard mobile range (<= 720px).
      setUseHamburger(space < 30 || window.innerWidth <= 720);
    };
    checkCollision();
    window.addEventListener('resize', checkCollision);
    return () => window.removeEventListener('resize', checkCollision);
  }, []);

  // Snap the menu shut when switching back to desktop horizontal layout
  useEffect(() => {
    if (!useHamburger) setMenuOpen(false);
  }, [useHamburger]);

  // Close hamburger when clicking/tapping anywhere outside the nav,
  // or pressing Escape. Only wired up while the menu is actually open.
  useEffect(() => {
    if (!menuOpen || !useHamburger) return;
    const onOutside = e => {
      if (navInnerRef.current && !navInnerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = e => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside, {
      passive: true
    });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, useHamburger]);

  // Jump to the top instantly, then play the iris animation over
  // the now-scrolled page so the shutter opens onto the hero.
  // Setting scrollTop directly bypasses the global
  // `html { scroll-behavior: smooth }` rule that would otherwise
  // animate the jump.
  const handleLogoClick = e => {
    e.preventDefault();
    setMenuOpen(false);
    if (shutter) return;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setShutter(true);
    window.setTimeout(() => setShutter(false), 1850);
  };
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(id);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    className: `nav ${menuOpen ? 'menu-open' : ''} ${useHamburger ? 'has-hamburger' : ''}`,
    style: {
      boxShadow: scrolled ? '0 2px 8px var(--shadow)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner",
    ref: navInnerRef
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "nav-logo",
    ref: logoRef,
    onClick: handleLogoClick
  }, /*#__PURE__*/React.createElement("svg", {
    className: "nav-logo-iris",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.31 8 L20.05 17.94"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.69 8 H21.17"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.38 12 L13.12 2.06"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.69 16 L3.95 6.06"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.31 16 H2.83"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.62 12 L10.88 21.94"
  })), /*#__PURE__*/React.createElement("span", null, aboutme.Name || 'Rohit Lal')), /*#__PURE__*/React.createElement("ul", {
    className: "nav-links",
    ref: linksMeasureRef,
    style: {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: window.innerWidth <= 1070 ? '0.75rem' : '1.5rem',
      top: '-9999px',
      left: '-9999px'
    }
  }, NAV_SECTIONS.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "nav-link",
    style: {
      fontSize: window.innerWidth <= 1070 ? '0.85rem' : '0.95rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", null, s.label))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nav-toggle",
    "aria-label": menuOpen ? 'Close menu' : 'Open menu',
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("ul", {
    className: `nav-links ${menuOpen ? 'open' : ''}`
  }, NAV_SECTIONS.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${s.id}`,
    className: `nav-link ${active === s.id ? 'active' : ''}`,
    onClick: e => handleNavClick(e, s.id)
  }, /*#__PURE__*/React.createElement("span", null, s.label), /*#__PURE__*/React.createElement("span", {
    className: "nav-link-chevron",
    "aria-hidden": "true"
  }, "\u203A"))))))), shutter && /*#__PURE__*/React.createElement("div", {
    className: "shutter-overlay",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "iris-svg",
    viewBox: "-100 -100 200 200",
    preserveAspectRatio: "xMidYMid slice"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("mask", {
    id: "iris-mask"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-100",
    y: "-100",
    width: "200",
    height: "200",
    fill: "white"
  }), /*#__PURE__*/React.createElement("polygon", {
    className: "iris-hole",
    points: "0,-100 70.71,-70.71 100,0 70.71,70.71 0,100 -70.71,70.71 -100,0 -70.71,-70.71",
    fill: "black"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "-100",
    y: "-100",
    width: "200",
    height: "200",
    fill: "#0a0a0a",
    mask: "url(#iris-mask)"
  }))));
};

// ---- Icons ----
const Icon = ({
  name
}) => {
  const sizes = {
    width: 18,
    height: 18
  };
  switch (name) {
    case 'email':
      return /*#__PURE__*/React.createElement("svg", _extends({}, sizes, {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "22,6 12,13 2,6"
      }));
    case 'github':
      return /*#__PURE__*/React.createElement("svg", _extends({}, sizes, {
        viewBox: "0 0 24 24",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.57C20.57 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0z"
      }));
    case 'linkedin':
      return /*#__PURE__*/React.createElement("svg", _extends({}, sizes, {
        viewBox: "0 0 24 24",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.11 20.45H3.55V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
      }));
    case 'scholar':
      return /*#__PURE__*/React.createElement("svg", _extends({}, sizes, {
        viewBox: "0 0 24 24",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269A7.49 7.49 0 0 1 19.5 16.5 7.5 7.5 0 1 1 4.5 16.5a7.49 7.49 0 0 1 .742-2.731z"
      }));
    case 'twitter':
      return /*#__PURE__*/React.createElement("svg", _extends({}, sizes, {
        viewBox: "0 0 24 24",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      }));
    default:
      return null;
  }
};

// ---- News ----
const NewsSection = () => {
  // Fade-in trigger: same as every other section - fire the
  // moment any pixel of the section enters the viewport.
  const [sectionRef, visible] = useInView();
  const items = newsData && newsData.news ? newsData.news : [];
  const listRef = useRef(null);
  const autoRef = useRef(null);
  const pausedRef = useRef(false); // transient pause (hover/touch)
  const userPausedRef = useRef(false); // sticky pause (button click)
  const holdUntilRef = useRef(0); // wallclock ms before drift may resume
  const inViewRef = useRef(false); // live: is the news-list actually on screen?
  const [userPaused, setUserPaused] = useState(false);

  // Separate observer on the news-list itself. Drift is only allowed
  // while the list is almost entirely in the viewport; ratio >= 0.85
  // means the reader is genuinely parked at News.
  const START_DELAY_MS = 100;
  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      const wasIn = inViewRef.current;
      const nowIn = entry.intersectionRatio >= 0.85;
      inViewRef.current = nowIn;
      // Re-arm the start delay whenever we (re-)enter view so the
      // reader always gets a beat to register the top items
      // before drift begins.
      if (nowIn && !wasIn) {
        holdUntilRef.current = performance.now() + START_DELAY_MS;
      }
    }, {
      threshold: [0, 0.85, 1]
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Keep ref in sync with state so the rAF loop sees the latest value
  // without needing to be torn down and rebuilt each click.
  useEffect(() => {
    userPausedRef.current = userPaused;
  }, [userPaused]);
  const toggleAutoscroll = () => {
    const next = !userPausedRef.current;
    // Update ref synchronously so the rAF loop sees the new state
    // on the very next frame, not after React commits.
    userPausedRef.current = next;
    // Always clear any lingering hover/wheel hold - an explicit
    // button click overrides whatever timer was running.
    holdUntilRef.current = 0;
    // Also clear the transient hover-pause so a stray mouseenter
    // doesn't keep the loop blocked after resume.
    if (!next) pausedRef.current = false;
    setUserPaused(next);
  };
  useEffect(() => {
    const el = listRef.current;
    if (!el || !visible) return;
    const SPEED = 11; // px/sec, slow but visible drift
    const LOOP_DELAY_MS = 1500; // pause after looping back to top
    const INTERRUPT_HOLD_MS = 5000; // hold after any user interaction
    const ROLLBACK_MS = 1200; // duration of smooth scroll back to top
    let last = performance.now();
    // Initial start-delay is handled by the IntersectionObserver
    // above (it sets holdUntilRef when the list first enters view).
    let pos = el.scrollTop; // fractional accumulator; scrollTop may round
    let rollingBack = false;
    const step = now => {
      const node = listRef.current;
      if (!node) {
        autoRef.current = null;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const blocked = pausedRef.current || userPausedRef.current || !inViewRef.current ||
      // not actually at the News section
      rollingBack || now < holdUntilRef.current;
      if (!blocked) {
        const maxScroll = node.scrollHeight - node.clientHeight;
        if (maxScroll <= 0) {
          autoRef.current = requestAnimationFrame(step);
          return;
        }
        if (pos >= maxScroll - 0.5) {
          // Smooth animated scroll back to top, then resume drifting
          rollingBack = true;
          node.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          setTimeout(() => {
            rollingBack = false;
            pos = 0;
            last = performance.now();
            holdUntilRef.current = performance.now() + LOOP_DELAY_MS;
          }, ROLLBACK_MS);
        } else {
          pos += SPEED * dt;
          node.scrollTop = pos;
        }
      } else if (!rollingBack) {
        // Don't override scrollTop during smooth rollback;
        // otherwise stay in sync with whatever the user did.
        pos = node.scrollTop;
      }
      autoRef.current = requestAnimationFrame(step);
    };
    const onEnter = () => {
      pausedRef.current = true;
    };
    const onLeave = () => {
      pausedRef.current = false;
      last = performance.now();
      holdUntilRef.current = performance.now() + INTERRUPT_HOLD_MS;
    };
    const onUserScroll = () => {
      // Any wheel/touchmove input restarts the multi-second hold
      holdUntilRef.current = performance.now() + INTERRUPT_HOLD_MS;
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, {
      passive: true
    });
    el.addEventListener('touchend', onLeave, {
      passive: true
    });
    el.addEventListener('wheel', onUserScroll, {
      passive: true
    });
    el.addEventListener('touchmove', onUserScroll, {
      passive: true
    });
    autoRef.current = requestAnimationFrame(step);
    return () => {
      if (autoRef.current) cancelAnimationFrame(autoRef.current);
      autoRef.current = null;
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
      el.removeEventListener('wheel', onUserScroll);
      el.removeEventListener('touchmove', onUserScroll);
    };
  }, [visible, items.length]);
  return /*#__PURE__*/React.createElement("section", {
    id: "news",
    ref: sectionRef,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "news-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "news-header"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title",
    style: {
      marginBottom: 0
    }
  }, "News & Updates"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "news-autoscroll-toggle",
    onClick: toggleAutoscroll,
    "aria-pressed": userPaused,
    "aria-label": userPaused ? 'Resume autoscroll' : 'Pause autoscroll',
    title: userPaused ? 'Resume autoscroll' : 'Pause autoscroll'
  }, userPaused ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 5h4v14H6zM14 5h4v14h-4z"
  })), /*#__PURE__*/React.createElement("span", null, userPaused ? 'Resume' : 'Pause'))), /*#__PURE__*/React.createElement("div", {
    className: "news-list",
    ref: listRef
  }, items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "news-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "news-date"
  }, item.date), /*#__PURE__*/React.createElement("div", {
    className: "news-description",
    dangerouslySetInnerHTML: {
      __html: renderMarkdownLinks(item.description)
    }
  })))))));
};

// Types "<Name>", then performs a Word-style gesture: caret nudges
// left, drag-selects the full name back to the start, applies an
// underline to the selected range, deselects, parks caret at the end.
const TypedName = ({
  name
}) => {
  const [text, setText] = useState('');
  const [caret, setCaret] = useState(0);
  const [selRange, setSelRange] = useState(null);
  const [ulRange, setUlRange] = useState(null);
  const subject = name || 'Rohit Lal';
  useEffect(() => {
    let cancelled = false;
    let buffer = '';
    let pos = 0;
    const sync = () => {
      setText(buffer);
      setCaret(pos);
    };
    const wait = ms => new Promise(res => window.setTimeout(res, ms));
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    const delayFor = ch => {
      if (ch === ',' || ch === '!') return rand(420, 620);
      if (ch === ' ') return rand(90, 180);
      if (ch === "'" || ch === '"') return rand(140, 240);
      return rand(110, 230);
    };
    const typeStr = async (str, fixedSpeed) => {
      for (const ch of str) {
        if (cancelled) return;
        buffer = buffer.slice(0, pos) + ch + buffer.slice(pos);
        pos += 1;
        sync();
        await wait(fixedSpeed != null ? fixedSpeed : delayFor(ch));
      }
    };
    const backspace = async n => {
      for (let i = 0; i < n; i++) {
        if (cancelled || pos === 0) return;
        buffer = buffer.slice(0, pos - 1) + buffer.slice(pos);
        pos -= 1;
        sync();
        await wait(rand(60, 110));
      }
    };
    const moveLeft = async n => {
      for (let i = 0; i < n; i++) {
        if (cancelled || pos === 0) return;
        pos -= 1;
        sync();
        await wait(rand(100, 160));
      }
    };
    const moveRight = async n => {
      for (let i = 0; i < n; i++) {
        if (cancelled || pos >= buffer.length) return;
        pos += 1;
        sync();
        await wait(rand(100, 160));
      }
    };
    // Word-style drag-select: anchor at the current caret, head
    // sweeps left one character at a time leaving a highlight.
    const dragSelectLeft = async n => {
      const anchor = pos;
      for (let i = 0; i < n; i++) {
        if (cancelled || pos === 0) return;
        pos -= 1;
        setSelRange([pos, anchor]);
        sync();
        await wait(rand(38, 65));
      }
    };
    const applyUnderlineToSelection = range => {
      setUlRange(range);
    };
    const clearSelection = () => {
      setSelRange(null);
    };
    (async () => {
      await wait(600); // brief beat before typing starts
      await typeStr(`${subject}. `); // "Rohit Lal. " - name, period, trailing space

      if (cancelled) return;
      // Underline range covers just "Rohit Lal" inside the
      // longer buffer "Rohit Lal. ".
      const nameStart = 0;
      const nameEnd = subject.length;
      await wait(650); // admire the line for a beat
      await moveLeft(2); // step back over the trailing space, then the period
      await wait(380);
      await dragSelectLeft(subject.length); // drag-select "Rohit Lal" right-to-left
      await wait(550); // selection sits visible
      applyUnderlineToSelection([nameStart, nameEnd]); // Cmd+U lands
      await wait(900); // admire the underlined name
      clearSelection(); // click-away, deselect
      await wait(220);
      await moveRight(buffer.length); // walk caret char-by-char all the way back to the end, past the period and trailing space
    })();
    return () => {
      cancelled = true;
    };
  }, [subject]);

  // Render the text as 1-3 segments based on the active selection
  // and underline ranges, with the caret slotted in at its position.
  const splitPoints = (() => {
    const set = new Set([0, text.length, caret]);
    if (selRange) {
      set.add(selRange[0]);
      set.add(selRange[1]);
    }
    if (ulRange) {
      set.add(ulRange[0]);
      set.add(ulRange[1]);
    }
    return [...set].filter(p => p >= 0 && p <= text.length).sort((a, b) => a - b);
  })();
  const nodes = [];
  for (let s = 0; s < splitPoints.length; s++) {
    const start = splitPoints[s];
    if (start === caret) {
      nodes.push(/*#__PURE__*/React.createElement("span", {
        key: `c${s}`,
        className: "hero-cursor",
        "aria-hidden": "true"
      }));
    }
    if (s === splitPoints.length - 1) break;
    const end = splitPoints[s + 1];
    if (start === end) continue;
    const inSel = selRange && start >= selRange[0] && end <= selRange[1];
    const inUL = ulRange && start >= ulRange[0] && end <= ulRange[1];
    const cls = [inSel ? 'hero-name-sel' : '', inUL ? 'hero-name-ul' : ''].filter(Boolean).join(' ');
    nodes.push(/*#__PURE__*/React.createElement("span", {
      key: `s${start}`,
      className: cls
    }, text.slice(start, end)));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, nodes);
};

// ---- Hero ----
const Hero = () => {
  const dp = aboutme.DP_Link || 'img/rohit.png';
  const expertiseParts = (aboutme.Area_Of_Expertise || '').split('|').map(p => p.trim()).filter(Boolean);
  const emailHref = aboutme.Email || 'mailto:take2rohit@gmail.com';

  // Corner decoration: scripted sequence of squares. Each "square event"
  // is 4 line segments (top, right, bottom, left) sharing one animation
  // delay so all four sides draw together, hold, and wipe together -
  // guaranteed to outline a real square instead of stray lines.
  const gridLines = React.useMemo(() => {
    const CYCLE = 16; // master loop in seconds
    const squares = [{
      x: 55,
      y: 30,
      side: 75,
      t: 0
    }, {
      x: 170,
      y: 80,
      side: 55,
      t: 4
    }, {
      x: 45,
      y: 155,
      side: 70,
      t: 8
    }, {
      x: 160,
      y: 190,
      side: 50,
      t: 12
    }];
    const out = [];
    squares.forEach((sq, idx) => {
      const {
        x,
        y,
        side,
        t
      } = sq;
      // ordered so the draw flows around the perimeter: top L->R,
      // right T->B, bottom R->L, left B->T
      const sides = [{
        x1: x,
        y1: y,
        x2: x + side,
        y2: y
      }, {
        x1: x + side,
        y1: y,
        x2: x + side,
        y2: y + side
      }, {
        x1: x + side,
        y1: y + side,
        x2: x,
        y2: y + side
      }, {
        x1: x,
        y1: y + side,
        x2: x,
        y2: y
      }];
      sides.forEach((s, j) => {
        // Small per-side stagger so the square draws around itself
        const delay = t + j * 0.25;
        out.push(/*#__PURE__*/React.createElement("line", {
          key: `${idx}-${j}`,
          className: "hero-grid-line",
          pathLength: "100",
          x1: s.x1,
          y1: s.y1,
          x2: s.x2,
          y2: s.y2,
          style: {
            animationDelay: `${delay}s`,
            animationDuration: `${CYCLE}s`
          }
        }));
      });
    });
    return out;
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    id: "hero",
    className: "hero section visible"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "hero-grid",
    viewBox: "0 0 260 260",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, gridLines), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-image-wrapper"
  }, /*#__PURE__*/React.createElement("img", {
    src: dp,
    alt: aboutme.Name || 'Profile',
    className: "hero-image"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-content"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "hero-name"
  }, /*#__PURE__*/React.createElement(TypedName, {
    name: aboutme.Name
  })), /*#__PURE__*/React.createElement("p", {
    className: "hero-expertise"
  }, expertiseParts.map((p, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-accent"
  }, p), i < expertiseParts.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, " | ")))), /*#__PURE__*/React.createElement("p", {
    className: "hero-bio",
    dangerouslySetInnerHTML: {
      __html: renderMarkdownLinks(aboutme.Bio_Short || aboutme.About || '')
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: emailHref,
    className: "hero-link primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "email"
  }), /*#__PURE__*/React.createElement("span", null, "Email")), aboutme.Github && /*#__PURE__*/React.createElement("a", {
    href: aboutme.Github,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "hero-link"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "github"
  }), /*#__PURE__*/React.createElement("span", null, "GitHub")), aboutme.LinkedIn && /*#__PURE__*/React.createElement("a", {
    href: aboutme.LinkedIn,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "hero-link"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "linkedin"
  }), /*#__PURE__*/React.createElement("span", null, "LinkedIn")), aboutme.Scholar && /*#__PURE__*/React.createElement("a", {
    href: aboutme.Scholar,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "hero-link"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scholar"
  }), /*#__PURE__*/React.createElement("span", null, "Scholar")), aboutme.Twitter && /*#__PURE__*/React.createElement("a", {
    href: aboutme.Twitter,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "hero-link"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "twitter"
  }), /*#__PURE__*/React.createElement("span", null, "X / Twitter")))))));
};

// ---- Stats ----
const STAT_COUNT_DURATION = 9000; // ms — shared so all counters finish together

const StatCounter = ({
  target,
  suffix,
  label,
  animate
}) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const start = performance.now();
    let frame;
    const tick = now => {
      const t = Math.min((now - start) / STAT_COUNT_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, target]);
  // Reserve width based on the final string so the card doesn't reflow each tick.
  const finalText = `${target}${suffix || ''}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-number stat-number--counter"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-number-ghost",
    "aria-hidden": "true"
  }, finalText), /*#__PURE__*/React.createElement("span", {
    className: "stat-number-value"
  }, value, suffix)), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, label));
};
const StatMarquee = ({
  text,
  label
}) => {
  const items = String(text).split(',').map(s => s.trim()).filter(Boolean);
  const doubled = [...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    className: "stat-card stat-card--marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-marquee-track"
  }, doubled.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "stat-marquee-item"
  }, v)))), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, label));
};
const Stats = () => {
  const [ref, visible] = useInView(0.3);
  const stats = Array.isArray(aboutme.Stats) ? aboutme.Stats : [];
  if (!stats.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "stats"
  }, stats.map((s, i) => {
    const raw = String(s.number);
    if (raw.includes(',')) {
      return /*#__PURE__*/React.createElement(StatMarquee, {
        key: i,
        text: raw,
        label: s.label
      });
    }
    const m = raw.match(/^(-?\d+(?:\.\d+)?)(\D*)$/);
    if (m) {
      return /*#__PURE__*/React.createElement(StatCounter, {
        key: i,
        target: parseFloat(m[1]),
        suffix: m[2],
        label: s.label,
        animate: visible
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-number"
    }, s.number), /*#__PURE__*/React.createElement("div", {
      className: "stat-label"
    }, s.label));
  }));
};

// ---- Publications ----
const fallbackPubImage = 'img/portfolio/word_emb.webp';
const Publications = () => {
  const [ref, visible] = useInView();
  const [lightbox, setLightbox] = useState(null);
  const openLightbox = (src, alt, caption) => setLightbox({
    src,
    alt,
    caption
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "publications",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Recent Publications"), /*#__PURE__*/React.createElement(Stats, null), publicationsData.map((pub, i) => {
    const src = pub.image || fallbackPubImage;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "publication-card-enhanced"
    }, /*#__PURE__*/React.createElement("div", {
      className: "publication-image",
      role: "button",
      tabIndex: 0,
      "aria-label": `Open full-size image for ${pub.paper}`,
      onClick: () => openLightbox(src, pub.paper, pub.paper),
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(src, pub.paper, pub.paper);
        }
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: pub.paper,
      loading: "lazy"
    })), /*#__PURE__*/React.createElement("div", {
      className: "publication-details"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "publication-title"
    }, pub.paper), /*#__PURE__*/React.createElement("div", {
      className: "publication-links"
    }, pub.paper_link && /*#__PURE__*/React.createElement("a", {
      href: pub.paper_link,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "publication-link"
    }, "Paper"), pub.code_link && /*#__PURE__*/React.createElement("a", {
      href: pub.code_link,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "publication-link"
    }, "Code"), pub.project_page && /*#__PURE__*/React.createElement("a", {
      href: pub.project_page,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "publication-link"
    }, "Project"), pub.bibtex && /*#__PURE__*/React.createElement("a", {
      href: pub.bibtex,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "publication-link"
    }, "BibTeX"), pub.video && /*#__PURE__*/React.createElement("a", {
      href: pub.video,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "publication-link"
    }, "Video"))), /*#__PURE__*/React.createElement("p", {
      className: "publication-authors",
      dangerouslySetInnerHTML: {
        __html: renderMarkdownLinks(pub.author)
      }
    }), /*#__PURE__*/React.createElement("p", {
      className: "publication-venue"
    }, pub.pub), pub.abstract && /*#__PURE__*/React.createElement("div", {
      className: "publication-abstract"
    }, /*#__PURE__*/React.createElement("strong", null, "TL;DR:"), " ", pub.abstract)));
  })), /*#__PURE__*/React.createElement(Lightbox, {
    data: lightbox,
    onClose: () => setLightbox(null)
  }));
};

// ---- Lightbox (image popup with smooth animation) ----
const Lightbox = ({
  data,
  onClose
}) => {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!data) return;
    setClosing(false);

    // Freeze the page via position: fixed on body (only reliable
    // scroll lock on iOS Safari; overflow: hidden alone isn't enough).
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    const onKey = e => {
      if (e.key === 'Escape') triggerClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      // `html { scroll-behavior: smooth }` would otherwise animate
      // the restoration scroll from 0 back down to scrollY (the
      // "weird scroll from up to down" on close). Temporarily
      // pin it to auto so the jump is instant.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevBehavior;
      });
    };
  }, [data]);
  const triggerClose = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };
  if (!data) return null;
  // Portal to <body> so the modal escapes any ancestor stacking
  // context (the .section wrapper applies `transform`, which would
  // otherwise trap the modal below the fixed navbar).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: `lightbox-overlay ${closing ? 'closing' : ''}`,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": data.alt || 'Image preview',
    onClick: triggerClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "lightbox-frame",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("img", {
    className: "lightbox-image",
    src: data.src,
    alt: data.alt || ''
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lightbox-close",
    "aria-label": "Close image preview",
    onClick: e => {
      e.stopPropagation();
      triggerClose();
    }
  }, "\xD7"))), document.body);
};

// ---- Experience ----
const Experience = () => {
  const [ref, visible] = useInView();
  const itemRefs = useRef([]);
  const [visibleItems, setVisibleItems] = useState(new Set());
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = itemRefs.current.indexOf(entry.target);
          if (idx >= 0) setVisibleItems(prev => new Set(prev).add(idx));
        }
      });
    }, {
      threshold: 0.2
    });
    itemRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    id: "experience",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Experience"), /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, experienceData.map((exp, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: el => itemRefs.current[i] = el,
    className: `timeline-item ${visibleItems.has(i) ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "timeline-company"
  }, exp.url ? /*#__PURE__*/React.createElement("a", {
    href: exp.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, exp.company) : exp.company), /*#__PURE__*/React.createElement("div", {
    className: "timeline-title"
  }, exp.title), Array.isArray(exp.bullets) && exp.bullets.length > 0 ? /*#__PURE__*/React.createElement("ul", {
    className: "timeline-bullets"
  }, exp.bullets.map((b, j) => /*#__PURE__*/React.createElement("li", {
    key: j,
    dangerouslySetInnerHTML: {
      __html: renderMarkdownLinks(b)
    }
  }))) : exp.description && /*#__PURE__*/React.createElement("div", {
    className: "timeline-description",
    dangerouslySetInnerHTML: {
      __html: renderMarkdownLinks(exp.description)
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "timeline-meta"
  }, exp.location && /*#__PURE__*/React.createElement("div", {
    className: "timeline-location"
  }, exp.location), /*#__PURE__*/React.createElement("div", {
    className: "timeline-dates"
  }, exp.date)))))));
};

// ---- Projects ----
const Projects = () => {
  const [ref, visible] = useInView();
  const [filter, setFilter] = useState('All');
  const scrollRef = useRef(null);
  const autoRef = useRef(null);
  const allTags = ['All', ...Array.from(new Set(projectsData.flatMap(p => p.tags || [])))];
  const filtered = filter === 'All' ? projectsData : projectsData.filter(p => (p.tags || []).includes(filter));
  const scrollBy = dir => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir * 340,
        behavior: 'smooth'
      });
    }
  };
  const stopAuto = () => {
    if (autoRef.current) {
      cancelAnimationFrame(autoRef.current);
      autoRef.current = null;
    }
  };
  const startAuto = () => {
    stopAuto();
    const SPEED = 35; // px/sec, marquee drift speed
    let last = performance.now();
    let rollingBack = false;
    // Track sub-pixel position locally; iOS Safari rounds scrollLeft
    // to integers, so small per-frame increments would otherwise
    // get dropped and the marquee would never move on mobile.
    let pos = scrollRef.current ? scrollRef.current.scrollLeft : 0;
    let prevScrollLeft = pos;
    const step = now => {
      const el = scrollRef.current;
      if (!el) {
        autoRef.current = null;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05); // clamp on tab refocus
      last = now;

      // If the user (or a button) scrolled the strip, resync our
      // local position so we don't yank them back.
      if (Math.abs(el.scrollLeft - prevScrollLeft) > 2) {
        pos = el.scrollLeft;
      }
      if (!rollingBack) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (pos >= maxScroll - 1) {
          rollingBack = true;
          el.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          setTimeout(() => {
            rollingBack = false;
            pos = 0;
            prevScrollLeft = 0;
            last = performance.now();
          }, 1200);
        } else {
          pos += SPEED * dt;
          el.scrollLeft = pos;
          prevScrollLeft = el.scrollLeft;
        }
      }
      autoRef.current = requestAnimationFrame(step);
    };
    autoRef.current = requestAnimationFrame(step);
  };

  // Pause auto-scroll only for real mouse hover. Touch taps emit
  // pointerenter/mouseenter without a matching leave, so without
  // this filter the marquee would freeze on the first tap on phones.
  const handlePointerEnter = e => {
    if (!e.pointerType || e.pointerType === 'mouse') stopAuto();
  };
  const handlePointerLeave = e => {
    if (!e.pointerType || e.pointerType === 'mouse') startAuto();
  };

  // Auto-scroll when section is in view; pause when out of view
  useEffect(() => {
    if (visible) startAuto();else stopAuto();
    return stopAuto;
  }, [visible, filter]);
  return /*#__PURE__*/React.createElement("section", {
    id: "projects",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Undergrad Projects"), /*#__PURE__*/React.createElement("p", {
    className: "projects-caption"
  }, /*#__PURE__*/React.createElement("em", null, "B.C. - Before Claude."), " Projects where I built AI, not the other way around."), allTags.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "project-filters"
  }, allTags.map(tag => /*#__PURE__*/React.createElement("button", {
    key: tag,
    className: `filter-btn ${filter === tag ? 'active' : ''}`,
    onClick: () => setFilter(tag)
  }, tag))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      stopAuto();
      scrollBy(-1);
    },
    "aria-label": "Scroll left",
    style: {
      position: 'absolute',
      left: '-20px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--bg-secondary)',
      border: '2px solid var(--accent)',
      color: 'var(--accent)',
      fontSize: 20,
      cursor: 'pointer',
      boxShadow: '0 4px 12px var(--shadow)'
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      stopAuto();
      scrollBy(1);
    },
    "aria-label": "Scroll right",
    style: {
      position: 'absolute',
      right: '-20px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--bg-secondary)',
      border: '2px solid var(--accent)',
      color: 'var(--accent)',
      fontSize: 20,
      cursor: 'pointer',
      boxShadow: '0 4px 12px var(--shadow)'
    }
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "projects-grid"
  }, filtered.map((project, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "project-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "project-image-wrapper"
  }, /*#__PURE__*/React.createElement("img", {
    src: project.image,
    alt: project.title,
    className: "project-image",
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "project-content"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "project-title"
  }, project.title), /*#__PURE__*/React.createElement("p", {
    className: "project-abstract"
  }, project.abstract), project.tags && project.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "project-tags"
  }, project.tags.map((tag, j) => /*#__PURE__*/React.createElement("span", {
    key: j,
    className: "project-tag"
  }, tag))), /*#__PURE__*/React.createElement("div", {
    className: "project-links"
  }, project.github && /*#__PURE__*/React.createElement("a", {
    href: project.github,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "project-link"
  }, "GitHub"), project.video && /*#__PURE__*/React.createElement("a", {
    href: project.video,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "project-link"
  }, "Video"), project.paper && /*#__PURE__*/React.createElement("a", {
    href: project.paper,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "project-link"
  }, "Paper")))))))));
};

// ---- Skills ----
const Skills = () => {
  const [ref, visible] = useInView();
  const cats = skillsData.categories || [];
  return /*#__PURE__*/React.createElement("section", {
    id: "skills",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Technical Skills"), /*#__PURE__*/React.createElement("p", {
    className: "projects-caption"
  }, "Used them enough to know where each one tends to break!"), /*#__PURE__*/React.createElement("div", {
    className: "skills-categories"
  }, cats.map((cat, i) => {
    const color = cat.color || 'var(--accent)';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "skill-category",
      style: {
        animationDelay: `${i * 0.1}s`
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "skill-category-title",
      style: {
        borderLeft: `4px solid ${color}`,
        paddingLeft: '0.6rem'
      }
    }, cat.title), /*#__PURE__*/React.createElement("div", {
      className: "skill-pills"
    }, (cat.skills || []).map((skill, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      className: "skill-pill",
      style: {
        borderColor: color
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = color;
        e.currentTarget.style.color = 'white';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-primary)';
      }
    }, skill))));
  }))));
};

// ---- Awards Carousel (3D Cover Flow) ----
const Gallery = () => {
  const [ref, visible] = useInView();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const items = achievementsData;

  // Viewport visibility state to ensure timer only runs when carousel is in view
  const containerRef = useRef(null);
  const [carouselFullyInView, setCarouselFullyInView] = useState(false);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      setCarouselFullyInView(entry.isIntersecting);
    }, {
      threshold: 0.85
    }); // 85% visibility means virtually the entire carousel is on screen
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Gesture states
  const startXRef = useRef(0);
  const isSwipingRef = useRef(false);

  // Infinite wrapping next/prev
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setResetTrigger(prev => prev + 1); // Reset the timer atomically
  };
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
    setResetTrigger(prev => prev + 1); // Reset the timer atomically
  };

  // Auto-scroll loop (10s cycle)
  useEffect(() => {
    if (!auto || !carouselFullyInView || items.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 10000);
    return () => clearInterval(t);
  }, [auto, carouselFullyInView, resetTrigger, items.length]);

  // Recalculate shortest distance diff for circular wrapping
  const getDiff = idx => {
    let d = idx - currentIndex;
    const half = Math.floor(items.length / 2);
    while (d > half) d -= items.length;
    while (d < -half) d += items.length;
    return d;
  };

  // Touch event handlers for swiping
  const handleTouchStart = e => {
    startXRef.current = e.touches[0].clientX;
    isSwipingRef.current = true;
    setAuto(false);
  };
  const handleTouchMove = e => {
    if (!isSwipingRef.current) return;
    const diffX = startXRef.current - e.touches[0].clientX;
    if (Math.abs(diffX) > 40) {
      // threshold
      if (diffX > 0) handleNext();else handlePrev();
      isSwipingRef.current = false; // block further movements for this swipe
    }
  };
  const handleTouchEnd = () => {
    isSwipingRef.current = false;
    setAuto(true);
  };

  // Mouse event handlers for swiping/dragging
  const handleMouseDown = e => {
    startXRef.current = e.clientX;
    isSwipingRef.current = true;
    setAuto(false);
  };
  const handleMouseMove = e => {
    if (!isSwipingRef.current) return;
    const diffX = startXRef.current - e.clientX;
    if (Math.abs(diffX) > 40) {
      // threshold
      if (diffX > 0) handleNext();else handlePrev();
      isSwipingRef.current = false;
    }
  };
  const handleMouseUp = () => {
    isSwipingRef.current = false;
  };

  // Resolve a click on the track to the visually front-most card at
  // that pixel. Needed because the active card's overlay (scale 1.1 +
  // translateZ) and the 3D `preserve-3d` track absorb clicks on
  // flanking cards, so per-item onClick never fires for them.
  // Z-order from front: active > left-1/right-1 > left-2/right-2.
  const POS_PRIORITY = {
    active: 3,
    'left-1': 2,
    'right-1': 2,
    'left-2': 1,
    'right-2': 1
  };
  const handleTrackClick = e => {
    const cards = e.currentTarget.querySelectorAll('.coverflow-item');
    let bestIdx = -1;
    let bestPriority = -1;
    cards.forEach((el, i) => {
      const cls = el.className;
      let priority = 0;
      for (const key in POS_PRIORITY) {
        if (cls.indexOf(key) !== -1) {
          priority = POS_PRIORITY[key];
          break;
        }
      }
      if (priority === 0) return; // hidden
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right) return;
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      if (priority > bestPriority) {
        bestPriority = priority;
        bestIdx = i;
      }
    });
    if (bestIdx >= 0 && bestIdx !== currentIndex) {
      e.preventDefault();
      setCurrentIndex(bestIdx);
      setResetTrigger(prev => prev + 1);
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "gallery",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Recognition"), /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: "coverflow-container",
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: () => {
      handleMouseUp();
      setAuto(true);
    },
    onMouseLeave: () => {
      handleMouseUp();
      setAuto(true);
    },
    onMouseEnter: () => setAuto(false)
  }, /*#__PURE__*/React.createElement("button", {
    className: "coverflow-nav prev",
    onClick: handlePrev,
    "aria-label": "Previous"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "coverflow-track",
    onClick: handleTrackClick
  }, items.map((item, i) => {
    const diff = getDiff(i);
    const isActive = diff === 0;
    let posClass = "hidden";
    if (diff === 0) posClass = "active";else if (diff === -1) posClass = "left-1";else if (diff === -2) posClass = "left-2";else if (diff === 1) posClass = "right-1";else if (diff === 2) posClass = "right-2";
    const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "coverflow-image-wrapper"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.image,
      alt: item.title,
      className: "coverflow-image",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      className: "coverflow-dimmer"
    })), /*#__PURE__*/React.createElement("div", {
      className: "coverflow-overlay"
    }, /*#__PURE__*/React.createElement("div", {
      className: "coverflow-overlay-content"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "coverflow-title"
    }, item.title), /*#__PURE__*/React.createElement("p", {
      className: "coverflow-description"
    }, item.description), /*#__PURE__*/React.createElement("div", {
      className: "coverflow-footer"
    }, /*#__PURE__*/React.createElement("span", {
      className: "coverflow-date"
    }, item.date), item.link && /*#__PURE__*/React.createElement("span", {
      className: "coverflow-action-btn"
    }, "View source \u2197")))), isActive && /*#__PURE__*/React.createElement("div", {
      className: "coverflow-progress-line"
    }, /*#__PURE__*/React.createElement("div", {
      key: `${currentIndex}-${resetTrigger}`,
      className: "coverflow-progress-fill",
      style: {
        animationPlayState: auto && carouselFullyInView ? 'running' : 'paused'
      }
    })));
    const itemProps = {
      className: `coverflow-item ${posClass}`,
      onClick: e => {
        if (!isActive) {
          e.preventDefault();
          e.stopPropagation();
          setCurrentIndex(i);
          setResetTrigger(prev => prev + 1);
        }
      }
    };
    return item.link ? /*#__PURE__*/React.createElement("a", _extends({
      key: i,
      href: item.link,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": `${item.title} - view source`
    }, itemProps), inner) : /*#__PURE__*/React.createElement("div", _extends({
      key: i
    }, itemProps), inner);
  })), /*#__PURE__*/React.createElement("button", {
    className: "coverflow-nav next",
    onClick: handleNext,
    "aria-label": "Next"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
  })))), items.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "coverflow-indicators"
  }, items.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `coverflow-indicator ${i === currentIndex ? 'active' : ''}`,
    onClick: () => {
      setCurrentIndex(i);
      setResetTrigger(prev => prev + 1);
    }
  })))));
};

// ---- Travel Map (D3 + topojson) ----
const projectLatLng = (lat, lng) => {
  const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
  const c = projection([lng, lat]);
  return c ? {
    x: c[0],
    y: c[1]
  } : null;
};

// Zoom/pan constants for the travel map.
const MAP_VB_W = 960,
  MAP_VB_H = 600;
const MAP_MIN_K = 1,
  MAP_MAX_K = 8;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Constrain pan so we never see beyond the map viewBox.
const clampTransform = (k, x, y) => {
  const kk = clamp(k, MAP_MIN_K, MAP_MAX_K);
  const maxX = 0,
    minX = MAP_VB_W * (1 - kk);
  const maxY = 0,
    minY = MAP_VB_H * (1 - kk);
  return {
    k: kk,
    x: clamp(x, minX, maxX),
    y: clamp(y, minY, maxY)
  };
};
const TravelMap = () => {
  const [ref, visible] = useInView();
  const [mapData, setMapData] = useState(null);
  const [pathFn, setPathFn] = useState(null);
  // `hovered` is mouse-cursor-only; `pinned` is a click/tap latch.
  // The snapshot tooltip shows whichever is set (pinned wins). This
  // split prevents the mobile bug where a tap fires both onMouseEnter
  // and onClick, racing each other so the snapshot flashes and then
  // gets toggled back off.
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const hover = pinned || hovered;
  // Clear both layers when a pan / zoom interaction starts - the
  // markers move under the user, so any open tooltip should go away.
  const dismissTooltip = () => {
    setHovered(null);
    setPinned(null);
  };
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  // Transform lives in a ref so wheel/pointer/touch handlers can mutate
  // it cheaply (no React re-render per event), and we just push a new
  // transform attribute on the SVG group via a direct DOM write.
  const transformRef = useRef({
    k: 1,
    x: 0,
    y: 0
  });
  const groupRef = useRef(null);
  const panStateRef = useRef(null); // { lastX, lastY } during drag
  const pinchStateRef = useRef(null); // { initialDist, initialK, midSvg }

  useEffect(() => {
    if (typeof fetch !== 'function' || typeof d3 === 'undefined' || typeof topojson === 'undefined') {
      return;
    }
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()).then(data => {
      setMapData(data);
      const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
      const path = d3.geoPath().projection(projection);
      setPathFn(() => path);
    }).catch(err => console.error('Failed to load map', err));
  }, []);

  // Apply the current transform to the SVG group via direct DOM write.
  const applyTransform = () => {
    const {
      k,
      x,
      y
    } = transformRef.current;
    if (groupRef.current) {
      groupRef.current.setAttribute('transform', `translate(${x}, ${y}) scale(${k})`);
    }
  };
  const setTransform = (k, x, y) => {
    transformRef.current = clampTransform(k, x, y);
    applyTransform();
  };

  // Convert a client-space point (e.g. mouse position) into the
  // SVG viewBox coordinate space, accounting for current zoom.
  const clientToViewbox = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return {
      x: 0,
      y: 0
    };
    const rect = svg.getBoundingClientRect();
    // Map viewBox is 960x600 stretched to fit the rect.
    const vx = (clientX - rect.left) * (MAP_VB_W / rect.width);
    const vy = (clientY - rect.top) * (MAP_VB_H / rect.height);
    return {
      x: vx,
      y: vy
    };
  };

  // Zoom toward a focal point in viewBox space, keeping that point
  // visually anchored under the cursor / pinch midpoint.
  const zoomAt = (focalVx, focalVy, newK) => {
    const t = transformRef.current;
    const k0 = t.k;
    const k1 = clamp(newK, MAP_MIN_K, MAP_MAX_K);
    if (k1 === k0) return;
    // (focal - x) / k stays constant before and after the zoom.
    const x1 = focalVx - (focalVx - t.x) * (k1 / k0);
    const y1 = focalVy - (focalVy - t.y) * (k1 / k0);
    setTransform(k1, x1, y1);
  };

  // Wheel handler: smooth multiplicative zoom toward cursor.
  const onWheel = e => {
    e.preventDefault();
    const {
      x: vx,
      y: vy
    } = clientToViewbox(e.clientX, e.clientY);
    const factor = Math.exp(-e.deltaY * 0.0015);
    zoomAt(vx, vy, transformRef.current.k * factor);
    dismissTooltip();
  };

  // Drag-pan. The handler is attached to the transparent pan-surface
  // rect that sits behind the markers, so events on markers never
  // reach here - no filtering needed.
  const onPointerDown = e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    panStateRef.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    e.currentTarget.style.cursor = 'grabbing';
  };
  const onPointerMove = e => {
    const ps = panStateRef.current;
    if (!ps || ps.pointerId !== e.pointerId) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dxv = (e.clientX - ps.lastX) * (MAP_VB_W / rect.width);
    const dyv = (e.clientY - ps.lastY) * (MAP_VB_H / rect.height);
    ps.lastX = e.clientX;
    ps.lastY = e.clientY;
    const t = transformRef.current;
    setTransform(t.k, t.x + dxv, t.y + dyv);
    dismissTooltip();
  };
  const onPointerUp = e => {
    const ps = panStateRef.current;
    if (!ps) return;
    if (ps.pointerId === e.pointerId) {
      panStateRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      e.currentTarget.style.cursor = 'grab';
    }
  };

  // Two-finger pinch zoom on touch.
  const touchDist = touches => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };
  const onTouchStart = e => {
    if (e.touches.length === 2) {
      const midClientX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midClientY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const midSvg = clientToViewbox(midClientX, midClientY);
      pinchStateRef.current = {
        initialDist: touchDist(e.touches),
        initialK: transformRef.current.k,
        midSvg
      };
      panStateRef.current = null;
    }
  };
  const onTouchMove = e => {
    if (e.touches.length === 2 && pinchStateRef.current) {
      e.preventDefault();
      const dist = touchDist(e.touches);
      const ratio = dist / pinchStateRef.current.initialDist;
      const newK = pinchStateRef.current.initialK * ratio;
      const {
        x: vx,
        y: vy
      } = pinchStateRef.current.midSvg;
      zoomAt(vx, vy, newK);
      dismissTooltip();
    }
  };
  const onTouchEnd = e => {
    if (e.touches.length < 2) pinchStateRef.current = null;
  };

  // Double-click resets the view.
  const onDoubleClick = e => {
    e.preventDefault();
    setTransform(1, 0, 0);
  };

  // Any click on the pan-surface rect is by definition on empty
  // map space (marker events never reach this handler), so just
  // clear the pinned snapshot.
  const onSvgClick = () => {
    setPinned(null);
  };

  // Re-apply transform whenever the group ref attaches (after re-render).
  useEffect(() => {
    if (mapData && pathFn) applyTransform();
  }, [mapData, pathFn]);

  // React's synthetic onWheel / onTouchMove handlers are passive by
  // default, which means e.preventDefault() is silently dropped.
  // Attach native non-passive listeners instead so wheel zoom and
  // pinch zoom actually consume the gesture (no page scroll behind).
  useEffect(() => {
    if (!mapData || !pathFn) return;
    const svg = svgRef.current;
    if (!svg) return;
    const wheelOpts = {
      passive: false
    };
    const touchOpts = {
      passive: false
    };
    svg.addEventListener('wheel', onWheel, wheelOpts);
    svg.addEventListener('touchmove', onTouchMove, touchOpts);
    return () => {
      svg.removeEventListener('wheel', onWheel, wheelOpts);
      svg.removeEventListener('touchmove', onTouchMove, touchOpts);
    };
  }, [mapData, pathFn]);
  const zoomIn = () => {
    const t = transformRef.current;
    zoomAt(MAP_VB_W / 2, MAP_VB_H / 2, t.k * 1.5);
  };
  const zoomOut = () => {
    const t = transformRef.current;
    zoomAt(MAP_VB_W / 2, MAP_VB_H / 2, t.k / 1.5);
  };
  const zoomReset = () => setTransform(1, 0, 0);
  const cities = travelData.cities || [];

  // Native event delegation for marker hover / click. React's
  // synthetic events on SVG `<g>` elements do not reliably fire
  // for real (trusted) mouse input from production browsers - see
  // commit history. Verified by capturing events at the document
  // level: native pointerover / click on the marker children DO
  // fire, but the React handler attached to the marker `<g>` is
  // never invoked. Attaching native listeners on the parent SVG
  // and dispatching manually based on event target sidesteps the
  // problem entirely.
  useEffect(() => {
    if (!mapData || !pathFn) return;
    const svg = svgRef.current;
    if (!svg) return;
    const markerForEvent = e => {
      const t = e.target;
      return t && t.closest ? t.closest('.travel-marker') : null;
    };
    const cityForMarker = markerEl => {
      const idx = parseInt(markerEl.getAttribute('data-idx'), 10);
      return Number.isFinite(idx) ? cities[idx] : null;
    };
    const onMouseOver = e => {
      const m = markerForEvent(e);
      if (!m) return;
      // mouseover fires for every child entry; only react when
      // crossing from outside the marker to inside.
      const related = e.relatedTarget;
      if (related && related.closest && related.closest('.travel-marker') === m) return;
      const c = cityForMarker(m);
      if (c) setHovered(c);
    };
    const onMouseOut = e => {
      const m = markerForEvent(e);
      if (!m) return;
      const related = e.relatedTarget;
      if (related && related.closest && related.closest('.travel-marker') === m) return;
      setHovered(null);
    };
    const onMarkerClick = e => {
      const m = markerForEvent(e);
      if (!m) return;
      e.stopPropagation();
      const c = cityForMarker(m);
      if (!c) return;
      setHovered(null);
      setPinned(prev => prev && prev.name === c.name ? null : c);
    };
    svg.addEventListener('mouseover', onMouseOver);
    svg.addEventListener('mouseout', onMouseOut);
    svg.addEventListener('click', onMarkerClick, true);
    return () => {
      svg.removeEventListener('mouseover', onMouseOver);
      svg.removeEventListener('mouseout', onMouseOut);
      svg.removeEventListener('click', onMarkerClick, true);
    };
  }, [mapData, pathFn, cities]);
  return /*#__PURE__*/React.createElement("section", {
    id: "travel",
    ref: ref,
    className: `section ${visible ? 'visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Travel Chronicles"), /*#__PURE__*/React.createElement("p", {
    className: "projects-caption"
  }, /*#__PURE__*/React.createElement("em", null, "Off the clock."), " I love exploring new cities, hanging out with friends, getting lost in nature, and meeting new people along the way - the map below traces where those adventures have landed.", ' ', " .", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--accent)'
    }
  }, "Hover/Click/Touch"), " for snapshots,", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--accent)'
    }
  }, "scroll or pinch"), " to zoom,", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--accent)'
    }
  }, "drag"), " to pan. Double-click to reset."), /*#__PURE__*/React.createElement("div", {
    className: "journey-map-container",
    ref: containerRef
  }, !mapData || !pathFn ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 100,
      color: 'var(--text-secondary)'
    }
  }, "Loading map\u2026") : /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    viewBox: "0 0 960 600",
    style: {
      width: '100%',
      height: '100%',
      touchAction: 'none'
    },
    onDoubleClick: onDoubleClick
  }, /*#__PURE__*/React.createElement("g", {
    ref: groupRef
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "960",
    height: "600",
    fill: "transparent",
    style: {
      cursor: 'grab'
    },
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onPointerCancel: onPointerUp,
    onTouchStart: onTouchStart,
    onTouchEnd: onTouchEnd,
    onClick: onSvgClick
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      pointerEvents: 'none'
    }
  }, topojson.feature(mapData, mapData.objects.states).features.map((state, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: pathFn(state),
    fill: "var(--bg-tertiary)",
    stroke: "var(--border-color)",
    strokeWidth: "1.5"
  }))), cities.map((c, i) => {
    const proj = projectLatLng(c.lat, c.lng);
    if (!proj) return null;
    const {
      x,
      y
    } = proj;
    const isPark = c.type === 'park';
    const isSchool = c.type === 'school';
    // No React event handlers on the marker; events are
    // wired via native delegation above. data-idx lets the
    // delegated listener map the hit target back to its city.
    // Home city (where Rohit lives) gets a red marker + label.
    const markerColor = c.home ? '#d62828' : 'var(--accent)';
    const labelColor = c.home ? '#d62828' : 'var(--text-primary)';
    const labelWeight = c.home ? '700' : '500';
    if (isPark) {
      return /*#__PURE__*/React.createElement("g", {
        key: i,
        className: "travel-marker",
        "data-idx": i,
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: x,
        cy: y,
        r: "14",
        fill: markerColor,
        opacity: "0.06"
      }), /*#__PURE__*/React.createElement("g", {
        transform: `translate(${x}, ${y})`
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 0,-9 L 7,6 L -7,6 Z",
        fill: "none",
        stroke: markerColor,
        strokeWidth: "2",
        opacity: "0.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 0,-6 L 4,4 L -4,4 Z",
        fill: markerColor
      }), /*#__PURE__*/React.createElement("circle", {
        cy: "-4",
        r: "1.5",
        fill: "var(--bg-secondary)"
      })));
    }
    if (isSchool) {
      // Graduation cap. Identified in the legend by the
      // city name rather than a text label on the map
      // itself, to keep dense SoCal corner uncluttered.
      return /*#__PURE__*/React.createElement("g", {
        key: i,
        className: "travel-marker",
        "data-idx": i,
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: x,
        cy: y,
        r: "14",
        fill: markerColor,
        opacity: "0.06"
      }), /*#__PURE__*/React.createElement("g", {
        transform: `translate(${x}, ${y})`
      }, /*#__PURE__*/React.createElement("path", {
        d: "M -5,1 L -5,4 Q -5,6 -3,6 L 3,6 Q 5,6 5,4 L 5,1 Z",
        fill: markerColor,
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 0,-6 L 9,-1 L 0,3 L -9,-1 Z",
        fill: markerColor
      }), /*#__PURE__*/React.createElement("line", {
        x1: "7",
        y1: "-1",
        x2: "7",
        y2: "5",
        stroke: markerColor,
        strokeWidth: "1.2",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "6",
        r: "1.4",
        fill: markerColor
      })));
    }
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      className: "travel-marker",
      "data-idx": i,
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "16",
      fill: markerColor,
      opacity: "0.08"
    }), c.home && /*#__PURE__*/React.createElement("circle", {
      className: "home-pulse",
      cx: x,
      cy: y,
      r: "5"
    }), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${x}, ${y})`
    }, /*#__PURE__*/React.createElement("circle", {
      r: "10",
      fill: "none",
      stroke: markerColor,
      strokeWidth: "1.5",
      opacity: "0.3"
    }), /*#__PURE__*/React.createElement("circle", {
      r: "7",
      fill: "none",
      stroke: markerColor,
      strokeWidth: "2",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement("circle", {
      r: "4",
      fill: markerColor
    }), /*#__PURE__*/React.createElement("circle", {
      r: "1.5",
      fill: "var(--bg-secondary)"
    })), /*#__PURE__*/React.createElement("text", {
      x: x + (c.offsetX || 0),
      y: y + (c.offsetY || 25),
      textAnchor: c.textAnchor || 'middle',
      fill: labelColor,
      fontSize: "13",
      fontWeight: labelWeight,
      style: {
        pointerEvents: 'none',
        userSelect: 'none'
      }
    }, c.name));
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(825, 430)",
    style: {
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "130",
    height: "160",
    rx: "6",
    fill: "var(--bg-secondary)",
    stroke: "var(--border-color)",
    strokeWidth: "1",
    opacity: "0.92"
  }), /*#__PURE__*/React.createElement("text", {
    x: "12",
    y: "20",
    fontSize: "11",
    fontWeight: "700",
    letterSpacing: "1.2",
    fill: "var(--text-secondary)"
  }, "LEGEND"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(22, 50)"
  }, /*#__PURE__*/React.createElement("circle", {
    r: "7",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "1.5",
    opacity: "0.3"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "5",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "1.5",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "2.5",
    fill: "var(--accent)"
  })), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "54",
    fontSize: "13",
    fontWeight: "500",
    fill: "var(--text-primary)"
  }, "City"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(22, 80)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0,-7 L 6,5 L -6,5 Z",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "1.5",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0,-4 L 3,3 L -3,3 Z",
    fill: "var(--accent)"
  })), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "84",
    fontSize: "13",
    fontWeight: "500",
    fill: "var(--text-primary)"
  }, "National park"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(22, 110)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -4,1 L -4,3 Q -4,5 -2,5 L 2,5 Q 4,5 4,3 L 4,1 Z",
    fill: "var(--accent)",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0,-5 L 7,-1 L 0,2 L -7,-1 Z",
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5.5",
    y1: "-1",
    x2: "5.5",
    y2: "4",
    stroke: "var(--accent)",
    strokeWidth: "1",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5.5",
    cy: "5",
    r: "1.1",
    fill: "var(--accent)"
  })), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "114",
    fontSize: "13",
    fontWeight: "500",
    fill: "var(--text-primary)"
  }, "Riverside"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(22, 140)"
  }, /*#__PURE__*/React.createElement("circle", {
    r: "7",
    fill: "none",
    stroke: "#d62828",
    strokeWidth: "1.5",
    opacity: "0.3"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "5",
    fill: "none",
    stroke: "#d62828",
    strokeWidth: "1.5",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "2.5",
    fill: "#d62828"
  })), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "144",
    fontSize: "13",
    fontWeight: "700",
    fill: "#d62828"
  }, "Home"))), mapData && pathFn && /*#__PURE__*/React.createElement("div", {
    className: "map-zoom-controls",
    "aria-label": "Map zoom controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: zoomIn,
    "aria-label": "Zoom in",
    title: "Zoom in"
  }, "+"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: zoomOut,
    "aria-label": "Zoom out",
    title: "Zoom out"
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: zoomReset,
    "aria-label": "Reset zoom",
    title: "Reset"
  }, "\u27F3")), hover && /*#__PURE__*/React.createElement("div", {
    className: "map-tooltip"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "map-tooltip-close",
    "aria-label": "Close snapshot",
    onClick: e => {
      e.stopPropagation();
      dismissTooltip();
    }
  }, "\xD7"), hover.image && /*#__PURE__*/React.createElement("img", {
    src: hover.image,
    alt: hover.name,
    loading: "lazy"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-tooltip-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-tooltip-name"
  }, hover.name), /*#__PURE__*/React.createElement("div", {
    className: "map-tooltip-desc"
  }, hover.description), hover.image_credit && /*#__PURE__*/React.createElement("div", {
    className: "map-tooltip-credit"
  }, "Photo: ", hover.image_credit_url ? /*#__PURE__*/React.createElement("a", {
    href: hover.image_credit_url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, hover.image_credit) : hover.image_credit))))));
};

// ---- App ----
const App = () => {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const sectionIds = ['hero', 'news', 'publications', 'experience', 'gallery', 'skills', 'projects', 'travel'];
    const onScroll = () => {
      const y = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (y >= top && y < bottom) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToSection = id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = id === 'hero' ? 0 : el.offsetTop - 60;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Navigation, {
    active: active,
    onNavigate: scrollToSection
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 60
    }
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(NewsSection, null), /*#__PURE__*/React.createElement(Publications, null), /*#__PURE__*/React.createElement(Experience, null), /*#__PURE__*/React.createElement(Gallery, null), /*#__PURE__*/React.createElement(Skills, null), /*#__PURE__*/React.createElement(Projects, null), /*#__PURE__*/React.createElement(TravelMap, null), /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " ", aboutme.Name || 'Rohit Lal', ". All rights reserved.", aboutme.Github && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: aboutme.Github,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "GitHub")), aboutme.LinkedIn && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: aboutme.LinkedIn,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "LinkedIn")), aboutme.Scholar && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: aboutme.Scholar,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Scholar")))))));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));

//# sourceMappingURL=app.js.map