import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/* ------------------------------------------------------------------ */
/*  PALETTE (relevée sur le site : teal #0D6E6E, doré #C59B27)         */
/* ------------------------------------------------------------------ */
const TEAL = '#0D6E6E';
const GOLD = '#C59B27';
const INK = '#111111';
const WHITE = '#FFFFFF';

/*
  primary : fond teal plein. Au survol, le liquide DORÉ remplit le bouton
            et le texte passe en noir.
  outline : fond transparent, contour doré. Au survol, le liquide NOIR
            remplit le bouton et le texte passe en blanc.
*/
const VARIANTS = {
  primary: {
    '--liquid-fill': GOLD,
    '--liquid-text': WHITE,
    '--liquid-active-text': INK,
    '--liquid-border': TEAL,
    backgroundColor: TEAL,
  },
  outline: {
    '--liquid-fill': INK,
    '--liquid-text': INK,
    '--liquid-active-text': WHITE,
    '--liquid-border': GOLD,
    backgroundColor: 'transparent',
  },
};

const SIZES = {
  sm: 'min-h-9 px-4 text-xs gap-1.5',
  default: 'min-h-12 px-7 text-xs md:text-sm gap-2',
  lg: 'min-h-14 px-9 text-sm md:text-base gap-2.5',
};

const BASE_CLASSES = [
  'group relative isolate inline-flex items-center justify-center overflow-hidden',
  'rounded-full whitespace-nowrap select-none cursor-pointer',
  '[-webkit-tap-highlight-color:transparent]',
  'transition-[transform,box-shadow,border-color] duration-150 ease-out',
  'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.38)]',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D6E6E]',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ');

const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/*  CSS injecté une seule fois : affiche le texte de la couche inversée */
/* ------------------------------------------------------------------ */
const LIQUID_CSS =
  '[data-liquid-inverted] [data-liquid-text]::before{content:attr(data-liquid-text);}';

function injectLiquidStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('liquid-button-styles')) return;
  const el = document.createElement('style');
  el.id = 'liquid-button-styles';
  el.textContent = LIQUID_CSS;
  document.head.appendChild(el);
}

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                         */
/* ------------------------------------------------------------------ */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const DEFAULT_NOISE_FREQUENCY = { baseX: 0.035, baseY: 0.08 };

const isValidFrequency = (value) => Number.isFinite(value) && value >= 0;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Lit la valeur baseFrequency de feTurbulence ("0.035 0.08" ou "0.05"). */
export function parseNoiseFrequency(value) {
  const fallback = {
    baseX: DEFAULT_NOISE_FREQUENCY.baseX,
    baseY: DEFAULT_NOISE_FREQUENCY.baseY,
  };
  if (value == null) return fallback;

  const tokens = String(value).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return fallback;

  const parsed = tokens.map(Number);
  const x = parsed[0];
  const y = parsed[1];

  if (tokens.length === 1) {
    if (!isValidFrequency(x)) return fallback;
    return { baseX: x, baseY: x };
  }

  return {
    baseX: isValidFrequency(x) ? x : DEFAULT_NOISE_FREQUENCY.baseX,
    baseY: isValidFrequency(y) ? y : DEFAULT_NOISE_FREQUENCY.baseY,
  };
}

function formatNoiseFrequency(frequency) {
  return `${frequency.baseX} ${frequency.baseY}`;
}

/*
  Copie le contenu du bouton dans la couche inversée.
  Le texte est dessiné via ::before { content: attr(data-liquid-text) } :
  le libellé n'existe qu'une fois dans le DOM (pas de "EnvoyerEnvoyer").
*/
function cloneInvertedContent(source, dest) {
  const fragment = document.createDocumentFragment();
  source.childNodes.forEach((node) => {
    const clone = node.cloneNode(true);
    if (clone instanceof Element) {
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    }
    fragment.append(clone);
  });

  fragment.normalize();
  fragment.querySelectorAll('svg title, svg desc').forEach((el) => el.remove());

  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  for (const text of textNodes) {
    if (!text.data.trim() || text.parentNode instanceof SVGElement) continue;
    const label = document.createElement('span');
    label.setAttribute('data-liquid-text', text.data);
    text.replaceWith(label);
  }

  dest.replaceChildren(fragment);
}

const maxCornerDistance = (width, height, x, y) =>
  Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y)
  );

/* ------------------------------------------------------------------ */
/*  Composant                                                           */
/* ------------------------------------------------------------------ */
export const LiquidButton = forwardRef(function LiquidButton(
  {
    children,
    className,
    variant = 'primary',
    size = 'default',
    fillColor,
    textColor,
    activeTextColor,
    borderColor,
    noiseFrequency = '0.035 0.08',
    style,
    disabled,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onFocus,
    onBlur,
    ...rest
  },
  forwardedRef
) {
  const rawId = useId();
  const instanceId = `liquid-ink-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`;
  const filterId = `${instanceId}-filter`;
  const clipPathId = `${instanceId}-clip`;

  const buttonRef = useRef(null);
  const svgRef = useRef(null);
  const blobRef = useRef(null);
  const clipEllipseRef = useRef(null);
  const displacementRef = useRef(null);
  const turbulenceRef = useRef(null);
  const rippleRef = useRef(null);

  const [isPressed, setIsPressed] = useState(false);

  const contentRef = useRef(null);
  const invertedRef = useRef(null);
  const parsedFreq = parseNoiseFrequency(noiseFrequency);
  const parsedFreqRef = useRef(parsedFreq);
  parsedFreqRef.current = parsedFreq;

  const stateRef = useRef({
    x: 0,
    y: 0,
    radius: 0,
    radiusVelocity: 0,
    pointerActive: false,
    focusActive: false,
    targetSpeed: 0,
    speed: 0,
    targetAngle: 0,
    angle: 0,
    stretch: 1,
    frame: 0,
    lastFrame: 0,
    lastPointerTime: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    disabled: Boolean(disabled),

    time: 0,
    unstableJitterX: 0,
    unstableJitterY: 0,
    randomSeed: 8,

    ringProgress: 0,
    ringPhase: 0,
    ringX: 0,
    ringY: 0,
    ringOriginX: 0,
    ringOriginY: 0,
    ringEscapeAngle: 0,
    ringPeakScale: 0.58,
    ringDipRatio: 0.86,
    ringSpeedMult: 1.0,
    ringEccentricity: 1.0,
  });

  stateRef.current.disabled = Boolean(disabled);

  /* Dimensions en pixels CSS du bouton (avant transformations). */
  const getDimensions = useCallback(() => {
    const svg = svgRef.current;
    const button = buttonRef.current;
    if (!svg || !button) return { width: 0, height: 0, rect: null };
    const rect = svg.getBoundingClientRect();
    return { width: button.clientWidth, height: button.clientHeight, rect };
  }, []);

  /* Position du pointeur à l'écran -> pixels du bouton. */
  const toLocalPoint = useCallback(
    (clientX, clientY) => {
      const { rect, width, height } = getDimensions();
      if (!rect || width <= 0 || height <= 0 || rect.width <= 0 || rect.height <= 0) {
        return null;
      }
      return {
        x: clamp(((clientX - rect.left) * width) / rect.width, 0, width),
        y: clamp(((clientY - rect.top) * height) / rect.height, 0, height),
        width,
        height,
      };
    },
    [getDimensions]
  );

  const setShapeAttributes = useCallback((element, rx, ry, angle) => {
    if (!element) return;
    const s = stateRef.current;
    const renderX = s.x + s.unstableJitterX;
    const renderY = s.y + s.unstableJitterY;

    element.setAttribute('cx', String(renderX));
    element.setAttribute('cy', String(renderY));
    element.setAttribute('rx', String(Math.max(0, rx)));
    element.setAttribute('ry', String(Math.max(0, ry)));
    element.setAttribute('transform', `rotate(${angle} ${renderX} ${renderY})`);
  }, []);

  const renderShape = useCallback(() => {
    const { width, height } = getDimensions();
    if (width <= 0 || height <= 0) return;
    const s = stateRef.current;

    const axisScale = Math.sqrt(s.stretch);
    const rx = s.radius * axisScale;
    const ry = s.radius / axisScale;

    setShapeAttributes(blobRef.current, rx, ry, s.angle);
    setShapeAttributes(clipEllipseRef.current, rx, ry, s.angle);

    const reduced = prefersReducedMotion();

    if (turbulenceRef.current && !reduced) {
      const breathingFactor = 1 + Math.sin(s.time * 2.5) * 0.12;
      const { baseX, baseY } = parsedFreqRef.current;
      turbulenceRef.current.setAttribute(
        'baseFrequency',
        `${(baseX * breathingFactor).toFixed(4)} ${(baseY * (2 - breathingFactor)).toFixed(4)}`
      );
    }

    const livingFluidShimmer = Math.sin(s.time * 4) * 1.5;
    const ringTurbulence = s.ringPhase > 0 ? (1 - s.ringProgress) * 18 : 0;
    const displacementScale = reduced
      ? 0
      : 4.5 + s.speed * 18 + livingFluidShimmer + ringTurbulence;
    displacementRef.current?.setAttribute('scale', displacementScale.toFixed(2));

    if (rippleRef.current) {
      if (s.ringPhase > 0) {
        const baseDimension = Math.min(width, height);
        const peakRadius = baseDimension * s.ringPeakScale;
        const recoilDipRadius = peakRadius * s.ringDipRatio;
        let currentRadius = 0;
        let currentOpacity = 0;
        let currentStroke = 2.4;

        if (s.ringPhase === 1) {
          const easeOut = 1 - Math.pow(1 - s.ringProgress, 3);
          currentRadius = easeOut * peakRadius;
          currentOpacity = 0.95 - s.ringProgress * 0.12;
          currentStroke = 2.6 - s.ringProgress * 0.3;
        } else if (s.ringPhase === 2) {
          const recoilFactor = Math.sin(s.ringProgress * Math.PI);
          currentRadius = peakRadius - recoilFactor * (peakRadius - recoilDipRadius);
          currentOpacity = 0.88;
          currentStroke = 2.3;
        } else if (s.ringPhase === 3) {
          const p = s.ringProgress;
          currentRadius = recoilDipRadius + p * Math.max(width, height) * 0.85;
          currentOpacity = Math.max(0, 0.88 * (1 - p));
          currentStroke = Math.max(1, 2.3 * (1 - p * 0.6));
        }

        rippleRef.current.setAttribute('cx', String(s.ringX + s.unstableJitterX * 0.5));
        rippleRef.current.setAttribute('cy', String(s.ringY + s.unstableJitterY * 0.5));
        rippleRef.current.setAttribute('r', String(Math.max(0, currentRadius)));
        rippleRef.current.setAttribute('opacity', String(Math.max(0, currentOpacity)));
        rippleRef.current.style.strokeWidth = `${currentStroke.toFixed(2)}px`;
        rippleRef.current.style.display = 'block';
      } else {
        rippleRef.current.style.display = 'none';
      }
    }
  }, [getDimensions, setShapeAttributes]);

  const tickRef = useRef(() => {});

  const scheduleFrame = useCallback(() => {
    const s = stateRef.current;
    if (s.frame === 0) {
      s.frame = window.requestAnimationFrame((now) => tickRef.current(now));
    }
  }, []);

  tickRef.current = (now) => {
    const s = stateRef.current;
    s.frame = 0;

    const dt =
      s.lastFrame === 0 ? 1 / 60 : clamp((now - s.lastFrame) / 1000, 1 / 240, 1 / 30);
    s.lastFrame = now;
    s.time += dt;

    const { width, height } = getDimensions();
    if (width <= 0 || height <= 0) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      s.unstableJitterX = 0;
      s.unstableJitterY = 0;
      s.ringPhase = 0;
      s.ringProgress = 0;
    } else {
      const t = s.time;
      s.unstableJitterX =
        Math.sin(t * 3.7) * 2.2 + Math.sin(t * 7.1 + 1.2) * 1.4 + Math.cos(t * 11.3) * 0.8;
      s.unstableJitterY =
        Math.cos(t * 3.1) * 1.8 + Math.sin(t * 6.3 + 2.4) * 1.2 + Math.sin(t * 13.1) * 0.6;
    }

    const speedLerp = 1 - Math.exp(-dt / 0.105);
    s.speed += (s.targetSpeed - s.speed) * speedLerp;
    s.targetSpeed = 0;

    const breathingStretch = reduced ? 0 : Math.sin(s.time * 2.8) * 0.04;
    const desiredStretch = 1 + s.speed * 0.55 + (s.pointerActive ? breathingStretch : 0);
    s.stretch += (desiredStretch - s.stretch) * (1 - Math.exp(-dt / 0.08));

    const angleDelta = ((s.targetAngle - s.angle + 540) % 360) - 180;
    s.angle += angleDelta * (1 - Math.exp(-dt / 0.075));

    if (!reduced) {
      if (s.ringPhase === 1) {
        s.ringProgress += dt * 3.8 * s.ringSpeedMult;
        if (s.ringProgress >= 1) {
          s.ringPhase = 2;
          s.ringProgress = 0;
        }
      } else if (s.ringPhase === 2) {
        s.ringProgress += dt * 7.8 * s.ringSpeedMult;
        if (s.ringProgress >= 1) {
          s.ringPhase = 3;
          s.ringProgress = 0;
        }
      } else if (s.ringPhase === 3) {
        s.ringProgress += dt * 3.5 * s.ringSpeedMult;
        const glideSpeed = Math.max(width, height) * 1.55 * dt * s.ringSpeedMult;
        s.ringX += Math.cos(s.ringEscapeAngle) * glideSpeed;
        s.ringY += Math.sin(s.ringEscapeAngle) * glideSpeed;

        if (s.ringProgress >= 1) {
          s.ringPhase = 0;
          s.ringProgress = 0;
        }
      }
    }

    const active = (s.pointerActive || s.focusActive) && !s.disabled;
    const targetRadius = active
      ? maxCornerDistance(width, height, s.x, s.y) * Math.sqrt(s.stretch) * 1.14
      : 0;

    if (reduced) {
      s.radius = targetRadius;
      s.radiusVelocity = 0;
    } else {
      const spring = 150;
      const damping = 24;
      const acceleration = (targetRadius - s.radius) * spring - s.radiusVelocity * damping;
      s.radiusVelocity += acceleration * dt;
      s.radius += s.radiusVelocity * dt;
    }

    if (s.radius < 0) {
      s.radius = 0;
      s.radiusVelocity = 0;
    }

    renderShape();

    if (active || s.ringPhase > 0 || Math.abs(s.radius) > 0.1) {
      s.frame = window.requestAnimationFrame((next) => tickRef.current(next));
    } else {
      s.lastFrame = 0;
      s.radius = 0;
      s.radiusVelocity = 0;
      s.stretch = 1;
      s.speed = 0;
      s.ringPhase = 0;
      renderShape();
    }
  };

  const setOrigin = useCallback(
    (clientX, clientY) => {
      const point = toLocalPoint(clientX, clientY);
      if (!point) return;
      const s = stateRef.current;
      s.x = point.x;
      s.y = point.y;
      renderShape();
    },
    [toLocalPoint, renderShape]
  );

  const triggerClickImpulse = useCallback(
    (clientX, clientY) => {
      const point = toLocalPoint(clientX, clientY);
      if (!point) return;
      const { x: posX, y: posY, width, height } = point;
      const s = stateRef.current;

      s.ringOriginX = posX;
      s.ringOriginY = posY;
      s.ringX = posX;
      s.ringY = posY;
      s.ringPhase = 1;
      s.ringProgress = 0;

      s.randomSeed = Math.floor(Math.random() * 9999) + 1;
      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute('seed', String(s.randomSeed));
      }

      s.ringPeakScale = 0.56 + Math.random() * 0.09;
      s.ringDipRatio = 0.82 + Math.random() * 0.08;
      s.ringSpeedMult = 0.92 + Math.random() * 0.22;

      const centerX = width / 2;
      const centerY = height / 2;
      const dx = posX - centerX;
      const dy = posY - centerY;
      const baseAngle = Math.hypot(dx, dy) > 2 ? Math.atan2(dy, dx) : -Math.PI / 2;
      const anglePerturbation = (Math.random() - 0.5) * 0.85;
      s.ringEscapeAngle = baseAngle + anglePerturbation;

      const randomImpulse = 130 + Math.random() * 50;
      s.radiusVelocity += randomImpulse;

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(10);
        } catch (e) {
          /* ignoré */
        }
      }

      scheduleFrame();
    },
    [toLocalPoint, scheduleFrame]
  );

  const syncSize = useCallback(() => {
    const { width, height } = getDimensions();
    if (width <= 0 || height <= 0) return;
    const s = stateRef.current;
    if (s.x === 0 && s.y === 0) {
      s.x = width / 2;
      s.y = height / 2;
    }
    renderShape();
  }, [getDimensions, renderShape]);

  const updatePointerVelocity = (event) => {
    const now = performance.now();
    const s = stateRef.current;
    if (s.lastPointerTime > 0) {
      const elapsed = Math.max(8, now - s.lastPointerTime);
      const dx = event.clientX - s.lastPointerX;
      const dy = event.clientY - s.lastPointerY;
      const pixelsPerMs = Math.hypot(dx, dy) / elapsed;
      s.targetSpeed = clamp(pixelsPerMs / 1.65, 0, 1);

      if (Math.hypot(dx, dy) > 0.5) {
        s.targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      }
    }

    s.lastPointerTime = now;
    s.lastPointerX = event.clientX;
    s.lastPointerY = event.clientY;
  };

  /* Suit les changements de taille du bouton. */
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return undefined;

    syncSize();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        syncSize();
        scheduleFrame();
      });
      observer.observe(btn);
      return () => observer.disconnect();
    }

    const handleResize = () => {
      syncSize();
      scheduleFrame();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [syncSize, scheduleFrame]);

  /* Réinitialise l'état quand la fenêtre perd ou retrouve le focus. */
  useEffect(() => {
    const handleWindowBlur = () => {
      stateRef.current.pointerActive = false;
      stateRef.current.focusActive = false;
      stateRef.current.lastPointerTime = 0;
      setIsPressed(false);
      scheduleFrame();
    };

    const handleWindowFocus = () => {
      const btn = buttonRef.current;
      if (btn && btn.matches(':focus-visible') && !disabled) {
        stateRef.current.focusActive = true;
        scheduleFrame();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [disabled, scheduleFrame]);

  /* Annule l'animation en cours quand le composant disparaît. */
  useEffect(() => {
    const state = stateRef.current;
    return () => {
      if (state.frame !== 0) {
        window.cancelAnimationFrame(state.frame);
        state.frame = 0;
      }
    };
  }, []);

  /* Copie le contenu dans la couche inversée et la garde à jour. */
  useLayoutEffect(() => {
    injectLiquidStyles();

    const source = contentRef.current;
    const dest = invertedRef.current;
    if (!source || !dest) return undefined;

    const syncInvertedLayer = () => {
      cloneInvertedContent(source, dest);
    };

    syncInvertedLayer();
    const observer = new MutationObserver(syncInvertedLayer);
    observer.observe(source, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);

  const handlePointerEnter = (e) => {
    onPointerEnter?.(e);
    if (disabled || e.pointerType === 'touch') return;
    stateRef.current.pointerActive = true;
    setOrigin(e.clientX, e.clientY);
    updatePointerVelocity(e);
    scheduleFrame();
  };

  const handlePointerMove = (e) => {
    onPointerMove?.(e);
    if (disabled || e.pointerType === 'touch') return;
    setOrigin(e.clientX, e.clientY);
    updatePointerVelocity(e);
    scheduleFrame();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== 'touch') {
      setOrigin(e.clientX, e.clientY);
    }
    stateRef.current.pointerActive = false;
    stateRef.current.lastPointerTime = 0;
    setIsPressed(false);
    scheduleFrame();
    onPointerLeave?.(e);
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    stateRef.current.pointerActive = true;
    setIsPressed(true);
    setOrigin(e.clientX, e.clientY);
    triggerClickImpulse(e.clientX, e.clientY);
    onPointerDown?.(e);
  };

  const handlePointerUp = (e) => {
    setIsPressed(false);
    if (e.pointerType === 'touch') {
      stateRef.current.pointerActive = false;
      scheduleFrame();
    }
    onPointerUp?.(e);
  };

  const handlePointerCancel = (e) => {
    stateRef.current.pointerActive = false;
    stateRef.current.lastPointerTime = 0;
    setIsPressed(false);
    scheduleFrame();
    onPointerCancel?.(e);
  };

  const handleFocus = (e) => {
    const btn = buttonRef.current;
    const focusVisible = btn?.matches(':focus-visible') && !disabled;
    stateRef.current.focusActive = !!focusVisible;
    if (focusVisible) {
      const { width, height } = getDimensions();
      stateRef.current.x = width / 2;
      stateRef.current.y = height / 2;
      renderShape();
      scheduleFrame();
    }
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    stateRef.current.focusActive = false;
    scheduleFrame();
    onBlur?.(e);
  };

  /* Référence stable : évite de détacher / rattacher la ref du parent. */
  const assignRef = useCallback(
    (element) => {
      buttonRef.current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    },
    [forwardedRef]
  );

  const variantVars = VARIANTS[variant] || VARIANTS.primary;

  const customVars = {
    ...variantVars,
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: 'var(--liquid-border)',
    color: 'var(--liquid-text)',
    ...(fillColor ? { '--liquid-fill': fillColor } : {}),
    ...(textColor ? { '--liquid-text': textColor } : {}),
    ...(activeTextColor ? { '--liquid-active-text': activeTextColor } : {}),
    ...(borderColor ? { '--liquid-border': borderColor } : {}),
    '--liquid-clip': `url(#${clipPathId})`,
    ...style,
  };

  return (
    <button
      ref={assignRef}
      type="button"
      data-liquid-button
      className={cx(
        BASE_CLASSES,
        SIZES[size] || SIZES.default,
        isPressed && 'scale-[0.96] -translate-y-0 shadow-inner duration-75',
        className
      )}
      style={customVars}
      disabled={disabled}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {/* Pas de viewBox : une unité SVG = un pixel CSS du bouton. */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            x="-35%"
            y="-45%"
            width="170%"
            height="190%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency={formatNoiseFrequency(parsedFreq)}
              numOctaves={2}
              seed={8}
              result="liquid-noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="liquid-noise"
              scale={5}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
            <ellipse ref={clipEllipseRef} cx={0} cy={0} rx={0} ry={0} />
          </clipPath>
        </defs>
        <ellipse
          ref={blobRef}
          filter={`url(#${filterId})`}
          style={{ fill: 'var(--liquid-fill)' }}
          cx={0}
          cy={0}
          rx={0}
          ry={0}
        />
        <circle
          ref={rippleRef}
          filter={`url(#${filterId})`}
          cx={0}
          cy={0}
          r={0}
          fill="none"
          style={{
            stroke: 'var(--liquid-active-text)',
            strokeWidth: '2.4px',
            display: 'none',
          }}
        />
      </svg>

      <span
        ref={contentRef}
        data-liquid-content
        className={cx(
          'pointer-events-none relative z-10 inline-flex items-center justify-center gap-2 transition-transform duration-100',
          isPressed && 'scale-[0.98]'
        )}
        style={{ color: 'var(--liquid-text)' }}
      >
        {children}
      </span>

      <span
        ref={invertedRef}
        data-liquid-inverted
        className={cx(
          'pointer-events-none absolute inset-0 z-20 inline-flex items-center justify-center gap-2 px-[inherit] transition-transform duration-100',
          isPressed && 'scale-[0.98]'
        )}
        style={{
          color: 'var(--liquid-active-text)',
          clipPath: 'var(--liquid-clip)',
          WebkitClipPath: 'var(--liquid-clip)',
        }}
        aria-hidden="true"
      />
    </button>
  );
});

LiquidButton.displayName = 'LiquidButton';
export default LiquidButton;