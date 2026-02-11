import {
  A11yModule,
  BidiModule,
  BreakpointObserver,
  Directionality,
  ESCAPE,
  FocusMonitor,
  FocusTrapFactory,
  InteractivityChecker,
  LiveAnnouncer,
  MatCommonModule,
  MatIconModule,
  MediaMatcher,
  Platform,
  _CdkPrivateStyleLoader,
  _IdGenerator,
  _getEventTarget,
  _getFocusedElementPierceShadowDom,
  coerceArray,
  coerceElement,
  coerceNumberProperty,
  hasModifierKey,
  init_a11y,
  init_a11y_module,
  init_array,
  init_bidi,
  init_breakpoints_observer,
  init_common_module,
  init_directionality,
  init_element,
  init_focus_monitor,
  init_icon,
  init_id_generator,
  init_keycodes,
  init_keycodes2,
  init_passive_listeners,
  init_platform2,
  init_private,
  init_shadow_dom,
  init_style_loader,
  isFakeMousedownFromScreenReader,
  isFakeTouchstartFromScreenReader,
  normalizePassiveListenerOptions
} from "./chunk-ECNNNQ5B.js";
import {
  HttpClient,
  Router,
  RouterOutlet,
  init_http,
  init_router
} from "./chunk-PPGSDIHY.js";
import {
  ANIMATION_MODULE_TYPE,
  ApplicationRef,
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ConnectableObservable,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  FactoryTarget,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  IterableDiffers,
  Location,
  NgModule,
  NgModuleRef$1,
  NgZone,
  Observable,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  Subject,
  Subscription,
  TemplateRef,
  TestBed,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  __async,
  __decorate,
  __esm,
  __export,
  __spreadProps,
  __spreadValues,
  __toCommonJS,
  afterNextRender,
  animationFrameScheduler,
  asapScheduler,
  auditTime,
  booleanAttribute,
  core_exports,
  createComponent,
  defer,
  delay,
  distinctUntilChanged,
  effect,
  filter,
  finalize,
  forwardRef,
  init_common,
  init_core,
  init_esm,
  init_operators,
  init_tslib_es6,
  inject,
  isObservable,
  isPlatformBrowser,
  merge,
  numberAttribute,
  of,
  pairwise,
  provideZonelessChangeDetection,
  shareReplay,
  signal,
  startWith,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  untracked,
  ɵɵngDeclareClassMetadata,
  ɵɵngDeclareComponent,
  ɵɵngDeclareDirective,
  ɵɵngDeclareFactory,
  ɵɵngDeclareInjectable,
  ɵɵngDeclareInjector,
  ɵɵngDeclareNgModule
} from "./chunk-S5YEWOSK.js";

// node_modules/@angular/cdk/fesm2022/scrolling2.mjs
function supportsScrollBehavior() {
  if (scrollBehaviorSupported == null) {
    if (typeof document !== "object" || !document || typeof Element !== "function" || !Element) {
      scrollBehaviorSupported = false;
      return scrollBehaviorSupported;
    }
    if ("scrollBehavior" in document.documentElement.style) {
      scrollBehaviorSupported = true;
    } else {
      const scrollToFunction = Element.prototype.scrollTo;
      if (scrollToFunction) {
        scrollBehaviorSupported = !/\{\s*\[native code\]\s*\}/.test(scrollToFunction.toString());
      } else {
        scrollBehaviorSupported = false;
      }
    }
  }
  return scrollBehaviorSupported;
}
function getRtlScrollAxisType() {
  if (typeof document !== "object" || !document) {
    return RtlScrollAxisType.NORMAL;
  }
  if (rtlScrollAxisType == null) {
    const scrollContainer = document.createElement("div");
    const containerStyle = scrollContainer.style;
    scrollContainer.dir = "rtl";
    containerStyle.width = "1px";
    containerStyle.overflow = "auto";
    containerStyle.visibility = "hidden";
    containerStyle.pointerEvents = "none";
    containerStyle.position = "absolute";
    const content = document.createElement("div");
    const contentStyle = content.style;
    contentStyle.width = "2px";
    contentStyle.height = "1px";
    scrollContainer.appendChild(content);
    document.body.appendChild(scrollContainer);
    rtlScrollAxisType = RtlScrollAxisType.NORMAL;
    if (scrollContainer.scrollLeft === 0) {
      scrollContainer.scrollLeft = 1;
      rtlScrollAxisType = scrollContainer.scrollLeft === 0 ? RtlScrollAxisType.NEGATED : RtlScrollAxisType.INVERTED;
    }
    scrollContainer.remove();
  }
  return rtlScrollAxisType;
}
var RtlScrollAxisType, rtlScrollAxisType, scrollBehaviorSupported;
var init_scrolling2 = __esm({
  "node_modules/@angular/cdk/fesm2022/scrolling2.mjs"() {
    "use strict";
    (function(RtlScrollAxisType2) {
      RtlScrollAxisType2[RtlScrollAxisType2["NORMAL"] = 0] = "NORMAL";
      RtlScrollAxisType2[RtlScrollAxisType2["NEGATED"] = 1] = "NEGATED";
      RtlScrollAxisType2[RtlScrollAxisType2["INVERTED"] = 2] = "INVERTED";
    })(RtlScrollAxisType || (RtlScrollAxisType = {}));
  }
});

// node_modules/@angular/cdk/fesm2022/test-environment.mjs
function _isTestEnvironment() {
  return (
    // @ts-ignore
    typeof __karma__ !== "undefined" && !!__karma__ || // @ts-ignore
    typeof jasmine !== "undefined" && !!jasmine || // @ts-ignore
    typeof jest !== "undefined" && !!jest || // @ts-ignore
    typeof Mocha !== "undefined" && !!Mocha
  );
}
var init_test_environment = __esm({
  "node_modules/@angular/cdk/fesm2022/test-environment.mjs"() {
    "use strict";
  }
});

// node_modules/@angular/cdk/fesm2022/platform.mjs
var PlatformModule;
var init_platform = __esm({
  "node_modules/@angular/cdk/fesm2022/platform.mjs"() {
    "use strict";
    init_platform2();
    init_core();
    init_core();
    init_passive_listeners();
    init_shadow_dom();
    PlatformModule = class _PlatformModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PlatformModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PlatformModule });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PlatformModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: PlatformModule, decorators: [{
      type: NgModule,
      args: [{}]
    }] });
  }
});

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule, Breakpoints;
var init_layout = __esm({
  "node_modules/@angular/cdk/fesm2022/layout.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_breakpoints_observer();
    LayoutModule = class _LayoutModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _LayoutModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: LayoutModule, decorators: [{
      type: NgModule,
      args: [{}]
    }] });
    Breakpoints = {
      XSmall: "(max-width: 599.98px)",
      Small: "(min-width: 600px) and (max-width: 959.98px)",
      Medium: "(min-width: 960px) and (max-width: 1279.98px)",
      Large: "(min-width: 1280px) and (max-width: 1919.98px)",
      XLarge: "(min-width: 1920px)",
      Handset: "(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",
      Tablet: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
      Web: "(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",
      HandsetPortrait: "(max-width: 599.98px) and (orientation: portrait)",
      TabletPortrait: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",
      WebPortrait: "(min-width: 840px) and (orientation: portrait)",
      HandsetLandscape: "(max-width: 959.98px) and (orientation: landscape)",
      TabletLandscape: "(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
      WebLandscape: "(min-width: 1280px) and (orientation: landscape)"
    };
  }
});

// node_modules/@angular/material/fesm2022/animation.mjs
function _getAnimationsState() {
  if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, { optional: true }) === "NoopAnimations") {
    return "di-disabled";
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia("(prefers-reduced-motion)").matches;
  return reducedMotion ? "reduced-motion" : "enabled";
}
function _animationsDisabled() {
  return _getAnimationsState() !== "enabled";
}
var MATERIAL_ANIMATIONS, reducedMotion;
var init_animation = __esm({
  "node_modules/@angular/material/fesm2022/animation.mjs"() {
    "use strict";
    init_layout();
    init_core();
    MATERIAL_ANIMATIONS = new InjectionToken("MATERIAL_ANIMATIONS");
    reducedMotion = null;
  }
});

// node_modules/@angular/cdk/fesm2022/css-pixel-value.mjs
function coerceCssPixelValue(value2) {
  if (value2 == null) {
    return "";
  }
  return typeof value2 === "string" ? value2 : `${value2}px`;
}
var init_css_pixel_value = __esm({
  "node_modules/@angular/cdk/fesm2022/css-pixel-value.mjs"() {
    "use strict";
  }
});

// node_modules/@angular/cdk/fesm2022/coercion.mjs
var init_coercion = __esm({
  "node_modules/@angular/cdk/fesm2022/coercion.mjs"() {
    "use strict";
    init_element();
  }
});

// node_modules/@angular/material/fesm2022/ripple.mjs
function distanceToFurthestCorner(x, y, rect) {
  const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
  const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
  return Math.sqrt(distX * distX + distY * distY);
}
var RippleState, RippleRef, passiveCapturingEventOptions$1, RippleEventManager, defaultRippleAnimationConfig, ignoreMouseEventsTimeout, passiveCapturingEventOptions, pointerDownEvents, pointerUpEvents, _MatRippleStylesLoader, RippleRenderer, MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple;
var init_ripple = __esm({
  "node_modules/@angular/material/fesm2022/ripple.mjs"() {
    "use strict";
    init_platform();
    init_core();
    init_core();
    init_a11y();
    init_coercion();
    init_private();
    init_animation();
    (function(RippleState2) {
      RippleState2[RippleState2["FADING_IN"] = 0] = "FADING_IN";
      RippleState2[RippleState2["VISIBLE"] = 1] = "VISIBLE";
      RippleState2[RippleState2["FADING_OUT"] = 2] = "FADING_OUT";
      RippleState2[RippleState2["HIDDEN"] = 3] = "HIDDEN";
    })(RippleState || (RippleState = {}));
    RippleRef = class {
      _renderer;
      element;
      config;
      _animationForciblyDisabledThroughCss;
      /** Current state of the ripple. */
      state = RippleState.HIDDEN;
      constructor(_renderer, element, config, _animationForciblyDisabledThroughCss = false) {
        this._renderer = _renderer;
        this.element = element;
        this.config = config;
        this._animationForciblyDisabledThroughCss = _animationForciblyDisabledThroughCss;
      }
      /** Fades out the ripple element. */
      fadeOut() {
        this._renderer.fadeOutRipple(this);
      }
    };
    passiveCapturingEventOptions$1 = normalizePassiveListenerOptions({
      passive: true,
      capture: true
    });
    RippleEventManager = class {
      _events = /* @__PURE__ */ new Map();
      /** Adds an event handler. */
      addHandler(ngZone, name, element, handler) {
        const handlersForEvent = this._events.get(name);
        if (handlersForEvent) {
          const handlersForElement = handlersForEvent.get(element);
          if (handlersForElement) {
            handlersForElement.add(handler);
          } else {
            handlersForEvent.set(element, /* @__PURE__ */ new Set([handler]));
          }
        } else {
          this._events.set(name, /* @__PURE__ */ new Map([[element, /* @__PURE__ */ new Set([handler])]]));
          ngZone.runOutsideAngular(() => {
            document.addEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
          });
        }
      }
      /** Removes an event handler. */
      removeHandler(name, element, handler) {
        const handlersForEvent = this._events.get(name);
        if (!handlersForEvent) {
          return;
        }
        const handlersForElement = handlersForEvent.get(element);
        if (!handlersForElement) {
          return;
        }
        handlersForElement.delete(handler);
        if (handlersForElement.size === 0) {
          handlersForEvent.delete(element);
        }
        if (handlersForEvent.size === 0) {
          this._events.delete(name);
          document.removeEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
        }
      }
      /** Event handler that is bound and which dispatches the events to the different targets. */
      _delegateEventHandler = (event) => {
        const target = _getEventTarget(event);
        if (target) {
          this._events.get(event.type)?.forEach((handlers, element) => {
            if (element === target || element.contains(target)) {
              handlers.forEach((handler) => handler.handleEvent(event));
            }
          });
        }
      };
    };
    defaultRippleAnimationConfig = {
      enterDuration: 225,
      exitDuration: 150
    };
    ignoreMouseEventsTimeout = 800;
    passiveCapturingEventOptions = normalizePassiveListenerOptions({
      passive: true,
      capture: true
    });
    pointerDownEvents = ["mousedown", "touchstart"];
    pointerUpEvents = ["mouseup", "mouseleave", "touchend", "touchcancel"];
    _MatRippleStylesLoader = class __MatRippleStylesLoader {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: __MatRippleStylesLoader, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: __MatRippleStylesLoader, isStandalone: true, selector: "ng-component", host: { attributes: { "mat-ripple-style-loader": "" } }, ngImport: core_exports, template: "", isInline: true, styles: [".mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}\n"], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleStylesLoader, decorators: [{
      type: Component,
      args: [{ template: "", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: { "mat-ripple-style-loader": "" }, styles: [".mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}\n"] }]
    }] });
    RippleRenderer = class _RippleRenderer {
      _target;
      _ngZone;
      _platform;
      /** Element where the ripples are being added to. */
      _containerElement;
      /** Element which triggers the ripple elements on mouse events. */
      _triggerElement;
      /** Whether the pointer is currently down or not. */
      _isPointerDown = false;
      /**
       * Map of currently active ripple references.
       * The ripple reference is mapped to its element event listeners.
       * The reason why `| null` is used is that event listeners are added only
       * when the condition is truthy (see the `_startFadeOutTransition` method).
       */
      _activeRipples = /* @__PURE__ */ new Map();
      /** Latest non-persistent ripple that was triggered. */
      _mostRecentTransientRipple;
      /** Time in milliseconds when the last touchstart event happened. */
      _lastTouchStartEvent;
      /** Whether pointer-up event listeners have been registered. */
      _pointerUpEventsRegistered = false;
      /**
       * Cached dimensions of the ripple container. Set when the first
       * ripple is shown and cleared once no more ripples are visible.
       */
      _containerRect;
      static _eventManager = new RippleEventManager();
      constructor(_target, _ngZone, elementOrElementRef, _platform, injector) {
        this._target = _target;
        this._ngZone = _ngZone;
        this._platform = _platform;
        if (_platform.isBrowser) {
          this._containerElement = coerceElement(elementOrElementRef);
        }
        if (injector) {
          injector.get(_CdkPrivateStyleLoader).load(_MatRippleStylesLoader);
        }
      }
      /**
       * Fades in a ripple at the given coordinates.
       * @param x Coordinate within the element, along the X axis at which to start the ripple.
       * @param y Coordinate within the element, along the Y axis at which to start the ripple.
       * @param config Extra ripple options.
       */
      fadeInRipple(x, y, config = {}) {
        const containerRect = this._containerRect = this._containerRect || this._containerElement.getBoundingClientRect();
        const animationConfig = __spreadValues(__spreadValues({}, defaultRippleAnimationConfig), config.animation);
        if (config.centered) {
          x = containerRect.left + containerRect.width / 2;
          y = containerRect.top + containerRect.height / 2;
        }
        const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
        const offsetX = x - containerRect.left;
        const offsetY = y - containerRect.top;
        const enterDuration = animationConfig.enterDuration;
        const ripple = document.createElement("div");
        ripple.classList.add("mat-ripple-element");
        ripple.style.left = `${offsetX - radius}px`;
        ripple.style.top = `${offsetY - radius}px`;
        ripple.style.height = `${radius * 2}px`;
        ripple.style.width = `${radius * 2}px`;
        if (config.color != null) {
          ripple.style.backgroundColor = config.color;
        }
        ripple.style.transitionDuration = `${enterDuration}ms`;
        this._containerElement.appendChild(ripple);
        const computedStyles = window.getComputedStyle(ripple);
        const userTransitionProperty = computedStyles.transitionProperty;
        const userTransitionDuration = computedStyles.transitionDuration;
        const animationForciblyDisabledThroughCss = userTransitionProperty === "none" || // Note: The canonical unit for serialized CSS `<time>` properties is seconds. Additionally
        // some browsers expand the duration for every property (in our case `opacity` and `transform`).
        userTransitionDuration === "0s" || userTransitionDuration === "0s, 0s" || // If the container is 0x0, it's likely `display: none`.
        containerRect.width === 0 && containerRect.height === 0;
        const rippleRef = new RippleRef(this, ripple, config, animationForciblyDisabledThroughCss);
        ripple.style.transform = "scale3d(1, 1, 1)";
        rippleRef.state = RippleState.FADING_IN;
        if (!config.persistent) {
          this._mostRecentTransientRipple = rippleRef;
        }
        let eventListeners = null;
        if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) {
          this._ngZone.runOutsideAngular(() => {
            const onTransitionEnd = () => {
              if (eventListeners) {
                eventListeners.fallbackTimer = null;
              }
              clearTimeout(fallbackTimer);
              this._finishRippleTransition(rippleRef);
            };
            const onTransitionCancel = () => this._destroyRipple(rippleRef);
            const fallbackTimer = setTimeout(onTransitionCancel, enterDuration + 100);
            ripple.addEventListener("transitionend", onTransitionEnd);
            ripple.addEventListener("transitioncancel", onTransitionCancel);
            eventListeners = { onTransitionEnd, onTransitionCancel, fallbackTimer };
          });
        }
        this._activeRipples.set(rippleRef, eventListeners);
        if (animationForciblyDisabledThroughCss || !enterDuration) {
          this._finishRippleTransition(rippleRef);
        }
        return rippleRef;
      }
      /** Fades out a ripple reference. */
      fadeOutRipple(rippleRef) {
        if (rippleRef.state === RippleState.FADING_OUT || rippleRef.state === RippleState.HIDDEN) {
          return;
        }
        const rippleEl = rippleRef.element;
        const animationConfig = __spreadValues(__spreadValues({}, defaultRippleAnimationConfig), rippleRef.config.animation);
        rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleEl.style.opacity = "0";
        rippleRef.state = RippleState.FADING_OUT;
        if (rippleRef._animationForciblyDisabledThroughCss || !animationConfig.exitDuration) {
          this._finishRippleTransition(rippleRef);
        }
      }
      /** Fades out all currently active ripples. */
      fadeOutAll() {
        this._getActiveRipples().forEach((ripple) => ripple.fadeOut());
      }
      /** Fades out all currently active non-persistent ripples. */
      fadeOutAllNonPersistent() {
        this._getActiveRipples().forEach((ripple) => {
          if (!ripple.config.persistent) {
            ripple.fadeOut();
          }
        });
      }
      /** Sets up the trigger event listeners */
      setupTriggerEvents(elementOrElementRef) {
        const element = coerceElement(elementOrElementRef);
        if (!this._platform.isBrowser || !element || element === this._triggerElement) {
          return;
        }
        this._removeTriggerEvents();
        this._triggerElement = element;
        pointerDownEvents.forEach((type) => {
          _RippleRenderer._eventManager.addHandler(this._ngZone, type, element, this);
        });
      }
      /**
       * Handles all registered events.
       * @docs-private
       */
      handleEvent(event) {
        if (event.type === "mousedown") {
          this._onMousedown(event);
        } else if (event.type === "touchstart") {
          this._onTouchStart(event);
        } else {
          this._onPointerUp();
        }
        if (!this._pointerUpEventsRegistered) {
          this._ngZone.runOutsideAngular(() => {
            pointerUpEvents.forEach((type) => {
              this._triggerElement.addEventListener(type, this, passiveCapturingEventOptions);
            });
          });
          this._pointerUpEventsRegistered = true;
        }
      }
      /** Method that will be called if the fade-in or fade-in transition completed. */
      _finishRippleTransition(rippleRef) {
        if (rippleRef.state === RippleState.FADING_IN) {
          this._startFadeOutTransition(rippleRef);
        } else if (rippleRef.state === RippleState.FADING_OUT) {
          this._destroyRipple(rippleRef);
        }
      }
      /**
       * Starts the fade-out transition of the given ripple if it's not persistent and the pointer
       * is not held down anymore.
       */
      _startFadeOutTransition(rippleRef) {
        const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
        const { persistent } = rippleRef.config;
        rippleRef.state = RippleState.VISIBLE;
        if (!persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) {
          rippleRef.fadeOut();
        }
      }
      /** Destroys the given ripple by removing it from the DOM and updating its state. */
      _destroyRipple(rippleRef) {
        const eventListeners = this._activeRipples.get(rippleRef) ?? null;
        this._activeRipples.delete(rippleRef);
        if (!this._activeRipples.size) {
          this._containerRect = null;
        }
        if (rippleRef === this._mostRecentTransientRipple) {
          this._mostRecentTransientRipple = null;
        }
        rippleRef.state = RippleState.HIDDEN;
        if (eventListeners !== null) {
          rippleRef.element.removeEventListener("transitionend", eventListeners.onTransitionEnd);
          rippleRef.element.removeEventListener("transitioncancel", eventListeners.onTransitionCancel);
          if (eventListeners.fallbackTimer !== null) {
            clearTimeout(eventListeners.fallbackTimer);
          }
        }
        rippleRef.element.remove();
      }
      /** Function being called whenever the trigger is being pressed using mouse. */
      _onMousedown(event) {
        const isFakeMousedown = isFakeMousedownFromScreenReader(event);
        const isSyntheticEvent = this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
        if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
          this._isPointerDown = true;
          this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
        }
      }
      /** Function being called whenever the trigger is being pressed using touch. */
      _onTouchStart(event) {
        if (!this._target.rippleDisabled && !isFakeTouchstartFromScreenReader(event)) {
          this._lastTouchStartEvent = Date.now();
          this._isPointerDown = true;
          const touches = event.changedTouches;
          if (touches) {
            for (let i = 0; i < touches.length; i++) {
              this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
            }
          }
        }
      }
      /** Function being called whenever the trigger is being released. */
      _onPointerUp() {
        if (!this._isPointerDown) {
          return;
        }
        this._isPointerDown = false;
        this._getActiveRipples().forEach((ripple) => {
          const isVisible = ripple.state === RippleState.VISIBLE || ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN;
          if (!ripple.config.persistent && isVisible) {
            ripple.fadeOut();
          }
        });
      }
      _getActiveRipples() {
        return Array.from(this._activeRipples.keys());
      }
      /** Removes previously registered event listeners from the trigger element. */
      _removeTriggerEvents() {
        const trigger = this._triggerElement;
        if (trigger) {
          pointerDownEvents.forEach((type) => _RippleRenderer._eventManager.removeHandler(type, trigger, this));
          if (this._pointerUpEventsRegistered) {
            pointerUpEvents.forEach((type) => trigger.removeEventListener(type, this, passiveCapturingEventOptions));
            this._pointerUpEventsRegistered = false;
          }
        }
      }
    };
    MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken("mat-ripple-global-options");
    MatRipple = class _MatRipple {
      _elementRef = inject(ElementRef);
      _animationsDisabled = _animationsDisabled();
      /** Custom color for all ripples. */
      color;
      /** Whether the ripples should be visible outside the component's bounds. */
      unbounded;
      /**
       * Whether the ripple always originates from the center of the host element's bounds, rather
       * than originating from the location of the click event.
       */
      centered;
      /**
       * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
       * will be the distance from the center of the ripple to the furthest corner of the host element's
       * bounding rectangle.
       */
      radius = 0;
      /**
       * Configuration for the ripple animation. Allows modifying the enter and exit animation
       * duration of the ripples. The animation durations will be overwritten if the
       * `NoopAnimationsModule` is being used.
       */
      animation;
      /**
       * Whether click events will not trigger the ripple. Ripples can be still launched manually
       * by using the `launch()` method.
       */
      get disabled() {
        return this._disabled;
      }
      set disabled(value2) {
        if (value2) {
          this.fadeOutAllNonPersistent();
        }
        this._disabled = value2;
        this._setupTriggerEventsIfEnabled();
      }
      _disabled = false;
      /**
       * The element that triggers the ripple when click events are received.
       * Defaults to the directive's host element.
       */
      get trigger() {
        return this._trigger || this._elementRef.nativeElement;
      }
      set trigger(trigger) {
        this._trigger = trigger;
        this._setupTriggerEventsIfEnabled();
      }
      _trigger;
      /** Renderer for the ripple DOM manipulations. */
      _rippleRenderer;
      /** Options that are set globally for all ripples. */
      _globalOptions;
      /** @docs-private Whether ripple directive is initialized and the input bindings are set. */
      _isInitialized = false;
      constructor() {
        const ngZone = inject(NgZone);
        const platform = inject(Platform);
        const globalOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
        const injector = inject(Injector);
        this._globalOptions = globalOptions || {};
        this._rippleRenderer = new RippleRenderer(this, ngZone, this._elementRef, platform, injector);
      }
      ngOnInit() {
        this._isInitialized = true;
        this._setupTriggerEventsIfEnabled();
      }
      ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
      }
      /** Fades out all currently showing ripple elements. */
      fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
      }
      /** Fades out all currently showing non-persistent ripple elements. */
      fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
      }
      /**
       * Ripple configuration from the directive's input values.
       * @docs-private Implemented as part of RippleTarget
       */
      get rippleConfig() {
        return {
          centered: this.centered,
          radius: this.radius,
          color: this.color,
          animation: __spreadValues(__spreadValues(__spreadValues({}, this._globalOptions.animation), this._animationsDisabled ? { enterDuration: 0, exitDuration: 0 } : {}), this.animation),
          terminateOnPointerUp: this._globalOptions.terminateOnPointerUp
        };
      }
      /**
       * Whether ripples on pointer-down are disabled or not.
       * @docs-private Implemented as part of RippleTarget
       */
      get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
      }
      /** Sets up the trigger event listeners if ripples are enabled. */
      _setupTriggerEventsIfEnabled() {
        if (!this.disabled && this._isInitialized) {
          this._rippleRenderer.setupTriggerEvents(this.trigger);
        }
      }
      /** Launches a manual ripple at the specified coordinated or just by the ripple config. */
      launch(configOrX, y = 0, config) {
        if (typeof configOrX === "number") {
          return this._rippleRenderer.fadeInRipple(configOrX, y, __spreadValues(__spreadValues({}, this.rippleConfig), config));
        } else {
          return this._rippleRenderer.fadeInRipple(0, 0, __spreadValues(__spreadValues({}, this.rippleConfig), configOrX));
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRipple, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatRipple, isStandalone: true, selector: "[mat-ripple], [matRipple]", inputs: { color: ["matRippleColor", "color"], unbounded: ["matRippleUnbounded", "unbounded"], centered: ["matRippleCentered", "centered"], radius: ["matRippleRadius", "radius"], animation: ["matRippleAnimation", "animation"], disabled: ["matRippleDisabled", "disabled"], trigger: ["matRippleTrigger", "trigger"] }, host: { properties: { "class.mat-ripple-unbounded": "unbounded" }, classAttribute: "mat-ripple" }, exportAs: ["matRipple"], ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatRipple, decorators: [{
      type: Directive,
      args: [{
        selector: "[mat-ripple], [matRipple]",
        exportAs: "matRipple",
        host: {
          "class": "mat-ripple",
          "[class.mat-ripple-unbounded]": "unbounded"
        }
      }]
    }], ctorParameters: () => [], propDecorators: { color: [{
      type: Input,
      args: ["matRippleColor"]
    }], unbounded: [{
      type: Input,
      args: ["matRippleUnbounded"]
    }], centered: [{
      type: Input,
      args: ["matRippleCentered"]
    }], radius: [{
      type: Input,
      args: ["matRippleRadius"]
    }], animation: [{
      type: Input,
      args: ["matRippleAnimation"]
    }], disabled: [{
      type: Input,
      args: ["matRippleDisabled"]
    }], trigger: [{
      type: Input,
      args: ["matRippleTrigger"]
    }] } });
  }
});

// node_modules/@angular/material/fesm2022/ripple-loader.mjs
var eventListenerOptions, rippleInteractionEvents, matRippleUninitialized, matRippleClassName, matRippleCentered, matRippleDisabled, MatRippleLoader;
var init_ripple_loader = __esm({
  "node_modules/@angular/material/fesm2022/ripple-loader.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_platform();
    init_animation();
    init_ripple();
    eventListenerOptions = { capture: true };
    rippleInteractionEvents = ["focus", "mousedown", "mouseenter", "touchstart"];
    matRippleUninitialized = "mat-ripple-loader-uninitialized";
    matRippleClassName = "mat-ripple-loader-class-name";
    matRippleCentered = "mat-ripple-loader-centered";
    matRippleDisabled = "mat-ripple-loader-disabled";
    MatRippleLoader = class _MatRippleLoader {
      _document = inject(DOCUMENT);
      _animationsDisabled = _animationsDisabled();
      _globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
      _platform = inject(Platform);
      _ngZone = inject(NgZone);
      _injector = inject(Injector);
      _eventCleanups;
      _hosts = /* @__PURE__ */ new Map();
      constructor() {
        const renderer = inject(RendererFactory2).createRenderer(null, null);
        this._eventCleanups = this._ngZone.runOutsideAngular(() => rippleInteractionEvents.map((name) => renderer.listen(this._document, name, this._onInteraction, eventListenerOptions)));
      }
      ngOnDestroy() {
        const hosts = this._hosts.keys();
        for (const host of hosts) {
          this.destroyRipple(host);
        }
        this._eventCleanups.forEach((cleanup) => cleanup());
      }
      /**
       * Configures the ripple that will be rendered by the ripple loader.
       *
       * Stores the given information about how the ripple should be configured on the host
       * element so that it can later be retrived & used when the ripple is actually created.
       */
      configureRipple(host, config) {
        host.setAttribute(matRippleUninitialized, this._globalRippleOptions?.namespace ?? "");
        if (config.className || !host.hasAttribute(matRippleClassName)) {
          host.setAttribute(matRippleClassName, config.className || "");
        }
        if (config.centered) {
          host.setAttribute(matRippleCentered, "");
        }
        if (config.disabled) {
          host.setAttribute(matRippleDisabled, "");
        }
      }
      /** Sets the disabled state on the ripple instance corresponding to the given host element. */
      setDisabled(host, disabled) {
        const ripple = this._hosts.get(host);
        if (ripple) {
          ripple.target.rippleDisabled = disabled;
          if (!disabled && !ripple.hasSetUpEvents) {
            ripple.hasSetUpEvents = true;
            ripple.renderer.setupTriggerEvents(host);
          }
        } else if (disabled) {
          host.setAttribute(matRippleDisabled, "");
        } else {
          host.removeAttribute(matRippleDisabled);
        }
      }
      /**
       * Handles creating and attaching component internals
       * when a component is initially interacted with.
       */
      _onInteraction = (event) => {
        const eventTarget = _getEventTarget(event);
        if (eventTarget instanceof HTMLElement) {
          const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ""}"]`);
          if (element) {
            this._createRipple(element);
          }
        }
      };
      /** Creates a MatRipple and appends it to the given element. */
      _createRipple(host) {
        if (!this._document || this._hosts.has(host)) {
          return;
        }
        host.querySelector(".mat-ripple")?.remove();
        const rippleEl = this._document.createElement("span");
        rippleEl.classList.add("mat-ripple", host.getAttribute(matRippleClassName));
        host.append(rippleEl);
        const globalOptions = this._globalRippleOptions;
        const enterDuration = this._animationsDisabled ? 0 : globalOptions?.animation?.enterDuration ?? defaultRippleAnimationConfig.enterDuration;
        const exitDuration = this._animationsDisabled ? 0 : globalOptions?.animation?.exitDuration ?? defaultRippleAnimationConfig.exitDuration;
        const target = {
          rippleDisabled: this._animationsDisabled || globalOptions?.disabled || host.hasAttribute(matRippleDisabled),
          rippleConfig: {
            centered: host.hasAttribute(matRippleCentered),
            terminateOnPointerUp: globalOptions?.terminateOnPointerUp,
            animation: {
              enterDuration,
              exitDuration
            }
          }
        };
        const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform, this._injector);
        const hasSetUpEvents = !target.rippleDisabled;
        if (hasSetUpEvents) {
          renderer.setupTriggerEvents(host);
        }
        this._hosts.set(host, {
          target,
          renderer,
          hasSetUpEvents
        });
        host.removeAttribute(matRippleUninitialized);
      }
      destroyRipple(host) {
        const ripple = this._hosts.get(host);
        if (ripple) {
          ripple.renderer._removeTriggerEvents();
          this._hosts.delete(host);
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleLoader, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleLoader, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatRippleLoader, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
  }
});

// node_modules/@angular/material/fesm2022/structural-styles.mjs
var _StructuralStylesLoader;
var init_structural_styles = __esm({
  "node_modules/@angular/material/fesm2022/structural-styles.mjs"() {
    "use strict";
    init_core();
    init_core();
    _StructuralStylesLoader = class __StructuralStylesLoader {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: __StructuralStylesLoader, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: __StructuralStylesLoader, isStandalone: true, selector: "structural-styles", ngImport: core_exports, template: "", isInline: true, styles: ['.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}\n'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _StructuralStylesLoader, decorators: [{
      type: Component,
      args: [{ selector: "structural-styles", encapsulation: ViewEncapsulation.None, template: "", changeDetection: ChangeDetectionStrategy.OnPush, styles: ['.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}\n'] }]
    }] });
  }
});

// node_modules/@angular/material/fesm2022/icon-button.mjs
function transformTabIndex(value2) {
  return value2 == null ? void 0 : numberAttribute(value2);
}
var MAT_BUTTON_CONFIG, MatButtonBase, MatIconButton;
var init_icon_button = __esm({
  "node_modules/@angular/material/fesm2022/icon-button.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_a11y();
    init_private();
    init_ripple_loader();
    init_structural_styles();
    init_animation();
    MAT_BUTTON_CONFIG = new InjectionToken("MAT_BUTTON_CONFIG");
    MatButtonBase = class _MatButtonBase {
      _elementRef = inject(ElementRef);
      _ngZone = inject(NgZone);
      _animationsDisabled = _animationsDisabled();
      _config = inject(MAT_BUTTON_CONFIG, { optional: true });
      _focusMonitor = inject(FocusMonitor);
      _cleanupClick;
      _renderer = inject(Renderer2);
      /**
       * Handles the lazy creation of the MatButton ripple.
       * Used to improve initial load time of large applications.
       */
      _rippleLoader = inject(MatRippleLoader);
      /** Whether the button is set on an anchor node. */
      _isAnchor;
      /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
      _isFab = false;
      /**
       * Theme color of the button. This API is supported in M2 themes only, it has
       * no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/button/styling.
       *
       * For information on applying color variants in M3, see
       * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
       */
      color;
      /** Whether the ripple effect is disabled or not. */
      get disableRipple() {
        return this._disableRipple;
      }
      set disableRipple(value2) {
        this._disableRipple = value2;
        this._updateRippleDisabled();
      }
      _disableRipple = false;
      /** Whether the button is disabled. */
      get disabled() {
        return this._disabled;
      }
      set disabled(value2) {
        this._disabled = value2;
        this._updateRippleDisabled();
      }
      _disabled = false;
      /** `aria-disabled` value of the button. */
      ariaDisabled;
      /**
       * Natively disabled buttons prevent focus and any pointer events from reaching the button.
       * In some scenarios this might not be desirable, because it can prevent users from finding out
       * why the button is disabled (e.g. via tooltip). This is also useful for buttons that may
       * become disabled when activated, which would cause focus to be transferred to the document
       * body instead of remaining on the button.
       *
       * Enabling this input will change the button so that it is styled to be disabled and will be
       * marked as `aria-disabled`, but it will allow the button to receive events and focus.
       *
       * Note that by enabling this, you need to set the `tabindex` yourself if the button isn't
       * meant to be tabbable and you have to prevent the button action (e.g. form submissions).
       */
      disabledInteractive;
      /** Tab index for the button. */
      tabIndex;
      /**
       * Backwards-compatibility input that handles pre-existing `[tabindex]` bindings.
       * @docs-private
       */
      set _tabindex(value2) {
        this.tabIndex = value2;
      }
      constructor() {
        inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
        const element = this._elementRef.nativeElement;
        this._isAnchor = element.tagName === "A";
        this.disabledInteractive = this._config?.disabledInteractive ?? false;
        this.color = this._config?.color ?? null;
        this._rippleLoader?.configureRipple(element, { className: "mat-mdc-button-ripple" });
      }
      ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
        if (this._isAnchor) {
          this._setupAsAnchor();
        }
      }
      ngOnDestroy() {
        this._cleanupClick?.();
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
      }
      /** Focuses the button. */
      focus(origin = "program", options) {
        if (origin) {
          this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
        } else {
          this._elementRef.nativeElement.focus(options);
        }
      }
      _getAriaDisabled() {
        if (this.ariaDisabled != null) {
          return this.ariaDisabled;
        }
        if (this._isAnchor) {
          return this.disabled || null;
        }
        return this.disabled && this.disabledInteractive ? true : null;
      }
      _getDisabledAttribute() {
        return this.disabledInteractive || !this.disabled ? null : true;
      }
      _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
      }
      _getTabIndex() {
        if (this._isAnchor) {
          return this.disabled && !this.disabledInteractive ? -1 : this.tabIndex;
        }
        return this.tabIndex;
      }
      _setupAsAnchor() {
        this._cleanupClick = this._ngZone.runOutsideAngular(() => this._renderer.listen(this._elementRef.nativeElement, "click", (event) => {
          if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        }));
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatButtonBase, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: _MatButtonBase, isStandalone: true, inputs: { color: "color", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], ariaDisabled: ["aria-disabled", "ariaDisabled", booleanAttribute], disabledInteractive: ["disabledInteractive", "disabledInteractive", booleanAttribute], tabIndex: ["tabIndex", "tabIndex", transformTabIndex], _tabindex: ["tabindex", "_tabindex", transformTabIndex] }, host: { properties: { "class": 'color ? "mat-" + color : ""', "attr.disabled": "_getDisabledAttribute()", "attr.aria-disabled": "_getAriaDisabled()", "attr.tabindex": "_getTabIndex()", "class.mat-mdc-button-disabled": "disabled", "class.mat-mdc-button-disabled-interactive": "disabledInteractive", "class.mat-unthemed": "!color", "class._mat-animation-noopable": "_animationsDisabled" }, classAttribute: "mat-mdc-button-base" }, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatButtonBase, decorators: [{
      type: Directive,
      args: [{
        host: {
          // Add a class that applies to all buttons. This makes it easier to target if somebody
          // wants to target all Material buttons.
          "class": "mat-mdc-button-base",
          "[class]": 'color ? "mat-" + color : ""',
          "[attr.disabled]": "_getDisabledAttribute()",
          "[attr.aria-disabled]": "_getAriaDisabled()",
          "[attr.tabindex]": "_getTabIndex()",
          "[class.mat-mdc-button-disabled]": "disabled",
          "[class.mat-mdc-button-disabled-interactive]": "disabledInteractive",
          "[class.mat-unthemed]": "!color",
          "[class._mat-animation-noopable]": "_animationsDisabled"
        }
      }]
    }], ctorParameters: () => [], propDecorators: { color: [{
      type: Input
    }], disableRipple: [{
      type: Input,
      args: [{ transform: booleanAttribute }]
    }], disabled: [{
      type: Input,
      args: [{ transform: booleanAttribute }]
    }], ariaDisabled: [{
      type: Input,
      args: [{ transform: booleanAttribute, alias: "aria-disabled" }]
    }], disabledInteractive: [{
      type: Input,
      args: [{ transform: booleanAttribute }]
    }], tabIndex: [{
      type: Input,
      args: [{ transform: transformTabIndex }]
    }], _tabindex: [{
      type: Input,
      args: [{ alias: "tabindex", transform: transformTabIndex }]
    }] } });
    MatIconButton = class _MatIconButton extends MatButtonBase {
      constructor() {
        super();
        this._rippleLoader.configureRipple(this._elementRef.nativeElement, { centered: true });
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatIconButton, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatIconButton, isStandalone: true, selector: "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]", host: { classAttribute: "mdc-icon-button mat-mdc-icon-button" }, exportAs: ["matButton", "matAnchor"], usesInheritance: true, ngImport: core_exports, template: `<span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>

<ng-content></ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-icon-button{-webkit-user-select:none;user-select:none;display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;text-decoration:none;cursor:pointer;z-index:0;overflow:visible;border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));flex-shrink:0;text-align:center;width:var(--mat-icon-button-state-layer-size, 40px);height:var(--mat-icon-button-state-layer-size, 40px);padding:calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);font-size:var(--mat-icon-button-icon-size, 24px);color:var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-icon-button .mdc-button__label,.mat-mdc-icon-button .mat-icon{z-index:1;position:relative}.mat-mdc-icon-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-icon-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-icon-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-icon-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-icon-button-touch-target-size, 48px);display:var(--mat-icon-button-touch-target-display, block);left:50%;width:var(--mat-icon-button-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button[disabled],.mat-mdc-icon-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-icon-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-icon-button img,.mat-mdc-icon-button svg{width:var(--mat-icon-button-icon-size, 24px);height:var(--mat-icon-button-icon-size, 24px);vertical-align:baseline}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%))}.mat-mdc-icon-button[hidden]{display:none}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}\n', "@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}\n"], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatIconButton, decorators: [{
      type: Component,
      args: [{ selector: `button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]`, host: {
        "class": "mdc-icon-button mat-mdc-icon-button"
      }, exportAs: "matButton, matAnchor", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `<span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>

<ng-content></ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-icon-button{-webkit-user-select:none;user-select:none;display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;text-decoration:none;cursor:pointer;z-index:0;overflow:visible;border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));flex-shrink:0;text-align:center;width:var(--mat-icon-button-state-layer-size, 40px);height:var(--mat-icon-button-state-layer-size, 40px);padding:calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);font-size:var(--mat-icon-button-icon-size, 24px);color:var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-icon-button .mdc-button__label,.mat-mdc-icon-button .mat-icon{z-index:1;position:relative}.mat-mdc-icon-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-icon-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-icon-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-icon-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-icon-button-touch-target-size, 48px);display:var(--mat-icon-button-touch-target-display, block);left:50%;width:var(--mat-icon-button-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button[disabled],.mat-mdc-icon-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-icon-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-icon-button img,.mat-mdc-icon-button svg{width:var(--mat-icon-button-icon-size, 24px);height:var(--mat-icon-button-icon-size, 24px);vertical-align:baseline}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%))}.mat-mdc-icon-button[hidden]{display:none}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}\n', "@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}\n"] }]
    }], ctorParameters: () => [] });
  }
});

// node_modules/@angular/material/fesm2022/ripple-module.mjs
var MatRippleModule;
var init_ripple_module = __esm({
  "node_modules/@angular/material/fesm2022/ripple-module.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_common_module();
    init_ripple();
    MatRippleModule = class _MatRippleModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleModule, imports: [MatCommonModule, MatRipple], exports: [MatRipple, MatCommonModule] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatRippleModule, imports: [MatCommonModule, MatCommonModule] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatRippleModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [MatCommonModule, MatRipple],
        exports: [MatRipple, MatCommonModule]
      }]
    }] });
  }
});

// node_modules/@angular/material/fesm2022/button.mjs
function _inferAppearance(button) {
  if (button.hasAttribute("mat-raised-button")) {
    return "elevated";
  }
  if (button.hasAttribute("mat-stroked-button")) {
    return "outlined";
  }
  if (button.hasAttribute("mat-flat-button")) {
    return "filled";
  }
  if (button.hasAttribute("mat-button")) {
    return "text";
  }
  return null;
}
function MAT_FAB_DEFAULT_OPTIONS_FACTORY() {
  return {
    // The FAB by default has its color set to accent.
    color: "accent"
  };
}
var APPEARANCE_CLASSES, MatButton, MAT_FAB_DEFAULT_OPTIONS, defaults, MatFabButton, MatMiniFabButton, MatButtonModule;
var init_button = __esm({
  "node_modules/@angular/material/fesm2022/button.mjs"() {
    "use strict";
    init_icon_button();
    init_core();
    init_core();
    init_ripple_module();
    init_common_module();
    APPEARANCE_CLASSES = /* @__PURE__ */ new Map([
      ["text", ["mat-mdc-button"]],
      ["filled", ["mdc-button--unelevated", "mat-mdc-unelevated-button"]],
      ["elevated", ["mdc-button--raised", "mat-mdc-raised-button"]],
      ["outlined", ["mdc-button--outlined", "mat-mdc-outlined-button"]],
      ["tonal", ["mat-tonal-button"]]
    ]);
    MatButton = class _MatButton extends MatButtonBase {
      /** Appearance of the button. */
      get appearance() {
        return this._appearance;
      }
      set appearance(value2) {
        this.setAppearance(value2 || this._config?.defaultAppearance || "text");
      }
      _appearance = null;
      constructor() {
        super();
        const inferredAppearance = _inferAppearance(this._elementRef.nativeElement);
        if (inferredAppearance) {
          this.setAppearance(inferredAppearance);
        }
      }
      /** Programmatically sets the appearance of the button. */
      setAppearance(appearance) {
        if (appearance === this._appearance) {
          return;
        }
        const classList = this._elementRef.nativeElement.classList;
        const previousClasses = this._appearance ? APPEARANCE_CLASSES.get(this._appearance) : null;
        const newClasses = APPEARANCE_CLASSES.get(appearance);
        if ((typeof ngDevMode === "undefined" || ngDevMode) && !newClasses) {
          throw new Error(`Unsupported MatButton appearance "${appearance}"`);
        }
        if (previousClasses) {
          classList.remove(...previousClasses);
        }
        classList.add(...newClasses);
        this._appearance = appearance;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatButton, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatButton, isStandalone: true, selector: "\n    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],\n    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],\n    a[mat-flat-button], a[mat-stroked-button]\n  ", inputs: { appearance: ["matButton", "appearance"] }, host: { classAttribute: "mdc-button" }, exportAs: ["matButton", "matAnchor"], usesInheritance: true, ngImport: core_exports, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-button-base{text-decoration:none}.mat-mdc-button-base .mat-icon{min-height:fit-content;flex-shrink:0}.mdc-button{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:none;line-height:inherit;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:rgba(0,0,0,0);padding:0 8px}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:none}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button[hidden]{display:none}.mdc-button .mdc-button__label{position:relative}.mat-mdc-button{padding:0 var(--mat-button-text-horizontal-padding, 12px);height:var(--mat-button-text-container-height, 40px);font-family:var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-text-label-text-transform);font-weight:var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight))}.mat-mdc-button,.mat-mdc-button .mdc-button__ripple{border-radius:var(--mat-button-text-container-shape, var(--mat-sys-corner-full))}.mat-mdc-button:not(:disabled){color:var(--mat-button-text-label-text-color, var(--mat-sys-primary))}.mat-mdc-button[disabled],.mat-mdc-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-button:has(.material-icons,mat-icon,[matButtonIcon]){padding:0 var(--mat-button-text-with-icon-horizontal-padding, 16px)}.mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}[dir=rtl] .mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}.mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}[dir=rtl] .mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}.mat-mdc-button .mat-ripple-element{background-color:var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-state-layer-color, var(--mat-sys-primary))}.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-text-touch-target-size, 48px);display:var(--mat-button-text-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-filled-container-height, 40px);font-family:var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-filled-label-text-transform);font-weight:var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-filled-horizontal-padding, 24px)}.mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}[dir=rtl] .mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}.mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}.mat-mdc-unelevated-button .mat-ripple-element{background-color:var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary))}.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-unelevated-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-unelevated-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-unelevated-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-unelevated-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-filled-touch-target-size, 48px);display:var(--mat-button-filled-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button:not(:disabled){color:var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));background-color:var(--mat-button-filled-container-color, var(--mat-sys-primary))}.mat-mdc-unelevated-button,.mat-mdc-unelevated-button .mdc-button__ripple{border-radius:var(--mat-button-filled-container-shape, var(--mat-sys-corner-full))}.mat-mdc-unelevated-button[disabled],.mat-mdc-unelevated-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-raised-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);box-shadow:var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));height:var(--mat-button-protected-container-height, 40px);font-family:var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-protected-label-text-transform);font-weight:var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-protected-horizontal-padding, 24px)}.mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}[dir=rtl] .mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}.mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}[dir=rtl] .mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}.mat-mdc-raised-button .mat-ripple-element{background-color:var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-state-layer-color, var(--mat-sys-primary))}.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-raised-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-raised-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-raised-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-raised-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-protected-touch-target-size, 48px);display:var(--mat-button-protected-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-raised-button:not(:disabled){color:var(--mat-button-protected-label-text-color, var(--mat-sys-primary));background-color:var(--mat-button-protected-container-color, var(--mat-sys-surface))}.mat-mdc-raised-button,.mat-mdc-raised-button .mdc-button__ripple{border-radius:var(--mat-button-protected-container-shape, var(--mat-sys-corner-full))}.mat-mdc-raised-button:hover{box-shadow:var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2))}.mat-mdc-raised-button:focus{box-shadow:var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button:active,.mat-mdc-raised-button:focus:active{box-shadow:var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button[disabled],.mat-mdc-raised-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-raised-button[disabled].mat-mdc-button-disabled,.mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled{box-shadow:var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0))}.mat-mdc-raised-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-outlined-button{border-style:solid;transition:border 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-outlined-container-height, 40px);font-family:var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-outlined-label-text-transform);font-weight:var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));border-radius:var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));border-width:var(--mat-button-outlined-outline-width, 1px);padding:0 var(--mat-button-outlined-horizontal-padding, 24px)}.mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}[dir=rtl] .mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}.mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}[dir=rtl] .mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}.mat-mdc-outlined-button .mat-ripple-element{background-color:var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary))}.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-outlined-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-outlined-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-outlined-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-outlined-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-outlined-touch-target-size, 48px);display:var(--mat-button-outlined-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-outlined-button:not(:disabled){color:var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));border-color:var(--mat-button-outlined-outline-color, var(--mat-sys-outline))}.mat-mdc-outlined-button[disabled],.mat-mdc-outlined-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));border-color:var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-tonal-container-height, 40px);font-family:var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-tonal-label-text-transform);font-weight:var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-tonal-horizontal-padding, 24px)}.mat-tonal-button:not(:disabled){color:var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));background-color:var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container))}.mat-tonal-button,.mat-tonal-button .mdc-button__ripple{border-radius:var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full))}.mat-tonal-button[disabled],.mat-tonal-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-tonal-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}[dir=rtl] .mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}.mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}[dir=rtl] .mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}.mat-tonal-button .mat-ripple-element{background-color:var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-tonal-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-tonal-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-tonal-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-tonal-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-tonal-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-tonal-touch-target-size, 48px);display:var(--mat-button-tonal-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-button,.mat-mdc-unelevated-button,.mat-mdc-raised-button,.mat-mdc-outlined-button,.mat-tonal-button{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-button .mdc-button__label,.mat-mdc-button .mat-icon,.mat-mdc-unelevated-button .mdc-button__label,.mat-mdc-unelevated-button .mat-icon,.mat-mdc-raised-button .mdc-button__label,.mat-mdc-raised-button .mat-icon,.mat-mdc-outlined-button .mdc-button__label,.mat-mdc-outlined-button .mat-icon,.mat-tonal-button .mdc-button__label,.mat-tonal-button .mat-icon{z-index:1;position:relative}.mat-mdc-button .mat-focus-indicator,.mat-mdc-unelevated-button .mat-focus-indicator,.mat-mdc-raised-button .mat-focus-indicator,.mat-mdc-outlined-button .mat-focus-indicator,.mat-tonal-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-button:focus>.mat-focus-indicator::before,.mat-mdc-unelevated-button:focus>.mat-focus-indicator::before,.mat-mdc-raised-button:focus>.mat-focus-indicator::before,.mat-mdc-outlined-button:focus>.mat-focus-indicator::before,.mat-tonal-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-button._mat-animation-noopable,.mat-mdc-unelevated-button._mat-animation-noopable,.mat-mdc-raised-button._mat-animation-noopable,.mat-mdc-outlined-button._mat-animation-noopable,.mat-tonal-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-button>.mat-icon,.mat-mdc-unelevated-button>.mat-icon,.mat-mdc-raised-button>.mat-icon,.mat-mdc-outlined-button>.mat-icon,.mat-tonal-button>.mat-icon{display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mdc-button__ripple{top:-1px;left:-1px;bottom:-1px;right:-1px}.mat-mdc-unelevated-button .mat-focus-indicator::before,.mat-tonal-button .mat-focus-indicator::before,.mat-mdc-raised-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-outlined-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px)*-1)}\n', "@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}\n"], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatButton, decorators: [{
      type: Component,
      args: [{ selector: `
    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],
    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],
    a[mat-flat-button], a[mat-stroked-button]
  `, host: {
        "class": "mdc-button"
      }, exportAs: "matButton, matAnchor", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-button-base{text-decoration:none}.mat-mdc-button-base .mat-icon{min-height:fit-content;flex-shrink:0}.mdc-button{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:none;line-height:inherit;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:rgba(0,0,0,0);padding:0 8px}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:none}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button[hidden]{display:none}.mdc-button .mdc-button__label{position:relative}.mat-mdc-button{padding:0 var(--mat-button-text-horizontal-padding, 12px);height:var(--mat-button-text-container-height, 40px);font-family:var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-text-label-text-transform);font-weight:var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight))}.mat-mdc-button,.mat-mdc-button .mdc-button__ripple{border-radius:var(--mat-button-text-container-shape, var(--mat-sys-corner-full))}.mat-mdc-button:not(:disabled){color:var(--mat-button-text-label-text-color, var(--mat-sys-primary))}.mat-mdc-button[disabled],.mat-mdc-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-button:has(.material-icons,mat-icon,[matButtonIcon]){padding:0 var(--mat-button-text-with-icon-horizontal-padding, 16px)}.mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}[dir=rtl] .mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}.mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}[dir=rtl] .mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}.mat-mdc-button .mat-ripple-element{background-color:var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-state-layer-color, var(--mat-sys-primary))}.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-text-touch-target-size, 48px);display:var(--mat-button-text-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-filled-container-height, 40px);font-family:var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-filled-label-text-transform);font-weight:var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-filled-horizontal-padding, 24px)}.mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}[dir=rtl] .mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}.mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}.mat-mdc-unelevated-button .mat-ripple-element{background-color:var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary))}.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-unelevated-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-unelevated-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-unelevated-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-unelevated-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-filled-touch-target-size, 48px);display:var(--mat-button-filled-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button:not(:disabled){color:var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));background-color:var(--mat-button-filled-container-color, var(--mat-sys-primary))}.mat-mdc-unelevated-button,.mat-mdc-unelevated-button .mdc-button__ripple{border-radius:var(--mat-button-filled-container-shape, var(--mat-sys-corner-full))}.mat-mdc-unelevated-button[disabled],.mat-mdc-unelevated-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-raised-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);box-shadow:var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));height:var(--mat-button-protected-container-height, 40px);font-family:var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-protected-label-text-transform);font-weight:var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-protected-horizontal-padding, 24px)}.mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}[dir=rtl] .mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}.mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}[dir=rtl] .mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}.mat-mdc-raised-button .mat-ripple-element{background-color:var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-state-layer-color, var(--mat-sys-primary))}.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-raised-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-raised-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-raised-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-raised-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-protected-touch-target-size, 48px);display:var(--mat-button-protected-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-raised-button:not(:disabled){color:var(--mat-button-protected-label-text-color, var(--mat-sys-primary));background-color:var(--mat-button-protected-container-color, var(--mat-sys-surface))}.mat-mdc-raised-button,.mat-mdc-raised-button .mdc-button__ripple{border-radius:var(--mat-button-protected-container-shape, var(--mat-sys-corner-full))}.mat-mdc-raised-button:hover{box-shadow:var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2))}.mat-mdc-raised-button:focus{box-shadow:var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button:active,.mat-mdc-raised-button:focus:active{box-shadow:var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button[disabled],.mat-mdc-raised-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-raised-button[disabled].mat-mdc-button-disabled,.mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled{box-shadow:var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0))}.mat-mdc-raised-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-outlined-button{border-style:solid;transition:border 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-outlined-container-height, 40px);font-family:var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-outlined-label-text-transform);font-weight:var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));border-radius:var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));border-width:var(--mat-button-outlined-outline-width, 1px);padding:0 var(--mat-button-outlined-horizontal-padding, 24px)}.mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}[dir=rtl] .mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}.mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}[dir=rtl] .mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}.mat-mdc-outlined-button .mat-ripple-element{background-color:var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary))}.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-outlined-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-outlined-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-outlined-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-outlined-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-outlined-touch-target-size, 48px);display:var(--mat-button-outlined-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-outlined-button:not(:disabled){color:var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));border-color:var(--mat-button-outlined-outline-color, var(--mat-sys-outline))}.mat-mdc-outlined-button[disabled],.mat-mdc-outlined-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));border-color:var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-tonal-container-height, 40px);font-family:var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-tonal-label-text-transform);font-weight:var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-tonal-horizontal-padding, 24px)}.mat-tonal-button:not(:disabled){color:var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));background-color:var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container))}.mat-tonal-button,.mat-tonal-button .mdc-button__ripple{border-radius:var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full))}.mat-tonal-button[disabled],.mat-tonal-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-tonal-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}[dir=rtl] .mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}.mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}[dir=rtl] .mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}.mat-tonal-button .mat-ripple-element{background-color:var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-tonal-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-tonal-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-tonal-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-tonal-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-tonal-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-button-tonal-touch-target-size, 48px);display:var(--mat-button-tonal-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-button,.mat-mdc-unelevated-button,.mat-mdc-raised-button,.mat-mdc-outlined-button,.mat-tonal-button{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-button .mdc-button__label,.mat-mdc-button .mat-icon,.mat-mdc-unelevated-button .mdc-button__label,.mat-mdc-unelevated-button .mat-icon,.mat-mdc-raised-button .mdc-button__label,.mat-mdc-raised-button .mat-icon,.mat-mdc-outlined-button .mdc-button__label,.mat-mdc-outlined-button .mat-icon,.mat-tonal-button .mdc-button__label,.mat-tonal-button .mat-icon{z-index:1;position:relative}.mat-mdc-button .mat-focus-indicator,.mat-mdc-unelevated-button .mat-focus-indicator,.mat-mdc-raised-button .mat-focus-indicator,.mat-mdc-outlined-button .mat-focus-indicator,.mat-tonal-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-button:focus>.mat-focus-indicator::before,.mat-mdc-unelevated-button:focus>.mat-focus-indicator::before,.mat-mdc-raised-button:focus>.mat-focus-indicator::before,.mat-mdc-outlined-button:focus>.mat-focus-indicator::before,.mat-tonal-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-button._mat-animation-noopable,.mat-mdc-unelevated-button._mat-animation-noopable,.mat-mdc-raised-button._mat-animation-noopable,.mat-mdc-outlined-button._mat-animation-noopable,.mat-tonal-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-button>.mat-icon,.mat-mdc-unelevated-button>.mat-icon,.mat-mdc-raised-button>.mat-icon,.mat-mdc-outlined-button>.mat-icon,.mat-tonal-button>.mat-icon{display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mdc-button__ripple{top:-1px;left:-1px;bottom:-1px;right:-1px}.mat-mdc-unelevated-button .mat-focus-indicator::before,.mat-tonal-button .mat-focus-indicator::before,.mat-mdc-raised-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-outlined-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px)*-1)}\n', "@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}\n"] }]
    }], ctorParameters: () => [], propDecorators: { appearance: [{
      type: Input,
      args: ["matButton"]
    }] } });
    MAT_FAB_DEFAULT_OPTIONS = new InjectionToken("mat-mdc-fab-default-options", {
      providedIn: "root",
      factory: MAT_FAB_DEFAULT_OPTIONS_FACTORY
    });
    defaults = MAT_FAB_DEFAULT_OPTIONS_FACTORY();
    MatFabButton = class _MatFabButton extends MatButtonBase {
      _options = inject(MAT_FAB_DEFAULT_OPTIONS, { optional: true });
      _isFab = true;
      extended;
      constructor() {
        super();
        this._options = this._options || defaults;
        this.color = this._options.color || defaults.color;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatFabButton, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "16.1.0", version: "20.2.0-next.2", type: _MatFabButton, isStandalone: true, selector: "button[mat-fab], a[mat-fab], button[matFab], a[matFab]", inputs: { extended: ["extended", "extended", booleanAttribute] }, host: { properties: { "class.mdc-fab--extended": "extended", "class.mat-mdc-extended-fab": "extended" }, classAttribute: "mdc-fab mat-mdc-fab-base mat-mdc-fab" }, exportAs: ["matButton", "matAnchor"], usesInheritance: true, ngImport: core_exports, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-fab-base{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:56px;height:56px;padding:0;border:none;fill:currentColor;text-decoration:none;cursor:pointer;-moz-appearance:none;-webkit-appearance:none;overflow:visible;transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),opacity 15ms linear 30ms,transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);flex-shrink:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-fab-base .mat-mdc-button-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-fab-base .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-fab-base .mdc-button__label,.mat-mdc-fab-base .mat-icon{z-index:1;position:relative}.mat-mdc-fab-base .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-fab-base:focus>.mat-focus-indicator::before{content:""}.mat-mdc-fab-base._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-fab-base::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-fab-base[hidden]{display:none}.mat-mdc-fab-base::-moz-focus-inner{padding:0;border:0}.mat-mdc-fab-base:active,.mat-mdc-fab-base:focus{outline:none}.mat-mdc-fab-base:hover{cursor:pointer}.mat-mdc-fab-base>svg{width:100%}.mat-mdc-fab-base .mat-icon,.mat-mdc-fab-base .material-icons{transition:transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);fill:currentColor;will-change:transform}.mat-mdc-fab-base .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base[disabled]:focus,.mat-mdc-fab-base.mat-mdc-button-disabled,.mat-mdc-fab-base.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-fab-base.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab{background-color:var(--mat-fab-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-container-shape, var(--mat-sys-corner-large));color:var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:hover{box-shadow:var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-fab:focus{box-shadow:var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:active,.mat-mdc-fab:focus:active{box-shadow:var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab[disabled],.mat-mdc-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-touch-target-size, 48px);display:var(--mat-fab-touch-target-display, block);left:50%;width:var(--mat-fab-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-fab .mat-ripple-element{background-color:var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-disabled-state-layer-color)}.mat-mdc-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-mini-fab{width:40px;height:40px;background-color:var(--mat-fab-small-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));color:var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:hover{box-shadow:var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-mini-fab:focus{box-shadow:var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:active,.mat-mdc-mini-fab:focus:active{box-shadow:var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab[disabled],.mat-mdc-mini-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-mini-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-small-touch-target-size, 48px);display:var(--mat-fab-small-touch-target-display);left:50%;width:var(--mat-fab-small-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-mini-fab .mat-ripple-element{background-color:var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-disabled-state-layer-color)}.mat-mdc-mini-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-mini-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-mini-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-extended-fab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:20px;padding-right:20px;width:auto;max-width:100%;line-height:normal;box-shadow:var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));height:var(--mat-fab-extended-container-height, 56px);border-radius:var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));font-family:var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-extended-fab:hover{box-shadow:var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-extended-fab:focus{box-shadow:var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab:active,.mat-mdc-extended-fab:focus:active{box-shadow:var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab[disabled]:focus,.mat-mdc-extended-fab.mat-mdc-button-disabled,.mat-mdc-extended-fab.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.mat-icon,[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.material-icons,.mat-mdc-extended-fab>.mat-icon,.mat-mdc-extended-fab>.material-icons{margin-left:-8px;margin-right:12px}.mat-mdc-extended-fab .mdc-button__label+.mat-icon,.mat-mdc-extended-fab .mdc-button__label+.material-icons,[dir=rtl] .mat-mdc-extended-fab>.mat-icon,[dir=rtl] .mat-mdc-extended-fab>.material-icons{margin-left:12px;margin-right:-8px}.mat-mdc-extended-fab .mat-mdc-button-touch-target{width:100%}\n'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatFabButton, decorators: [{
      type: Component,
      args: [{ selector: `button[mat-fab], a[mat-fab], button[matFab], a[matFab]`, host: {
        "class": "mdc-fab mat-mdc-fab-base mat-mdc-fab",
        "[class.mdc-fab--extended]": "extended",
        "[class.mat-mdc-extended-fab]": "extended"
      }, exportAs: "matButton, matAnchor", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-fab-base{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:56px;height:56px;padding:0;border:none;fill:currentColor;text-decoration:none;cursor:pointer;-moz-appearance:none;-webkit-appearance:none;overflow:visible;transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),opacity 15ms linear 30ms,transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);flex-shrink:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-fab-base .mat-mdc-button-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-fab-base .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-fab-base .mdc-button__label,.mat-mdc-fab-base .mat-icon{z-index:1;position:relative}.mat-mdc-fab-base .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-fab-base:focus>.mat-focus-indicator::before{content:""}.mat-mdc-fab-base._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-fab-base::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-fab-base[hidden]{display:none}.mat-mdc-fab-base::-moz-focus-inner{padding:0;border:0}.mat-mdc-fab-base:active,.mat-mdc-fab-base:focus{outline:none}.mat-mdc-fab-base:hover{cursor:pointer}.mat-mdc-fab-base>svg{width:100%}.mat-mdc-fab-base .mat-icon,.mat-mdc-fab-base .material-icons{transition:transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);fill:currentColor;will-change:transform}.mat-mdc-fab-base .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base[disabled]:focus,.mat-mdc-fab-base.mat-mdc-button-disabled,.mat-mdc-fab-base.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-fab-base.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab{background-color:var(--mat-fab-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-container-shape, var(--mat-sys-corner-large));color:var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:hover{box-shadow:var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-fab:focus{box-shadow:var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:active,.mat-mdc-fab:focus:active{box-shadow:var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab[disabled],.mat-mdc-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-touch-target-size, 48px);display:var(--mat-fab-touch-target-display, block);left:50%;width:var(--mat-fab-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-fab .mat-ripple-element{background-color:var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-disabled-state-layer-color)}.mat-mdc-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-mini-fab{width:40px;height:40px;background-color:var(--mat-fab-small-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));color:var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:hover{box-shadow:var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-mini-fab:focus{box-shadow:var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:active,.mat-mdc-mini-fab:focus:active{box-shadow:var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab[disabled],.mat-mdc-mini-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-mini-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-small-touch-target-size, 48px);display:var(--mat-fab-small-touch-target-display);left:50%;width:var(--mat-fab-small-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-mini-fab .mat-ripple-element{background-color:var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-disabled-state-layer-color)}.mat-mdc-mini-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-mini-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-mini-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-extended-fab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:20px;padding-right:20px;width:auto;max-width:100%;line-height:normal;box-shadow:var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));height:var(--mat-fab-extended-container-height, 56px);border-radius:var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));font-family:var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-extended-fab:hover{box-shadow:var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-extended-fab:focus{box-shadow:var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab:active,.mat-mdc-extended-fab:focus:active{box-shadow:var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab[disabled]:focus,.mat-mdc-extended-fab.mat-mdc-button-disabled,.mat-mdc-extended-fab.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.mat-icon,[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.material-icons,.mat-mdc-extended-fab>.mat-icon,.mat-mdc-extended-fab>.material-icons{margin-left:-8px;margin-right:12px}.mat-mdc-extended-fab .mdc-button__label+.mat-icon,.mat-mdc-extended-fab .mdc-button__label+.material-icons,[dir=rtl] .mat-mdc-extended-fab>.mat-icon,[dir=rtl] .mat-mdc-extended-fab>.material-icons{margin-left:12px;margin-right:-8px}.mat-mdc-extended-fab .mat-mdc-button-touch-target{width:100%}\n'] }]
    }], ctorParameters: () => [], propDecorators: { extended: [{
      type: Input,
      args: [{ transform: booleanAttribute }]
    }] } });
    MatMiniFabButton = class _MatMiniFabButton extends MatButtonBase {
      _options = inject(MAT_FAB_DEFAULT_OPTIONS, { optional: true });
      _isFab = true;
      constructor() {
        super();
        this._options = this._options || defaults;
        this.color = this._options.color || defaults.color;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatMiniFabButton, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatMiniFabButton, isStandalone: true, selector: "button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]", host: { classAttribute: "mdc-fab mat-mdc-fab-base mdc-fab--mini mat-mdc-mini-fab" }, exportAs: ["matButton", "matAnchor"], usesInheritance: true, ngImport: core_exports, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-fab-base{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:56px;height:56px;padding:0;border:none;fill:currentColor;text-decoration:none;cursor:pointer;-moz-appearance:none;-webkit-appearance:none;overflow:visible;transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),opacity 15ms linear 30ms,transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);flex-shrink:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-fab-base .mat-mdc-button-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-fab-base .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-fab-base .mdc-button__label,.mat-mdc-fab-base .mat-icon{z-index:1;position:relative}.mat-mdc-fab-base .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-fab-base:focus>.mat-focus-indicator::before{content:""}.mat-mdc-fab-base._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-fab-base::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-fab-base[hidden]{display:none}.mat-mdc-fab-base::-moz-focus-inner{padding:0;border:0}.mat-mdc-fab-base:active,.mat-mdc-fab-base:focus{outline:none}.mat-mdc-fab-base:hover{cursor:pointer}.mat-mdc-fab-base>svg{width:100%}.mat-mdc-fab-base .mat-icon,.mat-mdc-fab-base .material-icons{transition:transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);fill:currentColor;will-change:transform}.mat-mdc-fab-base .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base[disabled]:focus,.mat-mdc-fab-base.mat-mdc-button-disabled,.mat-mdc-fab-base.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-fab-base.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab{background-color:var(--mat-fab-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-container-shape, var(--mat-sys-corner-large));color:var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:hover{box-shadow:var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-fab:focus{box-shadow:var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:active,.mat-mdc-fab:focus:active{box-shadow:var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab[disabled],.mat-mdc-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-touch-target-size, 48px);display:var(--mat-fab-touch-target-display, block);left:50%;width:var(--mat-fab-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-fab .mat-ripple-element{background-color:var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-disabled-state-layer-color)}.mat-mdc-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-mini-fab{width:40px;height:40px;background-color:var(--mat-fab-small-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));color:var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:hover{box-shadow:var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-mini-fab:focus{box-shadow:var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:active,.mat-mdc-mini-fab:focus:active{box-shadow:var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab[disabled],.mat-mdc-mini-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-mini-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-small-touch-target-size, 48px);display:var(--mat-fab-small-touch-target-display);left:50%;width:var(--mat-fab-small-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-mini-fab .mat-ripple-element{background-color:var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-disabled-state-layer-color)}.mat-mdc-mini-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-mini-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-mini-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-extended-fab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:20px;padding-right:20px;width:auto;max-width:100%;line-height:normal;box-shadow:var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));height:var(--mat-fab-extended-container-height, 56px);border-radius:var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));font-family:var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-extended-fab:hover{box-shadow:var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-extended-fab:focus{box-shadow:var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab:active,.mat-mdc-extended-fab:focus:active{box-shadow:var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab[disabled]:focus,.mat-mdc-extended-fab.mat-mdc-button-disabled,.mat-mdc-extended-fab.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.mat-icon,[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.material-icons,.mat-mdc-extended-fab>.mat-icon,.mat-mdc-extended-fab>.material-icons{margin-left:-8px;margin-right:12px}.mat-mdc-extended-fab .mdc-button__label+.mat-icon,.mat-mdc-extended-fab .mdc-button__label+.material-icons,[dir=rtl] .mat-mdc-extended-fab>.mat-icon,[dir=rtl] .mat-mdc-extended-fab>.material-icons{margin-left:12px;margin-right:-8px}.mat-mdc-extended-fab .mat-mdc-button-touch-target{width:100%}\n'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatMiniFabButton, decorators: [{
      type: Component,
      args: [{ selector: `button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]`, host: {
        "class": "mdc-fab mat-mdc-fab-base mdc-fab--mini mat-mdc-mini-fab"
      }, exportAs: "matButton, matAnchor", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`, styles: ['.mat-mdc-fab-base{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:56px;height:56px;padding:0;border:none;fill:currentColor;text-decoration:none;cursor:pointer;-moz-appearance:none;-webkit-appearance:none;overflow:visible;transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),opacity 15ms linear 30ms,transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);flex-shrink:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-fab-base .mat-mdc-button-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-fab-base .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-fab-base .mdc-button__label,.mat-mdc-fab-base .mat-icon{z-index:1;position:relative}.mat-mdc-fab-base .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-fab-base:focus>.mat-focus-indicator::before{content:""}.mat-mdc-fab-base._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-fab-base::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-fab-base[hidden]{display:none}.mat-mdc-fab-base::-moz-focus-inner{padding:0;border:0}.mat-mdc-fab-base:active,.mat-mdc-fab-base:focus{outline:none}.mat-mdc-fab-base:hover{cursor:pointer}.mat-mdc-fab-base>svg{width:100%}.mat-mdc-fab-base .mat-icon,.mat-mdc-fab-base .material-icons{transition:transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);fill:currentColor;will-change:transform}.mat-mdc-fab-base .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-fab-base[disabled],.mat-mdc-fab-base[disabled]:focus,.mat-mdc-fab-base.mat-mdc-button-disabled,.mat-mdc-fab-base.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-fab-base.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab{background-color:var(--mat-fab-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-container-shape, var(--mat-sys-corner-large));color:var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:hover{box-shadow:var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-fab:focus{box-shadow:var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab:active,.mat-mdc-fab:focus:active{box-shadow:var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-fab[disabled],.mat-mdc-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-touch-target-size, 48px);display:var(--mat-fab-touch-target-display, block);left:50%;width:var(--mat-fab-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-fab .mat-ripple-element{background-color:var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-disabled-state-layer-color)}.mat-mdc-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-mini-fab{width:40px;height:40px;background-color:var(--mat-fab-small-container-color, var(--mat-sys-primary-container));border-radius:var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));color:var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));box-shadow:var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:hover{box-shadow:var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-mini-fab:focus{box-shadow:var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab:active,.mat-mdc-mini-fab:focus:active{box-shadow:var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-mini-fab[disabled],.mat-mdc-mini-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-mini-fab .mat-mdc-button-touch-target{position:absolute;top:50%;height:var(--mat-fab-small-touch-target-size, 48px);display:var(--mat-fab-small-touch-target-display);left:50%;width:var(--mat-fab-small-touch-target-size, 48px);transform:translate(-50%, -50%)}.mat-mdc-mini-fab .mat-ripple-element{background-color:var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container))}.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-fab-small-disabled-state-layer-color)}.mat-mdc-mini-fab:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-mini-fab.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-mini-fab:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-extended-fab{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;padding-left:20px;padding-right:20px;width:auto;max-width:100%;line-height:normal;box-shadow:var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));height:var(--mat-fab-extended-container-height, 56px);border-radius:var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));font-family:var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-extended-fab:hover{box-shadow:var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4))}.mat-mdc-extended-fab:focus{box-shadow:var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab:active,.mat-mdc-extended-fab:focus:active{box-shadow:var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3))}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab.mat-mdc-button-disabled{cursor:default;pointer-events:none}.mat-mdc-extended-fab[disabled],.mat-mdc-extended-fab[disabled]:focus,.mat-mdc-extended-fab.mat-mdc-button-disabled,.mat-mdc-extended-fab.mat-mdc-button-disabled:focus{box-shadow:none}.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive{pointer-events:auto}[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.mat-icon,[dir=rtl] .mat-mdc-extended-fab .mdc-button__label+.material-icons,.mat-mdc-extended-fab>.mat-icon,.mat-mdc-extended-fab>.material-icons{margin-left:-8px;margin-right:12px}.mat-mdc-extended-fab .mdc-button__label+.mat-icon,.mat-mdc-extended-fab .mdc-button__label+.material-icons,[dir=rtl] .mat-mdc-extended-fab>.mat-icon,[dir=rtl] .mat-mdc-extended-fab>.material-icons{margin-left:12px;margin-right:-8px}.mat-mdc-extended-fab .mat-mdc-button-touch-target{width:100%}\n'] }]
    }], ctorParameters: () => [] });
    MatButtonModule = class _MatButtonModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatButtonModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatButtonModule, imports: [
        MatCommonModule,
        MatRippleModule,
        MatButton,
        MatMiniFabButton,
        MatIconButton,
        MatFabButton
      ], exports: [MatCommonModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatButtonModule, imports: [
        MatCommonModule,
        MatRippleModule,
        MatCommonModule
      ] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatButtonModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [
          MatCommonModule,
          MatRippleModule,
          MatButton,
          MatMiniFabButton,
          MatIconButton,
          MatFabButton
        ],
        exports: [MatCommonModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton]
      }]
    }] });
  }
});

// node_modules/@angular/cdk/fesm2022/portal.mjs
function throwNullPortalError() {
  throw Error("Must provide a portal to attach");
}
function throwPortalAlreadyAttachedError() {
  throw Error("Host already has a portal attached");
}
function throwPortalOutletAlreadyDisposedError() {
  throw Error("This PortalOutlet has already been disposed");
}
function throwUnknownPortalTypeError() {
  throw Error("Attempting to attach an unknown Portal type. BasePortalOutlet accepts either a ComponentPortal or a TemplatePortal.");
}
function throwNullPortalOutletError() {
  throw Error("Attempting to attach a portal to a null PortalOutlet");
}
function throwNoPortalAttachedError() {
  throw Error("Attempting to detach a portal that is not attached to a host");
}
var Portal, ComponentPortal, TemplatePortal, DomPortal, BasePortalOutlet, DomPortalOutlet, CdkPortal, TemplatePortalDirective, CdkPortalOutlet, PortalHostDirective, PortalModule;
var init_portal = __esm({
  "node_modules/@angular/cdk/fesm2022/portal.mjs"() {
    "use strict";
    init_core();
    init_core();
    Portal = class {
      _attachedHost;
      /** Attach this portal to a host. */
      attach(host) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          if (host == null) {
            throwNullPortalOutletError();
          }
          if (host.hasAttached()) {
            throwPortalAlreadyAttachedError();
          }
        }
        this._attachedHost = host;
        return host.attach(this);
      }
      /** Detach this portal from its host */
      detach() {
        let host = this._attachedHost;
        if (host != null) {
          this._attachedHost = null;
          host.detach();
        } else if (typeof ngDevMode === "undefined" || ngDevMode) {
          throwNoPortalAttachedError();
        }
      }
      /** Whether this portal is attached to a host. */
      get isAttached() {
        return this._attachedHost != null;
      }
      /**
       * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
       * the PortalOutlet when it is performing an `attach()` or `detach()`.
       */
      setAttachedHost(host) {
        this._attachedHost = host;
      }
    };
    ComponentPortal = class extends Portal {
      /** The type of the component that will be instantiated for attachment. */
      component;
      /**
       * Where the attached component should live in Angular's *logical* component tree.
       * This is different from where the component *renders*, which is determined by the PortalOutlet.
       * The origin is necessary when the host is outside of the Angular application context.
       */
      viewContainerRef;
      /** Injector used for the instantiation of the component. */
      injector;
      /**
       * List of DOM nodes that should be projected through `<ng-content>` of the attached component.
       */
      projectableNodes;
      constructor(component, viewContainerRef, injector, projectableNodes) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.projectableNodes = projectableNodes;
      }
    };
    TemplatePortal = class extends Portal {
      templateRef;
      viewContainerRef;
      context;
      injector;
      constructor(templateRef, viewContainerRef, context, injector) {
        super();
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
        this.injector = injector;
      }
      get origin() {
        return this.templateRef.elementRef;
      }
      /**
       * Attach the portal to the provided `PortalOutlet`.
       * When a context is provided it will override the `context` property of the `TemplatePortal`
       * instance.
       */
      attach(host, context = this.context) {
        this.context = context;
        return super.attach(host);
      }
      detach() {
        this.context = void 0;
        return super.detach();
      }
    };
    DomPortal = class extends Portal {
      /** DOM node hosting the portal's content. */
      element;
      constructor(element) {
        super();
        this.element = element instanceof ElementRef ? element.nativeElement : element;
      }
    };
    BasePortalOutlet = class {
      /** The portal currently attached to the host. */
      _attachedPortal;
      /** A function that will permanently dispose this host. */
      _disposeFn;
      /** Whether this host has already been permanently disposed. */
      _isDisposed = false;
      /** Whether this host has an attached portal. */
      hasAttached() {
        return !!this._attachedPortal;
      }
      /** Attaches a portal. */
      attach(portal) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          if (!portal) {
            throwNullPortalError();
          }
          if (this.hasAttached()) {
            throwPortalAlreadyAttachedError();
          }
          if (this._isDisposed) {
            throwPortalOutletAlreadyDisposedError();
          }
        }
        if (portal instanceof ComponentPortal) {
          this._attachedPortal = portal;
          return this.attachComponentPortal(portal);
        } else if (portal instanceof TemplatePortal) {
          this._attachedPortal = portal;
          return this.attachTemplatePortal(portal);
        } else if (this.attachDomPortal && portal instanceof DomPortal) {
          this._attachedPortal = portal;
          return this.attachDomPortal(portal);
        }
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          throwUnknownPortalTypeError();
        }
      }
      // @breaking-change 10.0.0 `attachDomPortal` to become a required abstract method.
      attachDomPortal = null;
      /** Detaches a previously attached portal. */
      detach() {
        if (this._attachedPortal) {
          this._attachedPortal.setAttachedHost(null);
          this._attachedPortal = null;
        }
        this._invokeDisposeFn();
      }
      /** Permanently dispose of this portal host. */
      dispose() {
        if (this.hasAttached()) {
          this.detach();
        }
        this._invokeDisposeFn();
        this._isDisposed = true;
      }
      /** @docs-private */
      setDisposeFn(fn) {
        this._disposeFn = fn;
      }
      _invokeDisposeFn() {
        if (this._disposeFn) {
          this._disposeFn();
          this._disposeFn = null;
        }
      }
    };
    DomPortalOutlet = class extends BasePortalOutlet {
      outletElement;
      _appRef;
      _defaultInjector;
      /**
       * @param outletElement Element into which the content is projected.
       * @param _appRef Reference to the application. Only used in component portals when there
       *   is no `ViewContainerRef` available.
       * @param _defaultInjector Injector to use as a fallback when the portal being attached doesn't
       *   have one. Only used for component portals.
       */
      constructor(outletElement, _appRef, _defaultInjector) {
        super();
        this.outletElement = outletElement;
        this._appRef = _appRef;
        this._defaultInjector = _defaultInjector;
      }
      /**
       * Attach the given ComponentPortal to DOM element.
       * @param portal Portal to be attached
       * @returns Reference to the created component.
       */
      attachComponentPortal(portal) {
        let componentRef;
        if (portal.viewContainerRef) {
          const injector = portal.injector || portal.viewContainerRef.injector;
          const ngModuleRef = injector.get(NgModuleRef$1, null, { optional: true }) || void 0;
          componentRef = portal.viewContainerRef.createComponent(portal.component, {
            index: portal.viewContainerRef.length,
            injector,
            ngModuleRef,
            projectableNodes: portal.projectableNodes || void 0
          });
          this.setDisposeFn(() => componentRef.destroy());
        } else {
          if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._appRef) {
            throw Error("Cannot attach component portal to outlet without an ApplicationRef.");
          }
          const appRef = this._appRef;
          const elementInjector = portal.injector || this._defaultInjector || Injector.NULL;
          const environmentInjector = elementInjector.get(EnvironmentInjector, appRef.injector);
          componentRef = createComponent(portal.component, {
            elementInjector,
            environmentInjector,
            projectableNodes: portal.projectableNodes || void 0
          });
          appRef.attachView(componentRef.hostView);
          this.setDisposeFn(() => {
            if (appRef.viewCount > 0) {
              appRef.detachView(componentRef.hostView);
            }
            componentRef.destroy();
          });
        }
        this.outletElement.appendChild(this._getComponentRootNode(componentRef));
        this._attachedPortal = portal;
        return componentRef;
      }
      /**
       * Attaches a template portal to the DOM as an embedded view.
       * @param portal Portal to be attached.
       * @returns Reference to the created embedded view.
       */
      attachTemplatePortal(portal) {
        let viewContainer = portal.viewContainerRef;
        let viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context, {
          injector: portal.injector
        });
        viewRef.rootNodes.forEach((rootNode) => this.outletElement.appendChild(rootNode));
        viewRef.detectChanges();
        this.setDisposeFn(() => {
          let index = viewContainer.indexOf(viewRef);
          if (index !== -1) {
            viewContainer.remove(index);
          }
        });
        this._attachedPortal = portal;
        return viewRef;
      }
      /**
       * Attaches a DOM portal by transferring its content into the outlet.
       * @param portal Portal to be attached.
       * @deprecated To be turned into a method.
       * @breaking-change 10.0.0
       */
      attachDomPortal = (portal) => {
        const element = portal.element;
        if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error("DOM portal content must be attached to a parent node.");
        }
        const anchorNode = this.outletElement.ownerDocument.createComment("dom-portal");
        element.parentNode.insertBefore(anchorNode, element);
        this.outletElement.appendChild(element);
        this._attachedPortal = portal;
        super.setDisposeFn(() => {
          if (anchorNode.parentNode) {
            anchorNode.parentNode.replaceChild(element, anchorNode);
          }
        });
      };
      /**
       * Clears out a portal from the DOM.
       */
      dispose() {
        super.dispose();
        this.outletElement.remove();
      }
      /** Gets the root HTMLElement for an instantiated component. */
      _getComponentRootNode(componentRef) {
        return componentRef.hostView.rootNodes[0];
      }
    };
    CdkPortal = class _CdkPortal extends TemplatePortal {
      constructor() {
        const templateRef = inject(TemplateRef);
        const viewContainerRef = inject(ViewContainerRef);
        super(templateRef, viewContainerRef);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkPortal, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkPortal, isStandalone: true, selector: "[cdkPortal]", exportAs: ["cdkPortal"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkPortal, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdkPortal]",
        exportAs: "cdkPortal"
      }]
    }], ctorParameters: () => [] });
    TemplatePortalDirective = class _TemplatePortalDirective extends CdkPortal {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _TemplatePortalDirective, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _TemplatePortalDirective, isStandalone: true, selector: "[cdk-portal], [portal]", providers: [
        {
          provide: CdkPortal,
          useExisting: _TemplatePortalDirective
        }
      ], exportAs: ["cdkPortal"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: TemplatePortalDirective, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdk-portal], [portal]",
        exportAs: "cdkPortal",
        providers: [
          {
            provide: CdkPortal,
            useExisting: TemplatePortalDirective
          }
        ]
      }]
    }] });
    CdkPortalOutlet = class _CdkPortalOutlet extends BasePortalOutlet {
      _moduleRef = inject(NgModuleRef$1, { optional: true });
      _document = inject(DOCUMENT);
      _viewContainerRef = inject(ViewContainerRef);
      /** Whether the portal component is initialized. */
      _isInitialized = false;
      /** Reference to the currently-attached component/view ref. */
      _attachedRef;
      constructor() {
        super();
      }
      /** Portal associated with the Portal outlet. */
      get portal() {
        return this._attachedPortal;
      }
      set portal(portal) {
        if (this.hasAttached() && !portal && !this._isInitialized) {
          return;
        }
        if (this.hasAttached()) {
          super.detach();
        }
        if (portal) {
          super.attach(portal);
        }
        this._attachedPortal = portal || null;
      }
      /** Emits when a portal is attached to the outlet. */
      attached = new EventEmitter();
      /** Component or view reference that is attached to the portal. */
      get attachedRef() {
        return this._attachedRef;
      }
      ngOnInit() {
        this._isInitialized = true;
      }
      ngOnDestroy() {
        super.dispose();
        this._attachedRef = this._attachedPortal = null;
      }
      /**
       * Attach the given ComponentPortal to this PortalOutlet.
       *
       * @param portal Portal to be attached to the portal outlet.
       * @returns Reference to the created component.
       */
      attachComponentPortal(portal) {
        portal.setAttachedHost(this);
        const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this._viewContainerRef;
        const ref = viewContainerRef.createComponent(portal.component, {
          index: viewContainerRef.length,
          injector: portal.injector || viewContainerRef.injector,
          projectableNodes: portal.projectableNodes || void 0,
          ngModuleRef: this._moduleRef || void 0
        });
        if (viewContainerRef !== this._viewContainerRef) {
          this._getRootNode().appendChild(ref.hostView.rootNodes[0]);
        }
        super.setDisposeFn(() => ref.destroy());
        this._attachedPortal = portal;
        this._attachedRef = ref;
        this.attached.emit(ref);
        return ref;
      }
      /**
       * Attach the given TemplatePortal to this PortalHost as an embedded View.
       * @param portal Portal to be attached.
       * @returns Reference to the created embedded view.
       */
      attachTemplatePortal(portal) {
        portal.setAttachedHost(this);
        const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context, {
          injector: portal.injector
        });
        super.setDisposeFn(() => this._viewContainerRef.clear());
        this._attachedPortal = portal;
        this._attachedRef = viewRef;
        this.attached.emit(viewRef);
        return viewRef;
      }
      /**
       * Attaches the given DomPortal to this PortalHost by moving all of the portal content into it.
       * @param portal Portal to be attached.
       * @deprecated To be turned into a method.
       * @breaking-change 10.0.0
       */
      attachDomPortal = (portal) => {
        const element = portal.element;
        if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error("DOM portal content must be attached to a parent node.");
        }
        const anchorNode = this._document.createComment("dom-portal");
        portal.setAttachedHost(this);
        element.parentNode.insertBefore(anchorNode, element);
        this._getRootNode().appendChild(element);
        this._attachedPortal = portal;
        super.setDisposeFn(() => {
          if (anchorNode.parentNode) {
            anchorNode.parentNode.replaceChild(element, anchorNode);
          }
        });
      };
      /** Gets the root node of the portal outlet. */
      _getRootNode() {
        const nativeElement = this._viewContainerRef.element.nativeElement;
        return nativeElement.nodeType === nativeElement.ELEMENT_NODE ? nativeElement : nativeElement.parentNode;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkPortalOutlet, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkPortalOutlet, isStandalone: true, selector: "[cdkPortalOutlet]", inputs: { portal: ["cdkPortalOutlet", "portal"] }, outputs: { attached: "attached" }, exportAs: ["cdkPortalOutlet"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkPortalOutlet, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdkPortalOutlet]",
        exportAs: "cdkPortalOutlet"
      }]
    }], ctorParameters: () => [], propDecorators: { portal: [{
      type: Input,
      args: ["cdkPortalOutlet"]
    }], attached: [{
      type: Output
    }] } });
    PortalHostDirective = class _PortalHostDirective extends CdkPortalOutlet {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PortalHostDirective, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _PortalHostDirective, isStandalone: true, selector: "[cdkPortalHost], [portalHost]", inputs: { portal: ["cdkPortalHost", "portal"] }, providers: [
        {
          provide: CdkPortalOutlet,
          useExisting: _PortalHostDirective
        }
      ], exportAs: ["cdkPortalHost"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: PortalHostDirective, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdkPortalHost], [portalHost]",
        exportAs: "cdkPortalHost",
        inputs: [{ name: "portal", alias: "cdkPortalHost" }],
        providers: [
          {
            provide: CdkPortalOutlet,
            useExisting: PortalHostDirective
          }
        ]
      }]
    }] });
    PortalModule = class _PortalModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PortalModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PortalModule, imports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective], exports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _PortalModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: PortalModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective],
        exports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective]
      }]
    }] });
  }
});

// node_modules/@angular/cdk/fesm2022/data-source.mjs
function isDataSource(value2) {
  return value2 && typeof value2.connect === "function" && !(value2 instanceof ConnectableObservable);
}
var DataSource;
var init_data_source = __esm({
  "node_modules/@angular/cdk/fesm2022/data-source.mjs"() {
    "use strict";
    init_esm();
    DataSource = class {
    };
  }
});

// node_modules/@angular/cdk/fesm2022/recycle-view-repeater-strategy.mjs
var ArrayDataSource, _ViewRepeaterOperation, _VIEW_REPEATER_STRATEGY, _RecycleViewRepeaterStrategy;
var init_recycle_view_repeater_strategy = __esm({
  "node_modules/@angular/cdk/fesm2022/recycle-view-repeater-strategy.mjs"() {
    "use strict";
    init_esm();
    init_data_source();
    init_core();
    ArrayDataSource = class extends DataSource {
      _data;
      constructor(_data) {
        super();
        this._data = _data;
      }
      connect() {
        return isObservable(this._data) ? this._data : of(this._data);
      }
      disconnect() {
      }
    };
    (function(_ViewRepeaterOperation2) {
      _ViewRepeaterOperation2[_ViewRepeaterOperation2["REPLACED"] = 0] = "REPLACED";
      _ViewRepeaterOperation2[_ViewRepeaterOperation2["INSERTED"] = 1] = "INSERTED";
      _ViewRepeaterOperation2[_ViewRepeaterOperation2["MOVED"] = 2] = "MOVED";
      _ViewRepeaterOperation2[_ViewRepeaterOperation2["REMOVED"] = 3] = "REMOVED";
    })(_ViewRepeaterOperation || (_ViewRepeaterOperation = {}));
    _VIEW_REPEATER_STRATEGY = new InjectionToken("_ViewRepeater");
    _RecycleViewRepeaterStrategy = class {
      /**
       * The size of the cache used to store unused views.
       * Setting the cache size to `0` will disable caching. Defaults to 20 views.
       */
      viewCacheSize = 20;
      /**
       * View cache that stores embedded view instances that have been previously stamped out,
       * but don't are not currently rendered. The view repeater will reuse these views rather than
       * creating brand new ones.
       *
       * TODO(michaeljamesparsons) Investigate whether using a linked list would improve performance.
       */
      _viewCache = [];
      /** Apply changes to the DOM. */
      applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
        changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
          let view;
          let operation;
          if (record.previousIndex == null) {
            const viewArgsFactory = () => itemContextFactory(record, adjustedPreviousIndex, currentIndex);
            view = this._insertView(viewArgsFactory, currentIndex, viewContainerRef, itemValueResolver(record));
            operation = view ? _ViewRepeaterOperation.INSERTED : _ViewRepeaterOperation.REPLACED;
          } else if (currentIndex == null) {
            this._detachAndCacheView(adjustedPreviousIndex, viewContainerRef);
            operation = _ViewRepeaterOperation.REMOVED;
          } else {
            view = this._moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, itemValueResolver(record));
            operation = _ViewRepeaterOperation.MOVED;
          }
          if (itemViewChanged) {
            itemViewChanged({
              context: view?.context,
              operation,
              record
            });
          }
        });
      }
      detach() {
        for (const view of this._viewCache) {
          view.destroy();
        }
        this._viewCache = [];
      }
      /**
       * Inserts a view for a new item, either from the cache or by creating a new
       * one. Returns `undefined` if the item was inserted into a cached view.
       */
      _insertView(viewArgsFactory, currentIndex, viewContainerRef, value2) {
        const cachedView = this._insertViewFromCache(currentIndex, viewContainerRef);
        if (cachedView) {
          cachedView.context.$implicit = value2;
          return void 0;
        }
        const viewArgs = viewArgsFactory();
        return viewContainerRef.createEmbeddedView(viewArgs.templateRef, viewArgs.context, viewArgs.index);
      }
      /** Detaches the view at the given index and inserts into the view cache. */
      _detachAndCacheView(index, viewContainerRef) {
        const detachedView = viewContainerRef.detach(index);
        this._maybeCacheView(detachedView, viewContainerRef);
      }
      /** Moves view at the previous index to the current index. */
      _moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, value2) {
        const view = viewContainerRef.get(adjustedPreviousIndex);
        viewContainerRef.move(view, currentIndex);
        view.context.$implicit = value2;
        return view;
      }
      /**
       * Cache the given detached view. If the cache is full, the view will be
       * destroyed.
       */
      _maybeCacheView(view, viewContainerRef) {
        if (this._viewCache.length < this.viewCacheSize) {
          this._viewCache.push(view);
        } else {
          const index = viewContainerRef.indexOf(view);
          if (index === -1) {
            view.destroy();
          } else {
            viewContainerRef.remove(index);
          }
        }
      }
      /** Inserts a recycled view from the cache at the given index. */
      _insertViewFromCache(index, viewContainerRef) {
        const cachedView = this._viewCache.pop();
        if (cachedView) {
          viewContainerRef.insert(cachedView, index);
        }
        return cachedView || null;
      }
    };
  }
});

// node_modules/@angular/cdk/fesm2022/scrolling.mjs
function _fixedSizeVirtualScrollStrategyFactory(fixedSizeDir) {
  return fixedSizeDir._scrollStrategy;
}
function rangesEqual(r1, r2) {
  return r1.start == r2.start && r1.end == r2.end;
}
function getOffset(orientation, direction, node) {
  const el = node;
  if (!el.getBoundingClientRect) {
    return 0;
  }
  const rect = el.getBoundingClientRect();
  if (orientation === "horizontal") {
    return direction === "start" ? rect.left : rect.right;
  }
  return direction === "start" ? rect.top : rect.bottom;
}
var VIRTUAL_SCROLL_STRATEGY, FixedSizeVirtualScrollStrategy, CdkFixedSizeVirtualScroll, DEFAULT_SCROLL_TIME, ScrollDispatcher, CdkScrollable, DEFAULT_RESIZE_TIME, ViewportRuler, VIRTUAL_SCROLLABLE, CdkVirtualScrollable, SCROLL_SCHEDULER, CdkVirtualScrollViewport, CdkVirtualForOf, CdkVirtualScrollableElement, CdkVirtualScrollableWindow, CdkScrollableModule, ScrollingModule;
var init_scrolling = __esm({
  "node_modules/@angular/cdk/fesm2022/scrolling.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_esm();
    init_operators();
    init_element();
    init_platform2();
    init_directionality();
    init_scrolling2();
    init_bidi();
    init_recycle_view_repeater_strategy();
    init_data_source();
    VIRTUAL_SCROLL_STRATEGY = new InjectionToken("VIRTUAL_SCROLL_STRATEGY");
    FixedSizeVirtualScrollStrategy = class {
      _scrolledIndexChange = new Subject();
      /** @docs-private Implemented as part of VirtualScrollStrategy. */
      scrolledIndexChange = this._scrolledIndexChange.pipe(distinctUntilChanged());
      /** The attached viewport. */
      _viewport = null;
      /** The size of the items in the virtually scrolling list. */
      _itemSize;
      /** The minimum amount of buffer rendered beyond the viewport (in pixels). */
      _minBufferPx;
      /** The number of buffer items to render beyond the edge of the viewport (in pixels). */
      _maxBufferPx;
      /**
       * @param itemSize The size of the items in the virtually scrolling list.
       * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
       * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
       */
      constructor(itemSize, minBufferPx, maxBufferPx) {
        this._itemSize = itemSize;
        this._minBufferPx = minBufferPx;
        this._maxBufferPx = maxBufferPx;
      }
      /**
       * Attaches this scroll strategy to a viewport.
       * @param viewport The viewport to attach this strategy to.
       */
      attach(viewport) {
        this._viewport = viewport;
        this._updateTotalContentSize();
        this._updateRenderedRange();
      }
      /** Detaches this scroll strategy from the currently attached viewport. */
      detach() {
        this._scrolledIndexChange.complete();
        this._viewport = null;
      }
      /**
       * Update the item size and buffer size.
       * @param itemSize The size of the items in the virtually scrolling list.
       * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
       * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
       */
      updateItemAndBufferSize(itemSize, minBufferPx, maxBufferPx) {
        if (maxBufferPx < minBufferPx && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error("CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx");
        }
        this._itemSize = itemSize;
        this._minBufferPx = minBufferPx;
        this._maxBufferPx = maxBufferPx;
        this._updateTotalContentSize();
        this._updateRenderedRange();
      }
      /** @docs-private Implemented as part of VirtualScrollStrategy. */
      onContentScrolled() {
        this._updateRenderedRange();
      }
      /** @docs-private Implemented as part of VirtualScrollStrategy. */
      onDataLengthChanged() {
        this._updateTotalContentSize();
        this._updateRenderedRange();
      }
      /** @docs-private Implemented as part of VirtualScrollStrategy. */
      onContentRendered() {
      }
      /** @docs-private Implemented as part of VirtualScrollStrategy. */
      onRenderedOffsetChanged() {
      }
      /**
       * Scroll to the offset for the given index.
       * @param index The index of the element to scroll to.
       * @param behavior The ScrollBehavior to use when scrolling.
       */
      scrollToIndex(index, behavior) {
        if (this._viewport) {
          this._viewport.scrollToOffset(index * this._itemSize, behavior);
        }
      }
      /** Update the viewport's total content size. */
      _updateTotalContentSize() {
        if (!this._viewport) {
          return;
        }
        this._viewport.setTotalContentSize(this._viewport.getDataLength() * this._itemSize);
      }
      /** Update the viewport's rendered range. */
      _updateRenderedRange() {
        if (!this._viewport) {
          return;
        }
        const renderedRange = this._viewport.getRenderedRange();
        const newRange = { start: renderedRange.start, end: renderedRange.end };
        const viewportSize = this._viewport.getViewportSize();
        const dataLength = this._viewport.getDataLength();
        let scrollOffset = this._viewport.measureScrollOffset();
        let firstVisibleIndex = this._itemSize > 0 ? scrollOffset / this._itemSize : 0;
        if (newRange.end > dataLength) {
          const maxVisibleItems = Math.ceil(viewportSize / this._itemSize);
          const newVisibleIndex = Math.max(0, Math.min(firstVisibleIndex, dataLength - maxVisibleItems));
          if (firstVisibleIndex != newVisibleIndex) {
            firstVisibleIndex = newVisibleIndex;
            scrollOffset = newVisibleIndex * this._itemSize;
            newRange.start = Math.floor(firstVisibleIndex);
          }
          newRange.end = Math.max(0, Math.min(dataLength, newRange.start + maxVisibleItems));
        }
        const startBuffer = scrollOffset - newRange.start * this._itemSize;
        if (startBuffer < this._minBufferPx && newRange.start != 0) {
          const expandStart = Math.ceil((this._maxBufferPx - startBuffer) / this._itemSize);
          newRange.start = Math.max(0, newRange.start - expandStart);
          newRange.end = Math.min(dataLength, Math.ceil(firstVisibleIndex + (viewportSize + this._minBufferPx) / this._itemSize));
        } else {
          const endBuffer = newRange.end * this._itemSize - (scrollOffset + viewportSize);
          if (endBuffer < this._minBufferPx && newRange.end != dataLength) {
            const expandEnd = Math.ceil((this._maxBufferPx - endBuffer) / this._itemSize);
            if (expandEnd > 0) {
              newRange.end = Math.min(dataLength, newRange.end + expandEnd);
              newRange.start = Math.max(0, Math.floor(firstVisibleIndex - this._minBufferPx / this._itemSize));
            }
          }
        }
        this._viewport.setRenderedRange(newRange);
        this._viewport.setRenderedContentOffset(this._itemSize * newRange.start);
        this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
      }
    };
    CdkFixedSizeVirtualScroll = class _CdkFixedSizeVirtualScroll {
      /** The size of the items in the list (in pixels). */
      get itemSize() {
        return this._itemSize;
      }
      set itemSize(value2) {
        this._itemSize = coerceNumberProperty(value2);
      }
      _itemSize = 20;
      /**
       * The minimum amount of buffer rendered beyond the viewport (in pixels).
       * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
       */
      get minBufferPx() {
        return this._minBufferPx;
      }
      set minBufferPx(value2) {
        this._minBufferPx = coerceNumberProperty(value2);
      }
      _minBufferPx = 100;
      /**
       * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
       */
      get maxBufferPx() {
        return this._maxBufferPx;
      }
      set maxBufferPx(value2) {
        this._maxBufferPx = coerceNumberProperty(value2);
      }
      _maxBufferPx = 200;
      /** The scroll strategy used by this directive. */
      _scrollStrategy = new FixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);
      ngOnChanges() {
        this._scrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkFixedSizeVirtualScroll, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkFixedSizeVirtualScroll, isStandalone: true, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: { itemSize: "itemSize", minBufferPx: "minBufferPx", maxBufferPx: "maxBufferPx" }, providers: [
        {
          provide: VIRTUAL_SCROLL_STRATEGY,
          useFactory: _fixedSizeVirtualScrollStrategyFactory,
          deps: [forwardRef(() => _CdkFixedSizeVirtualScroll)]
        }
      ], usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkFixedSizeVirtualScroll, decorators: [{
      type: Directive,
      args: [{
        selector: "cdk-virtual-scroll-viewport[itemSize]",
        providers: [
          {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: _fixedSizeVirtualScrollStrategyFactory,
            deps: [forwardRef(() => CdkFixedSizeVirtualScroll)]
          }
        ]
      }]
    }], propDecorators: { itemSize: [{
      type: Input
    }], minBufferPx: [{
      type: Input
    }], maxBufferPx: [{
      type: Input
    }] } });
    DEFAULT_SCROLL_TIME = 20;
    ScrollDispatcher = class _ScrollDispatcher {
      _ngZone = inject(NgZone);
      _platform = inject(Platform);
      _renderer = inject(RendererFactory2).createRenderer(null, null);
      _cleanupGlobalListener;
      constructor() {
      }
      /** Subject for notifying that a registered scrollable reference element has been scrolled. */
      _scrolled = new Subject();
      /** Keeps track of the amount of subscriptions to `scrolled`. Used for cleaning up afterwards. */
      _scrolledCount = 0;
      /**
       * Map of all the scrollable references that are registered with the service and their
       * scroll event subscriptions.
       */
      scrollContainers = /* @__PURE__ */ new Map();
      /**
       * Registers a scrollable instance with the service and listens for its scrolled events. When the
       * scrollable is scrolled, the service emits the event to its scrolled observable.
       * @param scrollable Scrollable instance to be registered.
       */
      register(scrollable) {
        if (!this.scrollContainers.has(scrollable)) {
          this.scrollContainers.set(scrollable, scrollable.elementScrolled().subscribe(() => this._scrolled.next(scrollable)));
        }
      }
      /**
       * De-registers a Scrollable reference and unsubscribes from its scroll event observable.
       * @param scrollable Scrollable instance to be deregistered.
       */
      deregister(scrollable) {
        const scrollableReference = this.scrollContainers.get(scrollable);
        if (scrollableReference) {
          scrollableReference.unsubscribe();
          this.scrollContainers.delete(scrollable);
        }
      }
      /**
       * Returns an observable that emits an event whenever any of the registered Scrollable
       * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
       * to override the default "throttle" time.
       *
       * **Note:** in order to avoid hitting change detection for every scroll event,
       * all of the events emitted from this stream will be run outside the Angular zone.
       * If you need to update any data bindings as a result of a scroll event, you have
       * to run the callback using `NgZone.run`.
       */
      scrolled(auditTimeInMs = DEFAULT_SCROLL_TIME) {
        if (!this._platform.isBrowser) {
          return of();
        }
        return new Observable((observer) => {
          if (!this._cleanupGlobalListener) {
            this._cleanupGlobalListener = this._ngZone.runOutsideAngular(() => this._renderer.listen("document", "scroll", () => this._scrolled.next()));
          }
          const subscription = auditTimeInMs > 0 ? this._scrolled.pipe(auditTime(auditTimeInMs)).subscribe(observer) : this._scrolled.subscribe(observer);
          this._scrolledCount++;
          return () => {
            subscription.unsubscribe();
            this._scrolledCount--;
            if (!this._scrolledCount) {
              this._cleanupGlobalListener?.();
              this._cleanupGlobalListener = void 0;
            }
          };
        });
      }
      ngOnDestroy() {
        this._cleanupGlobalListener?.();
        this._cleanupGlobalListener = void 0;
        this.scrollContainers.forEach((_, container) => this.deregister(container));
        this._scrolled.complete();
      }
      /**
       * Returns an observable that emits whenever any of the
       * scrollable ancestors of an element are scrolled.
       * @param elementOrElementRef Element whose ancestors to listen for.
       * @param auditTimeInMs Time to throttle the scroll events.
       */
      ancestorScrolled(elementOrElementRef, auditTimeInMs) {
        const ancestors = this.getAncestorScrollContainers(elementOrElementRef);
        return this.scrolled(auditTimeInMs).pipe(filter((target) => !target || ancestors.indexOf(target) > -1));
      }
      /** Returns all registered Scrollables that contain the provided element. */
      getAncestorScrollContainers(elementOrElementRef) {
        const scrollingContainers = [];
        this.scrollContainers.forEach((_subscription, scrollable) => {
          if (this._scrollableContainsElement(scrollable, elementOrElementRef)) {
            scrollingContainers.push(scrollable);
          }
        });
        return scrollingContainers;
      }
      /** Returns true if the element is contained within the provided Scrollable. */
      _scrollableContainsElement(scrollable, elementOrElementRef) {
        let element = coerceElement(elementOrElementRef);
        let scrollableElement = scrollable.getElementRef().nativeElement;
        do {
          if (element == scrollableElement) {
            return true;
          }
        } while (element = element.parentElement);
        return false;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollDispatcher, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollDispatcher, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: ScrollDispatcher, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    CdkScrollable = class _CdkScrollable {
      elementRef = inject(ElementRef);
      scrollDispatcher = inject(ScrollDispatcher);
      ngZone = inject(NgZone);
      dir = inject(Directionality, { optional: true });
      _scrollElement = this.elementRef.nativeElement;
      _destroyed = new Subject();
      _renderer = inject(Renderer2);
      _cleanupScroll;
      _elementScrolled = new Subject();
      constructor() {
      }
      ngOnInit() {
        this._cleanupScroll = this.ngZone.runOutsideAngular(() => this._renderer.listen(this._scrollElement, "scroll", (event) => this._elementScrolled.next(event)));
        this.scrollDispatcher.register(this);
      }
      ngOnDestroy() {
        this._cleanupScroll?.();
        this._elementScrolled.complete();
        this.scrollDispatcher.deregister(this);
        this._destroyed.next();
        this._destroyed.complete();
      }
      /** Returns observable that emits when a scroll event is fired on the host element. */
      elementScrolled() {
        return this._elementScrolled;
      }
      /** Gets the ElementRef for the viewport. */
      getElementRef() {
        return this.elementRef;
      }
      /**
       * Scrolls to the specified offsets. This is a normalized version of the browser's native scrollTo
       * method, since browsers are not consistent about what scrollLeft means in RTL. For this method
       * left and right always refer to the left and right side of the scrolling container irrespective
       * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
       * in an RTL context.
       * @param options specified the offsets to scroll to.
       */
      scrollTo(options) {
        const el = this.elementRef.nativeElement;
        const isRtl = this.dir && this.dir.value == "rtl";
        if (options.left == null) {
          options.left = isRtl ? options.end : options.start;
        }
        if (options.right == null) {
          options.right = isRtl ? options.start : options.end;
        }
        if (options.bottom != null) {
          options.top = el.scrollHeight - el.clientHeight - options.bottom;
        }
        if (isRtl && getRtlScrollAxisType() != RtlScrollAxisType.NORMAL) {
          if (options.left != null) {
            options.right = el.scrollWidth - el.clientWidth - options.left;
          }
          if (getRtlScrollAxisType() == RtlScrollAxisType.INVERTED) {
            options.left = options.right;
          } else if (getRtlScrollAxisType() == RtlScrollAxisType.NEGATED) {
            options.left = options.right ? -options.right : options.right;
          }
        } else {
          if (options.right != null) {
            options.left = el.scrollWidth - el.clientWidth - options.right;
          }
        }
        this._applyScrollToOptions(options);
      }
      _applyScrollToOptions(options) {
        const el = this.elementRef.nativeElement;
        if (supportsScrollBehavior()) {
          el.scrollTo(options);
        } else {
          if (options.top != null) {
            el.scrollTop = options.top;
          }
          if (options.left != null) {
            el.scrollLeft = options.left;
          }
        }
      }
      /**
       * Measures the scroll offset relative to the specified edge of the viewport. This method can be
       * used instead of directly checking scrollLeft or scrollTop, since browsers are not consistent
       * about what scrollLeft means in RTL. The values returned by this method are normalized such that
       * left and right always refer to the left and right side of the scrolling container irrespective
       * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
       * in an RTL context.
       * @param from The edge to measure from.
       */
      measureScrollOffset(from) {
        const LEFT = "left";
        const RIGHT = "right";
        const el = this.elementRef.nativeElement;
        if (from == "top") {
          return el.scrollTop;
        }
        if (from == "bottom") {
          return el.scrollHeight - el.clientHeight - el.scrollTop;
        }
        const isRtl = this.dir && this.dir.value == "rtl";
        if (from == "start") {
          from = isRtl ? RIGHT : LEFT;
        } else if (from == "end") {
          from = isRtl ? LEFT : RIGHT;
        }
        if (isRtl && getRtlScrollAxisType() == RtlScrollAxisType.INVERTED) {
          if (from == LEFT) {
            return el.scrollWidth - el.clientWidth - el.scrollLeft;
          } else {
            return el.scrollLeft;
          }
        } else if (isRtl && getRtlScrollAxisType() == RtlScrollAxisType.NEGATED) {
          if (from == LEFT) {
            return el.scrollLeft + el.scrollWidth - el.clientWidth;
          } else {
            return -el.scrollLeft;
          }
        } else {
          if (from == LEFT) {
            return el.scrollLeft;
          } else {
            return el.scrollWidth - el.clientWidth - el.scrollLeft;
          }
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkScrollable, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkScrollable, isStandalone: true, selector: "[cdk-scrollable], [cdkScrollable]", ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkScrollable, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdk-scrollable], [cdkScrollable]"
      }]
    }], ctorParameters: () => [] });
    DEFAULT_RESIZE_TIME = 20;
    ViewportRuler = class _ViewportRuler {
      _platform = inject(Platform);
      _listeners;
      /** Cached viewport dimensions. */
      _viewportSize;
      /** Stream of viewport change events. */
      _change = new Subject();
      /** Used to reference correct document/window */
      _document = inject(DOCUMENT);
      constructor() {
        const ngZone = inject(NgZone);
        const renderer = inject(RendererFactory2).createRenderer(null, null);
        ngZone.runOutsideAngular(() => {
          if (this._platform.isBrowser) {
            const changeListener = (event) => this._change.next(event);
            this._listeners = [
              renderer.listen("window", "resize", changeListener),
              renderer.listen("window", "orientationchange", changeListener)
            ];
          }
          this.change().subscribe(() => this._viewportSize = null);
        });
      }
      ngOnDestroy() {
        this._listeners?.forEach((cleanup) => cleanup());
        this._change.complete();
      }
      /** Returns the viewport's width and height. */
      getViewportSize() {
        if (!this._viewportSize) {
          this._updateViewportSize();
        }
        const output = { width: this._viewportSize.width, height: this._viewportSize.height };
        if (!this._platform.isBrowser) {
          this._viewportSize = null;
        }
        return output;
      }
      /** Gets a DOMRect for the viewport's bounds. */
      getViewportRect() {
        const scrollPosition = this.getViewportScrollPosition();
        const { width, height } = this.getViewportSize();
        return {
          top: scrollPosition.top,
          left: scrollPosition.left,
          bottom: scrollPosition.top + height,
          right: scrollPosition.left + width,
          height,
          width
        };
      }
      /** Gets the (top, left) scroll position of the viewport. */
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) {
          return { top: 0, left: 0 };
        }
        const document2 = this._document;
        const window2 = this._getWindow();
        const documentElement = document2.documentElement;
        const documentRect = documentElement.getBoundingClientRect();
        const top = -documentRect.top || document2.body.scrollTop || window2.scrollY || documentElement.scrollTop || 0;
        const left = -documentRect.left || document2.body.scrollLeft || window2.scrollX || documentElement.scrollLeft || 0;
        return { top, left };
      }
      /**
       * Returns a stream that emits whenever the size of the viewport changes.
       * This stream emits outside of the Angular zone.
       * @param throttleTime Time in milliseconds to throttle the stream.
       */
      change(throttleTime = DEFAULT_RESIZE_TIME) {
        return throttleTime > 0 ? this._change.pipe(auditTime(throttleTime)) : this._change;
      }
      /** Use defaultView of injected document if available or fallback to global window reference */
      _getWindow() {
        return this._document.defaultView || window;
      }
      /** Updates the cached viewport size. */
      _updateViewportSize() {
        const window2 = this._getWindow();
        this._viewportSize = this._platform.isBrowser ? { width: window2.innerWidth, height: window2.innerHeight } : { width: 0, height: 0 };
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ViewportRuler, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ViewportRuler, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: ViewportRuler, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    VIRTUAL_SCROLLABLE = new InjectionToken("VIRTUAL_SCROLLABLE");
    CdkVirtualScrollable = class _CdkVirtualScrollable extends CdkScrollable {
      constructor() {
        super();
      }
      /**
       * Measure the viewport size for the provided orientation.
       *
       * @param orientation The orientation to measure the size from.
       */
      measureViewportSize(orientation) {
        const viewportEl = this.elementRef.nativeElement;
        return orientation === "horizontal" ? viewportEl.clientWidth : viewportEl.clientHeight;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkVirtualScrollable, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkVirtualScrollable, isStandalone: true, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkVirtualScrollable, decorators: [{
      type: Directive
    }], ctorParameters: () => [] });
    SCROLL_SCHEDULER = typeof requestAnimationFrame !== "undefined" ? animationFrameScheduler : asapScheduler;
    CdkVirtualScrollViewport = class _CdkVirtualScrollViewport extends CdkVirtualScrollable {
      elementRef = inject(ElementRef);
      _changeDetectorRef = inject(ChangeDetectorRef);
      _scrollStrategy = inject(VIRTUAL_SCROLL_STRATEGY, {
        optional: true
      });
      scrollable = inject(VIRTUAL_SCROLLABLE, { optional: true });
      _platform = inject(Platform);
      /** Emits when the viewport is detached from a CdkVirtualForOf. */
      _detachedSubject = new Subject();
      /** Emits when the rendered range changes. */
      _renderedRangeSubject = new Subject();
      /** The direction the viewport scrolls. */
      get orientation() {
        return this._orientation;
      }
      set orientation(orientation) {
        if (this._orientation !== orientation) {
          this._orientation = orientation;
          this._calculateSpacerSize();
        }
      }
      _orientation = "vertical";
      /**
       * Whether rendered items should persist in the DOM after scrolling out of view. By default, items
       * will be removed.
       */
      appendOnly = false;
      // Note: we don't use the typical EventEmitter here because we need to subscribe to the scroll
      // strategy lazily (i.e. only if the user is actually listening to the events). We do this because
      // depending on how the strategy calculates the scrolled index, it may come at a cost to
      // performance.
      /** Emits when the index of the first element visible in the viewport changes. */
      scrolledIndexChange = new Observable((observer) => this._scrollStrategy.scrolledIndexChange.subscribe((index) => Promise.resolve().then(() => this.ngZone.run(() => observer.next(index)))));
      /** The element that wraps the rendered content. */
      _contentWrapper;
      /** A stream that emits whenever the rendered range changes. */
      renderedRangeStream = this._renderedRangeSubject;
      /**
       * The total size of all content (in pixels), including content that is not currently rendered.
       */
      _totalContentSize = 0;
      /** A string representing the `style.width` property value to be used for the spacer element. */
      _totalContentWidth = signal("", ...ngDevMode ? [{ debugName: "_totalContentWidth" }] : []);
      /** A string representing the `style.height` property value to be used for the spacer element. */
      _totalContentHeight = signal("", ...ngDevMode ? [{ debugName: "_totalContentHeight" }] : []);
      /**
       * The CSS transform applied to the rendered subset of items so that they appear within the bounds
       * of the visible viewport.
       */
      _renderedContentTransform;
      /** The currently rendered range of indices. */
      _renderedRange = { start: 0, end: 0 };
      /** The length of the data bound to this viewport (in number of items). */
      _dataLength = 0;
      /** The size of the viewport (in pixels). */
      _viewportSize = 0;
      /** the currently attached CdkVirtualScrollRepeater. */
      _forOf;
      /** The last rendered content offset that was set. */
      _renderedContentOffset = 0;
      /**
       * Whether the last rendered content offset was to the end of the content (and therefore needs to
       * be rewritten as an offset to the start of the content).
       */
      _renderedContentOffsetNeedsRewrite = false;
      _changeDetectionNeeded = signal(false, ...ngDevMode ? [{ debugName: "_changeDetectionNeeded" }] : []);
      /** A list of functions to run after the next change detection cycle. */
      _runAfterChangeDetection = [];
      /** Subscription to changes in the viewport size. */
      _viewportChanges = Subscription.EMPTY;
      _injector = inject(Injector);
      _isDestroyed = false;
      constructor() {
        super();
        const viewportRuler = inject(ViewportRuler);
        if (!this._scrollStrategy && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error('Error: cdk-virtual-scroll-viewport requires the "itemSize" property to be set.');
        }
        this._viewportChanges = viewportRuler.change().subscribe(() => {
          this.checkViewportSize();
        });
        if (!this.scrollable) {
          this.elementRef.nativeElement.classList.add("cdk-virtual-scrollable");
          this.scrollable = this;
        }
        const ref = effect(() => {
          if (this._changeDetectionNeeded()) {
            this._doChangeDetection();
          }
        }, ...ngDevMode ? [{ debugName: "ref", injector: inject(ApplicationRef).injector }] : [
          // Using ApplicationRef injector is important here because we want this to be a root
          // effect that runs before change detection of any application views (since we're depending on markForCheck marking parents dirty)
          { injector: inject(ApplicationRef).injector }
        ]);
        inject(DestroyRef).onDestroy(() => void ref.destroy());
      }
      ngOnInit() {
        if (!this._platform.isBrowser) {
          return;
        }
        if (this.scrollable === this) {
          super.ngOnInit();
        }
        this.ngZone.runOutsideAngular(() => Promise.resolve().then(() => {
          this._measureViewportSize();
          this._scrollStrategy.attach(this);
          this.scrollable.elementScrolled().pipe(
            // Start off with a fake scroll event so we properly detect our initial position.
            startWith(null),
            // Collect multiple events into one until the next animation frame. This way if
            // there are multiple scroll events in the same frame we only need to recheck
            // our layout once.
            auditTime(0, SCROLL_SCHEDULER),
            // Usually `elementScrolled` is completed when the scrollable is destroyed, but
            // that may not be the case if a `CdkVirtualScrollableElement` is used so we have
            // to unsubscribe here just in case.
            takeUntil(this._destroyed)
          ).subscribe(() => this._scrollStrategy.onContentScrolled());
          this._markChangeDetectionNeeded();
        }));
      }
      ngOnDestroy() {
        this.detach();
        this._scrollStrategy.detach();
        this._renderedRangeSubject.complete();
        this._detachedSubject.complete();
        this._viewportChanges.unsubscribe();
        this._isDestroyed = true;
        super.ngOnDestroy();
      }
      /** Attaches a `CdkVirtualScrollRepeater` to this viewport. */
      attach(forOf) {
        if (this._forOf && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error("CdkVirtualScrollViewport is already attached.");
        }
        this.ngZone.runOutsideAngular(() => {
          this._forOf = forOf;
          this._forOf.dataStream.pipe(takeUntil(this._detachedSubject)).subscribe((data) => {
            const newLength = data.length;
            if (newLength !== this._dataLength) {
              this._dataLength = newLength;
              this._scrollStrategy.onDataLengthChanged();
            }
            this._doChangeDetection();
          });
        });
      }
      /** Detaches the current `CdkVirtualForOf`. */
      detach() {
        this._forOf = null;
        this._detachedSubject.next();
      }
      /** Gets the length of the data bound to this viewport (in number of items). */
      getDataLength() {
        return this._dataLength;
      }
      /** Gets the size of the viewport (in pixels). */
      getViewportSize() {
        return this._viewportSize;
      }
      // TODO(mmalerba): This is technically out of sync with what's really rendered until a render
      // cycle happens. I'm being careful to only call it after the render cycle is complete and before
      // setting it to something else, but its error prone and should probably be split into
      // `pendingRange` and `renderedRange`, the latter reflecting whats actually in the DOM.
      /** Get the current rendered range of items. */
      getRenderedRange() {
        return this._renderedRange;
      }
      measureBoundingClientRectWithScrollOffset(from) {
        return this.getElementRef().nativeElement.getBoundingClientRect()[from];
      }
      /**
       * Sets the total size of all content (in pixels), including content that is not currently
       * rendered.
       */
      setTotalContentSize(size) {
        if (this._totalContentSize !== size) {
          this._totalContentSize = size;
          this._calculateSpacerSize();
          this._markChangeDetectionNeeded();
        }
      }
      /** Sets the currently rendered range of indices. */
      setRenderedRange(range) {
        if (!rangesEqual(this._renderedRange, range)) {
          if (this.appendOnly) {
            range = { start: 0, end: Math.max(this._renderedRange.end, range.end) };
          }
          this._renderedRangeSubject.next(this._renderedRange = range);
          this._markChangeDetectionNeeded(() => this._scrollStrategy.onContentRendered());
        }
      }
      /**
       * Gets the offset from the start of the viewport to the start of the rendered data (in pixels).
       */
      getOffsetToRenderedContentStart() {
        return this._renderedContentOffsetNeedsRewrite ? null : this._renderedContentOffset;
      }
      /**
       * Sets the offset from the start of the viewport to either the start or end of the rendered data
       * (in pixels).
       */
      setRenderedContentOffset(offset, to = "to-start") {
        offset = this.appendOnly && to === "to-start" ? 0 : offset;
        const isRtl = this.dir && this.dir.value == "rtl";
        const isHorizontal = this.orientation == "horizontal";
        const axis = isHorizontal ? "X" : "Y";
        const axisDirection = isHorizontal && isRtl ? -1 : 1;
        let transform = `translate${axis}(${Number(axisDirection * offset)}px)`;
        this._renderedContentOffset = offset;
        if (to === "to-end") {
          transform += ` translate${axis}(-100%)`;
          this._renderedContentOffsetNeedsRewrite = true;
        }
        if (this._renderedContentTransform != transform) {
          this._renderedContentTransform = transform;
          this._markChangeDetectionNeeded(() => {
            if (this._renderedContentOffsetNeedsRewrite) {
              this._renderedContentOffset -= this.measureRenderedContentSize();
              this._renderedContentOffsetNeedsRewrite = false;
              this.setRenderedContentOffset(this._renderedContentOffset);
            } else {
              this._scrollStrategy.onRenderedOffsetChanged();
            }
          });
        }
      }
      /**
       * Scrolls to the given offset from the start of the viewport. Please note that this is not always
       * the same as setting `scrollTop` or `scrollLeft`. In a horizontal viewport with right-to-left
       * direction, this would be the equivalent of setting a fictional `scrollRight` property.
       * @param offset The offset to scroll to.
       * @param behavior The ScrollBehavior to use when scrolling. Default is behavior is `auto`.
       */
      scrollToOffset(offset, behavior = "auto") {
        const options = { behavior };
        if (this.orientation === "horizontal") {
          options.start = offset;
        } else {
          options.top = offset;
        }
        this.scrollable.scrollTo(options);
      }
      /**
       * Scrolls to the offset for the given index.
       * @param index The index of the element to scroll to.
       * @param behavior The ScrollBehavior to use when scrolling. Default is behavior is `auto`.
       */
      scrollToIndex(index, behavior = "auto") {
        this._scrollStrategy.scrollToIndex(index, behavior);
      }
      /**
       * Gets the current scroll offset from the start of the scrollable (in pixels).
       * @param from The edge to measure the offset from. Defaults to 'top' in vertical mode and 'start'
       *     in horizontal mode.
       */
      measureScrollOffset(from) {
        let measureScrollOffset;
        if (this.scrollable == this) {
          measureScrollOffset = (_from) => super.measureScrollOffset(_from);
        } else {
          measureScrollOffset = (_from) => this.scrollable.measureScrollOffset(_from);
        }
        return Math.max(0, measureScrollOffset(from ?? (this.orientation === "horizontal" ? "start" : "top")) - this.measureViewportOffset());
      }
      /**
       * Measures the offset of the viewport from the scrolling container
       * @param from The edge to measure from.
       */
      measureViewportOffset(from) {
        let fromRect;
        const LEFT = "left";
        const RIGHT = "right";
        const isRtl = this.dir?.value == "rtl";
        if (from == "start") {
          fromRect = isRtl ? RIGHT : LEFT;
        } else if (from == "end") {
          fromRect = isRtl ? LEFT : RIGHT;
        } else if (from) {
          fromRect = from;
        } else {
          fromRect = this.orientation === "horizontal" ? "left" : "top";
        }
        const scrollerClientRect = this.scrollable.measureBoundingClientRectWithScrollOffset(fromRect);
        const viewportClientRect = this.elementRef.nativeElement.getBoundingClientRect()[fromRect];
        return viewportClientRect - scrollerClientRect;
      }
      /** Measure the combined size of all of the rendered items. */
      measureRenderedContentSize() {
        const contentEl = this._contentWrapper.nativeElement;
        return this.orientation === "horizontal" ? contentEl.offsetWidth : contentEl.offsetHeight;
      }
      /**
       * Measure the total combined size of the given range. Throws if the range includes items that are
       * not rendered.
       */
      measureRangeSize(range) {
        if (!this._forOf) {
          return 0;
        }
        return this._forOf.measureRangeSize(range, this.orientation);
      }
      /** Update the viewport dimensions and re-render. */
      checkViewportSize() {
        this._measureViewportSize();
        this._scrollStrategy.onDataLengthChanged();
      }
      /** Measure the viewport size. */
      _measureViewportSize() {
        this._viewportSize = this.scrollable.measureViewportSize(this.orientation);
      }
      /** Queue up change detection to run. */
      _markChangeDetectionNeeded(runAfter) {
        if (runAfter) {
          this._runAfterChangeDetection.push(runAfter);
        }
        if (untracked(this._changeDetectionNeeded)) {
          return;
        }
        this.ngZone.runOutsideAngular(() => {
          Promise.resolve().then(() => {
            this.ngZone.run(() => {
              this._changeDetectionNeeded.set(true);
            });
          });
        });
      }
      /** Run change detection. */
      _doChangeDetection() {
        if (this._isDestroyed) {
          return;
        }
        this.ngZone.run(() => {
          this._changeDetectorRef.markForCheck();
          this._contentWrapper.nativeElement.style.transform = this._renderedContentTransform;
          afterNextRender(() => {
            this._changeDetectionNeeded.set(false);
            const runAfterChangeDetection = this._runAfterChangeDetection;
            this._runAfterChangeDetection = [];
            for (const fn of runAfterChangeDetection) {
              fn();
            }
          }, { injector: this._injector });
        });
      }
      /** Calculates the `style.width` and `style.height` for the spacer element. */
      _calculateSpacerSize() {
        this._totalContentHeight.set(this.orientation === "horizontal" ? "" : `${this._totalContentSize}px`);
        this._totalContentWidth.set(this.orientation === "horizontal" ? `${this._totalContentSize}px` : "");
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkVirtualScrollViewport, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "16.1.0", version: "20.2.0-next.2", type: _CdkVirtualScrollViewport, isStandalone: true, selector: "cdk-virtual-scroll-viewport", inputs: { orientation: "orientation", appendOnly: ["appendOnly", "appendOnly", booleanAttribute] }, outputs: { scrolledIndexChange: "scrolledIndexChange" }, host: { properties: { "class.cdk-virtual-scroll-orientation-horizontal": 'orientation === "horizontal"', "class.cdk-virtual-scroll-orientation-vertical": 'orientation !== "horizontal"' }, classAttribute: "cdk-virtual-scroll-viewport" }, providers: [
        {
          provide: CdkScrollable,
          useFactory: (virtualScrollable, viewport) => virtualScrollable || viewport,
          deps: [[new Optional(), new Inject(VIRTUAL_SCROLLABLE)], _CdkVirtualScrollViewport]
        }
      ], viewQueries: [{ propertyName: "_contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, static: true }], usesInheritance: true, ngImport: core_exports, template: '<!--\n  Wrap the rendered content in an element that will be used to offset it based on the scroll\n  position.\n-->\n<div #contentWrapper class="cdk-virtual-scroll-content-wrapper">\n  <ng-content></ng-content>\n</div>\n<!--\n  Spacer used to force the scrolling container to the correct size for the *total* number of items\n  so that the scrollbar captures the size of the entire data set.\n-->\n<div class="cdk-virtual-scroll-spacer"\n     [style.width]="_totalContentWidth()" [style.height]="_totalContentHeight()"></div>\n', styles: ["cdk-virtual-scroll-viewport{display:block;position:relative;transform:translateZ(0)}.cdk-virtual-scrollable{overflow:auto;will-change:scroll-position;contain:strict}.cdk-virtual-scroll-content-wrapper{position:absolute;top:0;left:0;contain:content}[dir=rtl] .cdk-virtual-scroll-content-wrapper{right:0;left:auto}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper{min-height:100%}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-left:0;padding-right:0;margin-left:0;margin-right:0;border-left-width:0;border-right-width:0;outline:none}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper{min-width:100%}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;border-top-width:0;border-bottom-width:0;outline:none}.cdk-virtual-scroll-spacer{height:1px;transform-origin:0 0;flex:0 0 auto}[dir=rtl] .cdk-virtual-scroll-spacer{transform-origin:100% 0}\n"], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkVirtualScrollViewport, decorators: [{
      type: Component,
      args: [{ selector: "cdk-virtual-scroll-viewport", host: {
        "class": "cdk-virtual-scroll-viewport",
        "[class.cdk-virtual-scroll-orientation-horizontal]": 'orientation === "horizontal"',
        "[class.cdk-virtual-scroll-orientation-vertical]": 'orientation !== "horizontal"'
      }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
        {
          provide: CdkScrollable,
          useFactory: (virtualScrollable, viewport) => virtualScrollable || viewport,
          deps: [[new Optional(), new Inject(VIRTUAL_SCROLLABLE)], CdkVirtualScrollViewport]
        }
      ], template: '<!--\n  Wrap the rendered content in an element that will be used to offset it based on the scroll\n  position.\n-->\n<div #contentWrapper class="cdk-virtual-scroll-content-wrapper">\n  <ng-content></ng-content>\n</div>\n<!--\n  Spacer used to force the scrolling container to the correct size for the *total* number of items\n  so that the scrollbar captures the size of the entire data set.\n-->\n<div class="cdk-virtual-scroll-spacer"\n     [style.width]="_totalContentWidth()" [style.height]="_totalContentHeight()"></div>\n', styles: ["cdk-virtual-scroll-viewport{display:block;position:relative;transform:translateZ(0)}.cdk-virtual-scrollable{overflow:auto;will-change:scroll-position;contain:strict}.cdk-virtual-scroll-content-wrapper{position:absolute;top:0;left:0;contain:content}[dir=rtl] .cdk-virtual-scroll-content-wrapper{right:0;left:auto}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper{min-height:100%}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-left:0;padding-right:0;margin-left:0;margin-right:0;border-left-width:0;border-right-width:0;outline:none}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper{min-width:100%}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;border-top-width:0;border-bottom-width:0;outline:none}.cdk-virtual-scroll-spacer{height:1px;transform-origin:0 0;flex:0 0 auto}[dir=rtl] .cdk-virtual-scroll-spacer{transform-origin:100% 0}\n"] }]
    }], ctorParameters: () => [], propDecorators: { orientation: [{
      type: Input
    }], appendOnly: [{
      type: Input,
      args: [{ transform: booleanAttribute }]
    }], scrolledIndexChange: [{
      type: Output
    }], _contentWrapper: [{
      type: ViewChild,
      args: ["contentWrapper", { static: true }]
    }] } });
    CdkVirtualForOf = class _CdkVirtualForOf {
      _viewContainerRef = inject(ViewContainerRef);
      _template = inject(TemplateRef);
      _differs = inject(IterableDiffers);
      _viewRepeater = inject(_VIEW_REPEATER_STRATEGY);
      _viewport = inject(CdkVirtualScrollViewport, { skipSelf: true });
      /** Emits when the rendered view of the data changes. */
      viewChange = new Subject();
      /** Subject that emits when a new DataSource instance is given. */
      _dataSourceChanges = new Subject();
      /** The DataSource to display. */
      get cdkVirtualForOf() {
        return this._cdkVirtualForOf;
      }
      set cdkVirtualForOf(value2) {
        this._cdkVirtualForOf = value2;
        if (isDataSource(value2)) {
          this._dataSourceChanges.next(value2);
        } else {
          this._dataSourceChanges.next(new ArrayDataSource(isObservable(value2) ? value2 : Array.from(value2 || [])));
        }
      }
      _cdkVirtualForOf;
      /**
       * The `TrackByFunction` to use for tracking changes. The `TrackByFunction` takes the index and
       * the item and produces a value to be used as the item's identity when tracking changes.
       */
      get cdkVirtualForTrackBy() {
        return this._cdkVirtualForTrackBy;
      }
      set cdkVirtualForTrackBy(fn) {
        this._needsUpdate = true;
        this._cdkVirtualForTrackBy = fn ? (index, item) => fn(index + (this._renderedRange ? this._renderedRange.start : 0), item) : void 0;
      }
      _cdkVirtualForTrackBy;
      /** The template used to stamp out new elements. */
      set cdkVirtualForTemplate(value2) {
        if (value2) {
          this._needsUpdate = true;
          this._template = value2;
        }
      }
      /**
       * The size of the cache used to store templates that are not being used for re-use later.
       * Setting the cache size to `0` will disable caching. Defaults to 20 templates.
       */
      get cdkVirtualForTemplateCacheSize() {
        return this._viewRepeater.viewCacheSize;
      }
      set cdkVirtualForTemplateCacheSize(size) {
        this._viewRepeater.viewCacheSize = coerceNumberProperty(size);
      }
      /** Emits whenever the data in the current DataSource changes. */
      dataStream = this._dataSourceChanges.pipe(
        // Start off with null `DataSource`.
        startWith(null),
        // Bundle up the previous and current data sources so we can work with both.
        pairwise(),
        // Use `_changeDataSource` to disconnect from the previous data source and connect to the
        // new one, passing back a stream of data changes which we run through `switchMap` to give
        // us a data stream that emits the latest data from whatever the current `DataSource` is.
        switchMap(([prev, cur]) => this._changeDataSource(prev, cur)),
        // Replay the last emitted data when someone subscribes.
        shareReplay(1)
      );
      /** The differ used to calculate changes to the data. */
      _differ = null;
      /** The most recent data emitted from the DataSource. */
      _data;
      /** The currently rendered items. */
      _renderedItems;
      /** The currently rendered range of indices. */
      _renderedRange;
      /** Whether the rendered data should be updated during the next ngDoCheck cycle. */
      _needsUpdate = false;
      _destroyed = new Subject();
      constructor() {
        const ngZone = inject(NgZone);
        this.dataStream.subscribe((data) => {
          this._data = data;
          this._onRenderedDataChange();
        });
        this._viewport.renderedRangeStream.pipe(takeUntil(this._destroyed)).subscribe((range) => {
          this._renderedRange = range;
          if (this.viewChange.observers.length) {
            ngZone.run(() => this.viewChange.next(this._renderedRange));
          }
          this._onRenderedDataChange();
        });
        this._viewport.attach(this);
      }
      /**
       * Measures the combined size (width for horizontal orientation, height for vertical) of all items
       * in the specified range. Throws an error if the range includes items that are not currently
       * rendered.
       */
      measureRangeSize(range, orientation) {
        if (range.start >= range.end) {
          return 0;
        }
        if ((range.start < this._renderedRange.start || range.end > this._renderedRange.end) && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error(`Error: attempted to measure an item that isn't rendered.`);
        }
        const renderedStartIndex = range.start - this._renderedRange.start;
        const rangeLen = range.end - range.start;
        let firstNode;
        let lastNode;
        for (let i = 0; i < rangeLen; i++) {
          const view = this._viewContainerRef.get(i + renderedStartIndex);
          if (view && view.rootNodes.length) {
            firstNode = lastNode = view.rootNodes[0];
            break;
          }
        }
        for (let i = rangeLen - 1; i > -1; i--) {
          const view = this._viewContainerRef.get(i + renderedStartIndex);
          if (view && view.rootNodes.length) {
            lastNode = view.rootNodes[view.rootNodes.length - 1];
            break;
          }
        }
        return firstNode && lastNode ? getOffset(orientation, "end", lastNode) - getOffset(orientation, "start", firstNode) : 0;
      }
      ngDoCheck() {
        if (this._differ && this._needsUpdate) {
          const changes = this._differ.diff(this._renderedItems);
          if (!changes) {
            this._updateContext();
          } else {
            this._applyChanges(changes);
          }
          this._needsUpdate = false;
        }
      }
      ngOnDestroy() {
        this._viewport.detach();
        this._dataSourceChanges.next(void 0);
        this._dataSourceChanges.complete();
        this.viewChange.complete();
        this._destroyed.next();
        this._destroyed.complete();
        this._viewRepeater.detach();
      }
      /** React to scroll state changes in the viewport. */
      _onRenderedDataChange() {
        if (!this._renderedRange) {
          return;
        }
        this._renderedItems = this._data.slice(this._renderedRange.start, this._renderedRange.end);
        if (!this._differ) {
          this._differ = this._differs.find(this._renderedItems).create((index, item) => {
            return this.cdkVirtualForTrackBy ? this.cdkVirtualForTrackBy(index, item) : item;
          });
        }
        this._needsUpdate = true;
      }
      /** Swap out one `DataSource` for another. */
      _changeDataSource(oldDs, newDs) {
        if (oldDs) {
          oldDs.disconnect(this);
        }
        this._needsUpdate = true;
        return newDs ? newDs.connect(this) : of();
      }
      /** Update the `CdkVirtualForOfContext` for all views. */
      _updateContext() {
        const count = this._data.length;
        let i = this._viewContainerRef.length;
        while (i--) {
          const view = this._viewContainerRef.get(i);
          view.context.index = this._renderedRange.start + i;
          view.context.count = count;
          this._updateComputedContextProperties(view.context);
          view.detectChanges();
        }
      }
      /** Apply changes to the DOM. */
      _applyChanges(changes) {
        this._viewRepeater.applyChanges(changes, this._viewContainerRef, (record, _adjustedPreviousIndex, currentIndex) => this._getEmbeddedViewArgs(record, currentIndex), (record) => record.item);
        changes.forEachIdentityChange((record) => {
          const view = this._viewContainerRef.get(record.currentIndex);
          view.context.$implicit = record.item;
        });
        const count = this._data.length;
        let i = this._viewContainerRef.length;
        while (i--) {
          const view = this._viewContainerRef.get(i);
          view.context.index = this._renderedRange.start + i;
          view.context.count = count;
          this._updateComputedContextProperties(view.context);
        }
      }
      /** Update the computed properties on the `CdkVirtualForOfContext`. */
      _updateComputedContextProperties(context) {
        context.first = context.index === 0;
        context.last = context.index === context.count - 1;
        context.even = context.index % 2 === 0;
        context.odd = !context.even;
      }
      _getEmbeddedViewArgs(record, index) {
        return {
          templateRef: this._template,
          context: {
            $implicit: record.item,
            // It's guaranteed that the iterable is not "undefined" or "null" because we only
            // generate views for elements if the "cdkVirtualForOf" iterable has elements.
            cdkVirtualForOf: this._cdkVirtualForOf,
            index: -1,
            count: -1,
            first: false,
            last: false,
            odd: false,
            even: false
          },
          index
        };
      }
      static ngTemplateContextGuard(directive, context) {
        return true;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkVirtualForOf, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkVirtualForOf, isStandalone: true, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: { cdkVirtualForOf: "cdkVirtualForOf", cdkVirtualForTrackBy: "cdkVirtualForTrackBy", cdkVirtualForTemplate: "cdkVirtualForTemplate", cdkVirtualForTemplateCacheSize: "cdkVirtualForTemplateCacheSize" }, providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }], ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkVirtualForOf, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdkVirtualFor][cdkVirtualForOf]",
        providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }]
      }]
    }], ctorParameters: () => [], propDecorators: { cdkVirtualForOf: [{
      type: Input
    }], cdkVirtualForTrackBy: [{
      type: Input
    }], cdkVirtualForTemplate: [{
      type: Input
    }], cdkVirtualForTemplateCacheSize: [{
      type: Input
    }] } });
    CdkVirtualScrollableElement = class _CdkVirtualScrollableElement extends CdkVirtualScrollable {
      constructor() {
        super();
      }
      measureBoundingClientRectWithScrollOffset(from) {
        return this.getElementRef().nativeElement.getBoundingClientRect()[from] - this.measureScrollOffset(from);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkVirtualScrollableElement, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkVirtualScrollableElement, isStandalone: true, selector: "[cdkVirtualScrollingElement]", host: { classAttribute: "cdk-virtual-scrollable" }, providers: [{ provide: VIRTUAL_SCROLLABLE, useExisting: _CdkVirtualScrollableElement }], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkVirtualScrollableElement, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdkVirtualScrollingElement]",
        providers: [{ provide: VIRTUAL_SCROLLABLE, useExisting: CdkVirtualScrollableElement }],
        host: {
          "class": "cdk-virtual-scrollable"
        }
      }]
    }], ctorParameters: () => [] });
    CdkVirtualScrollableWindow = class _CdkVirtualScrollableWindow extends CdkVirtualScrollable {
      constructor() {
        super();
        const document2 = inject(DOCUMENT);
        this.elementRef = new ElementRef(document2.documentElement);
        this._scrollElement = document2;
      }
      measureBoundingClientRectWithScrollOffset(from) {
        return this.getElementRef().nativeElement.getBoundingClientRect()[from];
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkVirtualScrollableWindow, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkVirtualScrollableWindow, isStandalone: true, selector: "cdk-virtual-scroll-viewport[scrollWindow]", providers: [{ provide: VIRTUAL_SCROLLABLE, useExisting: _CdkVirtualScrollableWindow }], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkVirtualScrollableWindow, decorators: [{
      type: Directive,
      args: [{
        selector: "cdk-virtual-scroll-viewport[scrollWindow]",
        providers: [{ provide: VIRTUAL_SCROLLABLE, useExisting: CdkVirtualScrollableWindow }]
      }]
    }], ctorParameters: () => [] });
    CdkScrollableModule = class _CdkScrollableModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkScrollableModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkScrollableModule, imports: [CdkScrollable], exports: [CdkScrollable] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkScrollableModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkScrollableModule, decorators: [{
      type: NgModule,
      args: [{
        exports: [CdkScrollable],
        imports: [CdkScrollable]
      }]
    }] });
    ScrollingModule = class _ScrollingModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollingModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollingModule, imports: [
        BidiModule,
        CdkScrollableModule,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        CdkVirtualScrollableWindow,
        CdkVirtualScrollableElement
      ], exports: [
        BidiModule,
        CdkScrollableModule,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        CdkVirtualScrollViewport,
        CdkVirtualScrollableWindow,
        CdkVirtualScrollableElement
      ] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollingModule, imports: [
        BidiModule,
        CdkScrollableModule,
        BidiModule,
        CdkScrollableModule
      ] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: ScrollingModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [
          BidiModule,
          CdkScrollableModule,
          CdkVirtualScrollViewport,
          CdkFixedSizeVirtualScroll,
          CdkVirtualForOf,
          CdkVirtualScrollableWindow,
          CdkVirtualScrollableElement
        ],
        exports: [
          BidiModule,
          CdkScrollableModule,
          CdkFixedSizeVirtualScroll,
          CdkVirtualForOf,
          CdkVirtualScrollViewport,
          CdkVirtualScrollableWindow,
          CdkVirtualScrollableElement
        ]
      }]
    }] });
  }
});

// node_modules/@angular/cdk/fesm2022/overlay-module.mjs
function createBlockScrollStrategy(injector) {
  return new BlockScrollStrategy(injector.get(ViewportRuler), injector.get(DOCUMENT));
}
function getMatScrollStrategyAlreadyAttachedError() {
  return Error(`Scroll strategy has already been attached.`);
}
function createCloseScrollStrategy(injector, config) {
  return new CloseScrollStrategy(injector.get(ScrollDispatcher), injector.get(NgZone), injector.get(ViewportRuler), config);
}
function isElementScrolledOutsideView(element, scrollContainers) {
  return scrollContainers.some((containerBounds) => {
    const outsideAbove = element.bottom < containerBounds.top;
    const outsideBelow = element.top > containerBounds.bottom;
    const outsideLeft = element.right < containerBounds.left;
    const outsideRight = element.left > containerBounds.right;
    return outsideAbove || outsideBelow || outsideLeft || outsideRight;
  });
}
function isElementClippedByScrolling(element, scrollContainers) {
  return scrollContainers.some((scrollContainerRect) => {
    const clippedAbove = element.top < scrollContainerRect.top;
    const clippedBelow = element.bottom > scrollContainerRect.bottom;
    const clippedLeft = element.left < scrollContainerRect.left;
    const clippedRight = element.right > scrollContainerRect.right;
    return clippedAbove || clippedBelow || clippedLeft || clippedRight;
  });
}
function createRepositionScrollStrategy(injector, config) {
  return new RepositionScrollStrategy(injector.get(ScrollDispatcher), injector.get(ViewportRuler), injector.get(NgZone), config);
}
function validateVerticalPosition(property, value2) {
  if (value2 !== "top" && value2 !== "bottom" && value2 !== "center") {
    throw Error(`ConnectedPosition: Invalid ${property} "${value2}". Expected "top", "bottom" or "center".`);
  }
}
function validateHorizontalPosition(property, value2) {
  if (value2 !== "start" && value2 !== "end" && value2 !== "center") {
    throw Error(`ConnectedPosition: Invalid ${property} "${value2}". Expected "start", "end" or "center".`);
  }
}
function containsPierceShadowDom(parent, child) {
  const supportsShadowRoot = typeof ShadowRoot !== "undefined" && ShadowRoot;
  let current = child;
  while (current) {
    if (current === parent) {
      return true;
    }
    current = supportsShadowRoot && current instanceof ShadowRoot ? current.host : current.parentNode;
  }
  return false;
}
function createFlexibleConnectedPositionStrategy(injector, origin) {
  return new FlexibleConnectedPositionStrategy(origin, injector.get(ViewportRuler), injector.get(DOCUMENT), injector.get(Platform), injector.get(OverlayContainer));
}
function extendStyles(destination, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
  return destination;
}
function getPixelValue(input) {
  if (typeof input !== "number" && input != null) {
    const [value2, units] = input.split(cssUnitPattern);
    return !units || units === "px" ? parseFloat(value2) : null;
  }
  return input || null;
}
function getRoundedBoundingClientRect(clientRect) {
  return {
    top: Math.floor(clientRect.top),
    right: Math.floor(clientRect.right),
    bottom: Math.floor(clientRect.bottom),
    left: Math.floor(clientRect.left),
    width: Math.floor(clientRect.width),
    height: Math.floor(clientRect.height)
  };
}
function compareScrollVisibility(a, b) {
  if (a === b) {
    return true;
  }
  return a.isOriginClipped === b.isOriginClipped && a.isOriginOutsideView === b.isOriginOutsideView && a.isOverlayClipped === b.isOverlayClipped && a.isOverlayOutsideView === b.isOverlayOutsideView;
}
function createGlobalPositionStrategy(_injector) {
  return new GlobalPositionStrategy();
}
function createOverlayRef(injector, config) {
  injector.get(_CdkPrivateStyleLoader).load(_CdkOverlayStyleLoader);
  const overlayContainer = injector.get(OverlayContainer);
  const doc = injector.get(DOCUMENT);
  const idGenerator = injector.get(_IdGenerator);
  const appRef = injector.get(ApplicationRef);
  const directionality = injector.get(Directionality);
  const host = doc.createElement("div");
  const pane = doc.createElement("div");
  pane.id = idGenerator.getId("cdk-overlay-");
  pane.classList.add("cdk-overlay-pane");
  host.appendChild(pane);
  overlayContainer.getContainerElement().appendChild(host);
  const portalOutlet = new DomPortalOutlet(pane, appRef, injector);
  const overlayConfig = new OverlayConfig(config);
  const renderer = injector.get(Renderer2, null, { optional: true }) || injector.get(RendererFactory2).createRenderer(null, null);
  overlayConfig.direction = overlayConfig.direction || directionality.value;
  return new OverlayRef(portalOutlet, host, pane, overlayConfig, injector.get(NgZone), injector.get(OverlayKeyboardDispatcher), doc, injector.get(Location), injector.get(OverlayOutsideClickDispatcher), config?.disableAnimations ?? injector.get(ANIMATION_MODULE_TYPE, null, { optional: true }) === "NoopAnimations", injector.get(EnvironmentInjector), renderer);
}
function CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
  const injector = inject(Injector);
  return () => createRepositionScrollStrategy(injector);
}
var scrollBehaviorSupported2, BlockScrollStrategy, CloseScrollStrategy, NoopScrollStrategy, RepositionScrollStrategy, ScrollStrategyOptions, OverlayConfig, ConnectedOverlayPositionChange, BaseOverlayDispatcher, OverlayKeyboardDispatcher, OverlayOutsideClickDispatcher, _CdkOverlayStyleLoader, OverlayContainer, BackdropRef, OverlayRef, boundingBoxClass, cssUnitPattern, FlexibleConnectedPositionStrategy, wrapperClass, GlobalPositionStrategy, OverlayPositionBuilder, Overlay, defaultPositionList, CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY, CdkOverlayOrigin, CdkConnectedOverlay, CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER, OverlayModule;
var init_overlay_module = __esm({
  "node_modules/@angular/cdk/fesm2022/overlay-module.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_common();
    init_platform2();
    init_shadow_dom();
    init_test_environment();
    init_style_loader();
    init_esm();
    init_css_pixel_value();
    init_array();
    init_scrolling();
    init_portal();
    init_scrolling2();
    init_operators();
    init_id_generator();
    init_directionality();
    init_keycodes2();
    init_keycodes();
    init_bidi();
    scrollBehaviorSupported2 = supportsScrollBehavior();
    BlockScrollStrategy = class {
      _viewportRuler;
      _previousHTMLStyles = { top: "", left: "" };
      _previousScrollPosition;
      _isEnabled = false;
      _document;
      constructor(_viewportRuler, document2) {
        this._viewportRuler = _viewportRuler;
        this._document = document2;
      }
      /** Attaches this scroll strategy to an overlay. */
      attach() {
      }
      /** Blocks page-level scroll while the attached overlay is open. */
      enable() {
        if (this._canBeEnabled()) {
          const root = this._document.documentElement;
          this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
          this._previousHTMLStyles.left = root.style.left || "";
          this._previousHTMLStyles.top = root.style.top || "";
          root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
          root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
          root.classList.add("cdk-global-scrollblock");
          this._isEnabled = true;
        }
      }
      /** Unblocks page-level scroll while the attached overlay is open. */
      disable() {
        if (this._isEnabled) {
          const html = this._document.documentElement;
          const body = this._document.body;
          const htmlStyle = html.style;
          const bodyStyle = body.style;
          const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || "";
          const previousBodyScrollBehavior = bodyStyle.scrollBehavior || "";
          this._isEnabled = false;
          htmlStyle.left = this._previousHTMLStyles.left;
          htmlStyle.top = this._previousHTMLStyles.top;
          html.classList.remove("cdk-global-scrollblock");
          if (scrollBehaviorSupported2) {
            htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = "auto";
          }
          window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
          if (scrollBehaviorSupported2) {
            htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
            bodyStyle.scrollBehavior = previousBodyScrollBehavior;
          }
        }
      }
      _canBeEnabled() {
        const html = this._document.documentElement;
        if (html.classList.contains("cdk-global-scrollblock") || this._isEnabled) {
          return false;
        }
        const rootElement = this._document.documentElement;
        const viewport = this._viewportRuler.getViewportSize();
        return rootElement.scrollHeight > viewport.height || rootElement.scrollWidth > viewport.width;
      }
    };
    CloseScrollStrategy = class {
      _scrollDispatcher;
      _ngZone;
      _viewportRuler;
      _config;
      _scrollSubscription = null;
      _overlayRef;
      _initialScrollPosition;
      constructor(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._ngZone = _ngZone;
        this._viewportRuler = _viewportRuler;
        this._config = _config;
      }
      /** Attaches this scroll strategy to an overlay. */
      attach(overlayRef) {
        if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
      }
      /** Enables the closing of the attached overlay on scroll. */
      enable() {
        if (this._scrollSubscription) {
          return;
        }
        const stream = this._scrollDispatcher.scrolled(0).pipe(filter((scrollable) => {
          return !scrollable || !this._overlayRef.overlayElement.contains(scrollable.getElementRef().nativeElement);
        }));
        if (this._config && this._config.threshold && this._config.threshold > 1) {
          this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
          this._scrollSubscription = stream.subscribe(() => {
            const scrollPosition = this._viewportRuler.getViewportScrollPosition().top;
            if (Math.abs(scrollPosition - this._initialScrollPosition) > this._config.threshold) {
              this._detach();
            } else {
              this._overlayRef.updatePosition();
            }
          });
        } else {
          this._scrollSubscription = stream.subscribe(this._detach);
        }
      }
      /** Disables the closing the attached overlay on scroll. */
      disable() {
        if (this._scrollSubscription) {
          this._scrollSubscription.unsubscribe();
          this._scrollSubscription = null;
        }
      }
      detach() {
        this.disable();
        this._overlayRef = null;
      }
      /** Detaches the overlay ref and disables the scroll strategy. */
      _detach = () => {
        this.disable();
        if (this._overlayRef.hasAttached()) {
          this._ngZone.run(() => this._overlayRef.detach());
        }
      };
    };
    NoopScrollStrategy = class {
      /** Does nothing, as this scroll strategy is a no-op. */
      enable() {
      }
      /** Does nothing, as this scroll strategy is a no-op. */
      disable() {
      }
      /** Does nothing, as this scroll strategy is a no-op. */
      attach() {
      }
    };
    RepositionScrollStrategy = class {
      _scrollDispatcher;
      _viewportRuler;
      _ngZone;
      _config;
      _scrollSubscription = null;
      _overlayRef;
      constructor(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        this._ngZone = _ngZone;
        this._config = _config;
      }
      /** Attaches this scroll strategy to an overlay. */
      attach(overlayRef) {
        if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
      }
      /** Enables repositioning of the attached overlay on scroll. */
      enable() {
        if (!this._scrollSubscription) {
          const throttle = this._config ? this._config.scrollThrottle : 0;
          this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(() => {
            this._overlayRef.updatePosition();
            if (this._config && this._config.autoClose) {
              const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
              const { width, height } = this._viewportRuler.getViewportSize();
              const parentRects = [{ width, height, bottom: height, right: width, top: 0, left: 0 }];
              if (isElementScrolledOutsideView(overlayRect, parentRects)) {
                this.disable();
                this._ngZone.run(() => this._overlayRef.detach());
              }
            }
          });
        }
      }
      /** Disables repositioning of the attached overlay on scroll. */
      disable() {
        if (this._scrollSubscription) {
          this._scrollSubscription.unsubscribe();
          this._scrollSubscription = null;
        }
      }
      detach() {
        this.disable();
        this._overlayRef = null;
      }
    };
    ScrollStrategyOptions = class _ScrollStrategyOptions {
      _injector = inject(Injector);
      constructor() {
      }
      /** Do nothing on scroll. */
      noop = () => new NoopScrollStrategy();
      /**
       * Close the overlay as soon as the user scrolls.
       * @param config Configuration to be used inside the scroll strategy.
       */
      close = (config) => createCloseScrollStrategy(this._injector, config);
      /** Block scrolling. */
      block = () => createBlockScrollStrategy(this._injector);
      /**
       * Update the overlay's position on scroll.
       * @param config Configuration to be used inside the scroll strategy.
       * Allows debouncing the reposition calls.
       */
      reposition = (config) => createRepositionScrollStrategy(this._injector, config);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollStrategyOptions, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _ScrollStrategyOptions, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: ScrollStrategyOptions, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    OverlayConfig = class {
      /** Strategy with which to position the overlay. */
      positionStrategy;
      /** Strategy to be used when handling scroll events while the overlay is open. */
      scrollStrategy = new NoopScrollStrategy();
      /** Custom class to add to the overlay pane. */
      panelClass = "";
      /** Whether the overlay has a backdrop. */
      hasBackdrop = false;
      /** Custom class to add to the backdrop */
      backdropClass = "cdk-overlay-dark-backdrop";
      /** Whether to disable any built-in animations. */
      disableAnimations;
      /** The width of the overlay panel. If a number is provided, pixel units are assumed. */
      width;
      /** The height of the overlay panel. If a number is provided, pixel units are assumed. */
      height;
      /** The min-width of the overlay panel. If a number is provided, pixel units are assumed. */
      minWidth;
      /** The min-height of the overlay panel. If a number is provided, pixel units are assumed. */
      minHeight;
      /** The max-width of the overlay panel. If a number is provided, pixel units are assumed. */
      maxWidth;
      /** The max-height of the overlay panel. If a number is provided, pixel units are assumed. */
      maxHeight;
      /**
       * Direction of the text in the overlay panel. If a `Directionality` instance
       * is passed in, the overlay will handle changes to its value automatically.
       */
      direction;
      /**
       * Whether the overlay should be disposed of when the user goes backwards/forwards in history.
       * Note that this usually doesn't include clicking on links (unless the user is using
       * the `HashLocationStrategy`).
       */
      disposeOnNavigation = false;
      constructor(config) {
        if (config) {
          const configKeys = Object.keys(config);
          for (const key of configKeys) {
            if (config[key] !== void 0) {
              this[key] = config[key];
            }
          }
        }
      }
    };
    ConnectedOverlayPositionChange = class {
      connectionPair;
      scrollableViewProperties;
      constructor(connectionPair, scrollableViewProperties) {
        this.connectionPair = connectionPair;
        this.scrollableViewProperties = scrollableViewProperties;
      }
    };
    BaseOverlayDispatcher = class _BaseOverlayDispatcher {
      /** Currently attached overlays in the order they were attached. */
      _attachedOverlays = [];
      _document = inject(DOCUMENT);
      _isAttached;
      constructor() {
      }
      ngOnDestroy() {
        this.detach();
      }
      /** Add a new overlay to the list of attached overlay refs. */
      add(overlayRef) {
        this.remove(overlayRef);
        this._attachedOverlays.push(overlayRef);
      }
      /** Remove an overlay from the list of attached overlay refs. */
      remove(overlayRef) {
        const index = this._attachedOverlays.indexOf(overlayRef);
        if (index > -1) {
          this._attachedOverlays.splice(index, 1);
        }
        if (this._attachedOverlays.length === 0) {
          this.detach();
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _BaseOverlayDispatcher, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _BaseOverlayDispatcher, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: BaseOverlayDispatcher, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    OverlayKeyboardDispatcher = class _OverlayKeyboardDispatcher extends BaseOverlayDispatcher {
      _ngZone = inject(NgZone);
      _renderer = inject(RendererFactory2).createRenderer(null, null);
      _cleanupKeydown;
      /** Add a new overlay to the list of attached overlay refs. */
      add(overlayRef) {
        super.add(overlayRef);
        if (!this._isAttached) {
          this._ngZone.runOutsideAngular(() => {
            this._cleanupKeydown = this._renderer.listen("body", "keydown", this._keydownListener);
          });
          this._isAttached = true;
        }
      }
      /** Detaches the global keyboard event listener. */
      detach() {
        if (this._isAttached) {
          this._cleanupKeydown?.();
          this._isAttached = false;
        }
      }
      /** Keyboard event listener that will be attached to the body. */
      _keydownListener = (event) => {
        const overlays = this._attachedOverlays;
        for (let i = overlays.length - 1; i > -1; i--) {
          if (overlays[i]._keydownEvents.observers.length > 0) {
            this._ngZone.run(() => overlays[i]._keydownEvents.next(event));
            break;
          }
        }
      };
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayKeyboardDispatcher, deps: null, target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayKeyboardDispatcher, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: OverlayKeyboardDispatcher, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }] });
    OverlayOutsideClickDispatcher = class _OverlayOutsideClickDispatcher extends BaseOverlayDispatcher {
      _platform = inject(Platform);
      _ngZone = inject(NgZone);
      _renderer = inject(RendererFactory2).createRenderer(null, null);
      _cursorOriginalValue;
      _cursorStyleIsSet = false;
      _pointerDownEventTarget;
      _cleanups;
      /** Add a new overlay to the list of attached overlay refs. */
      add(overlayRef) {
        super.add(overlayRef);
        if (!this._isAttached) {
          const body = this._document.body;
          const eventOptions = { capture: true };
          const renderer = this._renderer;
          this._cleanups = this._ngZone.runOutsideAngular(() => [
            renderer.listen(body, "pointerdown", this._pointerDownListener, eventOptions),
            renderer.listen(body, "click", this._clickListener, eventOptions),
            renderer.listen(body, "auxclick", this._clickListener, eventOptions),
            renderer.listen(body, "contextmenu", this._clickListener, eventOptions)
          ]);
          if (this._platform.IOS && !this._cursorStyleIsSet) {
            this._cursorOriginalValue = body.style.cursor;
            body.style.cursor = "pointer";
            this._cursorStyleIsSet = true;
          }
          this._isAttached = true;
        }
      }
      /** Detaches the global keyboard event listener. */
      detach() {
        if (this._isAttached) {
          this._cleanups?.forEach((cleanup) => cleanup());
          this._cleanups = void 0;
          if (this._platform.IOS && this._cursorStyleIsSet) {
            this._document.body.style.cursor = this._cursorOriginalValue;
            this._cursorStyleIsSet = false;
          }
          this._isAttached = false;
        }
      }
      /** Store pointerdown event target to track origin of click. */
      _pointerDownListener = (event) => {
        this._pointerDownEventTarget = _getEventTarget(event);
      };
      /** Click event listener that will be attached to the body propagate phase. */
      _clickListener = (event) => {
        const target = _getEventTarget(event);
        const origin = event.type === "click" && this._pointerDownEventTarget ? this._pointerDownEventTarget : target;
        this._pointerDownEventTarget = null;
        const overlays = this._attachedOverlays.slice();
        for (let i = overlays.length - 1; i > -1; i--) {
          const overlayRef = overlays[i];
          if (overlayRef._outsidePointerEvents.observers.length < 1 || !overlayRef.hasAttached()) {
            continue;
          }
          if (containsPierceShadowDom(overlayRef.overlayElement, target) || containsPierceShadowDom(overlayRef.overlayElement, origin)) {
            break;
          }
          const outsidePointerEvents = overlayRef._outsidePointerEvents;
          if (this._ngZone) {
            this._ngZone.run(() => outsidePointerEvents.next(event));
          } else {
            outsidePointerEvents.next(event);
          }
        }
      };
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayOutsideClickDispatcher, deps: null, target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayOutsideClickDispatcher, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: OverlayOutsideClickDispatcher, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }] });
    _CdkOverlayStyleLoader = class __CdkOverlayStyleLoader {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: __CdkOverlayStyleLoader, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: __CdkOverlayStyleLoader, isStandalone: true, selector: "ng-component", host: { attributes: { "cdk-overlay-style-loader": "" } }, ngImport: core_exports, template: "", isInline: true, styles: [".cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed}@layer cdk-overlay{.cdk-overlay-container{z-index:1000}}.cdk-overlay-container:empty{display:none}.cdk-global-overlay-wrapper{display:flex;position:absolute}@layer cdk-overlay{.cdk-global-overlay-wrapper{z-index:1000}}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;display:flex;max-width:100%;max-height:100%}@layer cdk-overlay{.cdk-overlay-pane{z-index:1000}}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);opacity:0;touch-action:manipulation}@layer cdk-overlay{.cdk-overlay-backdrop{z-index:1000;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}}@media(prefers-reduced-motion){.cdk-overlay-backdrop{transition-duration:1ms}}.cdk-overlay-backdrop-showing{opacity:1}@media(forced-colors: active){.cdk-overlay-backdrop-showing{opacity:.6}}@layer cdk-overlay{.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.32)}}.cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing,.cdk-high-contrast-active .cdk-overlay-transparent-backdrop{opacity:0;visibility:visible}.cdk-overlay-backdrop-noop-animation{transition:none}.cdk-overlay-connected-position-bounding-box{position:absolute;display:flex;flex-direction:column;min-width:1px;min-height:1px}@layer cdk-overlay{.cdk-overlay-connected-position-bounding-box{z-index:1000}}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkOverlayStyleLoader, decorators: [{
      type: Component,
      args: [{ template: "", changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: { "cdk-overlay-style-loader": "" }, styles: [".cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed}@layer cdk-overlay{.cdk-overlay-container{z-index:1000}}.cdk-overlay-container:empty{display:none}.cdk-global-overlay-wrapper{display:flex;position:absolute}@layer cdk-overlay{.cdk-global-overlay-wrapper{z-index:1000}}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;display:flex;max-width:100%;max-height:100%}@layer cdk-overlay{.cdk-overlay-pane{z-index:1000}}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);opacity:0;touch-action:manipulation}@layer cdk-overlay{.cdk-overlay-backdrop{z-index:1000;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}}@media(prefers-reduced-motion){.cdk-overlay-backdrop{transition-duration:1ms}}.cdk-overlay-backdrop-showing{opacity:1}@media(forced-colors: active){.cdk-overlay-backdrop-showing{opacity:.6}}@layer cdk-overlay{.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.32)}}.cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing,.cdk-high-contrast-active .cdk-overlay-transparent-backdrop{opacity:0;visibility:visible}.cdk-overlay-backdrop-noop-animation{transition:none}.cdk-overlay-connected-position-bounding-box{position:absolute;display:flex;flex-direction:column;min-width:1px;min-height:1px}@layer cdk-overlay{.cdk-overlay-connected-position-bounding-box{z-index:1000}}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"] }]
    }] });
    OverlayContainer = class _OverlayContainer {
      _platform = inject(Platform);
      _containerElement;
      _document = inject(DOCUMENT);
      _styleLoader = inject(_CdkPrivateStyleLoader);
      constructor() {
      }
      ngOnDestroy() {
        this._containerElement?.remove();
      }
      /**
       * This method returns the overlay container element. It will lazily
       * create the element the first time it is called to facilitate using
       * the container in non-browser environments.
       * @returns the container element
       */
      getContainerElement() {
        this._loadStyles();
        if (!this._containerElement) {
          this._createContainer();
        }
        return this._containerElement;
      }
      /**
       * Create the overlay container element, which is simply a div
       * with the 'cdk-overlay-container' class on the document body.
       */
      _createContainer() {
        const containerClass = "cdk-overlay-container";
        if (this._platform.isBrowser || _isTestEnvironment()) {
          const oppositePlatformContainers = this._document.querySelectorAll(`.${containerClass}[platform="server"], .${containerClass}[platform="test"]`);
          for (let i = 0; i < oppositePlatformContainers.length; i++) {
            oppositePlatformContainers[i].remove();
          }
        }
        const container = this._document.createElement("div");
        container.classList.add(containerClass);
        if (_isTestEnvironment()) {
          container.setAttribute("platform", "test");
        } else if (!this._platform.isBrowser) {
          container.setAttribute("platform", "server");
        }
        this._document.body.appendChild(container);
        this._containerElement = container;
      }
      /** Loads the structural styles necessary for the overlay to work. */
      _loadStyles() {
        this._styleLoader.load(_CdkOverlayStyleLoader);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayContainer, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayContainer, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: OverlayContainer, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    BackdropRef = class {
      _renderer;
      _ngZone;
      element;
      _cleanupClick;
      _cleanupTransitionEnd;
      _fallbackTimeout;
      constructor(document2, _renderer, _ngZone, onClick) {
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this.element = document2.createElement("div");
        this.element.classList.add("cdk-overlay-backdrop");
        this._cleanupClick = _renderer.listen(this.element, "click", onClick);
      }
      detach() {
        this._ngZone.runOutsideAngular(() => {
          const element = this.element;
          clearTimeout(this._fallbackTimeout);
          this._cleanupTransitionEnd?.();
          this._cleanupTransitionEnd = this._renderer.listen(element, "transitionend", this.dispose);
          this._fallbackTimeout = setTimeout(this.dispose, 500);
          element.style.pointerEvents = "none";
          element.classList.remove("cdk-overlay-backdrop-showing");
        });
      }
      dispose = () => {
        clearTimeout(this._fallbackTimeout);
        this._cleanupClick?.();
        this._cleanupTransitionEnd?.();
        this._cleanupClick = this._cleanupTransitionEnd = this._fallbackTimeout = void 0;
        this.element.remove();
      };
    };
    OverlayRef = class {
      _portalOutlet;
      _host;
      _pane;
      _config;
      _ngZone;
      _keyboardDispatcher;
      _document;
      _location;
      _outsideClickDispatcher;
      _animationsDisabled;
      _injector;
      _renderer;
      _backdropClick = new Subject();
      _attachments = new Subject();
      _detachments = new Subject();
      _positionStrategy;
      _scrollStrategy;
      _locationChanges = Subscription.EMPTY;
      _backdropRef = null;
      _detachContentMutationObserver;
      _detachContentAfterRenderRef;
      /**
       * Reference to the parent of the `_host` at the time it was detached. Used to restore
       * the `_host` to its original position in the DOM when it gets re-attached.
       */
      _previousHostParent;
      /** Stream of keydown events dispatched to this overlay. */
      _keydownEvents = new Subject();
      /** Stream of mouse outside events dispatched to this overlay. */
      _outsidePointerEvents = new Subject();
      /** Reference to the currently-running `afterNextRender` call. */
      _afterNextRenderRef;
      constructor(_portalOutlet, _host, _pane, _config, _ngZone, _keyboardDispatcher, _document, _location, _outsideClickDispatcher, _animationsDisabled2 = false, _injector, _renderer) {
        this._portalOutlet = _portalOutlet;
        this._host = _host;
        this._pane = _pane;
        this._config = _config;
        this._ngZone = _ngZone;
        this._keyboardDispatcher = _keyboardDispatcher;
        this._document = _document;
        this._location = _location;
        this._outsideClickDispatcher = _outsideClickDispatcher;
        this._animationsDisabled = _animationsDisabled2;
        this._injector = _injector;
        this._renderer = _renderer;
        if (_config.scrollStrategy) {
          this._scrollStrategy = _config.scrollStrategy;
          this._scrollStrategy.attach(this);
        }
        this._positionStrategy = _config.positionStrategy;
      }
      /** The overlay's HTML element */
      get overlayElement() {
        return this._pane;
      }
      /** The overlay's backdrop HTML element. */
      get backdropElement() {
        return this._backdropRef?.element || null;
      }
      /**
       * Wrapper around the panel element. Can be used for advanced
       * positioning where a wrapper with specific styling is
       * required around the overlay pane.
       */
      get hostElement() {
        return this._host;
      }
      /**
       * Attaches content, given via a Portal, to the overlay.
       * If the overlay is configured to have a backdrop, it will be created.
       *
       * @param portal Portal instance to which to attach the overlay.
       * @returns The portal attachment result.
       */
      attach(portal) {
        if (!this._host.parentElement && this._previousHostParent) {
          this._previousHostParent.appendChild(this._host);
        }
        const attachResult = this._portalOutlet.attach(portal);
        if (this._positionStrategy) {
          this._positionStrategy.attach(this);
        }
        this._updateStackingOrder();
        this._updateElementSize();
        this._updateElementDirection();
        if (this._scrollStrategy) {
          this._scrollStrategy.enable();
        }
        this._afterNextRenderRef?.destroy();
        this._afterNextRenderRef = afterNextRender(() => {
          if (this.hasAttached()) {
            this.updatePosition();
          }
        }, { injector: this._injector });
        this._togglePointerEvents(true);
        if (this._config.hasBackdrop) {
          this._attachBackdrop();
        }
        if (this._config.panelClass) {
          this._toggleClasses(this._pane, this._config.panelClass, true);
        }
        this._attachments.next();
        this._completeDetachContent();
        this._keyboardDispatcher.add(this);
        if (this._config.disposeOnNavigation) {
          this._locationChanges = this._location.subscribe(() => this.dispose());
        }
        this._outsideClickDispatcher.add(this);
        if (typeof attachResult?.onDestroy === "function") {
          attachResult.onDestroy(() => {
            if (this.hasAttached()) {
              this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
            }
          });
        }
        return attachResult;
      }
      /**
       * Detaches an overlay from a portal.
       * @returns The portal detachment result.
       */
      detach() {
        if (!this.hasAttached()) {
          return;
        }
        this.detachBackdrop();
        this._togglePointerEvents(false);
        if (this._positionStrategy && this._positionStrategy.detach) {
          this._positionStrategy.detach();
        }
        if (this._scrollStrategy) {
          this._scrollStrategy.disable();
        }
        const detachmentResult = this._portalOutlet.detach();
        this._detachments.next();
        this._completeDetachContent();
        this._keyboardDispatcher.remove(this);
        this._detachContentWhenEmpty();
        this._locationChanges.unsubscribe();
        this._outsideClickDispatcher.remove(this);
        return detachmentResult;
      }
      /** Cleans up the overlay from the DOM. */
      dispose() {
        const isAttached = this.hasAttached();
        if (this._positionStrategy) {
          this._positionStrategy.dispose();
        }
        this._disposeScrollStrategy();
        this._backdropRef?.dispose();
        this._locationChanges.unsubscribe();
        this._keyboardDispatcher.remove(this);
        this._portalOutlet.dispose();
        this._attachments.complete();
        this._backdropClick.complete();
        this._keydownEvents.complete();
        this._outsidePointerEvents.complete();
        this._outsideClickDispatcher.remove(this);
        this._host?.remove();
        this._afterNextRenderRef?.destroy();
        this._previousHostParent = this._pane = this._host = this._backdropRef = null;
        if (isAttached) {
          this._detachments.next();
        }
        this._detachments.complete();
        this._completeDetachContent();
      }
      /** Whether the overlay has attached content. */
      hasAttached() {
        return this._portalOutlet.hasAttached();
      }
      /** Gets an observable that emits when the backdrop has been clicked. */
      backdropClick() {
        return this._backdropClick;
      }
      /** Gets an observable that emits when the overlay has been attached. */
      attachments() {
        return this._attachments;
      }
      /** Gets an observable that emits when the overlay has been detached. */
      detachments() {
        return this._detachments;
      }
      /** Gets an observable of keydown events targeted to this overlay. */
      keydownEvents() {
        return this._keydownEvents;
      }
      /** Gets an observable of pointer events targeted outside this overlay. */
      outsidePointerEvents() {
        return this._outsidePointerEvents;
      }
      /** Gets the current overlay configuration, which is immutable. */
      getConfig() {
        return this._config;
      }
      /** Updates the position of the overlay based on the position strategy. */
      updatePosition() {
        if (this._positionStrategy) {
          this._positionStrategy.apply();
        }
      }
      /** Switches to a new position strategy and updates the overlay position. */
      updatePositionStrategy(strategy) {
        if (strategy === this._positionStrategy) {
          return;
        }
        if (this._positionStrategy) {
          this._positionStrategy.dispose();
        }
        this._positionStrategy = strategy;
        if (this.hasAttached()) {
          strategy.attach(this);
          this.updatePosition();
        }
      }
      /** Update the size properties of the overlay. */
      updateSize(sizeConfig) {
        this._config = __spreadValues(__spreadValues({}, this._config), sizeConfig);
        this._updateElementSize();
      }
      /** Sets the LTR/RTL direction for the overlay. */
      setDirection(dir) {
        this._config = __spreadProps(__spreadValues({}, this._config), { direction: dir });
        this._updateElementDirection();
      }
      /** Add a CSS class or an array of classes to the overlay pane. */
      addPanelClass(classes) {
        if (this._pane) {
          this._toggleClasses(this._pane, classes, true);
        }
      }
      /** Remove a CSS class or an array of classes from the overlay pane. */
      removePanelClass(classes) {
        if (this._pane) {
          this._toggleClasses(this._pane, classes, false);
        }
      }
      /**
       * Returns the layout direction of the overlay panel.
       */
      getDirection() {
        const direction = this._config.direction;
        if (!direction) {
          return "ltr";
        }
        return typeof direction === "string" ? direction : direction.value;
      }
      /** Switches to a new scroll strategy. */
      updateScrollStrategy(strategy) {
        if (strategy === this._scrollStrategy) {
          return;
        }
        this._disposeScrollStrategy();
        this._scrollStrategy = strategy;
        if (this.hasAttached()) {
          strategy.attach(this);
          strategy.enable();
        }
      }
      /** Updates the text direction of the overlay panel. */
      _updateElementDirection() {
        this._host.setAttribute("dir", this.getDirection());
      }
      /** Updates the size of the overlay element based on the overlay config. */
      _updateElementSize() {
        if (!this._pane) {
          return;
        }
        const style = this._pane.style;
        style.width = coerceCssPixelValue(this._config.width);
        style.height = coerceCssPixelValue(this._config.height);
        style.minWidth = coerceCssPixelValue(this._config.minWidth);
        style.minHeight = coerceCssPixelValue(this._config.minHeight);
        style.maxWidth = coerceCssPixelValue(this._config.maxWidth);
        style.maxHeight = coerceCssPixelValue(this._config.maxHeight);
      }
      /** Toggles the pointer events for the overlay pane element. */
      _togglePointerEvents(enablePointer) {
        this._pane.style.pointerEvents = enablePointer ? "" : "none";
      }
      /** Attaches a backdrop for this overlay. */
      _attachBackdrop() {
        const showingClass = "cdk-overlay-backdrop-showing";
        this._backdropRef?.dispose();
        this._backdropRef = new BackdropRef(this._document, this._renderer, this._ngZone, (event) => {
          this._backdropClick.next(event);
        });
        if (this._animationsDisabled) {
          this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation");
        }
        if (this._config.backdropClass) {
          this._toggleClasses(this._backdropRef.element, this._config.backdropClass, true);
        }
        this._host.parentElement.insertBefore(this._backdropRef.element, this._host);
        if (!this._animationsDisabled && typeof requestAnimationFrame !== "undefined") {
          this._ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => this._backdropRef?.element.classList.add(showingClass));
          });
        } else {
          this._backdropRef.element.classList.add(showingClass);
        }
      }
      /**
       * Updates the stacking order of the element, moving it to the top if necessary.
       * This is required in cases where one overlay was detached, while another one,
       * that should be behind it, was destroyed. The next time both of them are opened,
       * the stacking will be wrong, because the detached element's pane will still be
       * in its original DOM position.
       */
      _updateStackingOrder() {
        if (this._host.nextSibling) {
          this._host.parentNode.appendChild(this._host);
        }
      }
      /** Detaches the backdrop (if any) associated with the overlay. */
      detachBackdrop() {
        if (this._animationsDisabled) {
          this._backdropRef?.dispose();
          this._backdropRef = null;
        } else {
          this._backdropRef?.detach();
        }
      }
      /** Toggles a single CSS class or an array of classes on an element. */
      _toggleClasses(element, cssClasses, isAdd) {
        const classes = coerceArray(cssClasses || []).filter((c) => !!c);
        if (classes.length) {
          isAdd ? element.classList.add(...classes) : element.classList.remove(...classes);
        }
      }
      /** Detaches the overlay once the content finishes animating and is removed from the DOM. */
      _detachContentWhenEmpty() {
        let rethrow = false;
        try {
          this._detachContentAfterRenderRef = afterNextRender(() => {
            rethrow = true;
            this._detachContent();
          }, {
            injector: this._injector
          });
        } catch (e) {
          if (rethrow) {
            throw e;
          }
          this._detachContent();
        }
        if (globalThis.MutationObserver && this._pane) {
          this._detachContentMutationObserver ||= new globalThis.MutationObserver(() => {
            this._detachContent();
          });
          this._detachContentMutationObserver.observe(this._pane, { childList: true });
        }
      }
      _detachContent() {
        if (!this._pane || !this._host || this._pane.children.length === 0) {
          if (this._pane && this._config.panelClass) {
            this._toggleClasses(this._pane, this._config.panelClass, false);
          }
          if (this._host && this._host.parentElement) {
            this._previousHostParent = this._host.parentElement;
            this._host.remove();
          }
          this._completeDetachContent();
        }
      }
      _completeDetachContent() {
        this._detachContentAfterRenderRef?.destroy();
        this._detachContentAfterRenderRef = void 0;
        this._detachContentMutationObserver?.disconnect();
      }
      /** Disposes of a scroll strategy. */
      _disposeScrollStrategy() {
        const scrollStrategy = this._scrollStrategy;
        scrollStrategy?.disable();
        scrollStrategy?.detach?.();
      }
    };
    boundingBoxClass = "cdk-overlay-connected-position-bounding-box";
    cssUnitPattern = /([A-Za-z%]+)$/;
    FlexibleConnectedPositionStrategy = class {
      _viewportRuler;
      _document;
      _platform;
      _overlayContainer;
      /** The overlay to which this strategy is attached. */
      _overlayRef;
      /** Whether we're performing the very first positioning of the overlay. */
      _isInitialRender;
      /** Last size used for the bounding box. Used to avoid resizing the overlay after open. */
      _lastBoundingBoxSize = { width: 0, height: 0 };
      /** Whether the overlay was pushed in a previous positioning. */
      _isPushed = false;
      /** Whether the overlay can be pushed on-screen on the initial open. */
      _canPush = true;
      /** Whether the overlay can grow via flexible width/height after the initial open. */
      _growAfterOpen = false;
      /** Whether the overlay's width and height can be constrained to fit within the viewport. */
      _hasFlexibleDimensions = true;
      /** Whether the overlay position is locked. */
      _positionLocked = false;
      /** Cached origin dimensions */
      _originRect;
      /** Cached overlay dimensions */
      _overlayRect;
      /** Cached viewport dimensions */
      _viewportRect;
      /** Cached container dimensions */
      _containerRect;
      /** Amount of space that must be maintained between the overlay and the edge of the viewport. */
      _viewportMargin = 0;
      /** The Scrollable containers used to check scrollable view properties on position change. */
      _scrollables = [];
      /** Ordered list of preferred positions, from most to least desirable. */
      _preferredPositions = [];
      /** The origin element against which the overlay will be positioned. */
      _origin;
      /** The overlay pane element. */
      _pane;
      /** Whether the strategy has been disposed of already. */
      _isDisposed;
      /**
       * Parent element for the overlay panel used to constrain the overlay panel's size to fit
       * within the viewport.
       */
      _boundingBox;
      /** The last position to have been calculated as the best fit position. */
      _lastPosition;
      /** The last calculated scroll visibility. Only tracked  */
      _lastScrollVisibility;
      /** Subject that emits whenever the position changes. */
      _positionChanges = new Subject();
      /** Subscription to viewport size changes. */
      _resizeSubscription = Subscription.EMPTY;
      /** Default offset for the overlay along the x axis. */
      _offsetX = 0;
      /** Default offset for the overlay along the y axis. */
      _offsetY = 0;
      /** Selector to be used when finding the elements on which to set the transform origin. */
      _transformOriginSelector;
      /** Keeps track of the CSS classes that the position strategy has applied on the overlay panel. */
      _appliedPanelClasses = [];
      /** Amount by which the overlay was pushed in each axis during the last time it was positioned. */
      _previousPushAmount;
      /** Observable sequence of position changes. */
      positionChanges = this._positionChanges;
      /** Ordered list of preferred positions, from most to least desirable. */
      get positions() {
        return this._preferredPositions;
      }
      constructor(connectedTo, _viewportRuler, _document, _platform, _overlayContainer) {
        this._viewportRuler = _viewportRuler;
        this._document = _document;
        this._platform = _platform;
        this._overlayContainer = _overlayContainer;
        this.setOrigin(connectedTo);
      }
      /** Attaches this position strategy to an overlay. */
      attach(overlayRef) {
        if (this._overlayRef && overlayRef !== this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error("This position strategy is already attached to an overlay");
        }
        this._validatePositions();
        overlayRef.hostElement.classList.add(boundingBoxClass);
        this._overlayRef = overlayRef;
        this._boundingBox = overlayRef.hostElement;
        this._pane = overlayRef.overlayElement;
        this._isDisposed = false;
        this._isInitialRender = true;
        this._lastPosition = null;
        this._resizeSubscription.unsubscribe();
        this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
          this._isInitialRender = true;
          this.apply();
        });
      }
      /**
       * Updates the position of the overlay element, using whichever preferred position relative
       * to the origin best fits on-screen.
       *
       * The selection of a position goes as follows:
       *  - If any positions fit completely within the viewport as-is,
       *      choose the first position that does so.
       *  - If flexible dimensions are enabled and at least one satisfies the given minimum width/height,
       *      choose the position with the greatest available size modified by the positions' weight.
       *  - If pushing is enabled, take the position that went off-screen the least and push it
       *      on-screen.
       *  - If none of the previous criteria were met, use the position that goes off-screen the least.
       * @docs-private
       */
      apply() {
        if (this._isDisposed || !this._platform.isBrowser) {
          return;
        }
        if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
          this.reapplyLastPosition();
          return;
        }
        this._clearPanelClasses();
        this._resetOverlayElementStyles();
        this._resetBoundingBoxStyles();
        this._viewportRect = this._getNarrowedViewportRect();
        this._originRect = this._getOriginRect();
        this._overlayRect = this._pane.getBoundingClientRect();
        this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect();
        const originRect = this._originRect;
        const overlayRect = this._overlayRect;
        const viewportRect = this._viewportRect;
        const containerRect = this._containerRect;
        const flexibleFits = [];
        let fallback;
        for (let pos of this._preferredPositions) {
          let originPoint = this._getOriginPoint(originRect, containerRect, pos);
          let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
          let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);
          if (overlayFit.isCompletelyWithinViewport) {
            this._isPushed = false;
            this._applyPosition(pos, originPoint);
            return;
          }
          if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
            flexibleFits.push({
              position: pos,
              origin: originPoint,
              overlayRect,
              boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos)
            });
            continue;
          }
          if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) {
            fallback = { overlayFit, overlayPoint, originPoint, position: pos, overlayRect };
          }
        }
        if (flexibleFits.length) {
          let bestFit = null;
          let bestScore = -1;
          for (const fit of flexibleFits) {
            const score = fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
            if (score > bestScore) {
              bestScore = score;
              bestFit = fit;
            }
          }
          this._isPushed = false;
          this._applyPosition(bestFit.position, bestFit.origin);
          return;
        }
        if (this._canPush) {
          this._isPushed = true;
          this._applyPosition(fallback.position, fallback.originPoint);
          return;
        }
        this._applyPosition(fallback.position, fallback.originPoint);
      }
      detach() {
        this._clearPanelClasses();
        this._lastPosition = null;
        this._previousPushAmount = null;
        this._resizeSubscription.unsubscribe();
      }
      /** Cleanup after the element gets destroyed. */
      dispose() {
        if (this._isDisposed) {
          return;
        }
        if (this._boundingBox) {
          extendStyles(this._boundingBox.style, {
            top: "",
            left: "",
            right: "",
            bottom: "",
            height: "",
            width: "",
            alignItems: "",
            justifyContent: ""
          });
        }
        if (this._pane) {
          this._resetOverlayElementStyles();
        }
        if (this._overlayRef) {
          this._overlayRef.hostElement.classList.remove(boundingBoxClass);
        }
        this.detach();
        this._positionChanges.complete();
        this._overlayRef = this._boundingBox = null;
        this._isDisposed = true;
      }
      /**
       * This re-aligns the overlay element with the trigger in its last calculated position,
       * even if a position higher in the "preferred positions" list would now fit. This
       * allows one to re-align the panel without changing the orientation of the panel.
       */
      reapplyLastPosition() {
        if (this._isDisposed || !this._platform.isBrowser) {
          return;
        }
        const lastPosition = this._lastPosition;
        if (lastPosition) {
          this._originRect = this._getOriginRect();
          this._overlayRect = this._pane.getBoundingClientRect();
          this._viewportRect = this._getNarrowedViewportRect();
          this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect();
          const originPoint = this._getOriginPoint(this._originRect, this._containerRect, lastPosition);
          this._applyPosition(lastPosition, originPoint);
        } else {
          this.apply();
        }
      }
      /**
       * Sets the list of Scrollable containers that host the origin element so that
       * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
       * Scrollable must be an ancestor element of the strategy's origin element.
       */
      withScrollableContainers(scrollables) {
        this._scrollables = scrollables;
        return this;
      }
      /**
       * Adds new preferred positions.
       * @param positions List of positions options for this overlay.
       */
      withPositions(positions) {
        this._preferredPositions = positions;
        if (positions.indexOf(this._lastPosition) === -1) {
          this._lastPosition = null;
        }
        this._validatePositions();
        return this;
      }
      /**
       * Sets a minimum distance the overlay may be positioned to the edge of the viewport.
       * @param margin Required margin between the overlay and the viewport edge in pixels.
       */
      withViewportMargin(margin) {
        this._viewportMargin = margin;
        return this;
      }
      /** Sets whether the overlay's width and height can be constrained to fit within the viewport. */
      withFlexibleDimensions(flexibleDimensions = true) {
        this._hasFlexibleDimensions = flexibleDimensions;
        return this;
      }
      /** Sets whether the overlay can grow after the initial open via flexible width/height. */
      withGrowAfterOpen(growAfterOpen = true) {
        this._growAfterOpen = growAfterOpen;
        return this;
      }
      /** Sets whether the overlay can be pushed on-screen if none of the provided positions fit. */
      withPush(canPush = true) {
        this._canPush = canPush;
        return this;
      }
      /**
       * Sets whether the overlay's position should be locked in after it is positioned
       * initially. When an overlay is locked in, it won't attempt to reposition itself
       * when the position is re-applied (e.g. when the user scrolls away).
       * @param isLocked Whether the overlay should locked in.
       */
      withLockedPosition(isLocked = true) {
        this._positionLocked = isLocked;
        return this;
      }
      /**
       * Sets the origin, relative to which to position the overlay.
       * Using an element origin is useful for building components that need to be positioned
       * relatively to a trigger (e.g. dropdown menus or tooltips), whereas using a point can be
       * used for cases like contextual menus which open relative to the user's pointer.
       * @param origin Reference to the new origin.
       */
      setOrigin(origin) {
        this._origin = origin;
        return this;
      }
      /**
       * Sets the default offset for the overlay's connection point on the x-axis.
       * @param offset New offset in the X axis.
       */
      withDefaultOffsetX(offset) {
        this._offsetX = offset;
        return this;
      }
      /**
       * Sets the default offset for the overlay's connection point on the y-axis.
       * @param offset New offset in the Y axis.
       */
      withDefaultOffsetY(offset) {
        this._offsetY = offset;
        return this;
      }
      /**
       * Configures that the position strategy should set a `transform-origin` on some elements
       * inside the overlay, depending on the current position that is being applied. This is
       * useful for the cases where the origin of an animation can change depending on the
       * alignment of the overlay.
       * @param selector CSS selector that will be used to find the target
       *    elements onto which to set the transform origin.
       */
      withTransformOriginOn(selector) {
        this._transformOriginSelector = selector;
        return this;
      }
      /**
       * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
       */
      _getOriginPoint(originRect, containerRect, pos) {
        let x;
        if (pos.originX == "center") {
          x = originRect.left + originRect.width / 2;
        } else {
          const startX = this._isRtl() ? originRect.right : originRect.left;
          const endX = this._isRtl() ? originRect.left : originRect.right;
          x = pos.originX == "start" ? startX : endX;
        }
        if (containerRect.left < 0) {
          x -= containerRect.left;
        }
        let y;
        if (pos.originY == "center") {
          y = originRect.top + originRect.height / 2;
        } else {
          y = pos.originY == "top" ? originRect.top : originRect.bottom;
        }
        if (containerRect.top < 0) {
          y -= containerRect.top;
        }
        return { x, y };
      }
      /**
       * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
       * origin point to which the overlay should be connected.
       */
      _getOverlayPoint(originPoint, overlayRect, pos) {
        let overlayStartX;
        if (pos.overlayX == "center") {
          overlayStartX = -overlayRect.width / 2;
        } else if (pos.overlayX === "start") {
          overlayStartX = this._isRtl() ? -overlayRect.width : 0;
        } else {
          overlayStartX = this._isRtl() ? 0 : -overlayRect.width;
        }
        let overlayStartY;
        if (pos.overlayY == "center") {
          overlayStartY = -overlayRect.height / 2;
        } else {
          overlayStartY = pos.overlayY == "top" ? 0 : -overlayRect.height;
        }
        return {
          x: originPoint.x + overlayStartX,
          y: originPoint.y + overlayStartY
        };
      }
      /** Gets how well an overlay at the given point will fit within the viewport. */
      _getOverlayFit(point, rawOverlayRect, viewport, position) {
        const overlay = getRoundedBoundingClientRect(rawOverlayRect);
        let { x, y } = point;
        let offsetX = this._getOffset(position, "x");
        let offsetY = this._getOffset(position, "y");
        if (offsetX) {
          x += offsetX;
        }
        if (offsetY) {
          y += offsetY;
        }
        let leftOverflow = 0 - x;
        let rightOverflow = x + overlay.width - viewport.width;
        let topOverflow = 0 - y;
        let bottomOverflow = y + overlay.height - viewport.height;
        let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
        let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
        let visibleArea = visibleWidth * visibleHeight;
        return {
          visibleArea,
          isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
          fitsInViewportVertically: visibleHeight === overlay.height,
          fitsInViewportHorizontally: visibleWidth == overlay.width
        };
      }
      /**
       * Whether the overlay can fit within the viewport when it may resize either its width or height.
       * @param fit How well the overlay fits in the viewport at some position.
       * @param point The (x, y) coordinates of the overlay at some position.
       * @param viewport The geometry of the viewport.
       */
      _canFitWithFlexibleDimensions(fit, point, viewport) {
        if (this._hasFlexibleDimensions) {
          const availableHeight = viewport.bottom - point.y;
          const availableWidth = viewport.right - point.x;
          const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
          const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);
          const verticalFit = fit.fitsInViewportVertically || minHeight != null && minHeight <= availableHeight;
          const horizontalFit = fit.fitsInViewportHorizontally || minWidth != null && minWidth <= availableWidth;
          return verticalFit && horizontalFit;
        }
        return false;
      }
      /**
       * Gets the point at which the overlay can be "pushed" on-screen. If the overlay is larger than
       * the viewport, the top-left corner will be pushed on-screen (with overflow occurring on the
       * right and bottom).
       *
       * @param start Starting point from which the overlay is pushed.
       * @param rawOverlayRect Dimensions of the overlay.
       * @param scrollPosition Current viewport scroll position.
       * @returns The point at which to position the overlay after pushing. This is effectively a new
       *     originPoint.
       */
      _pushOverlayOnScreen(start, rawOverlayRect, scrollPosition) {
        if (this._previousPushAmount && this._positionLocked) {
          return {
            x: start.x + this._previousPushAmount.x,
            y: start.y + this._previousPushAmount.y
          };
        }
        const overlay = getRoundedBoundingClientRect(rawOverlayRect);
        const viewport = this._viewportRect;
        const overflowRight = Math.max(start.x + overlay.width - viewport.width, 0);
        const overflowBottom = Math.max(start.y + overlay.height - viewport.height, 0);
        const overflowTop = Math.max(viewport.top - scrollPosition.top - start.y, 0);
        const overflowLeft = Math.max(viewport.left - scrollPosition.left - start.x, 0);
        let pushX = 0;
        let pushY = 0;
        if (overlay.width <= viewport.width) {
          pushX = overflowLeft || -overflowRight;
        } else {
          pushX = start.x < this._viewportMargin ? viewport.left - scrollPosition.left - start.x : 0;
        }
        if (overlay.height <= viewport.height) {
          pushY = overflowTop || -overflowBottom;
        } else {
          pushY = start.y < this._viewportMargin ? viewport.top - scrollPosition.top - start.y : 0;
        }
        this._previousPushAmount = { x: pushX, y: pushY };
        return {
          x: start.x + pushX,
          y: start.y + pushY
        };
      }
      /**
       * Applies a computed position to the overlay and emits a position change.
       * @param position The position preference
       * @param originPoint The point on the origin element where the overlay is connected.
       */
      _applyPosition(position, originPoint) {
        this._setTransformOrigin(position);
        this._setOverlayElementStyles(originPoint, position);
        this._setBoundingBoxStyles(originPoint, position);
        if (position.panelClass) {
          this._addPanelClasses(position.panelClass);
        }
        if (this._positionChanges.observers.length) {
          const scrollVisibility = this._getScrollVisibility();
          if (position !== this._lastPosition || !this._lastScrollVisibility || !compareScrollVisibility(this._lastScrollVisibility, scrollVisibility)) {
            const changeEvent = new ConnectedOverlayPositionChange(position, scrollVisibility);
            this._positionChanges.next(changeEvent);
          }
          this._lastScrollVisibility = scrollVisibility;
        }
        this._lastPosition = position;
        this._isInitialRender = false;
      }
      /** Sets the transform origin based on the configured selector and the passed-in position.  */
      _setTransformOrigin(position) {
        if (!this._transformOriginSelector) {
          return;
        }
        const elements = this._boundingBox.querySelectorAll(this._transformOriginSelector);
        let xOrigin;
        let yOrigin = position.overlayY;
        if (position.overlayX === "center") {
          xOrigin = "center";
        } else if (this._isRtl()) {
          xOrigin = position.overlayX === "start" ? "right" : "left";
        } else {
          xOrigin = position.overlayX === "start" ? "left" : "right";
        }
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
        }
      }
      /**
       * Gets the position and size of the overlay's sizing container.
       *
       * This method does no measuring and applies no styles so that we can cheaply compute the
       * bounds for all positions and choose the best fit based on these results.
       */
      _calculateBoundingBoxRect(origin, position) {
        const viewport = this._viewportRect;
        const isRtl = this._isRtl();
        let height, top, bottom;
        if (position.overlayY === "top") {
          top = origin.y;
          height = viewport.height - top + this._viewportMargin;
        } else if (position.overlayY === "bottom") {
          bottom = viewport.height - origin.y + this._viewportMargin * 2;
          height = viewport.height - bottom + this._viewportMargin;
        } else {
          const smallestDistanceToViewportEdge = Math.min(viewport.bottom - origin.y + viewport.top, origin.y);
          const previousHeight = this._lastBoundingBoxSize.height;
          height = smallestDistanceToViewportEdge * 2;
          top = origin.y - smallestDistanceToViewportEdge;
          if (height > previousHeight && !this._isInitialRender && !this._growAfterOpen) {
            top = origin.y - previousHeight / 2;
          }
        }
        const isBoundedByRightViewportEdge = position.overlayX === "start" && !isRtl || position.overlayX === "end" && isRtl;
        const isBoundedByLeftViewportEdge = position.overlayX === "end" && !isRtl || position.overlayX === "start" && isRtl;
        let width, left, right;
        if (isBoundedByLeftViewportEdge) {
          right = viewport.width - origin.x + this._viewportMargin * 2;
          width = origin.x - this._viewportMargin;
        } else if (isBoundedByRightViewportEdge) {
          left = origin.x;
          width = viewport.right - origin.x;
        } else {
          const smallestDistanceToViewportEdge = Math.min(viewport.right - origin.x + viewport.left, origin.x);
          const previousWidth = this._lastBoundingBoxSize.width;
          width = smallestDistanceToViewportEdge * 2;
          left = origin.x - smallestDistanceToViewportEdge;
          if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) {
            left = origin.x - previousWidth / 2;
          }
        }
        return { top, left, bottom, right, width, height };
      }
      /**
       * Sets the position and size of the overlay's sizing wrapper. The wrapper is positioned on the
       * origin's connection point and stretches to the bounds of the viewport.
       *
       * @param origin The point on the origin element where the overlay is connected.
       * @param position The position preference
       */
      _setBoundingBoxStyles(origin, position) {
        const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);
        if (!this._isInitialRender && !this._growAfterOpen) {
          boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
          boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
        }
        const styles = {};
        if (this._hasExactPosition()) {
          styles.top = styles.left = "0";
          styles.bottom = styles.right = styles.maxHeight = styles.maxWidth = "";
          styles.width = styles.height = "100%";
        } else {
          const maxHeight = this._overlayRef.getConfig().maxHeight;
          const maxWidth = this._overlayRef.getConfig().maxWidth;
          styles.height = coerceCssPixelValue(boundingBoxRect.height);
          styles.top = coerceCssPixelValue(boundingBoxRect.top);
          styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom);
          styles.width = coerceCssPixelValue(boundingBoxRect.width);
          styles.left = coerceCssPixelValue(boundingBoxRect.left);
          styles.right = coerceCssPixelValue(boundingBoxRect.right);
          if (position.overlayX === "center") {
            styles.alignItems = "center";
          } else {
            styles.alignItems = position.overlayX === "end" ? "flex-end" : "flex-start";
          }
          if (position.overlayY === "center") {
            styles.justifyContent = "center";
          } else {
            styles.justifyContent = position.overlayY === "bottom" ? "flex-end" : "flex-start";
          }
          if (maxHeight) {
            styles.maxHeight = coerceCssPixelValue(maxHeight);
          }
          if (maxWidth) {
            styles.maxWidth = coerceCssPixelValue(maxWidth);
          }
        }
        this._lastBoundingBoxSize = boundingBoxRect;
        extendStyles(this._boundingBox.style, styles);
      }
      /** Resets the styles for the bounding box so that a new positioning can be computed. */
      _resetBoundingBoxStyles() {
        extendStyles(this._boundingBox.style, {
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          height: "",
          width: "",
          alignItems: "",
          justifyContent: ""
        });
      }
      /** Resets the styles for the overlay pane so that a new positioning can be computed. */
      _resetOverlayElementStyles() {
        extendStyles(this._pane.style, {
          top: "",
          left: "",
          bottom: "",
          right: "",
          position: "",
          transform: ""
        });
      }
      /** Sets positioning styles to the overlay element. */
      _setOverlayElementStyles(originPoint, position) {
        const styles = {};
        const hasExactPosition = this._hasExactPosition();
        const hasFlexibleDimensions = this._hasFlexibleDimensions;
        const config = this._overlayRef.getConfig();
        if (hasExactPosition) {
          const scrollPosition = this._viewportRuler.getViewportScrollPosition();
          extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
          extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
        } else {
          styles.position = "static";
        }
        let transformString = "";
        let offsetX = this._getOffset(position, "x");
        let offsetY = this._getOffset(position, "y");
        if (offsetX) {
          transformString += `translateX(${offsetX}px) `;
        }
        if (offsetY) {
          transformString += `translateY(${offsetY}px)`;
        }
        styles.transform = transformString.trim();
        if (config.maxHeight) {
          if (hasExactPosition) {
            styles.maxHeight = coerceCssPixelValue(config.maxHeight);
          } else if (hasFlexibleDimensions) {
            styles.maxHeight = "";
          }
        }
        if (config.maxWidth) {
          if (hasExactPosition) {
            styles.maxWidth = coerceCssPixelValue(config.maxWidth);
          } else if (hasFlexibleDimensions) {
            styles.maxWidth = "";
          }
        }
        extendStyles(this._pane.style, styles);
      }
      /** Gets the exact top/bottom for the overlay when not using flexible sizing or when pushing. */
      _getExactOverlayY(position, originPoint, scrollPosition) {
        let styles = { top: "", bottom: "" };
        let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
        if (this._isPushed) {
          overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
        }
        if (position.overlayY === "bottom") {
          const documentHeight = this._document.documentElement.clientHeight;
          styles.bottom = `${documentHeight - (overlayPoint.y + this._overlayRect.height)}px`;
        } else {
          styles.top = coerceCssPixelValue(overlayPoint.y);
        }
        return styles;
      }
      /** Gets the exact left/right for the overlay when not using flexible sizing or when pushing. */
      _getExactOverlayX(position, originPoint, scrollPosition) {
        let styles = { left: "", right: "" };
        let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
        if (this._isPushed) {
          overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
        }
        let horizontalStyleProperty;
        if (this._isRtl()) {
          horizontalStyleProperty = position.overlayX === "end" ? "left" : "right";
        } else {
          horizontalStyleProperty = position.overlayX === "end" ? "right" : "left";
        }
        if (horizontalStyleProperty === "right") {
          const documentWidth = this._document.documentElement.clientWidth;
          styles.right = `${documentWidth - (overlayPoint.x + this._overlayRect.width)}px`;
        } else {
          styles.left = coerceCssPixelValue(overlayPoint.x);
        }
        return styles;
      }
      /**
       * Gets the view properties of the trigger and overlay, including whether they are clipped
       * or completely outside the view of any of the strategy's scrollables.
       */
      _getScrollVisibility() {
        const originBounds = this._getOriginRect();
        const overlayBounds = this._pane.getBoundingClientRect();
        const scrollContainerBounds = this._scrollables.map((scrollable) => {
          return scrollable.getElementRef().nativeElement.getBoundingClientRect();
        });
        return {
          isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
          isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
          isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
          isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds)
        };
      }
      /** Subtracts the amount that an element is overflowing on an axis from its length. */
      _subtractOverflows(length, ...overflows) {
        return overflows.reduce((currentValue, currentOverflow) => {
          return currentValue - Math.max(currentOverflow, 0);
        }, length);
      }
      /** Narrows the given viewport rect by the current _viewportMargin. */
      _getNarrowedViewportRect() {
        const width = this._document.documentElement.clientWidth;
        const height = this._document.documentElement.clientHeight;
        const scrollPosition = this._viewportRuler.getViewportScrollPosition();
        return {
          top: scrollPosition.top + this._viewportMargin,
          left: scrollPosition.left + this._viewportMargin,
          right: scrollPosition.left + width - this._viewportMargin,
          bottom: scrollPosition.top + height - this._viewportMargin,
          width: width - 2 * this._viewportMargin,
          height: height - 2 * this._viewportMargin
        };
      }
      /** Whether the we're dealing with an RTL context */
      _isRtl() {
        return this._overlayRef.getDirection() === "rtl";
      }
      /** Determines whether the overlay uses exact or flexible positioning. */
      _hasExactPosition() {
        return !this._hasFlexibleDimensions || this._isPushed;
      }
      /** Retrieves the offset of a position along the x or y axis. */
      _getOffset(position, axis) {
        if (axis === "x") {
          return position.offsetX == null ? this._offsetX : position.offsetX;
        }
        return position.offsetY == null ? this._offsetY : position.offsetY;
      }
      /** Validates that the current position match the expected values. */
      _validatePositions() {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          if (!this._preferredPositions.length) {
            throw Error("FlexibleConnectedPositionStrategy: At least one position is required.");
          }
          this._preferredPositions.forEach((pair) => {
            validateHorizontalPosition("originX", pair.originX);
            validateVerticalPosition("originY", pair.originY);
            validateHorizontalPosition("overlayX", pair.overlayX);
            validateVerticalPosition("overlayY", pair.overlayY);
          });
        }
      }
      /** Adds a single CSS class or an array of classes on the overlay panel. */
      _addPanelClasses(cssClasses) {
        if (this._pane) {
          coerceArray(cssClasses).forEach((cssClass) => {
            if (cssClass !== "" && this._appliedPanelClasses.indexOf(cssClass) === -1) {
              this._appliedPanelClasses.push(cssClass);
              this._pane.classList.add(cssClass);
            }
          });
        }
      }
      /** Clears the classes that the position strategy has applied from the overlay panel. */
      _clearPanelClasses() {
        if (this._pane) {
          this._appliedPanelClasses.forEach((cssClass) => {
            this._pane.classList.remove(cssClass);
          });
          this._appliedPanelClasses = [];
        }
      }
      /** Returns the DOMRect of the current origin. */
      _getOriginRect() {
        const origin = this._origin;
        if (origin instanceof ElementRef) {
          return origin.nativeElement.getBoundingClientRect();
        }
        if (origin instanceof Element) {
          return origin.getBoundingClientRect();
        }
        const width = origin.width || 0;
        const height = origin.height || 0;
        return {
          top: origin.y,
          bottom: origin.y + height,
          left: origin.x,
          right: origin.x + width,
          height,
          width
        };
      }
    };
    wrapperClass = "cdk-global-overlay-wrapper";
    GlobalPositionStrategy = class {
      /** The overlay to which this strategy is attached. */
      _overlayRef;
      _cssPosition = "static";
      _topOffset = "";
      _bottomOffset = "";
      _alignItems = "";
      _xPosition = "";
      _xOffset = "";
      _width = "";
      _height = "";
      _isDisposed = false;
      attach(overlayRef) {
        const config = overlayRef.getConfig();
        this._overlayRef = overlayRef;
        if (this._width && !config.width) {
          overlayRef.updateSize({ width: this._width });
        }
        if (this._height && !config.height) {
          overlayRef.updateSize({ height: this._height });
        }
        overlayRef.hostElement.classList.add(wrapperClass);
        this._isDisposed = false;
      }
      /**
       * Sets the top position of the overlay. Clears any previously set vertical position.
       * @param value New top offset.
       */
      top(value2 = "") {
        this._bottomOffset = "";
        this._topOffset = value2;
        this._alignItems = "flex-start";
        return this;
      }
      /**
       * Sets the left position of the overlay. Clears any previously set horizontal position.
       * @param value New left offset.
       */
      left(value2 = "") {
        this._xOffset = value2;
        this._xPosition = "left";
        return this;
      }
      /**
       * Sets the bottom position of the overlay. Clears any previously set vertical position.
       * @param value New bottom offset.
       */
      bottom(value2 = "") {
        this._topOffset = "";
        this._bottomOffset = value2;
        this._alignItems = "flex-end";
        return this;
      }
      /**
       * Sets the right position of the overlay. Clears any previously set horizontal position.
       * @param value New right offset.
       */
      right(value2 = "") {
        this._xOffset = value2;
        this._xPosition = "right";
        return this;
      }
      /**
       * Sets the overlay to the start of the viewport, depending on the overlay direction.
       * This will be to the left in LTR layouts and to the right in RTL.
       * @param offset Offset from the edge of the screen.
       */
      start(value2 = "") {
        this._xOffset = value2;
        this._xPosition = "start";
        return this;
      }
      /**
       * Sets the overlay to the end of the viewport, depending on the overlay direction.
       * This will be to the right in LTR layouts and to the left in RTL.
       * @param offset Offset from the edge of the screen.
       */
      end(value2 = "") {
        this._xOffset = value2;
        this._xPosition = "end";
        return this;
      }
      /**
       * Sets the overlay width and clears any previously set width.
       * @param value New width for the overlay
       * @deprecated Pass the `width` through the `OverlayConfig`.
       * @breaking-change 8.0.0
       */
      width(value2 = "") {
        if (this._overlayRef) {
          this._overlayRef.updateSize({ width: value2 });
        } else {
          this._width = value2;
        }
        return this;
      }
      /**
       * Sets the overlay height and clears any previously set height.
       * @param value New height for the overlay
       * @deprecated Pass the `height` through the `OverlayConfig`.
       * @breaking-change 8.0.0
       */
      height(value2 = "") {
        if (this._overlayRef) {
          this._overlayRef.updateSize({ height: value2 });
        } else {
          this._height = value2;
        }
        return this;
      }
      /**
       * Centers the overlay horizontally with an optional offset.
       * Clears any previously set horizontal position.
       *
       * @param offset Overlay offset from the horizontal center.
       */
      centerHorizontally(offset = "") {
        this.left(offset);
        this._xPosition = "center";
        return this;
      }
      /**
       * Centers the overlay vertically with an optional offset.
       * Clears any previously set vertical position.
       *
       * @param offset Overlay offset from the vertical center.
       */
      centerVertically(offset = "") {
        this.top(offset);
        this._alignItems = "center";
        return this;
      }
      /**
       * Apply the position to the element.
       * @docs-private
       */
      apply() {
        if (!this._overlayRef || !this._overlayRef.hasAttached()) {
          return;
        }
        const styles = this._overlayRef.overlayElement.style;
        const parentStyles = this._overlayRef.hostElement.style;
        const config = this._overlayRef.getConfig();
        const { width, height, maxWidth, maxHeight } = config;
        const shouldBeFlushHorizontally = (width === "100%" || width === "100vw") && (!maxWidth || maxWidth === "100%" || maxWidth === "100vw");
        const shouldBeFlushVertically = (height === "100%" || height === "100vh") && (!maxHeight || maxHeight === "100%" || maxHeight === "100vh");
        const xPosition = this._xPosition;
        const xOffset = this._xOffset;
        const isRtl = this._overlayRef.getConfig().direction === "rtl";
        let marginLeft = "";
        let marginRight = "";
        let justifyContent = "";
        if (shouldBeFlushHorizontally) {
          justifyContent = "flex-start";
        } else if (xPosition === "center") {
          justifyContent = "center";
          if (isRtl) {
            marginRight = xOffset;
          } else {
            marginLeft = xOffset;
          }
        } else if (isRtl) {
          if (xPosition === "left" || xPosition === "end") {
            justifyContent = "flex-end";
            marginLeft = xOffset;
          } else if (xPosition === "right" || xPosition === "start") {
            justifyContent = "flex-start";
            marginRight = xOffset;
          }
        } else if (xPosition === "left" || xPosition === "start") {
          justifyContent = "flex-start";
          marginLeft = xOffset;
        } else if (xPosition === "right" || xPosition === "end") {
          justifyContent = "flex-end";
          marginRight = xOffset;
        }
        styles.position = this._cssPosition;
        styles.marginLeft = shouldBeFlushHorizontally ? "0" : marginLeft;
        styles.marginTop = shouldBeFlushVertically ? "0" : this._topOffset;
        styles.marginBottom = this._bottomOffset;
        styles.marginRight = shouldBeFlushHorizontally ? "0" : marginRight;
        parentStyles.justifyContent = justifyContent;
        parentStyles.alignItems = shouldBeFlushVertically ? "flex-start" : this._alignItems;
      }
      /**
       * Cleans up the DOM changes from the position strategy.
       * @docs-private
       */
      dispose() {
        if (this._isDisposed || !this._overlayRef) {
          return;
        }
        const styles = this._overlayRef.overlayElement.style;
        const parent = this._overlayRef.hostElement;
        const parentStyles = parent.style;
        parent.classList.remove(wrapperClass);
        parentStyles.justifyContent = parentStyles.alignItems = styles.marginTop = styles.marginBottom = styles.marginLeft = styles.marginRight = styles.position = "";
        this._overlayRef = null;
        this._isDisposed = true;
      }
    };
    OverlayPositionBuilder = class _OverlayPositionBuilder {
      _injector = inject(Injector);
      constructor() {
      }
      /**
       * Creates a global position strategy.
       */
      global() {
        return createGlobalPositionStrategy();
      }
      /**
       * Creates a flexible position strategy.
       * @param origin Origin relative to which to position the overlay.
       */
      flexibleConnectedTo(origin) {
        return createFlexibleConnectedPositionStrategy(this._injector, origin);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayPositionBuilder, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayPositionBuilder, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: OverlayPositionBuilder, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    Overlay = class _Overlay {
      scrollStrategies = inject(ScrollStrategyOptions);
      _positionBuilder = inject(OverlayPositionBuilder);
      _injector = inject(Injector);
      constructor() {
      }
      /**
       * Creates an overlay.
       * @param config Configuration applied to the overlay.
       * @returns Reference to the created overlay.
       */
      create(config) {
        return createOverlayRef(this._injector, config);
      }
      /**
       * Gets a position builder that can be used, via fluent API,
       * to construct and configure a position strategy.
       * @returns An overlay position builder.
       */
      position() {
        return this._positionBuilder;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _Overlay, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _Overlay, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: Overlay, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    defaultPositionList = [
      {
        originX: "start",
        originY: "bottom",
        overlayX: "start",
        overlayY: "top"
      },
      {
        originX: "start",
        originY: "top",
        overlayX: "start",
        overlayY: "bottom"
      },
      {
        originX: "end",
        originY: "top",
        overlayX: "end",
        overlayY: "bottom"
      },
      {
        originX: "end",
        originY: "bottom",
        overlayX: "end",
        overlayY: "top"
      }
    ];
    CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY = new InjectionToken("cdk-connected-overlay-scroll-strategy", {
      providedIn: "root",
      factory: () => {
        const injector = inject(Injector);
        return () => createRepositionScrollStrategy(injector);
      }
    });
    CdkOverlayOrigin = class _CdkOverlayOrigin {
      elementRef = inject(ElementRef);
      constructor() {
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkOverlayOrigin, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkOverlayOrigin, isStandalone: true, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"], ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkOverlayOrigin, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]",
        exportAs: "cdkOverlayOrigin"
      }]
    }], ctorParameters: () => [] });
    CdkConnectedOverlay = class _CdkConnectedOverlay {
      _dir = inject(Directionality, { optional: true });
      _injector = inject(Injector);
      _overlayRef;
      _templatePortal;
      _backdropSubscription = Subscription.EMPTY;
      _attachSubscription = Subscription.EMPTY;
      _detachSubscription = Subscription.EMPTY;
      _positionSubscription = Subscription.EMPTY;
      _offsetX;
      _offsetY;
      _position;
      _scrollStrategyFactory = inject(CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY);
      _disposeOnNavigation = false;
      _ngZone = inject(NgZone);
      /** Origin for the connected overlay. */
      origin;
      /** Registered connected position pairs. */
      positions;
      /**
       * This input overrides the positions input if specified. It lets users pass
       * in arbitrary positioning strategies.
       */
      positionStrategy;
      /** The offset in pixels for the overlay connection point on the x-axis */
      get offsetX() {
        return this._offsetX;
      }
      set offsetX(offsetX) {
        this._offsetX = offsetX;
        if (this._position) {
          this._updatePositionStrategy(this._position);
        }
      }
      /** The offset in pixels for the overlay connection point on the y-axis */
      get offsetY() {
        return this._offsetY;
      }
      set offsetY(offsetY) {
        this._offsetY = offsetY;
        if (this._position) {
          this._updatePositionStrategy(this._position);
        }
      }
      /** The width of the overlay panel. */
      width;
      /** The height of the overlay panel. */
      height;
      /** The min width of the overlay panel. */
      minWidth;
      /** The min height of the overlay panel. */
      minHeight;
      /** The custom class to be set on the backdrop element. */
      backdropClass;
      /** The custom class to add to the overlay pane element. */
      panelClass;
      /** Margin between the overlay and the viewport edges. */
      viewportMargin = 0;
      /** Strategy to be used when handling scroll events while the overlay is open. */
      scrollStrategy;
      /** Whether the overlay is open. */
      open = false;
      /** Whether the overlay can be closed by user interaction. */
      disableClose = false;
      /** CSS selector which to set the transform origin. */
      transformOriginSelector;
      /** Whether or not the overlay should attach a backdrop. */
      hasBackdrop = false;
      /** Whether or not the overlay should be locked when scrolling. */
      lockPosition = false;
      /** Whether the overlay's width and height can be constrained to fit within the viewport. */
      flexibleDimensions = false;
      /** Whether the overlay can grow after the initial open when flexible positioning is turned on. */
      growAfterOpen = false;
      /** Whether the overlay can be pushed on-screen if none of the provided positions fit. */
      push = false;
      /** Whether the overlay should be disposed of when the user goes backwards/forwards in history. */
      get disposeOnNavigation() {
        return this._disposeOnNavigation;
      }
      set disposeOnNavigation(value2) {
        this._disposeOnNavigation = value2;
      }
      /** Event emitted when the backdrop is clicked. */
      backdropClick = new EventEmitter();
      /** Event emitted when the position has changed. */
      positionChange = new EventEmitter();
      /** Event emitted when the overlay has been attached. */
      attach = new EventEmitter();
      /** Event emitted when the overlay has been detached. */
      detach = new EventEmitter();
      /** Emits when there are keyboard events that are targeted at the overlay. */
      overlayKeydown = new EventEmitter();
      /** Emits when there are mouse outside click events that are targeted at the overlay. */
      overlayOutsideClick = new EventEmitter();
      // TODO(jelbourn): inputs for size, scroll behavior, animation, etc.
      constructor() {
        const templateRef = inject(TemplateRef);
        const viewContainerRef = inject(ViewContainerRef);
        this._templatePortal = new TemplatePortal(templateRef, viewContainerRef);
        this.scrollStrategy = this._scrollStrategyFactory();
      }
      /** The associated overlay reference. */
      get overlayRef() {
        return this._overlayRef;
      }
      /** The element's layout direction. */
      get dir() {
        return this._dir ? this._dir.value : "ltr";
      }
      ngOnDestroy() {
        this._attachSubscription.unsubscribe();
        this._detachSubscription.unsubscribe();
        this._backdropSubscription.unsubscribe();
        this._positionSubscription.unsubscribe();
        this._overlayRef?.dispose();
      }
      ngOnChanges(changes) {
        if (this._position) {
          this._updatePositionStrategy(this._position);
          this._overlayRef?.updateSize({
            width: this.width,
            minWidth: this.minWidth,
            height: this.height,
            minHeight: this.minHeight
          });
          if (changes["origin"] && this.open) {
            this._position.apply();
          }
        }
        if (changes["open"]) {
          this.open ? this.attachOverlay() : this.detachOverlay();
        }
      }
      /** Creates an overlay */
      _createOverlay() {
        if (!this.positions || !this.positions.length) {
          this.positions = defaultPositionList;
        }
        const overlayRef = this._overlayRef = createOverlayRef(this._injector, this._buildConfig());
        this._attachSubscription = overlayRef.attachments().subscribe(() => this.attach.emit());
        this._detachSubscription = overlayRef.detachments().subscribe(() => this.detach.emit());
        overlayRef.keydownEvents().subscribe((event) => {
          this.overlayKeydown.next(event);
          if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
            event.preventDefault();
            this.detachOverlay();
          }
        });
        this._overlayRef.outsidePointerEvents().subscribe((event) => {
          const origin = this._getOriginElement();
          const target = _getEventTarget(event);
          if (!origin || origin !== target && !origin.contains(target)) {
            this.overlayOutsideClick.next(event);
          }
        });
      }
      /** Builds the overlay config based on the directive's inputs */
      _buildConfig() {
        const positionStrategy = this._position = this.positionStrategy || this._createPositionStrategy();
        const overlayConfig = new OverlayConfig({
          direction: this._dir || "ltr",
          positionStrategy,
          scrollStrategy: this.scrollStrategy,
          hasBackdrop: this.hasBackdrop,
          disposeOnNavigation: this.disposeOnNavigation
        });
        if (this.width || this.width === 0) {
          overlayConfig.width = this.width;
        }
        if (this.height || this.height === 0) {
          overlayConfig.height = this.height;
        }
        if (this.minWidth || this.minWidth === 0) {
          overlayConfig.minWidth = this.minWidth;
        }
        if (this.minHeight || this.minHeight === 0) {
          overlayConfig.minHeight = this.minHeight;
        }
        if (this.backdropClass) {
          overlayConfig.backdropClass = this.backdropClass;
        }
        if (this.panelClass) {
          overlayConfig.panelClass = this.panelClass;
        }
        return overlayConfig;
      }
      /** Updates the state of a position strategy, based on the values of the directive inputs. */
      _updatePositionStrategy(positionStrategy) {
        const positions = this.positions.map((currentPosition) => ({
          originX: currentPosition.originX,
          originY: currentPosition.originY,
          overlayX: currentPosition.overlayX,
          overlayY: currentPosition.overlayY,
          offsetX: currentPosition.offsetX || this.offsetX,
          offsetY: currentPosition.offsetY || this.offsetY,
          panelClass: currentPosition.panelClass || void 0
        }));
        return positionStrategy.setOrigin(this._getOrigin()).withPositions(positions).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector);
      }
      /** Returns the position strategy of the overlay to be set on the overlay config */
      _createPositionStrategy() {
        const strategy = createFlexibleConnectedPositionStrategy(this._injector, this._getOrigin());
        this._updatePositionStrategy(strategy);
        return strategy;
      }
      _getOrigin() {
        if (this.origin instanceof CdkOverlayOrigin) {
          return this.origin.elementRef;
        } else {
          return this.origin;
        }
      }
      _getOriginElement() {
        if (this.origin instanceof CdkOverlayOrigin) {
          return this.origin.elementRef.nativeElement;
        }
        if (this.origin instanceof ElementRef) {
          return this.origin.nativeElement;
        }
        if (typeof Element !== "undefined" && this.origin instanceof Element) {
          return this.origin;
        }
        return null;
      }
      /** Attaches the overlay. */
      attachOverlay() {
        if (!this._overlayRef) {
          this._createOverlay();
        } else {
          this._overlayRef.getConfig().hasBackdrop = this.hasBackdrop;
        }
        if (!this._overlayRef.hasAttached()) {
          this._overlayRef.attach(this._templatePortal);
        }
        if (this.hasBackdrop) {
          this._backdropSubscription = this._overlayRef.backdropClick().subscribe((event) => {
            this.backdropClick.emit(event);
          });
        } else {
          this._backdropSubscription.unsubscribe();
        }
        this._positionSubscription.unsubscribe();
        if (this.positionChange.observers.length > 0) {
          this._positionSubscription = this._position.positionChanges.pipe(takeWhile(() => this.positionChange.observers.length > 0)).subscribe((position) => {
            this._ngZone.run(() => this.positionChange.emit(position));
            if (this.positionChange.observers.length === 0) {
              this._positionSubscription.unsubscribe();
            }
          });
        }
        this.open = true;
      }
      /** Detaches the overlay. */
      detachOverlay() {
        this._overlayRef?.detach();
        this._backdropSubscription.unsubscribe();
        this._positionSubscription.unsubscribe();
        this.open = false;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkConnectedOverlay, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: _CdkConnectedOverlay, isStandalone: true, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: { origin: ["cdkConnectedOverlayOrigin", "origin"], positions: ["cdkConnectedOverlayPositions", "positions"], positionStrategy: ["cdkConnectedOverlayPositionStrategy", "positionStrategy"], offsetX: ["cdkConnectedOverlayOffsetX", "offsetX"], offsetY: ["cdkConnectedOverlayOffsetY", "offsetY"], width: ["cdkConnectedOverlayWidth", "width"], height: ["cdkConnectedOverlayHeight", "height"], minWidth: ["cdkConnectedOverlayMinWidth", "minWidth"], minHeight: ["cdkConnectedOverlayMinHeight", "minHeight"], backdropClass: ["cdkConnectedOverlayBackdropClass", "backdropClass"], panelClass: ["cdkConnectedOverlayPanelClass", "panelClass"], viewportMargin: ["cdkConnectedOverlayViewportMargin", "viewportMargin"], scrollStrategy: ["cdkConnectedOverlayScrollStrategy", "scrollStrategy"], open: ["cdkConnectedOverlayOpen", "open"], disableClose: ["cdkConnectedOverlayDisableClose", "disableClose"], transformOriginSelector: ["cdkConnectedOverlayTransformOriginOn", "transformOriginSelector"], hasBackdrop: ["cdkConnectedOverlayHasBackdrop", "hasBackdrop", booleanAttribute], lockPosition: ["cdkConnectedOverlayLockPosition", "lockPosition", booleanAttribute], flexibleDimensions: ["cdkConnectedOverlayFlexibleDimensions", "flexibleDimensions", booleanAttribute], growAfterOpen: ["cdkConnectedOverlayGrowAfterOpen", "growAfterOpen", booleanAttribute], push: ["cdkConnectedOverlayPush", "push", booleanAttribute], disposeOnNavigation: ["cdkConnectedOverlayDisposeOnNavigation", "disposeOnNavigation", booleanAttribute] }, outputs: { backdropClick: "backdropClick", positionChange: "positionChange", attach: "attach", detach: "detach", overlayKeydown: "overlayKeydown", overlayOutsideClick: "overlayOutsideClick" }, exportAs: ["cdkConnectedOverlay"], usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkConnectedOverlay, decorators: [{
      type: Directive,
      args: [{
        selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]",
        exportAs: "cdkConnectedOverlay"
      }]
    }], ctorParameters: () => [], propDecorators: { origin: [{
      type: Input,
      args: ["cdkConnectedOverlayOrigin"]
    }], positions: [{
      type: Input,
      args: ["cdkConnectedOverlayPositions"]
    }], positionStrategy: [{
      type: Input,
      args: ["cdkConnectedOverlayPositionStrategy"]
    }], offsetX: [{
      type: Input,
      args: ["cdkConnectedOverlayOffsetX"]
    }], offsetY: [{
      type: Input,
      args: ["cdkConnectedOverlayOffsetY"]
    }], width: [{
      type: Input,
      args: ["cdkConnectedOverlayWidth"]
    }], height: [{
      type: Input,
      args: ["cdkConnectedOverlayHeight"]
    }], minWidth: [{
      type: Input,
      args: ["cdkConnectedOverlayMinWidth"]
    }], minHeight: [{
      type: Input,
      args: ["cdkConnectedOverlayMinHeight"]
    }], backdropClass: [{
      type: Input,
      args: ["cdkConnectedOverlayBackdropClass"]
    }], panelClass: [{
      type: Input,
      args: ["cdkConnectedOverlayPanelClass"]
    }], viewportMargin: [{
      type: Input,
      args: ["cdkConnectedOverlayViewportMargin"]
    }], scrollStrategy: [{
      type: Input,
      args: ["cdkConnectedOverlayScrollStrategy"]
    }], open: [{
      type: Input,
      args: ["cdkConnectedOverlayOpen"]
    }], disableClose: [{
      type: Input,
      args: ["cdkConnectedOverlayDisableClose"]
    }], transformOriginSelector: [{
      type: Input,
      args: ["cdkConnectedOverlayTransformOriginOn"]
    }], hasBackdrop: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayHasBackdrop", transform: booleanAttribute }]
    }], lockPosition: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayLockPosition", transform: booleanAttribute }]
    }], flexibleDimensions: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayFlexibleDimensions", transform: booleanAttribute }]
    }], growAfterOpen: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayGrowAfterOpen", transform: booleanAttribute }]
    }], push: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayPush", transform: booleanAttribute }]
    }], disposeOnNavigation: [{
      type: Input,
      args: [{ alias: "cdkConnectedOverlayDisposeOnNavigation", transform: booleanAttribute }]
    }], backdropClick: [{
      type: Output
    }], positionChange: [{
      type: Output
    }], attach: [{
      type: Output
    }], detach: [{
      type: Output
    }], overlayKeydown: [{
      type: Output
    }], overlayOutsideClick: [{
      type: Output
    }] } });
    CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER = {
      provide: CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY,
      useFactory: CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY
    };
    OverlayModule = class _OverlayModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayModule, imports: [BidiModule, PortalModule, ScrollingModule, CdkConnectedOverlay, CdkOverlayOrigin], exports: [CdkConnectedOverlay, CdkOverlayOrigin, ScrollingModule] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _OverlayModule, providers: [Overlay, CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER], imports: [BidiModule, PortalModule, ScrollingModule, ScrollingModule] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: OverlayModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [BidiModule, PortalModule, ScrollingModule, CdkConnectedOverlay, CdkOverlayOrigin],
        exports: [CdkConnectedOverlay, CdkOverlayOrigin, ScrollingModule],
        providers: [Overlay, CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER]
      }]
    }] });
  }
});

// node_modules/@angular/cdk/fesm2022/overlay.mjs
var FullscreenOverlayContainer;
var init_overlay = __esm({
  "node_modules/@angular/cdk/fesm2022/overlay.mjs"() {
    "use strict";
    init_overlay_module();
    init_overlay_module();
    init_core();
    init_core();
    FullscreenOverlayContainer = class _FullscreenOverlayContainer extends OverlayContainer {
      _renderer = inject(RendererFactory2).createRenderer(null, null);
      _fullScreenEventName;
      _cleanupFullScreenListener;
      constructor() {
        super();
      }
      ngOnDestroy() {
        super.ngOnDestroy();
        this._cleanupFullScreenListener?.();
      }
      _createContainer() {
        const eventName = this._getEventName();
        super._createContainer();
        this._adjustParentForFullscreenChange();
        if (eventName) {
          this._cleanupFullScreenListener?.();
          this._cleanupFullScreenListener = this._renderer.listen("document", eventName, () => {
            this._adjustParentForFullscreenChange();
          });
        }
      }
      _adjustParentForFullscreenChange() {
        if (this._containerElement) {
          const fullscreenElement = this.getFullscreenElement();
          const parent = fullscreenElement || this._document.body;
          parent.appendChild(this._containerElement);
        }
      }
      _getEventName() {
        if (!this._fullScreenEventName) {
          const _document = this._document;
          if (_document.fullscreenEnabled) {
            this._fullScreenEventName = "fullscreenchange";
          } else if (_document.webkitFullscreenEnabled) {
            this._fullScreenEventName = "webkitfullscreenchange";
          } else if (_document.mozFullScreenEnabled) {
            this._fullScreenEventName = "mozfullscreenchange";
          } else if (_document.msFullscreenEnabled) {
            this._fullScreenEventName = "MSFullscreenChange";
          }
        }
        return this._fullScreenEventName;
      }
      /**
       * When the page is put into fullscreen mode, a specific element is specified.
       * Only that element and its children are visible when in fullscreen mode.
       */
      getFullscreenElement() {
        const _document = this._document;
        return _document.fullscreenElement || _document.webkitFullscreenElement || _document.mozFullScreenElement || _document.msFullscreenElement || null;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _FullscreenOverlayContainer, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _FullscreenOverlayContainer, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: FullscreenOverlayContainer, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
  }
});

// src/app/services/brand-config.service.ts
var BrandConfigService;
var init_brand_config_service = __esm({
  "src/app/services/brand-config.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    BrandConfigService = class BrandConfigService2 {
      config = {
        brand: {
          name: "Beax RM",
          logo: "/config/assets/beax-rm/logo.png",
          logoDark: "/config/assets/beax-rm/logo-dark.png",
          icon: "/config/assets/beax-rm/icon.png"
        },
        colors: {
          primary: "#3B82F6",
          accent: "#F59E0B",
          secondary: "#6B7280"
        },
        app: {
          name: "Beax Resource Manager",
          version: "1.0.0",
          description: "Resource Management System",
          port: 4200,
          apiUrl: "http://localhost:3000/api"
        }
      };
      constructor() {
        this.loadConfigFromEnvironment();
      }
      loadConfigFromEnvironment() {
        if (typeof window !== "undefined" && window.brandConfig) {
          this.config = window.brandConfig;
        }
      }
      getBrandConfig() {
        return this.config;
      }
      getConfig() {
        return this.config;
      }
      getBrandName() {
        return this.config.brand.name;
      }
      getAppName() {
        return this.config.app.name;
      }
      getLogo() {
        return this.config.brand.logo;
      }
      getLogoDark() {
        return this.config.brand.logoDark;
      }
      getThemeAwareLogo(isDark) {
        return isDark ? this.config.brand.logoDark : this.config.brand.logo;
      }
      getIcon() {
        return this.config.brand.icon;
      }
      getColors() {
        return this.config.colors;
      }
      getApiUrl() {
        return this.config.app.apiUrl;
      }
      getPrimaryColor() {
        return this.config.colors.primary;
      }
      getAllowedModules() {
        return this.config.modules?.allowed || [];
      }
      isModuleAllowed(moduleId) {
        const allowedModules = this.getAllowedModules();
        return allowedModules.length === 0 || allowedModules.includes(moduleId);
      }
      getBrandKey() {
        const apiUrl = this.config.app.apiUrl;
        if (apiUrl.includes("racconti") || apiUrl.includes(":3002"))
          return "raccontixrm";
        if (apiUrl.includes(":3001"))
          return "true-process";
        return "beax-rm";
      }
      static ctorParameters = () => [];
    };
    BrandConfigService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], BrandConfigService);
  }
});

// node_modules/@angular/cdk/fesm2022/dialog.mjs
function throwDialogContentAlreadyAttachedError() {
  throw Error("Attempting to attach dialog content after content is already attached");
}
function getDirectionality(value2) {
  const valueSignal = signal(value2, ...ngDevMode ? [{ debugName: "valueSignal" }] : []);
  const change = new EventEmitter();
  return {
    valueSignal,
    get value() {
      return valueSignal();
    },
    change,
    ngOnDestroy() {
      change.complete();
    }
  };
}
function reverseForEach(items, callback) {
  let i = items.length;
  while (i--) {
    callback(items[i]);
  }
}
var DialogConfig, CdkDialogContainer, DialogRef, DIALOG_SCROLL_STRATEGY, DIALOG_DATA, DEFAULT_DIALOG_CONFIG, Dialog, DialogModule;
var init_dialog = __esm({
  "node_modules/@angular/cdk/fesm2022/dialog.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_esm();
    init_portal();
    init_a11y_module();
    init_focus_monitor();
    init_platform2();
    init_shadow_dom();
    init_keycodes2();
    init_keycodes();
    init_operators();
    init_overlay_module();
    init_id_generator();
    init_directionality();
    DialogConfig = class {
      /**
       * Where the attached component should live in Angular's *logical* component tree.
       * This affects what is available for injection and the change detection order for the
       * component instantiated inside of the dialog. This does not affect where the dialog
       * content will be rendered.
       */
      viewContainerRef;
      /**
       * Injector used for the instantiation of the component to be attached. If provided,
       * takes precedence over the injector indirectly provided by `ViewContainerRef`.
       */
      injector;
      /** ID for the dialog. If omitted, a unique one will be generated. */
      id;
      /** The ARIA role of the dialog element. */
      role = "dialog";
      /** Optional CSS class or classes applied to the overlay panel. */
      panelClass = "";
      /** Whether the dialog has a backdrop. */
      hasBackdrop = true;
      /** Optional CSS class or classes applied to the overlay backdrop. */
      backdropClass = "";
      /** Whether the dialog closes with the escape key or pointer events outside the panel element. */
      disableClose = false;
      /** Function used to determine whether the dialog is allowed to close. */
      closePredicate;
      /** Width of the dialog. */
      width = "";
      /** Height of the dialog. */
      height = "";
      /** Min-width of the dialog. If a number is provided, assumes pixel units. */
      minWidth;
      /** Min-height of the dialog. If a number is provided, assumes pixel units. */
      minHeight;
      /** Max-width of the dialog. If a number is provided, assumes pixel units. */
      maxWidth;
      /** Max-height of the dialog. If a number is provided, assumes pixel units. */
      maxHeight;
      /** Strategy to use when positioning the dialog. Defaults to centering it on the page. */
      positionStrategy;
      /** Data being injected into the child component. */
      data = null;
      /** Layout direction for the dialog's content. */
      direction;
      /** ID of the element that describes the dialog. */
      ariaDescribedBy = null;
      /** ID of the element that labels the dialog. */
      ariaLabelledBy = null;
      /** Dialog label applied via `aria-label` */
      ariaLabel = null;
      /**
       * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
       * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
       * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
       */
      ariaModal = false;
      /**
       * Where the dialog should focus on open.
       * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
       * AutoFocusTarget instead.
       */
      autoFocus = "first-tabbable";
      /**
       * Whether the dialog should restore focus to the previously-focused element upon closing.
       * Has the following behavior based on the type that is passed in:
       * - `boolean` - when true, will return focus to the element that was focused before the dialog
       *    was opened, otherwise won't restore focus at all.
       * - `string` - focus will be restored to the first element that matches the CSS selector.
       * - `HTMLElement` - focus will be restored to the specific element.
       */
      restoreFocus = true;
      /**
       * Scroll strategy to be used for the dialog. This determines how
       * the dialog responds to scrolling underneath the panel element.
       */
      scrollStrategy;
      /**
       * Whether the dialog should close when the user navigates backwards or forwards through browser
       * history. This does not apply to navigation via anchor element unless using URL-hash based
       * routing (`HashLocationStrategy` in the Angular router).
       */
      closeOnNavigation = true;
      /**
       * Whether the dialog should close when the dialog service is destroyed. This is useful if
       * another service is wrapping the dialog and is managing the destruction instead.
       */
      closeOnDestroy = true;
      /**
       * Whether the dialog should close when the underlying overlay is detached. This is useful if
       * another service is wrapping the dialog and is managing the destruction instead. E.g. an
       * external detachment can happen as a result of a scroll strategy triggering it or when the
       * browser location changes.
       */
      closeOnOverlayDetachments = true;
      /**
       * Whether the built-in overlay animations should be disabled.
       */
      disableAnimations = false;
      /**
       * Providers that will be exposed to the contents of the dialog. Can also
       * be provided as a function in order to generate the providers lazily.
       */
      providers;
      /**
       * Component into which the dialog content will be rendered. Defaults to `CdkDialogContainer`.
       * A configuration object can be passed in to customize the providers that will be exposed
       * to the dialog container.
       */
      container;
      /**
       * Context that will be passed to template-based dialogs.
       * A function can be passed in to resolve the context lazily.
       */
      templateContext;
    };
    CdkDialogContainer = class _CdkDialogContainer extends BasePortalOutlet {
      _elementRef = inject(ElementRef);
      _focusTrapFactory = inject(FocusTrapFactory);
      _config;
      _interactivityChecker = inject(InteractivityChecker);
      _ngZone = inject(NgZone);
      _focusMonitor = inject(FocusMonitor);
      _renderer = inject(Renderer2);
      _changeDetectorRef = inject(ChangeDetectorRef);
      _injector = inject(Injector);
      _platform = inject(Platform);
      _document = inject(DOCUMENT);
      /** The portal outlet inside of this container into which the dialog content will be loaded. */
      _portalOutlet;
      _focusTrapped = new Subject();
      /** The class that traps and manages focus within the dialog. */
      _focusTrap = null;
      /** Element that was focused before the dialog was opened. Save this to restore upon close. */
      _elementFocusedBeforeDialogWasOpened = null;
      /**
       * Type of interaction that led to the dialog being closed. This is used to determine
       * whether the focus style will be applied when returning focus to its original location
       * after the dialog is closed.
       */
      _closeInteractionType = null;
      /**
       * Queue of the IDs of the dialog's label element, based on their definition order. The first
       * ID will be used as the `aria-labelledby` value. We use a queue here to handle the case
       * where there are two or more titles in the DOM at a time and the first one is destroyed while
       * the rest are present.
       */
      _ariaLabelledByQueue = [];
      _isDestroyed = false;
      constructor() {
        super();
        this._config = inject(DialogConfig, { optional: true }) || new DialogConfig();
        if (this._config.ariaLabelledBy) {
          this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
        }
      }
      _addAriaLabelledBy(id) {
        this._ariaLabelledByQueue.push(id);
        this._changeDetectorRef.markForCheck();
      }
      _removeAriaLabelledBy(id) {
        const index = this._ariaLabelledByQueue.indexOf(id);
        if (index > -1) {
          this._ariaLabelledByQueue.splice(index, 1);
          this._changeDetectorRef.markForCheck();
        }
      }
      _contentAttached() {
        this._initializeFocusTrap();
        this._captureInitialFocus();
      }
      /**
       * Can be used by child classes to customize the initial focus
       * capturing behavior (e.g. if it's tied to an animation).
       */
      _captureInitialFocus() {
        this._trapFocus();
      }
      ngOnDestroy() {
        this._focusTrapped.complete();
        this._isDestroyed = true;
        this._restoreFocus();
      }
      /**
       * Attach a ComponentPortal as content to this dialog container.
       * @param portal Portal to be attached as the dialog content.
       */
      attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachComponentPortal(portal);
        this._contentAttached();
        return result;
      }
      /**
       * Attach a TemplatePortal as content to this dialog container.
       * @param portal Portal to be attached as the dialog content.
       */
      attachTemplatePortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachTemplatePortal(portal);
        this._contentAttached();
        return result;
      }
      /**
       * Attaches a DOM portal to the dialog container.
       * @param portal Portal to be attached.
       * @deprecated To be turned into a method.
       * @breaking-change 10.0.0
       */
      attachDomPortal = (portal) => {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachDomPortal(portal);
        this._contentAttached();
        return result;
      };
      // TODO(crisbeto): this shouldn't be exposed, but there are internal references to it.
      /** Captures focus if it isn't already inside the dialog. */
      _recaptureFocus() {
        if (!this._containsFocus()) {
          this._trapFocus();
        }
      }
      /**
       * Focuses the provided element. If the element is not focusable, it will add a tabIndex
       * attribute to forcefully focus it. The attribute is removed after focus is moved.
       * @param element The element to focus.
       */
      _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
          element.tabIndex = -1;
          this._ngZone.runOutsideAngular(() => {
            const callback = () => {
              deregisterBlur();
              deregisterMousedown();
              element.removeAttribute("tabindex");
            };
            const deregisterBlur = this._renderer.listen(element, "blur", callback);
            const deregisterMousedown = this._renderer.listen(element, "mousedown", callback);
          });
        }
        element.focus(options);
      }
      /**
       * Focuses the first element that matches the given selector within the focus trap.
       * @param selector The CSS selector for the element to set focus to.
       */
      _focusByCssSelector(selector, options) {
        let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
          this._forceFocus(elementToFocus, options);
        }
      }
      /**
       * Moves the focus inside the focus trap. When autoFocus is not set to 'dialog', if focus
       * cannot be moved then focus will go to the dialog container.
       */
      _trapFocus(options) {
        if (this._isDestroyed) {
          return;
        }
        afterNextRender(() => {
          const element = this._elementRef.nativeElement;
          switch (this._config.autoFocus) {
            case false:
            case "dialog":
              if (!this._containsFocus()) {
                element.focus(options);
              }
              break;
            case true:
            case "first-tabbable":
              const focusedSuccessfully = this._focusTrap?.focusInitialElement(options);
              if (!focusedSuccessfully) {
                this._focusDialogContainer(options);
              }
              break;
            case "first-heading":
              this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]', options);
              break;
            default:
              this._focusByCssSelector(this._config.autoFocus, options);
              break;
          }
          this._focusTrapped.next();
        }, { injector: this._injector });
      }
      /** Restores focus to the element that was focused before the dialog opened. */
      _restoreFocus() {
        const focusConfig = this._config.restoreFocus;
        let focusTargetElement = null;
        if (typeof focusConfig === "string") {
          focusTargetElement = this._document.querySelector(focusConfig);
        } else if (typeof focusConfig === "boolean") {
          focusTargetElement = focusConfig ? this._elementFocusedBeforeDialogWasOpened : null;
        } else if (focusConfig) {
          focusTargetElement = focusConfig;
        }
        if (this._config.restoreFocus && focusTargetElement && typeof focusTargetElement.focus === "function") {
          const activeElement = _getFocusedElementPierceShadowDom();
          const element = this._elementRef.nativeElement;
          if (!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) {
            if (this._focusMonitor) {
              this._focusMonitor.focusVia(focusTargetElement, this._closeInteractionType);
              this._closeInteractionType = null;
            } else {
              focusTargetElement.focus();
            }
          }
        }
        if (this._focusTrap) {
          this._focusTrap.destroy();
        }
      }
      /** Focuses the dialog container. */
      _focusDialogContainer(options) {
        this._elementRef.nativeElement.focus?.(options);
      }
      /** Returns whether focus is inside the dialog. */
      _containsFocus() {
        const element = this._elementRef.nativeElement;
        const activeElement = _getFocusedElementPierceShadowDom();
        return element === activeElement || element.contains(activeElement);
      }
      /** Sets up the focus trap. */
      _initializeFocusTrap() {
        if (this._platform.isBrowser) {
          this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
          if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
          }
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _CdkDialogContainer, deps: [], target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _CdkDialogContainer, isStandalone: true, selector: "cdk-dialog-container", host: { attributes: { "tabindex": "-1" }, properties: { "attr.id": "_config.id || null", "attr.role": "_config.role", "attr.aria-modal": "_config.ariaModal", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null" }, classAttribute: "cdk-dialog-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: core_exports, template: "<ng-template cdkPortalOutlet />\n", styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: CdkDialogContainer, decorators: [{
      type: Component,
      args: [{ selector: "cdk-dialog-container", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, imports: [CdkPortalOutlet], host: {
        "class": "cdk-dialog-container",
        "tabindex": "-1",
        "[attr.id]": "_config.id || null",
        "[attr.role]": "_config.role",
        "[attr.aria-modal]": "_config.ariaModal",
        "[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
        "[attr.aria-label]": "_config.ariaLabel",
        "[attr.aria-describedby]": "_config.ariaDescribedBy || null"
      }, template: "<ng-template cdkPortalOutlet />\n", styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"] }]
    }], ctorParameters: () => [], propDecorators: { _portalOutlet: [{
      type: ViewChild,
      args: [CdkPortalOutlet, { static: true }]
    }] } });
    DialogRef = class {
      overlayRef;
      config;
      /**
       * Instance of component opened into the dialog. Will be
       * null when the dialog is opened using a `TemplateRef`.
       */
      componentInstance;
      /**
       * `ComponentRef` of the component opened into the dialog. Will be
       * null when the dialog is opened using a `TemplateRef`.
       */
      componentRef;
      /** Instance of the container that is rendering out the dialog content. */
      containerInstance;
      /** Whether the user is allowed to close the dialog. */
      disableClose;
      /** Emits when the dialog has been closed. */
      closed = new Subject();
      /** Emits when the backdrop of the dialog is clicked. */
      backdropClick;
      /** Emits when on keyboard events within the dialog. */
      keydownEvents;
      /** Emits on pointer events that happen outside of the dialog. */
      outsidePointerEvents;
      /** Unique ID for the dialog. */
      id;
      /** Subscription to external detachments of the dialog. */
      _detachSubscription;
      constructor(overlayRef, config) {
        this.overlayRef = overlayRef;
        this.config = config;
        this.disableClose = config.disableClose;
        this.backdropClick = overlayRef.backdropClick();
        this.keydownEvents = overlayRef.keydownEvents();
        this.outsidePointerEvents = overlayRef.outsidePointerEvents();
        this.id = config.id;
        this.keydownEvents.subscribe((event) => {
          if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
            event.preventDefault();
            this.close(void 0, { focusOrigin: "keyboard" });
          }
        });
        this.backdropClick.subscribe(() => {
          if (!this.disableClose && this._canClose()) {
            this.close(void 0, { focusOrigin: "mouse" });
          } else {
            this.containerInstance._recaptureFocus?.();
          }
        });
        this._detachSubscription = overlayRef.detachments().subscribe(() => {
          if (config.closeOnOverlayDetachments !== false) {
            this.close();
          }
        });
      }
      /**
       * Close the dialog.
       * @param result Optional result to return to the dialog opener.
       * @param options Additional options to customize the closing behavior.
       */
      close(result, options) {
        if (this._canClose(result)) {
          const closedSubject = this.closed;
          this.containerInstance._closeInteractionType = options?.focusOrigin || "program";
          this._detachSubscription.unsubscribe();
          this.overlayRef.dispose();
          closedSubject.next(result);
          closedSubject.complete();
          this.componentInstance = this.containerInstance = null;
        }
      }
      /** Updates the position of the dialog based on the current position strategy. */
      updatePosition() {
        this.overlayRef.updatePosition();
        return this;
      }
      /**
       * Updates the dialog's width and height.
       * @param width New width of the dialog.
       * @param height New height of the dialog.
       */
      updateSize(width = "", height = "") {
        this.overlayRef.updateSize({ width, height });
        return this;
      }
      /** Add a CSS class or an array of classes to the overlay pane. */
      addPanelClass(classes) {
        this.overlayRef.addPanelClass(classes);
        return this;
      }
      /** Remove a CSS class or an array of classes from the overlay pane. */
      removePanelClass(classes) {
        this.overlayRef.removePanelClass(classes);
        return this;
      }
      /** Whether the dialog is allowed to close. */
      _canClose(result) {
        const config = this.config;
        return !!this.containerInstance && (!config.closePredicate || config.closePredicate(result, config, this.componentInstance));
      }
    };
    DIALOG_SCROLL_STRATEGY = new InjectionToken("DialogScrollStrategy", {
      providedIn: "root",
      factory: () => {
        const injector = inject(Injector);
        return () => createBlockScrollStrategy(injector);
      }
    });
    DIALOG_DATA = new InjectionToken("DialogData");
    DEFAULT_DIALOG_CONFIG = new InjectionToken("DefaultDialogConfig");
    Dialog = class _Dialog {
      _injector = inject(Injector);
      _defaultOptions = inject(DEFAULT_DIALOG_CONFIG, { optional: true });
      _parentDialog = inject(_Dialog, { optional: true, skipSelf: true });
      _overlayContainer = inject(OverlayContainer);
      _idGenerator = inject(_IdGenerator);
      _openDialogsAtThisLevel = [];
      _afterAllClosedAtThisLevel = new Subject();
      _afterOpenedAtThisLevel = new Subject();
      _ariaHiddenElements = /* @__PURE__ */ new Map();
      _scrollStrategy = inject(DIALOG_SCROLL_STRATEGY);
      /** Keeps track of the currently-open dialogs. */
      get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
      }
      /** Stream that emits when a dialog has been opened. */
      get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
      }
      /**
       * Stream that emits when all open dialog have finished closing.
       * Will emit on subscribe if there are no open dialogs to begin with.
       */
      afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
      constructor() {
      }
      open(componentOrTemplateRef, config) {
        const defaults2 = this._defaultOptions || new DialogConfig();
        config = __spreadValues(__spreadValues({}, defaults2), config);
        config.id = config.id || this._idGenerator.getId("cdk-dialog-");
        if (config.id && this.getDialogById(config.id) && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const overlayConfig = this._getOverlayConfig(config);
        const overlayRef = createOverlayRef(this._injector, overlayConfig);
        const dialogRef = new DialogRef(overlayRef, config);
        const dialogContainer = this._attachContainer(overlayRef, dialogRef, config);
        dialogRef.containerInstance = dialogContainer;
        if (!this.openDialogs.length) {
          const overlayContainer = this._overlayContainer.getContainerElement();
          if (dialogContainer._focusTrapped) {
            dialogContainer._focusTrapped.pipe(take(1)).subscribe(() => {
              this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
            });
          } else {
            this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
          }
        }
        this._attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config);
        this.openDialogs.push(dialogRef);
        dialogRef.closed.subscribe(() => this._removeOpenDialog(dialogRef, true));
        this.afterOpened.next(dialogRef);
        return dialogRef;
      }
      /**
       * Closes all of the currently-open dialogs.
       */
      closeAll() {
        reverseForEach(this.openDialogs, (dialog) => dialog.close());
      }
      /**
       * Finds an open dialog by its id.
       * @param id ID to use when looking up the dialog.
       */
      getDialogById(id) {
        return this.openDialogs.find((dialog) => dialog.id === id);
      }
      ngOnDestroy() {
        reverseForEach(this._openDialogsAtThisLevel, (dialog) => {
          if (dialog.config.closeOnDestroy === false) {
            this._removeOpenDialog(dialog, false);
          }
        });
        reverseForEach(this._openDialogsAtThisLevel, (dialog) => dialog.close());
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
        this._openDialogsAtThisLevel = [];
      }
      /**
       * Creates an overlay config from a dialog config.
       * @param config The dialog configuration.
       * @returns The overlay configuration.
       */
      _getOverlayConfig(config) {
        const state = new OverlayConfig({
          positionStrategy: config.positionStrategy || createGlobalPositionStrategy().centerHorizontally().centerVertically(),
          scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
          panelClass: config.panelClass,
          hasBackdrop: config.hasBackdrop,
          direction: config.direction,
          minWidth: config.minWidth,
          minHeight: config.minHeight,
          maxWidth: config.maxWidth,
          maxHeight: config.maxHeight,
          width: config.width,
          height: config.height,
          disposeOnNavigation: config.closeOnNavigation,
          disableAnimations: config.disableAnimations
        });
        if (config.backdropClass) {
          state.backdropClass = config.backdropClass;
        }
        return state;
      }
      /**
       * Attaches a dialog container to a dialog's already-created overlay.
       * @param overlay Reference to the dialog's underlying overlay.
       * @param config The dialog configuration.
       * @returns A promise resolving to a ComponentRef for the attached container.
       */
      _attachContainer(overlay, dialogRef, config) {
        const userInjector = config.injector || config.viewContainerRef?.injector;
        const providers = [
          { provide: DialogConfig, useValue: config },
          { provide: DialogRef, useValue: dialogRef },
          { provide: OverlayRef, useValue: overlay }
        ];
        let containerType;
        if (config.container) {
          if (typeof config.container === "function") {
            containerType = config.container;
          } else {
            containerType = config.container.type;
            providers.push(...config.container.providers(config));
          }
        } else {
          containerType = CdkDialogContainer;
        }
        const containerPortal = new ComponentPortal(containerType, config.viewContainerRef, Injector.create({ parent: userInjector || this._injector, providers }));
        const containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
      }
      /**
       * Attaches the user-provided component to the already-created dialog container.
       * @param componentOrTemplateRef The type of component being loaded into the dialog,
       *     or a TemplateRef to instantiate as the content.
       * @param dialogRef Reference to the dialog being opened.
       * @param dialogContainer Component that is going to wrap the dialog content.
       * @param config Configuration used to open the dialog.
       */
      _attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config) {
        if (componentOrTemplateRef instanceof TemplateRef) {
          const injector = this._createInjector(config, dialogRef, dialogContainer, void 0);
          let context = { $implicit: config.data, dialogRef };
          if (config.templateContext) {
            context = __spreadValues(__spreadValues({}, context), typeof config.templateContext === "function" ? config.templateContext() : config.templateContext);
          }
          dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, context, injector));
        } else {
          const injector = this._createInjector(config, dialogRef, dialogContainer, this._injector);
          const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
          dialogRef.componentRef = contentRef;
          dialogRef.componentInstance = contentRef.instance;
        }
      }
      /**
       * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
       * of a dialog to close itself and, optionally, to return a value.
       * @param config Config object that is used to construct the dialog.
       * @param dialogRef Reference to the dialog being opened.
       * @param dialogContainer Component that is going to wrap the dialog content.
       * @param fallbackInjector Injector to use as a fallback when a lookup fails in the custom
       * dialog injector, if the user didn't provide a custom one.
       * @returns The custom injector that can be used inside the dialog.
       */
      _createInjector(config, dialogRef, dialogContainer, fallbackInjector) {
        const userInjector = config.injector || config.viewContainerRef?.injector;
        const providers = [
          { provide: DIALOG_DATA, useValue: config.data },
          { provide: DialogRef, useValue: dialogRef }
        ];
        if (config.providers) {
          if (typeof config.providers === "function") {
            providers.push(...config.providers(dialogRef, config, dialogContainer));
          } else {
            providers.push(...config.providers);
          }
        }
        if (config.direction && (!userInjector || !userInjector.get(Directionality, null, { optional: true }))) {
          providers.push({
            provide: Directionality,
            useValue: getDirectionality(config.direction)
          });
        }
        return Injector.create({ parent: userInjector || fallbackInjector, providers });
      }
      /**
       * Removes a dialog from the array of open dialogs.
       * @param dialogRef Dialog to be removed.
       * @param emitEvent Whether to emit an event if this is the last dialog.
       */
      _removeOpenDialog(dialogRef, emitEvent) {
        const index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
          this.openDialogs.splice(index, 1);
          if (!this.openDialogs.length) {
            this._ariaHiddenElements.forEach((previousValue, element) => {
              if (previousValue) {
                element.setAttribute("aria-hidden", previousValue);
              } else {
                element.removeAttribute("aria-hidden");
              }
            });
            this._ariaHiddenElements.clear();
            if (emitEvent) {
              this._getAfterAllClosed().next();
            }
          }
        }
      }
      /** Hides all of the content that isn't an overlay from assistive technology. */
      _hideNonDialogContentFromAssistiveTechnology(overlayContainer) {
        if (overlayContainer.parentElement) {
          const siblings = overlayContainer.parentElement.children;
          for (let i = siblings.length - 1; i > -1; i--) {
            const sibling = siblings[i];
            if (sibling !== overlayContainer && sibling.nodeName !== "SCRIPT" && sibling.nodeName !== "STYLE" && !sibling.hasAttribute("aria-live")) {
              this._ariaHiddenElements.set(sibling, sibling.getAttribute("aria-hidden"));
              sibling.setAttribute("aria-hidden", "true");
            }
          }
        }
      }
      _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _Dialog, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _Dialog, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: Dialog, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    DialogModule = class _DialogModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _DialogModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _DialogModule, imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer], exports: [
        // Re-export the PortalModule so that people extending the `CdkDialogContainer`
        // don't have to remember to import it or be faced with an unhelpful error.
        PortalModule,
        CdkDialogContainer
      ] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _DialogModule, providers: [Dialog], imports: [
        OverlayModule,
        PortalModule,
        A11yModule,
        // Re-export the PortalModule so that people extending the `CdkDialogContainer`
        // don't have to remember to import it or be faced with an unhelpful error.
        PortalModule
      ] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: DialogModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
        exports: [
          // Re-export the PortalModule so that people extending the `CdkDialogContainer`
          // don't have to remember to import it or be faced with an unhelpful error.
          PortalModule,
          CdkDialogContainer
        ],
        providers: [Dialog]
      }]
    }] });
  }
});

// node_modules/@angular/material/fesm2022/dialog-module.mjs
function parseCssTime(time) {
  if (time == null) {
    return null;
  }
  if (typeof time === "number") {
    return time;
  }
  if (time.endsWith("ms")) {
    return coerceNumberProperty(time.substring(0, time.length - 2));
  }
  if (time.endsWith("s")) {
    return coerceNumberProperty(time.substring(0, time.length - 1)) * 1e3;
  }
  if (time === "0") {
    return 0;
  }
  return null;
}
function _closeDialogVia(ref, interactionType, result) {
  ref._closeInteractionType = interactionType;
  return ref.close(result);
}
function getClosestDialog(element, openDialogs) {
  let parent = element.nativeElement.parentElement;
  while (parent && !parent.classList.contains("mat-mdc-dialog-container")) {
    parent = parent.parentElement;
  }
  return parent ? openDialogs.find((dialog) => dialog.id === parent.id) : null;
}
var MatDialogConfig, OPEN_CLASS, OPENING_CLASS, CLOSING_CLASS, OPEN_ANIMATION_DURATION, CLOSE_ANIMATION_DURATION, MatDialogContainer, TRANSITION_DURATION_PROPERTY, MatDialogState, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogClose, MatDialogLayoutSection, MatDialogTitle, MatDialogContent, MatDialogActions, DIRECTIVES2, MatDialogModule;
var init_dialog_module = __esm({
  "node_modules/@angular/material/fesm2022/dialog-module.mjs"() {
    "use strict";
    init_dialog();
    init_overlay();
    init_portal();
    init_core();
    init_core();
    init_coercion();
    init_animation();
    init_esm();
    init_operators();
    init_keycodes();
    init_a11y();
    init_scrolling();
    init_scrolling();
    init_common_module();
    MatDialogConfig = class {
      /**
       * Where the attached component should live in Angular's *logical* component tree.
       * This affects what is available for injection and the change detection order for the
       * component instantiated inside of the dialog. This does not affect where the dialog
       * content will be rendered.
       */
      viewContainerRef;
      /**
       * Injector used for the instantiation of the component to be attached. If provided,
       * takes precedence over the injector indirectly provided by `ViewContainerRef`.
       */
      injector;
      /** ID for the dialog. If omitted, a unique one will be generated. */
      id;
      /** The ARIA role of the dialog element. */
      role = "dialog";
      /** Custom class for the overlay pane. */
      panelClass = "";
      /** Whether the dialog has a backdrop. */
      hasBackdrop = true;
      /** Custom class for the backdrop. */
      backdropClass = "";
      /** Whether the user can use escape or clicking on the backdrop to close the modal. */
      disableClose = false;
      /** Function used to determine whether the dialog is allowed to close. */
      closePredicate;
      /** Width of the dialog. */
      width = "";
      /** Height of the dialog. */
      height = "";
      /** Min-width of the dialog. If a number is provided, assumes pixel units. */
      minWidth;
      /** Min-height of the dialog. If a number is provided, assumes pixel units. */
      minHeight;
      /** Max-width of the dialog. If a number is provided, assumes pixel units. */
      maxWidth;
      /** Max-height of the dialog. If a number is provided, assumes pixel units. */
      maxHeight;
      /** Position overrides. */
      position;
      /** Data being injected into the child component. */
      data = null;
      /** Layout direction for the dialog's content. */
      direction;
      /** ID of the element that describes the dialog. */
      ariaDescribedBy = null;
      /** ID of the element that labels the dialog. */
      ariaLabelledBy = null;
      /** Aria label to assign to the dialog element. */
      ariaLabel = null;
      /**
       * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
       * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
       * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
       */
      ariaModal = false;
      /**
       * Where the dialog should focus on open.
       * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
       * AutoFocusTarget instead.
       */
      autoFocus = "first-tabbable";
      /**
       * Whether the dialog should restore focus to the
       * previously-focused element, after it's closed.
       */
      restoreFocus = true;
      /** Whether to wait for the opening animation to finish before trapping focus. */
      delayFocusTrap = true;
      /** Scroll strategy to be used for the dialog. */
      scrollStrategy;
      /**
       * Whether the dialog should close when the user goes backwards/forwards in history.
       * Note that this usually doesn't include clicking on links (unless the user is using
       * the `HashLocationStrategy`).
       */
      closeOnNavigation = true;
      /**
       * Duration of the enter animation in ms.
       * Should be a number, string type is deprecated.
       * @breaking-change 17.0.0 Remove string signature.
       */
      enterAnimationDuration;
      /**
       * Duration of the exit animation in ms.
       * Should be a number, string type is deprecated.
       * @breaking-change 17.0.0 Remove string signature.
       */
      exitAnimationDuration;
    };
    OPEN_CLASS = "mdc-dialog--open";
    OPENING_CLASS = "mdc-dialog--opening";
    CLOSING_CLASS = "mdc-dialog--closing";
    OPEN_ANIMATION_DURATION = 150;
    CLOSE_ANIMATION_DURATION = 75;
    MatDialogContainer = class _MatDialogContainer extends CdkDialogContainer {
      /** Emits when an animation state changes. */
      _animationStateChanged = new EventEmitter();
      /** Whether animations are enabled. */
      _animationsEnabled = !_animationsDisabled();
      /** Number of actions projected in the dialog. */
      _actionSectionCount = 0;
      /** Host element of the dialog container component. */
      _hostElement = this._elementRef.nativeElement;
      /** Duration of the dialog open animation. */
      _enterAnimationDuration = this._animationsEnabled ? parseCssTime(this._config.enterAnimationDuration) ?? OPEN_ANIMATION_DURATION : 0;
      /** Duration of the dialog close animation. */
      _exitAnimationDuration = this._animationsEnabled ? parseCssTime(this._config.exitAnimationDuration) ?? CLOSE_ANIMATION_DURATION : 0;
      /** Current timer for dialog animations. */
      _animationTimer = null;
      _contentAttached() {
        super._contentAttached();
        this._startOpenAnimation();
      }
      /** Starts the dialog open animation if enabled. */
      _startOpenAnimation() {
        this._animationStateChanged.emit({ state: "opening", totalTime: this._enterAnimationDuration });
        if (this._animationsEnabled) {
          this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._enterAnimationDuration}ms`);
          this._requestAnimationFrame(() => this._hostElement.classList.add(OPENING_CLASS, OPEN_CLASS));
          this._waitForAnimationToComplete(this._enterAnimationDuration, this._finishDialogOpen);
        } else {
          this._hostElement.classList.add(OPEN_CLASS);
          Promise.resolve().then(() => this._finishDialogOpen());
        }
      }
      /**
       * Starts the exit animation of the dialog if enabled. This method is
       * called by the dialog ref.
       */
      _startExitAnimation() {
        this._animationStateChanged.emit({ state: "closing", totalTime: this._exitAnimationDuration });
        this._hostElement.classList.remove(OPEN_CLASS);
        if (this._animationsEnabled) {
          this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._exitAnimationDuration}ms`);
          this._requestAnimationFrame(() => this._hostElement.classList.add(CLOSING_CLASS));
          this._waitForAnimationToComplete(this._exitAnimationDuration, this._finishDialogClose);
        } else {
          Promise.resolve().then(() => this._finishDialogClose());
        }
      }
      /**
       * Updates the number action sections.
       * @param delta Increase/decrease in the number of sections.
       */
      _updateActionSectionCount(delta) {
        this._actionSectionCount += delta;
        this._changeDetectorRef.markForCheck();
      }
      /**
       * Completes the dialog open by clearing potential animation classes, trapping
       * focus and emitting an opened event.
       */
      _finishDialogOpen = () => {
        this._clearAnimationClasses();
        this._openAnimationDone(this._enterAnimationDuration);
      };
      /**
       * Completes the dialog close by clearing potential animation classes, restoring
       * focus and emitting a closed event.
       */
      _finishDialogClose = () => {
        this._clearAnimationClasses();
        this._animationStateChanged.emit({ state: "closed", totalTime: this._exitAnimationDuration });
      };
      /** Clears all dialog animation classes. */
      _clearAnimationClasses() {
        this._hostElement.classList.remove(OPENING_CLASS, CLOSING_CLASS);
      }
      _waitForAnimationToComplete(duration, callback) {
        if (this._animationTimer !== null) {
          clearTimeout(this._animationTimer);
        }
        this._animationTimer = setTimeout(callback, duration);
      }
      /** Runs a callback in `requestAnimationFrame`, if available. */
      _requestAnimationFrame(callback) {
        this._ngZone.runOutsideAngular(() => {
          if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(callback);
          } else {
            callback();
          }
        });
      }
      _captureInitialFocus() {
        if (!this._config.delayFocusTrap) {
          this._trapFocus();
        }
      }
      /**
       * Callback for when the open dialog animation has finished. Intended to
       * be called by sub-classes that use different animation implementations.
       */
      _openAnimationDone(totalTime) {
        if (this._config.delayFocusTrap) {
          this._trapFocus();
        }
        this._animationStateChanged.next({ state: "opened", totalTime });
      }
      ngOnDestroy() {
        super.ngOnDestroy();
        if (this._animationTimer !== null) {
          clearTimeout(this._animationTimer);
        }
      }
      attachComponentPortal(portal) {
        const ref = super.attachComponentPortal(portal);
        ref.location.nativeElement.classList.add("mat-mdc-dialog-component-host");
        return ref;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogContainer, deps: null, target: FactoryTarget.Component });
      static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogContainer, isStandalone: true, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "class._mat-animation-noopable": "!_animationsEnabled", "class.mat-mdc-dialog-container-with-actions": "_actionSectionCount > 0" }, classAttribute: "mat-mdc-dialog-container mdc-dialog" }, usesInheritance: true, ngImport: core_exports, template: '<div class="mat-mdc-dialog-inner-container mdc-dialog__container">\n  <div class="mat-mdc-dialog-surface mdc-dialog__surface">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n', styles: ['.mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 560px);min-width:var(--mat-dialog-container-min-width, 280px)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, calc(100vw - 32px))}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, none);border-radius:var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));background-color:var(--mat-dialog-container-color, var(--mat-sys-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 6px 24px 13px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));line-height:var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));font-size:var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));font-weight:var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));letter-spacing:var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));line-height:var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));font-size:var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));font-weight:var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));letter-spacing:var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px 0)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;box-sizing:border-box;min-height:52px;margin:0;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 16px 24px);justify-content:var(--mat-dialog-actions-alignment, flex-end)}@media(forced-colors: active){.mat-mdc-dialog-actions{border-top-color:CanvasText}}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}\n'], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogContainer, decorators: [{
      type: Component,
      args: [{ selector: "mat-dialog-container", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, imports: [CdkPortalOutlet], host: {
        "class": "mat-mdc-dialog-container mdc-dialog",
        "tabindex": "-1",
        "[attr.aria-modal]": "_config.ariaModal",
        "[id]": "_config.id",
        "[attr.role]": "_config.role",
        "[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
        "[attr.aria-label]": "_config.ariaLabel",
        "[attr.aria-describedby]": "_config.ariaDescribedBy || null",
        "[class._mat-animation-noopable]": "!_animationsEnabled",
        "[class.mat-mdc-dialog-container-with-actions]": "_actionSectionCount > 0"
      }, template: '<div class="mat-mdc-dialog-inner-container mdc-dialog__container">\n  <div class="mat-mdc-dialog-surface mdc-dialog__surface">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n', styles: ['.mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 560px);min-width:var(--mat-dialog-container-min-width, 280px)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, calc(100vw - 32px))}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, none);border-radius:var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));background-color:var(--mat-dialog-container-color, var(--mat-sys-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 6px 24px 13px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));line-height:var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));font-size:var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));font-weight:var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));letter-spacing:var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));line-height:var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));font-size:var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));font-weight:var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));letter-spacing:var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px 0)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;box-sizing:border-box;min-height:52px;margin:0;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 16px 24px);justify-content:var(--mat-dialog-actions-alignment, flex-end)}@media(forced-colors: active){.mat-mdc-dialog-actions{border-top-color:CanvasText}}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}\n'] }]
    }] });
    TRANSITION_DURATION_PROPERTY = "--mat-dialog-transition-duration";
    (function(MatDialogState2) {
      MatDialogState2[MatDialogState2["OPEN"] = 0] = "OPEN";
      MatDialogState2[MatDialogState2["CLOSING"] = 1] = "CLOSING";
      MatDialogState2[MatDialogState2["CLOSED"] = 2] = "CLOSED";
    })(MatDialogState || (MatDialogState = {}));
    MatDialogRef = class {
      _ref;
      _config;
      _containerInstance;
      /** The instance of component opened into the dialog. */
      componentInstance;
      /**
       * `ComponentRef` of the component opened into the dialog. Will be
       * null when the dialog is opened using a `TemplateRef`.
       */
      componentRef;
      /** Whether the user is allowed to close the dialog. */
      disableClose;
      /** Unique ID for the dialog. */
      id;
      /** Subject for notifying the user that the dialog has finished opening. */
      _afterOpened = new Subject();
      /** Subject for notifying the user that the dialog has started closing. */
      _beforeClosed = new Subject();
      /** Result to be passed to afterClosed. */
      _result;
      /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
      _closeFallbackTimeout;
      /** Current state of the dialog. */
      _state = MatDialogState.OPEN;
      // TODO(crisbeto): we shouldn't have to declare this property, because `DialogRef.close`
      // already has a second `options` parameter that we can use. The problem is that internal tests
      // have assertions like `expect(MatDialogRef.close).toHaveBeenCalledWith(foo)` which will break,
      // because it'll be called with two arguments by things like `MatDialogClose`.
      /** Interaction that caused the dialog to close. */
      _closeInteractionType;
      constructor(_ref, _config, _containerInstance) {
        this._ref = _ref;
        this._config = _config;
        this._containerInstance = _containerInstance;
        this.disableClose = _config.disableClose;
        this.id = _ref.id;
        _ref.addPanelClass("mat-mdc-dialog-panel");
        _containerInstance._animationStateChanged.pipe(filter((event) => event.state === "opened"), take(1)).subscribe(() => {
          this._afterOpened.next();
          this._afterOpened.complete();
        });
        _containerInstance._animationStateChanged.pipe(filter((event) => event.state === "closed"), take(1)).subscribe(() => {
          clearTimeout(this._closeFallbackTimeout);
          this._finishDialogClose();
        });
        _ref.overlayRef.detachments().subscribe(() => {
          this._beforeClosed.next(this._result);
          this._beforeClosed.complete();
          this._finishDialogClose();
        });
        merge(this.backdropClick(), this.keydownEvents().pipe(filter((event) => event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)))).subscribe((event) => {
          if (!this.disableClose) {
            event.preventDefault();
            _closeDialogVia(this, event.type === "keydown" ? "keyboard" : "mouse");
          }
        });
      }
      /**
       * Close the dialog.
       * @param dialogResult Optional result to return to the dialog opener.
       */
      close(dialogResult) {
        const closePredicate = this._config.closePredicate;
        if (closePredicate && !closePredicate(dialogResult, this._config, this.componentInstance)) {
          return;
        }
        this._result = dialogResult;
        this._containerInstance._animationStateChanged.pipe(filter((event) => event.state === "closing"), take(1)).subscribe((event) => {
          this._beforeClosed.next(dialogResult);
          this._beforeClosed.complete();
          this._ref.overlayRef.detachBackdrop();
          this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
        });
        this._state = MatDialogState.CLOSING;
        this._containerInstance._startExitAnimation();
      }
      /**
       * Gets an observable that is notified when the dialog is finished opening.
       */
      afterOpened() {
        return this._afterOpened;
      }
      /**
       * Gets an observable that is notified when the dialog is finished closing.
       */
      afterClosed() {
        return this._ref.closed;
      }
      /**
       * Gets an observable that is notified when the dialog has started closing.
       */
      beforeClosed() {
        return this._beforeClosed;
      }
      /**
       * Gets an observable that emits when the overlay's backdrop has been clicked.
       */
      backdropClick() {
        return this._ref.backdropClick;
      }
      /**
       * Gets an observable that emits when keydown events are targeted on the overlay.
       */
      keydownEvents() {
        return this._ref.keydownEvents;
      }
      /**
       * Updates the dialog's position.
       * @param position New dialog position.
       */
      updatePosition(position) {
        let strategy = this._ref.config.positionStrategy;
        if (position && (position.left || position.right)) {
          position.left ? strategy.left(position.left) : strategy.right(position.right);
        } else {
          strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
          position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        } else {
          strategy.centerVertically();
        }
        this._ref.updatePosition();
        return this;
      }
      /**
       * Updates the dialog's width and height.
       * @param width New width of the dialog.
       * @param height New height of the dialog.
       */
      updateSize(width = "", height = "") {
        this._ref.updateSize(width, height);
        return this;
      }
      /** Add a CSS class or an array of classes to the overlay pane. */
      addPanelClass(classes) {
        this._ref.addPanelClass(classes);
        return this;
      }
      /** Remove a CSS class or an array of classes from the overlay pane. */
      removePanelClass(classes) {
        this._ref.removePanelClass(classes);
        return this;
      }
      /** Gets the current state of the dialog's lifecycle. */
      getState() {
        return this._state;
      }
      /**
       * Finishes the dialog close by updating the state of the dialog
       * and disposing the overlay.
       */
      _finishDialogClose() {
        this._state = MatDialogState.CLOSED;
        this._ref.close(this._result, { focusOrigin: this._closeInteractionType });
        this.componentInstance = null;
      }
    };
    MAT_DIALOG_DATA = new InjectionToken("MatMdcDialogData");
    MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken("mat-mdc-dialog-default-options");
    MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken("mat-mdc-dialog-scroll-strategy", {
      providedIn: "root",
      factory: () => {
        const injector = inject(Injector);
        return () => createBlockScrollStrategy(injector);
      }
    });
    MatDialog = class _MatDialog {
      _defaultOptions = inject(MAT_DIALOG_DEFAULT_OPTIONS, { optional: true });
      _scrollStrategy = inject(MAT_DIALOG_SCROLL_STRATEGY);
      _parentDialog = inject(_MatDialog, { optional: true, skipSelf: true });
      _idGenerator = inject(_IdGenerator);
      _injector = inject(Injector);
      _dialog = inject(Dialog);
      _animationsDisabled = _animationsDisabled();
      _openDialogsAtThisLevel = [];
      _afterAllClosedAtThisLevel = new Subject();
      _afterOpenedAtThisLevel = new Subject();
      dialogConfigClass = MatDialogConfig;
      _dialogRefConstructor;
      _dialogContainerType;
      _dialogDataToken;
      /** Keeps track of the currently-open dialogs. */
      get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
      }
      /** Stream that emits when a dialog has been opened. */
      get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
      }
      _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
      }
      /**
       * Stream that emits when all open dialog have finished closing.
       * Will emit on subscribe if there are no open dialogs to begin with.
       */
      afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
      constructor() {
        this._dialogRefConstructor = MatDialogRef;
        this._dialogContainerType = MatDialogContainer;
        this._dialogDataToken = MAT_DIALOG_DATA;
      }
      open(componentOrTemplateRef, config) {
        let dialogRef;
        config = __spreadValues(__spreadValues({}, this._defaultOptions || new MatDialogConfig()), config);
        config.id = config.id || this._idGenerator.getId("mat-mdc-dialog-");
        config.scrollStrategy = config.scrollStrategy || this._scrollStrategy();
        const cdkRef = this._dialog.open(componentOrTemplateRef, __spreadProps(__spreadValues({}, config), {
          positionStrategy: createGlobalPositionStrategy(this._injector).centerHorizontally().centerVertically(),
          // Disable closing since we need to sync it up to the animation ourselves.
          disableClose: true,
          // Closing is tied to our animation so the close predicate has to be implemented separately.
          closePredicate: void 0,
          // Disable closing on destroy, because this service cleans up its open dialogs as well.
          // We want to do the cleanup here, rather than the CDK service, because the CDK destroys
          // the dialogs immediately whereas we want it to wait for the animations to finish.
          closeOnDestroy: false,
          // Disable closing on detachments so that we can sync up the animation.
          // The Material dialog ref handles this manually.
          closeOnOverlayDetachments: false,
          disableAnimations: this._animationsDisabled || config.enterAnimationDuration?.toLocaleString() === "0" || config.exitAnimationDuration?.toString() === "0",
          container: {
            type: this._dialogContainerType,
            providers: () => [
              // Provide our config as the CDK config as well since it has the same interface as the
              // CDK one, but it contains the actual values passed in by the user for things like
              // `disableClose` which we disable for the CDK dialog since we handle it ourselves.
              { provide: this.dialogConfigClass, useValue: config },
              { provide: DialogConfig, useValue: config }
            ]
          },
          templateContext: () => ({ dialogRef }),
          providers: (ref, cdkConfig, dialogContainer) => {
            dialogRef = new this._dialogRefConstructor(ref, config, dialogContainer);
            dialogRef.updatePosition(config?.position);
            return [
              { provide: this._dialogContainerType, useValue: dialogContainer },
              { provide: this._dialogDataToken, useValue: cdkConfig.data },
              { provide: this._dialogRefConstructor, useValue: dialogRef }
            ];
          }
        }));
        dialogRef.componentRef = cdkRef.componentRef;
        dialogRef.componentInstance = cdkRef.componentInstance;
        this.openDialogs.push(dialogRef);
        this.afterOpened.next(dialogRef);
        dialogRef.afterClosed().subscribe(() => {
          const index = this.openDialogs.indexOf(dialogRef);
          if (index > -1) {
            this.openDialogs.splice(index, 1);
            if (!this.openDialogs.length) {
              this._getAfterAllClosed().next();
            }
          }
        });
        return dialogRef;
      }
      /**
       * Closes all of the currently-open dialogs.
       */
      closeAll() {
        this._closeDialogs(this.openDialogs);
      }
      /**
       * Finds an open dialog by its id.
       * @param id ID to use when looking up the dialog.
       */
      getDialogById(id) {
        return this.openDialogs.find((dialog) => dialog.id === id);
      }
      ngOnDestroy() {
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
      }
      _closeDialogs(dialogs) {
        let i = dialogs.length;
        while (i--) {
          dialogs[i].close();
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialog, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialog, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialog, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [] });
    MatDialogClose = class _MatDialogClose {
      dialogRef = inject(MatDialogRef, { optional: true });
      _elementRef = inject(ElementRef);
      _dialog = inject(MatDialog);
      /** Screen-reader label for the button. */
      ariaLabel;
      /** Default to "button" to prevents accidental form submits. */
      type = "button";
      /** Dialog close input. */
      dialogResult;
      _matDialogClose;
      constructor() {
      }
      ngOnInit() {
        if (!this.dialogRef) {
          this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
      }
      ngOnChanges(changes) {
        const proxiedChange = changes["_matDialogClose"] || changes["_matDialogCloseResult"];
        if (proxiedChange) {
          this.dialogResult = proxiedChange.currentValue;
        }
      }
      _onButtonClick(event) {
        _closeDialogVia(this.dialogRef, event.screenX === 0 && event.screenY === 0 ? "keyboard" : "mouse", this.dialogResult);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogClose, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogClose, isStandalone: true, selector: "[mat-dialog-close], [matDialogClose]", inputs: { ariaLabel: ["aria-label", "ariaLabel"], type: "type", dialogResult: ["mat-dialog-close", "dialogResult"], _matDialogClose: ["matDialogClose", "_matDialogClose"] }, host: { listeners: { "click": "_onButtonClick($event)" }, properties: { "attr.aria-label": "ariaLabel || null", "attr.type": "type" } }, exportAs: ["matDialogClose"], usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogClose, decorators: [{
      type: Directive,
      args: [{
        selector: "[mat-dialog-close], [matDialogClose]",
        exportAs: "matDialogClose",
        host: {
          "(click)": "_onButtonClick($event)",
          "[attr.aria-label]": "ariaLabel || null",
          "[attr.type]": "type"
        }
      }]
    }], ctorParameters: () => [], propDecorators: { ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }], type: [{
      type: Input
    }], dialogResult: [{
      type: Input,
      args: ["mat-dialog-close"]
    }], _matDialogClose: [{
      type: Input,
      args: ["matDialogClose"]
    }] } });
    MatDialogLayoutSection = class _MatDialogLayoutSection {
      _dialogRef = inject(MatDialogRef, { optional: true });
      _elementRef = inject(ElementRef);
      _dialog = inject(MatDialog);
      constructor() {
      }
      ngOnInit() {
        if (!this._dialogRef) {
          this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
        if (this._dialogRef) {
          Promise.resolve().then(() => {
            this._onAdd();
          });
        }
      }
      ngOnDestroy() {
        const instance = this._dialogRef?._containerInstance;
        if (instance) {
          Promise.resolve().then(() => {
            this._onRemove();
          });
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogLayoutSection, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogLayoutSection, isStandalone: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogLayoutSection, decorators: [{
      type: Directive
    }], ctorParameters: () => [] });
    MatDialogTitle = class _MatDialogTitle extends MatDialogLayoutSection {
      id = inject(_IdGenerator).getId("mat-mdc-dialog-title-");
      _onAdd() {
        this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id);
      }
      _onRemove() {
        this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogTitle, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogTitle, isStandalone: true, selector: "[mat-dialog-title], [matDialogTitle]", inputs: { id: "id" }, host: { properties: { "id": "id" }, classAttribute: "mat-mdc-dialog-title mdc-dialog__title" }, exportAs: ["matDialogTitle"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogTitle, decorators: [{
      type: Directive,
      args: [{
        selector: "[mat-dialog-title], [matDialogTitle]",
        exportAs: "matDialogTitle",
        host: {
          "class": "mat-mdc-dialog-title mdc-dialog__title",
          "[id]": "id"
        }
      }]
    }], propDecorators: { id: [{
      type: Input
    }] } });
    MatDialogContent = class _MatDialogContent {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogContent, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogContent, isStandalone: true, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]", host: { classAttribute: "mat-mdc-dialog-content mdc-dialog__content" }, hostDirectives: [{ directive: CdkScrollable }], ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogContent, decorators: [{
      type: Directive,
      args: [{
        selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
        host: { "class": "mat-mdc-dialog-content mdc-dialog__content" },
        hostDirectives: [CdkScrollable]
      }]
    }] });
    MatDialogActions = class _MatDialogActions extends MatDialogLayoutSection {
      /**
       * Horizontal alignment of action buttons.
       */
      align;
      _onAdd() {
        this._dialogRef._containerInstance?._updateActionSectionCount?.(1);
      }
      _onRemove() {
        this._dialogRef._containerInstance?._updateActionSectionCount?.(-1);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogActions, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatDialogActions, isStandalone: true, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: { align: "align" }, host: { properties: { "class.mat-mdc-dialog-actions-align-start": 'align === "start"', "class.mat-mdc-dialog-actions-align-center": 'align === "center"', "class.mat-mdc-dialog-actions-align-end": 'align === "end"' }, classAttribute: "mat-mdc-dialog-actions mdc-dialog__actions" }, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogActions, decorators: [{
      type: Directive,
      args: [{
        selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
        host: {
          "class": "mat-mdc-dialog-actions mdc-dialog__actions",
          "[class.mat-mdc-dialog-actions-align-start]": 'align === "start"',
          "[class.mat-mdc-dialog-actions-align-center]": 'align === "center"',
          "[class.mat-mdc-dialog-actions-align-end]": 'align === "end"'
        }
      }]
    }], propDecorators: { align: [{
      type: Input
    }] } });
    DIRECTIVES2 = [
      MatDialogContainer,
      MatDialogClose,
      MatDialogTitle,
      MatDialogActions,
      MatDialogContent
    ];
    MatDialogModule = class _MatDialogModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogModule, imports: [
        DialogModule,
        OverlayModule,
        PortalModule,
        MatCommonModule,
        MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent
      ], exports: [
        MatCommonModule,
        MatDialogContainer,
        MatDialogClose,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent
      ] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatDialogModule, providers: [MatDialog], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, MatCommonModule] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatDialogModule, decorators: [{
      type: NgModule,
      args: [{
        imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, ...DIRECTIVES2],
        exports: [MatCommonModule, ...DIRECTIVES2],
        providers: [MatDialog]
      }]
    }] });
  }
});

// node_modules/@angular/material/fesm2022/dialog.mjs
var init_dialog2 = __esm({
  "node_modules/@angular/material/fesm2022/dialog.mjs"() {
    "use strict";
    init_dialog_module();
  }
});

// angular:jit:style:inline:src/app/dialogs/session-timeout-dialog.component.ts;CiAgICAuc2Vzc2lvbi10aW1lb3V0LWRpYWxvZyB7CiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgICAgcGFkZGluZzogMnJlbTsKICAgICAgbWluLXdpZHRoOiAzMDBweDsKICAgIH0KICAgIC53YXJuaW5nLWljb24gewogICAgICBmb250LXNpemU6IDNyZW07CiAgICAgIHdpZHRoOiAzcmVtOwogICAgICBoZWlnaHQ6IDNyZW07CiAgICAgIGNvbG9yOiAjZmY5ODAwOwogICAgICBtYXJnaW4tYm90dG9tOiAxcmVtOwogICAgfQogICAgaDIgewogICAgICBtYXJnaW46IDFyZW0gMCAwLjVyZW07CiAgICAgIGNvbG9yOiAjMzMzOwogICAgfQogICAgcCB7CiAgICAgIGNvbG9yOiAjNjY2OwogICAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07CiAgICB9CiAg
var session_timeout_dialog_component_default;
var init_session_timeout_dialog_component = __esm({
  "angular:jit:style:inline:src/app/dialogs/session-timeout-dialog.component.ts;CiAgICAuc2Vzc2lvbi10aW1lb3V0LWRpYWxvZyB7CiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgICAgcGFkZGluZzogMnJlbTsKICAgICAgbWluLXdpZHRoOiAzMDBweDsKICAgIH0KICAgIC53YXJuaW5nLWljb24gewogICAgICBmb250LXNpemU6IDNyZW07CiAgICAgIHdpZHRoOiAzcmVtOwogICAgICBoZWlnaHQ6IDNyZW07CiAgICAgIGNvbG9yOiAjZmY5ODAwOwogICAgICBtYXJnaW4tYm90dG9tOiAxcmVtOwogICAgfQogICAgaDIgewogICAgICBtYXJnaW46IDFyZW0gMCAwLjVyZW07CiAgICAgIGNvbG9yOiAjMzMzOwogICAgfQogICAgcCB7CiAgICAgIGNvbG9yOiAjNjY2OwogICAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07CiAgICB9CiAg"() {
    session_timeout_dialog_component_default = "/* angular:styles/component:scss;7c8a5214762e4270bb85fbfc106e085c2aa59dbba05d544833fd4ec13d0048d6;/Users/rvshekhar/Desktop/Projects_Dev/Bhuri-SAP/frontend/src/app/dialogs/session-timeout-dialog.component.ts */\n.session-timeout-dialog {\n  text-align: center;\n  padding: 2rem;\n  min-width: 300px;\n}\n.warning-icon {\n  font-size: 3rem;\n  width: 3rem;\n  height: 3rem;\n  color: #ff9800;\n  margin-bottom: 1rem;\n}\nh2 {\n  margin: 1rem 0 0.5rem;\n  color: #333;\n}\np {\n  color: #666;\n  margin-bottom: 1.5rem;\n}\n/*# sourceMappingURL=session-timeout-dialog.component.css.map */\n";
  }
});

// src/app/dialogs/session-timeout-dialog.component.ts
var SessionTimeoutDialogComponent;
var init_session_timeout_dialog_component2 = __esm({
  "src/app/dialogs/session-timeout-dialog.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_session_timeout_dialog_component();
    init_core();
    init_router();
    init_dialog2();
    init_button();
    init_icon();
    SessionTimeoutDialogComponent = class SessionTimeoutDialogComponent2 {
      router = inject(Router);
      dialogRef = inject(MatDialogRef);
      login() {
        this.dialogRef.close();
        this.router.navigate(["/login"]);
      }
    };
    SessionTimeoutDialogComponent = __decorate([
      Component({
        selector: "app-session-timeout-dialog",
        standalone: true,
        imports: [MatDialogModule, MatButtonModule, MatIconModule],
        template: `
    <div class="session-timeout-dialog">
      <mat-icon class="warning-icon">warning</mat-icon>
      <h2>Session Timed Out</h2>
      <p>Your session has expired. Please login again to continue.</p>
      <button mat-raised-button color="primary" (click)="login()">
        Login Again
      </button>
    </div>
  `,
        styles: [session_timeout_dialog_component_default]
      })
    ], SessionTimeoutDialogComponent);
  }
});

// node_modules/engine.io-parser/build/esm/commons.js
var PACKET_TYPES, PACKET_TYPES_REVERSE, ERROR_PACKET;
var init_commons = __esm({
  "node_modules/engine.io-parser/build/esm/commons.js"() {
    "use strict";
    PACKET_TYPES = /* @__PURE__ */ Object.create(null);
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
    Object.keys(PACKET_TYPES).forEach((key) => {
      PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    ERROR_PACKET = { type: "error", data: "parser error" };
  }
});

// node_modules/engine.io-parser/build/esm/encodePacket.browser.js
function toArray(data) {
  if (data instanceof Uint8Array) {
    return data;
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  } else {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
}
function encodePacketToBinary(packet, callback) {
  if (withNativeBlob && packet.data instanceof Blob) {
    return packet.data.arrayBuffer().then(toArray).then(callback);
  } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
    return callback(toArray(packet.data));
  }
  encodePacket(packet, false, (encoded) => {
    if (!TEXT_ENCODER) {
      TEXT_ENCODER = new TextEncoder();
    }
    callback(TEXT_ENCODER.encode(encoded));
  });
}
var withNativeBlob, withNativeArrayBuffer, isView, encodePacket, encodeBlobAsBase64, TEXT_ENCODER;
var init_encodePacket_browser = __esm({
  "node_modules/engine.io-parser/build/esm/encodePacket.browser.js"() {
    "use strict";
    init_commons();
    withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
    withNativeArrayBuffer = typeof ArrayBuffer === "function";
    isView = (obj) => {
      return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
    };
    encodePacket = ({ type, data }, supportsBinary, callback) => {
      if (withNativeBlob && data instanceof Blob) {
        if (supportsBinary) {
          return callback(data);
        } else {
          return encodeBlobAsBase64(data, callback);
        }
      } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
        if (supportsBinary) {
          return callback(data);
        } else {
          return encodeBlobAsBase64(new Blob([data]), callback);
        }
      }
      return callback(PACKET_TYPES[type] + (data || ""));
    };
    encodeBlobAsBase64 = (data, callback) => {
      const fileReader = new FileReader();
      fileReader.onload = function() {
        const content = fileReader.result.split(",")[1];
        callback("b" + (content || ""));
      };
      return fileReader.readAsDataURL(data);
    };
  }
});

// node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
var chars, lookup, decode;
var init_base64_arraybuffer = __esm({
  "node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js"() {
    "use strict";
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    decode = (base64) => {
      let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
      if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
          bufferLength--;
        }
      }
      const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
      for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
      }
      return arraybuffer;
    };
  }
});

// node_modules/engine.io-parser/build/esm/decodePacket.browser.js
var withNativeArrayBuffer2, decodePacket, decodeBase64Packet, mapBinary;
var init_decodePacket_browser = __esm({
  "node_modules/engine.io-parser/build/esm/decodePacket.browser.js"() {
    "use strict";
    init_commons();
    init_base64_arraybuffer();
    withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
    decodePacket = (encodedPacket, binaryType) => {
      if (typeof encodedPacket !== "string") {
        return {
          type: "message",
          data: mapBinary(encodedPacket, binaryType)
        };
      }
      const type = encodedPacket.charAt(0);
      if (type === "b") {
        return {
          type: "message",
          data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
        };
      }
      const packetType = PACKET_TYPES_REVERSE[type];
      if (!packetType) {
        return ERROR_PACKET;
      }
      return encodedPacket.length > 1 ? {
        type: PACKET_TYPES_REVERSE[type],
        data: encodedPacket.substring(1)
      } : {
        type: PACKET_TYPES_REVERSE[type]
      };
    };
    decodeBase64Packet = (data, binaryType) => {
      if (withNativeArrayBuffer2) {
        const decoded = decode(data);
        return mapBinary(decoded, binaryType);
      } else {
        return { base64: true, data };
      }
    };
    mapBinary = (data, binaryType) => {
      switch (binaryType) {
        case "blob":
          if (data instanceof Blob) {
            return data;
          } else {
            return new Blob([data]);
          }
        case "arraybuffer":
        default:
          if (data instanceof ArrayBuffer) {
            return data;
          } else {
            return data.buffer;
          }
      }
    };
  }
});

// node_modules/engine.io-parser/build/esm/index.js
function createPacketEncoderStream() {
  return new TransformStream({
    transform(packet, controller) {
      encodePacketToBinary(packet, (encodedPacket) => {
        const payloadLength = encodedPacket.length;
        let header;
        if (payloadLength < 126) {
          header = new Uint8Array(1);
          new DataView(header.buffer).setUint8(0, payloadLength);
        } else if (payloadLength < 65536) {
          header = new Uint8Array(3);
          const view = new DataView(header.buffer);
          view.setUint8(0, 126);
          view.setUint16(1, payloadLength);
        } else {
          header = new Uint8Array(9);
          const view = new DataView(header.buffer);
          view.setUint8(0, 127);
          view.setBigUint64(1, BigInt(payloadLength));
        }
        if (packet.data && typeof packet.data !== "string") {
          header[0] |= 128;
        }
        controller.enqueue(header);
        controller.enqueue(encodedPacket);
      });
    }
  });
}
function totalLength(chunks) {
  return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
  if (chunks[0].length === size) {
    return chunks.shift();
  }
  const buffer = new Uint8Array(size);
  let j = 0;
  for (let i = 0; i < size; i++) {
    buffer[i] = chunks[0][j++];
    if (j === chunks[0].length) {
      chunks.shift();
      j = 0;
    }
  }
  if (chunks.length && j < chunks[0].length) {
    chunks[0] = chunks[0].slice(j);
  }
  return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
  if (!TEXT_DECODER) {
    TEXT_DECODER = new TextDecoder();
  }
  const chunks = [];
  let state = 0;
  let expectedLength = -1;
  let isBinary2 = false;
  return new TransformStream({
    transform(chunk, controller) {
      chunks.push(chunk);
      while (true) {
        if (state === 0) {
          if (totalLength(chunks) < 1) {
            break;
          }
          const header = concatChunks(chunks, 1);
          isBinary2 = (header[0] & 128) === 128;
          expectedLength = header[0] & 127;
          if (expectedLength < 126) {
            state = 3;
          } else if (expectedLength === 126) {
            state = 1;
          } else {
            state = 2;
          }
        } else if (state === 1) {
          if (totalLength(chunks) < 2) {
            break;
          }
          const headerArray = concatChunks(chunks, 2);
          expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
          state = 3;
        } else if (state === 2) {
          if (totalLength(chunks) < 8) {
            break;
          }
          const headerArray = concatChunks(chunks, 8);
          const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
          const n = view.getUint32(0);
          if (n > Math.pow(2, 53 - 32) - 1) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
          expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
          state = 3;
        } else {
          if (totalLength(chunks) < expectedLength) {
            break;
          }
          const data = concatChunks(chunks, expectedLength);
          controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
          state = 0;
        }
        if (expectedLength === 0 || expectedLength > maxPayload) {
          controller.enqueue(ERROR_PACKET);
          break;
        }
      }
    }
  });
}
var SEPARATOR, encodePayload, decodePayload, TEXT_DECODER, protocol;
var init_esm2 = __esm({
  "node_modules/engine.io-parser/build/esm/index.js"() {
    "use strict";
    init_encodePacket_browser();
    init_decodePacket_browser();
    init_commons();
    SEPARATOR = String.fromCharCode(30);
    encodePayload = (packets, callback) => {
      const length = packets.length;
      const encodedPackets = new Array(length);
      let count = 0;
      packets.forEach((packet, i) => {
        encodePacket(packet, false, (encodedPacket) => {
          encodedPackets[i] = encodedPacket;
          if (++count === length) {
            callback(encodedPackets.join(SEPARATOR));
          }
        });
      });
    };
    decodePayload = (encodedPayload, binaryType) => {
      const encodedPackets = encodedPayload.split(SEPARATOR);
      const packets = [];
      for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = decodePacket(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
          break;
        }
      }
      return packets;
    };
    protocol = 4;
  }
});

// node_modules/@socket.io/component-emitter/lib/esm/index.js
function Emitter(obj) {
  if (obj) return mixin(obj);
}
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
var init_esm3 = __esm({
  "node_modules/@socket.io/component-emitter/lib/esm/index.js"() {
    "use strict";
    Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
      return this;
    };
    Emitter.prototype.once = function(event, fn) {
      function on2() {
        this.off(event, on2);
        fn.apply(this, arguments);
      }
      on2.fn = fn;
      this.on(event, on2);
      return this;
    };
    Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }
      var callbacks = this._callbacks["$" + event];
      if (!callbacks) return this;
      if (1 == arguments.length) {
        delete this._callbacks["$" + event];
        return this;
      }
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      if (callbacks.length === 0) {
        delete this._callbacks["$" + event];
      }
      return this;
    };
    Emitter.prototype.emit = function(event) {
      this._callbacks = this._callbacks || {};
      var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }
      return this;
    };
    Emitter.prototype.emitReserved = Emitter.prototype.emit;
    Emitter.prototype.listeners = function(event) {
      this._callbacks = this._callbacks || {};
      return this._callbacks["$" + event] || [];
    };
    Emitter.prototype.hasListeners = function(event) {
      return !!this.listeners(event).length;
    };
  }
});

// node_modules/engine.io-client/build/esm/globals.js
function createCookieJar() {
}
var nextTick, globalThisShim, defaultBinaryType;
var init_globals = __esm({
  "node_modules/engine.io-client/build/esm/globals.js"() {
    "use strict";
    nextTick = (() => {
      const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
      if (isPromiseAvailable) {
        return (cb) => Promise.resolve().then(cb);
      } else {
        return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
      }
    })();
    globalThisShim = (() => {
      if (typeof self !== "undefined") {
        return self;
      } else if (typeof window !== "undefined") {
        return window;
      } else {
        return Function("return this")();
      }
    })();
    defaultBinaryType = "arraybuffer";
  }
});

// node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
  return attr.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}
function installTimerFunctions(obj, opts) {
  if (opts.useNativeTimers) {
    obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
    obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
  } else {
    obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
    obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
  }
}
function byteLength(obj) {
  if (typeof obj === "string") {
    return utf8Length(obj);
  }
  return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
  let c = 0, length = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i);
    if (c < 128) {
      length += 1;
    } else if (c < 2048) {
      length += 2;
    } else if (c < 55296 || c >= 57344) {
      length += 3;
    } else {
      i++;
      length += 4;
    }
  }
  return length;
}
function randomString() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
var NATIVE_SET_TIMEOUT, NATIVE_CLEAR_TIMEOUT, BASE64_OVERHEAD;
var init_util = __esm({
  "node_modules/engine.io-client/build/esm/util.js"() {
    "use strict";
    init_globals();
    NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
    NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
    BASE64_OVERHEAD = 1.33;
  }
});

// node_modules/engine.io-client/build/esm/contrib/parseqs.js
function encode(obj) {
  let str = "";
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length)
        str += "&";
      str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
    }
  }
  return str;
}
function decode2(qs) {
  let qry = {};
  let pairs = qs.split("&");
  for (let i = 0, l = pairs.length; i < l; i++) {
    let pair = pairs[i].split("=");
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
}
var init_parseqs = __esm({
  "node_modules/engine.io-client/build/esm/contrib/parseqs.js"() {
    "use strict";
  }
});

// node_modules/engine.io-client/build/esm/transport.js
var TransportError, Transport;
var init_transport = __esm({
  "node_modules/engine.io-client/build/esm/transport.js"() {
    "use strict";
    init_esm2();
    init_esm3();
    init_util();
    init_parseqs();
    TransportError = class extends Error {
      constructor(reason, description, context) {
        super(reason);
        this.description = description;
        this.context = context;
        this.type = "TransportError";
      }
    };
    Transport = class extends Emitter {
      /**
       * Transport abstract constructor.
       *
       * @param {Object} opts - options
       * @protected
       */
      constructor(opts) {
        super();
        this.writable = false;
        installTimerFunctions(this, opts);
        this.opts = opts;
        this.query = opts.query;
        this.socket = opts.socket;
        this.supportsBinary = !opts.forceBase64;
      }
      /**
       * Emits an error.
       *
       * @param {String} reason
       * @param description
       * @param context - the error context
       * @return {Transport} for chaining
       * @protected
       */
      onError(reason, description, context) {
        super.emitReserved("error", new TransportError(reason, description, context));
        return this;
      }
      /**
       * Opens the transport.
       */
      open() {
        this.readyState = "opening";
        this.doOpen();
        return this;
      }
      /**
       * Closes the transport.
       */
      close() {
        if (this.readyState === "opening" || this.readyState === "open") {
          this.doClose();
          this.onClose();
        }
        return this;
      }
      /**
       * Sends multiple packets.
       *
       * @param {Array} packets
       */
      send(packets) {
        if (this.readyState === "open") {
          this.write(packets);
        } else {
        }
      }
      /**
       * Called upon open
       *
       * @protected
       */
      onOpen() {
        this.readyState = "open";
        this.writable = true;
        super.emitReserved("open");
      }
      /**
       * Called with data.
       *
       * @param {String} data
       * @protected
       */
      onData(data) {
        const packet = decodePacket(data, this.socket.binaryType);
        this.onPacket(packet);
      }
      /**
       * Called with a decoded packet.
       *
       * @protected
       */
      onPacket(packet) {
        super.emitReserved("packet", packet);
      }
      /**
       * Called upon close.
       *
       * @protected
       */
      onClose(details) {
        this.readyState = "closed";
        super.emitReserved("close", details);
      }
      /**
       * Pauses the transport, in order not to lose packets during an upgrade.
       *
       * @param onPause
       */
      pause(onPause) {
      }
      createUri(schema, query = {}) {
        return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
      }
      _hostname() {
        const hostname = this.opts.hostname;
        return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
      }
      _port() {
        if (this.opts.port && (this.opts.secure && Number(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80)) {
          return ":" + this.opts.port;
        } else {
          return "";
        }
      }
      _query(query) {
        const encodedQuery = encode(query);
        return encodedQuery.length ? "?" + encodedQuery : "";
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/transports/polling.js
var Polling;
var init_polling = __esm({
  "node_modules/engine.io-client/build/esm/transports/polling.js"() {
    "use strict";
    init_transport();
    init_util();
    init_esm2();
    Polling = class extends Transport {
      constructor() {
        super(...arguments);
        this._polling = false;
      }
      get name() {
        return "polling";
      }
      /**
       * Opens the socket (triggers polling). We write a PING message to determine
       * when the transport is open.
       *
       * @protected
       */
      doOpen() {
        this._poll();
      }
      /**
       * Pauses polling.
       *
       * @param {Function} onPause - callback upon buffers are flushed and transport is paused
       * @package
       */
      pause(onPause) {
        this.readyState = "pausing";
        const pause = () => {
          this.readyState = "paused";
          onPause();
        };
        if (this._polling || !this.writable) {
          let total = 0;
          if (this._polling) {
            total++;
            this.once("pollComplete", function() {
              --total || pause();
            });
          }
          if (!this.writable) {
            total++;
            this.once("drain", function() {
              --total || pause();
            });
          }
        } else {
          pause();
        }
      }
      /**
       * Starts polling cycle.
       *
       * @private
       */
      _poll() {
        this._polling = true;
        this.doPoll();
        this.emitReserved("poll");
      }
      /**
       * Overloads onData to detect payloads.
       *
       * @protected
       */
      onData(data) {
        const callback = (packet) => {
          if ("opening" === this.readyState && packet.type === "open") {
            this.onOpen();
          }
          if ("close" === packet.type) {
            this.onClose({ description: "transport closed by the server" });
            return false;
          }
          this.onPacket(packet);
        };
        decodePayload(data, this.socket.binaryType).forEach(callback);
        if ("closed" !== this.readyState) {
          this._polling = false;
          this.emitReserved("pollComplete");
          if ("open" === this.readyState) {
            this._poll();
          } else {
          }
        }
      }
      /**
       * For polling, send a close packet.
       *
       * @protected
       */
      doClose() {
        const close = () => {
          this.write([{ type: "close" }]);
        };
        if ("open" === this.readyState) {
          close();
        } else {
          this.once("open", close);
        }
      }
      /**
       * Writes a packets payload.
       *
       * @param {Array} packets - data packets
       * @protected
       */
      write(packets) {
        this.writable = false;
        encodePayload(packets, (data) => {
          this.doWrite(data, () => {
            this.writable = true;
            this.emitReserved("drain");
          });
        });
      }
      /**
       * Generates uri for connection.
       *
       * @private
       */
      uri() {
        const schema = this.opts.secure ? "https" : "http";
        const query = this.query || {};
        if (false !== this.opts.timestampRequests) {
          query[this.opts.timestampParam] = randomString();
        }
        if (!this.supportsBinary && !query.sid) {
          query.b64 = 1;
        }
        return this.createUri(schema, query);
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/contrib/has-cors.js
var value, hasCORS;
var init_has_cors = __esm({
  "node_modules/engine.io-client/build/esm/contrib/has-cors.js"() {
    "use strict";
    value = false;
    try {
      value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
    } catch (err) {
    }
    hasCORS = value;
  }
});

// node_modules/engine.io-client/build/esm/transports/polling-xhr.js
function empty() {
}
function unloadHandler() {
  for (let i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}
function newRequest(opts) {
  const xdomain = opts.xdomain;
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {
  }
  if (!xdomain) {
    try {
      return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {
    }
  }
}
var BaseXHR, Request, hasXHR2, XHR;
var init_polling_xhr = __esm({
  "node_modules/engine.io-client/build/esm/transports/polling-xhr.js"() {
    "use strict";
    init_polling();
    init_esm3();
    init_util();
    init_globals();
    init_has_cors();
    BaseXHR = class extends Polling {
      /**
       * XHR Polling constructor.
       *
       * @param {Object} opts
       * @package
       */
      constructor(opts) {
        super(opts);
        if (typeof location !== "undefined") {
          const isSSL = "https:" === location.protocol;
          let port = location.port;
          if (!port) {
            port = isSSL ? "443" : "80";
          }
          this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
        }
      }
      /**
       * Sends data.
       *
       * @param {String} data to send.
       * @param {Function} called upon flush.
       * @private
       */
      doWrite(data, fn) {
        const req = this.request({
          method: "POST",
          data
        });
        req.on("success", fn);
        req.on("error", (xhrStatus, context) => {
          this.onError("xhr post error", xhrStatus, context);
        });
      }
      /**
       * Starts a poll cycle.
       *
       * @private
       */
      doPoll() {
        const req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", (xhrStatus, context) => {
          this.onError("xhr poll error", xhrStatus, context);
        });
        this.pollXhr = req;
      }
    };
    Request = class _Request extends Emitter {
      /**
       * Request constructor
       *
       * @param {Object} options
       * @package
       */
      constructor(createRequest, uri, opts) {
        super();
        this.createRequest = createRequest;
        installTimerFunctions(this, opts);
        this._opts = opts;
        this._method = opts.method || "GET";
        this._uri = uri;
        this._data = void 0 !== opts.data ? opts.data : null;
        this._create();
      }
      /**
       * Creates the XHR object and sends the request.
       *
       * @private
       */
      _create() {
        var _a;
        const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this._opts.xd;
        const xhr = this._xhr = this.createRequest(opts);
        try {
          xhr.open(this._method, this._uri, true);
          try {
            if (this._opts.extraHeaders) {
              xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
              for (let i in this._opts.extraHeaders) {
                if (this._opts.extraHeaders.hasOwnProperty(i)) {
                  xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
                }
              }
            }
          } catch (e) {
          }
          if ("POST" === this._method) {
            try {
              xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            } catch (e) {
            }
          }
          try {
            xhr.setRequestHeader("Accept", "*/*");
          } catch (e) {
          }
          (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
          if ("withCredentials" in xhr) {
            xhr.withCredentials = this._opts.withCredentials;
          }
          if (this._opts.requestTimeout) {
            xhr.timeout = this._opts.requestTimeout;
          }
          xhr.onreadystatechange = () => {
            var _a2;
            if (xhr.readyState === 3) {
              (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
                // @ts-ignore
                xhr.getResponseHeader("set-cookie")
              );
            }
            if (4 !== xhr.readyState)
              return;
            if (200 === xhr.status || 1223 === xhr.status) {
              this._onLoad();
            } else {
              this.setTimeoutFn(() => {
                this._onError(typeof xhr.status === "number" ? xhr.status : 0);
              }, 0);
            }
          };
          xhr.send(this._data);
        } catch (e) {
          this.setTimeoutFn(() => {
            this._onError(e);
          }, 0);
          return;
        }
        if (typeof document !== "undefined") {
          this._index = _Request.requestsCount++;
          _Request.requests[this._index] = this;
        }
      }
      /**
       * Called upon error.
       *
       * @private
       */
      _onError(err) {
        this.emitReserved("error", err, this._xhr);
        this._cleanup(true);
      }
      /**
       * Cleans up house.
       *
       * @private
       */
      _cleanup(fromError) {
        if ("undefined" === typeof this._xhr || null === this._xhr) {
          return;
        }
        this._xhr.onreadystatechange = empty;
        if (fromError) {
          try {
            this._xhr.abort();
          } catch (e) {
          }
        }
        if (typeof document !== "undefined") {
          delete _Request.requests[this._index];
        }
        this._xhr = null;
      }
      /**
       * Called upon load.
       *
       * @private
       */
      _onLoad() {
        const data = this._xhr.responseText;
        if (data !== null) {
          this.emitReserved("data", data);
          this.emitReserved("success");
          this._cleanup();
        }
      }
      /**
       * Aborts the request.
       *
       * @package
       */
      abort() {
        this._cleanup();
      }
    };
    Request.requestsCount = 0;
    Request.requests = {};
    if (typeof document !== "undefined") {
      if (typeof attachEvent === "function") {
        attachEvent("onunload", unloadHandler);
      } else if (typeof addEventListener === "function") {
        const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
        addEventListener(terminationEvent, unloadHandler, false);
      }
    }
    hasXHR2 = (function() {
      const xhr = newRequest({
        xdomain: false
      });
      return xhr && xhr.responseType !== null;
    })();
    XHR = class extends BaseXHR {
      constructor(opts) {
        super(opts);
        const forceBase64 = opts && opts.forceBase64;
        this.supportsBinary = hasXHR2 && !forceBase64;
      }
      request(opts = {}) {
        Object.assign(opts, { xd: this.xd }, this.opts);
        return new Request(newRequest, this.uri(), opts);
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/transports/websocket.js
var isReactNative, BaseWS, WebSocketCtor, WS;
var init_websocket = __esm({
  "node_modules/engine.io-client/build/esm/transports/websocket.js"() {
    "use strict";
    init_transport();
    init_util();
    init_esm2();
    init_globals();
    isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
    BaseWS = class extends Transport {
      get name() {
        return "websocket";
      }
      doOpen() {
        const uri = this.uri();
        const protocols = this.opts.protocols;
        const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
          opts.headers = this.opts.extraHeaders;
        }
        try {
          this.ws = this.createSocket(uri, protocols, opts);
        } catch (err) {
          return this.emitReserved("error", err);
        }
        this.ws.binaryType = this.socket.binaryType;
        this.addEventListeners();
      }
      /**
       * Adds event listeners to the socket
       *
       * @private
       */
      addEventListeners() {
        this.ws.onopen = () => {
          if (this.opts.autoUnref) {
            this.ws._socket.unref();
          }
          this.onOpen();
        };
        this.ws.onclose = (closeEvent) => this.onClose({
          description: "websocket connection closed",
          context: closeEvent
        });
        this.ws.onmessage = (ev) => this.onData(ev.data);
        this.ws.onerror = (e) => this.onError("websocket error", e);
      }
      write(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
          const packet = packets[i];
          const lastPacket = i === packets.length - 1;
          encodePacket(packet, this.supportsBinary, (data) => {
            try {
              this.doWrite(packet, data);
            } catch (e) {
            }
            if (lastPacket) {
              nextTick(() => {
                this.writable = true;
                this.emitReserved("drain");
              }, this.setTimeoutFn);
            }
          });
        }
      }
      doClose() {
        if (typeof this.ws !== "undefined") {
          this.ws.onerror = () => {
          };
          this.ws.close();
          this.ws = null;
        }
      }
      /**
       * Generates uri for connection.
       *
       * @private
       */
      uri() {
        const schema = this.opts.secure ? "wss" : "ws";
        const query = this.query || {};
        if (this.opts.timestampRequests) {
          query[this.opts.timestampParam] = randomString();
        }
        if (!this.supportsBinary) {
          query.b64 = 1;
        }
        return this.createUri(schema, query);
      }
    };
    WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    WS = class extends BaseWS {
      createSocket(uri, protocols, opts) {
        return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
      }
      doWrite(_packet, data) {
        this.ws.send(data);
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/transports/webtransport.js
var WT;
var init_webtransport = __esm({
  "node_modules/engine.io-client/build/esm/transports/webtransport.js"() {
    "use strict";
    init_transport();
    init_globals();
    init_esm2();
    WT = class extends Transport {
      get name() {
        return "webtransport";
      }
      doOpen() {
        try {
          this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
        } catch (err) {
          return this.emitReserved("error", err);
        }
        this._transport.closed.then(() => {
          this.onClose();
        }).catch((err) => {
          this.onError("webtransport error", err);
        });
        this._transport.ready.then(() => {
          this._transport.createBidirectionalStream().then((stream) => {
            const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
            const reader = stream.readable.pipeThrough(decoderStream).getReader();
            const encoderStream = createPacketEncoderStream();
            encoderStream.readable.pipeTo(stream.writable);
            this._writer = encoderStream.writable.getWriter();
            const read = () => {
              reader.read().then(({ done, value: value2 }) => {
                if (done) {
                  return;
                }
                this.onPacket(value2);
                read();
              }).catch((err) => {
              });
            };
            read();
            const packet = { type: "open" };
            if (this.query.sid) {
              packet.data = `{"sid":"${this.query.sid}"}`;
            }
            this._writer.write(packet).then(() => this.onOpen());
          });
        });
      }
      write(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
          const packet = packets[i];
          const lastPacket = i === packets.length - 1;
          this._writer.write(packet).then(() => {
            if (lastPacket) {
              nextTick(() => {
                this.writable = true;
                this.emitReserved("drain");
              }, this.setTimeoutFn);
            }
          });
        }
      }
      doClose() {
        var _a;
        (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/transports/index.js
var transports;
var init_transports = __esm({
  "node_modules/engine.io-client/build/esm/transports/index.js"() {
    "use strict";
    init_polling_xhr();
    init_websocket();
    init_webtransport();
    transports = {
      websocket: WS,
      webtransport: WT,
      polling: XHR
    };
  }
});

// node_modules/engine.io-client/build/esm/contrib/parseuri.js
function parse(str) {
  if (str.length > 8e3) {
    throw "URI too long";
  }
  const src = str, b = str.indexOf("["), e = str.indexOf("]");
  if (b != -1 && e != -1) {
    str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
  }
  let m = re.exec(str || ""), uri = {}, i = 14;
  while (i--) {
    uri[parts[i]] = m[i] || "";
  }
  if (b != -1 && e != -1) {
    uri.source = src;
    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
    uri.ipv6uri = true;
  }
  uri.pathNames = pathNames(uri, uri["path"]);
  uri.queryKey = queryKey(uri, uri["query"]);
  return uri;
}
function pathNames(obj, path) {
  const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
  if (path.slice(0, 1) == "/" || path.length === 0) {
    names.splice(0, 1);
  }
  if (path.slice(-1) == "/") {
    names.splice(names.length - 1, 1);
  }
  return names;
}
function queryKey(uri, query) {
  const data = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
    if ($1) {
      data[$1] = $2;
    }
  });
  return data;
}
var re, parts;
var init_parseuri = __esm({
  "node_modules/engine.io-client/build/esm/contrib/parseuri.js"() {
    "use strict";
    re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    parts = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor"
    ];
  }
});

// node_modules/engine.io-client/build/esm/socket.js
var withEventListeners, OFFLINE_EVENT_LISTENERS, SocketWithoutUpgrade, SocketWithUpgrade, Socket;
var init_socket = __esm({
  "node_modules/engine.io-client/build/esm/socket.js"() {
    "use strict";
    init_transports();
    init_util();
    init_parseqs();
    init_parseuri();
    init_esm3();
    init_esm2();
    init_globals();
    withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
    OFFLINE_EVENT_LISTENERS = [];
    if (withEventListeners) {
      addEventListener("offline", () => {
        OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
      }, false);
    }
    SocketWithoutUpgrade = class _SocketWithoutUpgrade extends Emitter {
      /**
       * Socket constructor.
       *
       * @param {String|Object} uri - uri or options
       * @param {Object} opts - options
       */
      constructor(uri, opts) {
        super();
        this.binaryType = defaultBinaryType;
        this.writeBuffer = [];
        this._prevBufferLen = 0;
        this._pingInterval = -1;
        this._pingTimeout = -1;
        this._maxPayload = -1;
        this._pingTimeoutTime = Infinity;
        if (uri && "object" === typeof uri) {
          opts = uri;
          uri = null;
        }
        if (uri) {
          const parsedUri = parse(uri);
          opts.hostname = parsedUri.host;
          opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
          opts.port = parsedUri.port;
          if (parsedUri.query)
            opts.query = parsedUri.query;
        } else if (opts.host) {
          opts.hostname = parse(opts.host).host;
        }
        installTimerFunctions(this, opts);
        this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
        if (opts.hostname && !opts.port) {
          opts.port = this.secure ? "443" : "80";
        }
        this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
        this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
        this.transports = [];
        this._transportsByName = {};
        opts.transports.forEach((t) => {
          const transportName = t.prototype.name;
          this.transports.push(transportName);
          this._transportsByName[transportName] = t;
        });
        this.opts = Object.assign({
          path: "/engine.io",
          agent: false,
          withCredentials: false,
          upgrade: true,
          timestampParam: "t",
          rememberUpgrade: false,
          addTrailingSlash: true,
          rejectUnauthorized: true,
          perMessageDeflate: {
            threshold: 1024
          },
          transportOptions: {},
          closeOnBeforeunload: false
        }, opts);
        this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
        if (typeof this.opts.query === "string") {
          this.opts.query = decode2(this.opts.query);
        }
        if (withEventListeners) {
          if (this.opts.closeOnBeforeunload) {
            this._beforeunloadEventListener = () => {
              if (this.transport) {
                this.transport.removeAllListeners();
                this.transport.close();
              }
            };
            addEventListener("beforeunload", this._beforeunloadEventListener, false);
          }
          if (this.hostname !== "localhost") {
            this._offlineEventListener = () => {
              this._onClose("transport close", {
                description: "network connection lost"
              });
            };
            OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
          }
        }
        if (this.opts.withCredentials) {
          this._cookieJar = createCookieJar();
        }
        this._open();
      }
      /**
       * Creates transport of the given type.
       *
       * @param {String} name - transport name
       * @return {Transport}
       * @private
       */
      createTransport(name) {
        const query = Object.assign({}, this.opts.query);
        query.EIO = protocol;
        query.transport = name;
        if (this.id)
          query.sid = this.id;
        const opts = Object.assign({}, this.opts, {
          query,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port
        }, this.opts.transportOptions[name]);
        return new this._transportsByName[name](opts);
      }
      /**
       * Initializes transport to use and starts probe.
       *
       * @private
       */
      _open() {
        if (this.transports.length === 0) {
          this.setTimeoutFn(() => {
            this.emitReserved("error", "No transports available");
          }, 0);
          return;
        }
        const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
        this.readyState = "opening";
        const transport = this.createTransport(transportName);
        transport.open();
        this.setTransport(transport);
      }
      /**
       * Sets the current transport. Disables the existing one (if any).
       *
       * @private
       */
      setTransport(transport) {
        if (this.transport) {
          this.transport.removeAllListeners();
        }
        this.transport = transport;
        transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
      }
      /**
       * Called when connection is deemed open.
       *
       * @private
       */
      onOpen() {
        this.readyState = "open";
        _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush();
      }
      /**
       * Handles a packet.
       *
       * @private
       */
      _onPacket(packet) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          this.emitReserved("packet", packet);
          this.emitReserved("heartbeat");
          switch (packet.type) {
            case "open":
              this.onHandshake(JSON.parse(packet.data));
              break;
            case "ping":
              this._sendPacket("pong");
              this.emitReserved("ping");
              this.emitReserved("pong");
              this._resetPingTimeout();
              break;
            case "error":
              const err = new Error("server error");
              err.code = packet.data;
              this._onError(err);
              break;
            case "message":
              this.emitReserved("data", packet.data);
              this.emitReserved("message", packet.data);
              break;
          }
        } else {
        }
      }
      /**
       * Called upon handshake completion.
       *
       * @param {Object} data - handshake obj
       * @private
       */
      onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this._pingInterval = data.pingInterval;
        this._pingTimeout = data.pingTimeout;
        this._maxPayload = data.maxPayload;
        this.onOpen();
        if ("closed" === this.readyState)
          return;
        this._resetPingTimeout();
      }
      /**
       * Sets and resets ping timeout timer based on server pings.
       *
       * @private
       */
      _resetPingTimeout() {
        this.clearTimeoutFn(this._pingTimeoutTimer);
        const delay2 = this._pingInterval + this._pingTimeout;
        this._pingTimeoutTime = Date.now() + delay2;
        this._pingTimeoutTimer = this.setTimeoutFn(() => {
          this._onClose("ping timeout");
        }, delay2);
        if (this.opts.autoUnref) {
          this._pingTimeoutTimer.unref();
        }
      }
      /**
       * Called on `drain` event
       *
       * @private
       */
      _onDrain() {
        this.writeBuffer.splice(0, this._prevBufferLen);
        this._prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
          this.emitReserved("drain");
        } else {
          this.flush();
        }
      }
      /**
       * Flush write buffers.
       *
       * @private
       */
      flush() {
        if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
          const packets = this._getWritablePackets();
          this.transport.send(packets);
          this._prevBufferLen = packets.length;
          this.emitReserved("flush");
        }
      }
      /**
       * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
       * long-polling)
       *
       * @private
       */
      _getWritablePackets() {
        const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
        if (!shouldCheckPayloadSize) {
          return this.writeBuffer;
        }
        let payloadSize = 1;
        for (let i = 0; i < this.writeBuffer.length; i++) {
          const data = this.writeBuffer[i].data;
          if (data) {
            payloadSize += byteLength(data);
          }
          if (i > 0 && payloadSize > this._maxPayload) {
            return this.writeBuffer.slice(0, i);
          }
          payloadSize += 2;
        }
        return this.writeBuffer;
      }
      /**
       * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
       *
       * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
       * `write()` method then the message would not be buffered by the Socket.IO client.
       *
       * @return {boolean}
       * @private
       */
      /* private */
      _hasPingExpired() {
        if (!this._pingTimeoutTime)
          return true;
        const hasExpired = Date.now() > this._pingTimeoutTime;
        if (hasExpired) {
          this._pingTimeoutTime = 0;
          nextTick(() => {
            this._onClose("ping timeout");
          }, this.setTimeoutFn);
        }
        return hasExpired;
      }
      /**
       * Sends a message.
       *
       * @param {String} msg - message.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @return {Socket} for chaining.
       */
      write(msg, options, fn) {
        this._sendPacket("message", msg, options, fn);
        return this;
      }
      /**
       * Sends a message. Alias of {@link Socket#write}.
       *
       * @param {String} msg - message.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @return {Socket} for chaining.
       */
      send(msg, options, fn) {
        this._sendPacket("message", msg, options, fn);
        return this;
      }
      /**
       * Sends a packet.
       *
       * @param {String} type: packet type.
       * @param {String} data.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @private
       */
      _sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
          fn = data;
          data = void 0;
        }
        if ("function" === typeof options) {
          fn = options;
          options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
          return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        const packet = {
          type,
          data,
          options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn)
          this.once("flush", fn);
        this.flush();
      }
      /**
       * Closes the connection.
       */
      close() {
        const close = () => {
          this._onClose("forced close");
          this.transport.close();
        };
        const cleanupAndClose = () => {
          this.off("upgrade", cleanupAndClose);
          this.off("upgradeError", cleanupAndClose);
          close();
        };
        const waitForUpgrade = () => {
          this.once("upgrade", cleanupAndClose);
          this.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
          this.readyState = "closing";
          if (this.writeBuffer.length) {
            this.once("drain", () => {
              if (this.upgrading) {
                waitForUpgrade();
              } else {
                close();
              }
            });
          } else if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        }
        return this;
      }
      /**
       * Called upon transport error
       *
       * @private
       */
      _onError(err) {
        _SocketWithoutUpgrade.priorWebsocketSuccess = false;
        if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
          this.transports.shift();
          return this._open();
        }
        this.emitReserved("error", err);
        this._onClose("transport error", err);
      }
      /**
       * Called upon transport close.
       *
       * @private
       */
      _onClose(reason, description) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          this.clearTimeoutFn(this._pingTimeoutTimer);
          this.transport.removeAllListeners("close");
          this.transport.close();
          this.transport.removeAllListeners();
          if (withEventListeners) {
            if (this._beforeunloadEventListener) {
              removeEventListener("beforeunload", this._beforeunloadEventListener, false);
            }
            if (this._offlineEventListener) {
              const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
              if (i !== -1) {
                OFFLINE_EVENT_LISTENERS.splice(i, 1);
              }
            }
          }
          this.readyState = "closed";
          this.id = null;
          this.emitReserved("close", reason, description);
          this.writeBuffer = [];
          this._prevBufferLen = 0;
        }
      }
    };
    SocketWithoutUpgrade.protocol = protocol;
    SocketWithUpgrade = class extends SocketWithoutUpgrade {
      constructor() {
        super(...arguments);
        this._upgrades = [];
      }
      onOpen() {
        super.onOpen();
        if ("open" === this.readyState && this.opts.upgrade) {
          for (let i = 0; i < this._upgrades.length; i++) {
            this._probe(this._upgrades[i]);
          }
        }
      }
      /**
       * Probes a transport.
       *
       * @param {String} name - transport name
       * @private
       */
      _probe(name) {
        let transport = this.createTransport(name);
        let failed = false;
        SocketWithoutUpgrade.priorWebsocketSuccess = false;
        const onTransportOpen = () => {
          if (failed)
            return;
          transport.send([{ type: "ping", data: "probe" }]);
          transport.once("packet", (msg) => {
            if (failed)
              return;
            if ("pong" === msg.type && "probe" === msg.data) {
              this.upgrading = true;
              this.emitReserved("upgrading", transport);
              if (!transport)
                return;
              SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
              this.transport.pause(() => {
                if (failed)
                  return;
                if ("closed" === this.readyState)
                  return;
                cleanup();
                this.setTransport(transport);
                transport.send([{ type: "upgrade" }]);
                this.emitReserved("upgrade", transport);
                transport = null;
                this.upgrading = false;
                this.flush();
              });
            } else {
              const err = new Error("probe error");
              err.transport = transport.name;
              this.emitReserved("upgradeError", err);
            }
          });
        };
        function freezeTransport() {
          if (failed)
            return;
          failed = true;
          cleanup();
          transport.close();
          transport = null;
        }
        const onerror = (err) => {
          const error = new Error("probe error: " + err);
          error.transport = transport.name;
          freezeTransport();
          this.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
          onerror("transport closed");
        }
        function onclose() {
          onerror("socket closed");
        }
        function onupgrade(to) {
          if (transport && to.name !== transport.name) {
            freezeTransport();
          }
        }
        const cleanup = () => {
          transport.removeListener("open", onTransportOpen);
          transport.removeListener("error", onerror);
          transport.removeListener("close", onTransportClose);
          this.off("close", onclose);
          this.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
          this.setTimeoutFn(() => {
            if (!failed) {
              transport.open();
            }
          }, 200);
        } else {
          transport.open();
        }
      }
      onHandshake(data) {
        this._upgrades = this._filterUpgrades(data.upgrades);
        super.onHandshake(data);
      }
      /**
       * Filters upgrades, returning only those matching client transports.
       *
       * @param {Array} upgrades - server upgrades
       * @private
       */
      _filterUpgrades(upgrades) {
        const filteredUpgrades = [];
        for (let i = 0; i < upgrades.length; i++) {
          if (~this.transports.indexOf(upgrades[i]))
            filteredUpgrades.push(upgrades[i]);
        }
        return filteredUpgrades;
      }
    };
    Socket = class extends SocketWithUpgrade {
      constructor(uri, opts = {}) {
        const o = typeof uri === "object" ? uri : opts;
        if (!o.transports || o.transports && typeof o.transports[0] === "string") {
          o.transports = (o.transports || ["polling", "websocket", "webtransport"]).map((transportName) => transports[transportName]).filter((t) => !!t);
        }
        super(uri, o);
      }
    };
  }
});

// node_modules/engine.io-client/build/esm/transports/polling-fetch.js
var init_polling_fetch = __esm({
  "node_modules/engine.io-client/build/esm/transports/polling-fetch.js"() {
    "use strict";
    init_polling();
  }
});

// node_modules/engine.io-client/build/esm/index.js
var protocol2;
var init_esm4 = __esm({
  "node_modules/engine.io-client/build/esm/index.js"() {
    "use strict";
    init_socket();
    init_socket();
    init_transport();
    init_transports();
    init_util();
    init_parseuri();
    init_globals();
    init_polling_fetch();
    init_polling_xhr();
    init_polling_xhr();
    init_websocket();
    init_websocket();
    init_webtransport();
    protocol2 = Socket.protocol;
  }
});

// node_modules/socket.io-client/build/esm/url.js
function url(uri, path = "", loc) {
  let obj = uri;
  loc = loc || typeof location !== "undefined" && location;
  if (null == uri)
    uri = loc.protocol + "//" + loc.host;
  if (typeof uri === "string") {
    if ("/" === uri.charAt(0)) {
      if ("/" === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }
    if (!/^(https?|wss?):\/\//.test(uri)) {
      if ("undefined" !== typeof loc) {
        uri = loc.protocol + "//" + uri;
      } else {
        uri = "https://" + uri;
      }
    }
    obj = parse(uri);
  }
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = "80";
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = "443";
    }
  }
  obj.path = obj.path || "/";
  const ipv6 = obj.host.indexOf(":") !== -1;
  const host = ipv6 ? "[" + obj.host + "]" : obj.host;
  obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
  obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
  return obj;
}
var init_url = __esm({
  "node_modules/socket.io-client/build/esm/url.js"() {
    "use strict";
    init_esm4();
  }
});

// node_modules/socket.io-parser/build/esm/is-binary.js
function isBinary(obj) {
  return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }
  if (isBinary(obj)) {
    return true;
  }
  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }
  return false;
}
var withNativeArrayBuffer3, isView2, toString, withNativeBlob2, withNativeFile;
var init_is_binary = __esm({
  "node_modules/socket.io-parser/build/esm/is-binary.js"() {
    "use strict";
    withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
    isView2 = (obj) => {
      return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
    };
    toString = Object.prototype.toString;
    withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
    withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
  }
});

// node_modules/socket.io-parser/build/esm/binary.js
function deconstructPacket(packet) {
  const buffers = [];
  const packetData = packet.data;
  const pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length;
  return { packet: pack, buffers };
}
function _deconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (isBinary(data)) {
    const placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    const newData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === "object" && !(data instanceof Date)) {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
    }
    return newData;
  }
  return data;
}
function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  delete packet.attachments;
  return packet;
}
function _reconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (data && data._placeholder === true) {
    const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
    if (isIndexValid) {
      return buffers[data.num];
    } else {
      throw new Error("illegal attachments");
    }
  } else if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === "object") {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }
  return data;
}
var init_binary = __esm({
  "node_modules/socket.io-parser/build/esm/binary.js"() {
    "use strict";
    init_is_binary();
  }
});

// node_modules/socket.io-parser/build/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  Decoder: () => Decoder,
  Encoder: () => Encoder,
  PacketType: () => PacketType,
  protocol: () => protocol3
});
function isObject(value2) {
  return Object.prototype.toString.call(value2) === "[object Object]";
}
var RESERVED_EVENTS, protocol3, PacketType, Encoder, Decoder, BinaryReconstructor;
var init_esm5 = __esm({
  "node_modules/socket.io-parser/build/esm/index.js"() {
    "use strict";
    init_esm3();
    init_binary();
    init_is_binary();
    RESERVED_EVENTS = [
      "connect",
      "connect_error",
      "disconnect",
      "disconnecting",
      "newListener",
      "removeListener"
      // used by the Node.js EventEmitter
    ];
    protocol3 = 5;
    (function(PacketType2) {
      PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
      PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
      PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
      PacketType2[PacketType2["ACK"] = 3] = "ACK";
      PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
      PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
      PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    Encoder = class {
      /**
       * Encoder constructor
       *
       * @param {function} replacer - custom replacer to pass down to JSON.parse
       */
      constructor(replacer) {
        this.replacer = replacer;
      }
      /**
       * Encode a packet as a single string if non-binary, or as a
       * buffer sequence, depending on packet type.
       *
       * @param {Object} obj - packet object
       */
      encode(obj) {
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
          if (hasBinary(obj)) {
            return this.encodeAsBinary({
              type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
              nsp: obj.nsp,
              data: obj.data,
              id: obj.id
            });
          }
        }
        return [this.encodeAsString(obj)];
      }
      /**
       * Encode packet as string.
       */
      encodeAsString(obj) {
        let str = "" + obj.type;
        if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
          str += obj.attachments + "-";
        }
        if (obj.nsp && "/" !== obj.nsp) {
          str += obj.nsp + ",";
        }
        if (null != obj.id) {
          str += obj.id;
        }
        if (null != obj.data) {
          str += JSON.stringify(obj.data, this.replacer);
        }
        return str;
      }
      /**
       * Encode packet as 'buffer sequence' by removing blobs, and
       * deconstructing packet into object with placeholders and
       * a list of buffers.
       */
      encodeAsBinary(obj) {
        const deconstruction = deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack);
        return buffers;
      }
    };
    Decoder = class _Decoder extends Emitter {
      /**
       * Decoder constructor
       *
       * @param {function} reviver - custom reviver to pass down to JSON.stringify
       */
      constructor(reviver) {
        super();
        this.reviver = reviver;
      }
      /**
       * Decodes an encoded packet string into packet JSON.
       *
       * @param {String} obj - encoded packet
       */
      add(obj) {
        let packet;
        if (typeof obj === "string") {
          if (this.reconstructor) {
            throw new Error("got plaintext data when reconstructing a packet");
          }
          packet = this.decodeString(obj);
          const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
          if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
            packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
            this.reconstructor = new BinaryReconstructor(packet);
            if (packet.attachments === 0) {
              super.emitReserved("decoded", packet);
            }
          } else {
            super.emitReserved("decoded", packet);
          }
        } else if (isBinary(obj) || obj.base64) {
          if (!this.reconstructor) {
            throw new Error("got binary data when not reconstructing a packet");
          } else {
            packet = this.reconstructor.takeBinaryData(obj);
            if (packet) {
              this.reconstructor = null;
              super.emitReserved("decoded", packet);
            }
          }
        } else {
          throw new Error("Unknown type: " + obj);
        }
      }
      /**
       * Decode a packet String (JSON data)
       *
       * @param {String} str
       * @return {Object} packet
       */
      decodeString(str) {
        let i = 0;
        const p = {
          type: Number(str.charAt(0))
        };
        if (PacketType[p.type] === void 0) {
          throw new Error("unknown packet type " + p.type);
        }
        if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
          const start = i + 1;
          while (str.charAt(++i) !== "-" && i != str.length) {
          }
          const buf = str.substring(start, i);
          if (buf != Number(buf) || str.charAt(i) !== "-") {
            throw new Error("Illegal attachments");
          }
          p.attachments = Number(buf);
        }
        if ("/" === str.charAt(i + 1)) {
          const start = i + 1;
          while (++i) {
            const c = str.charAt(i);
            if ("," === c)
              break;
            if (i === str.length)
              break;
          }
          p.nsp = str.substring(start, i);
        } else {
          p.nsp = "/";
        }
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
          const start = i + 1;
          while (++i) {
            const c = str.charAt(i);
            if (null == c || Number(c) != c) {
              --i;
              break;
            }
            if (i === str.length)
              break;
          }
          p.id = Number(str.substring(start, i + 1));
        }
        if (str.charAt(++i)) {
          const payload = this.tryParse(str.substr(i));
          if (_Decoder.isPayloadValid(p.type, payload)) {
            p.data = payload;
          } else {
            throw new Error("invalid payload");
          }
        }
        return p;
      }
      tryParse(str) {
        try {
          return JSON.parse(str, this.reviver);
        } catch (e) {
          return false;
        }
      }
      static isPayloadValid(type, payload) {
        switch (type) {
          case PacketType.CONNECT:
            return isObject(payload);
          case PacketType.DISCONNECT:
            return payload === void 0;
          case PacketType.CONNECT_ERROR:
            return typeof payload === "string" || isObject(payload);
          case PacketType.EVENT:
          case PacketType.BINARY_EVENT:
            return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
          case PacketType.ACK:
          case PacketType.BINARY_ACK:
            return Array.isArray(payload);
        }
      }
      /**
       * Deallocates a parser's resources
       */
      destroy() {
        if (this.reconstructor) {
          this.reconstructor.finishedReconstruction();
          this.reconstructor = null;
        }
      }
    };
    BinaryReconstructor = class {
      constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
      }
      /**
       * Method to be called when binary data received from connection
       * after a BINARY_EVENT packet.
       *
       * @param {Buffer | ArrayBuffer} binData - the raw binary data received
       * @return {null | Object} returns null if more binary data is expected or
       *   a reconstructed packet object if all buffers have been received.
       */
      takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
          const packet = reconstructPacket(this.reconPack, this.buffers);
          this.finishedReconstruction();
          return packet;
        }
        return null;
      }
      /**
       * Cleans up binary packet reconstruction variables.
       */
      finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
      }
    };
  }
});

// node_modules/socket.io-client/build/esm/on.js
function on(obj, ev, fn) {
  obj.on(ev, fn);
  return function subDestroy() {
    obj.off(ev, fn);
  };
}
var init_on = __esm({
  "node_modules/socket.io-client/build/esm/on.js"() {
    "use strict";
  }
});

// node_modules/socket.io-client/build/esm/socket.js
var RESERVED_EVENTS2, Socket2;
var init_socket2 = __esm({
  "node_modules/socket.io-client/build/esm/socket.js"() {
    "use strict";
    init_esm5();
    init_on();
    init_esm3();
    RESERVED_EVENTS2 = Object.freeze({
      connect: 1,
      connect_error: 1,
      disconnect: 1,
      disconnecting: 1,
      // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
      newListener: 1,
      removeListener: 1
    });
    Socket2 = class extends Emitter {
      /**
       * `Socket` constructor.
       */
      constructor(io, nsp, opts) {
        super();
        this.connected = false;
        this.recovered = false;
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this._queue = [];
        this._queueSeq = 0;
        this.ids = 0;
        this.acks = {};
        this.flags = {};
        this.io = io;
        this.nsp = nsp;
        if (opts && opts.auth) {
          this.auth = opts.auth;
        }
        this._opts = Object.assign({}, opts);
        if (this.io._autoConnect)
          this.open();
      }
      /**
       * Whether the socket is currently disconnected
       *
       * @example
       * const socket = io();
       *
       * socket.on("connect", () => {
       *   console.log(socket.disconnected); // false
       * });
       *
       * socket.on("disconnect", () => {
       *   console.log(socket.disconnected); // true
       * });
       */
      get disconnected() {
        return !this.connected;
      }
      /**
       * Subscribe to open, close and packet events
       *
       * @private
       */
      subEvents() {
        if (this.subs)
          return;
        const io = this.io;
        this.subs = [
          on(io, "open", this.onopen.bind(this)),
          on(io, "packet", this.onpacket.bind(this)),
          on(io, "error", this.onerror.bind(this)),
          on(io, "close", this.onclose.bind(this))
        ];
      }
      /**
       * Whether the Socket will try to reconnect when its Manager connects or reconnects.
       *
       * @example
       * const socket = io();
       *
       * console.log(socket.active); // true
       *
       * socket.on("disconnect", (reason) => {
       *   if (reason === "io server disconnect") {
       *     // the disconnection was initiated by the server, you need to manually reconnect
       *     console.log(socket.active); // false
       *   }
       *   // else the socket will automatically try to reconnect
       *   console.log(socket.active); // true
       * });
       */
      get active() {
        return !!this.subs;
      }
      /**
       * "Opens" the socket.
       *
       * @example
       * const socket = io({
       *   autoConnect: false
       * });
       *
       * socket.connect();
       */
      connect() {
        if (this.connected)
          return this;
        this.subEvents();
        if (!this.io["_reconnecting"])
          this.io.open();
        if ("open" === this.io._readyState)
          this.onopen();
        return this;
      }
      /**
       * Alias for {@link connect()}.
       */
      open() {
        return this.connect();
      }
      /**
       * Sends a `message` event.
       *
       * This method mimics the WebSocket.send() method.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
       *
       * @example
       * socket.send("hello");
       *
       * // this is equivalent to
       * socket.emit("message", "hello");
       *
       * @return self
       */
      send(...args) {
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
      }
      /**
       * Override `emit`.
       * If the event is in `events`, it's emitted normally.
       *
       * @example
       * socket.emit("hello", "world");
       *
       * // all serializable datastructures are supported (no need to call JSON.stringify)
       * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
       *
       * // with an acknowledgement from the server
       * socket.emit("hello", "world", (val) => {
       *   // ...
       * });
       *
       * @return self
       */
      emit(ev, ...args) {
        var _a, _b, _c;
        if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
          throw new Error('"' + ev.toString() + '" is a reserved event name');
        }
        args.unshift(ev);
        if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
          this._addToQueue(args);
          return this;
        }
        const packet = {
          type: PacketType.EVENT,
          data: args
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false;
        if ("function" === typeof args[args.length - 1]) {
          const id = this.ids++;
          const ack = args.pop();
          this._registerAckCallback(id, ack);
          packet.id = id;
        }
        const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
        const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
        const discardPacket = this.flags.volatile && !isTransportWritable;
        if (discardPacket) {
        } else if (isConnected) {
          this.notifyOutgoingListeners(packet);
          this.packet(packet);
        } else {
          this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
      }
      /**
       * @private
       */
      _registerAckCallback(id, ack) {
        var _a;
        const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
        if (timeout === void 0) {
          this.acks[id] = ack;
          return;
        }
        const timer = this.io.setTimeoutFn(() => {
          delete this.acks[id];
          for (let i = 0; i < this.sendBuffer.length; i++) {
            if (this.sendBuffer[i].id === id) {
              this.sendBuffer.splice(i, 1);
            }
          }
          ack.call(this, new Error("operation has timed out"));
        }, timeout);
        const fn = (...args) => {
          this.io.clearTimeoutFn(timer);
          ack.apply(this, args);
        };
        fn.withError = true;
        this.acks[id] = fn;
      }
      /**
       * Emits an event and waits for an acknowledgement
       *
       * @example
       * // without timeout
       * const response = await socket.emitWithAck("hello", "world");
       *
       * // with a specific timeout
       * try {
       *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
       * } catch (err) {
       *   // the server did not acknowledge the event in the given delay
       * }
       *
       * @return a Promise that will be fulfilled when the server acknowledges the event
       */
      emitWithAck(ev, ...args) {
        return new Promise((resolve, reject) => {
          const fn = (arg1, arg2) => {
            return arg1 ? reject(arg1) : resolve(arg2);
          };
          fn.withError = true;
          args.push(fn);
          this.emit(ev, ...args);
        });
      }
      /**
       * Add the packet to the queue.
       * @param args
       * @private
       */
      _addToQueue(args) {
        let ack;
        if (typeof args[args.length - 1] === "function") {
          ack = args.pop();
        }
        const packet = {
          id: this._queueSeq++,
          tryCount: 0,
          pending: false,
          args,
          flags: Object.assign({ fromQueue: true }, this.flags)
        };
        args.push((err, ...responseArgs) => {
          if (packet !== this._queue[0]) {
            return;
          }
          const hasError = err !== null;
          if (hasError) {
            if (packet.tryCount > this._opts.retries) {
              this._queue.shift();
              if (ack) {
                ack(err);
              }
            }
          } else {
            this._queue.shift();
            if (ack) {
              ack(null, ...responseArgs);
            }
          }
          packet.pending = false;
          return this._drainQueue();
        });
        this._queue.push(packet);
        this._drainQueue();
      }
      /**
       * Send the first packet of the queue, and wait for an acknowledgement from the server.
       * @param force - whether to resend a packet that has not been acknowledged yet
       *
       * @private
       */
      _drainQueue(force = false) {
        if (!this.connected || this._queue.length === 0) {
          return;
        }
        const packet = this._queue[0];
        if (packet.pending && !force) {
          return;
        }
        packet.pending = true;
        packet.tryCount++;
        this.flags = packet.flags;
        this.emit.apply(this, packet.args);
      }
      /**
       * Sends a packet.
       *
       * @param packet
       * @private
       */
      packet(packet) {
        packet.nsp = this.nsp;
        this.io._packet(packet);
      }
      /**
       * Called upon engine `open`.
       *
       * @private
       */
      onopen() {
        if (typeof this.auth == "function") {
          this.auth((data) => {
            this._sendConnectPacket(data);
          });
        } else {
          this._sendConnectPacket(this.auth);
        }
      }
      /**
       * Sends a CONNECT packet to initiate the Socket.IO session.
       *
       * @param data
       * @private
       */
      _sendConnectPacket(data) {
        this.packet({
          type: PacketType.CONNECT,
          data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
        });
      }
      /**
       * Called upon engine or manager `error`.
       *
       * @param err
       * @private
       */
      onerror(err) {
        if (!this.connected) {
          this.emitReserved("connect_error", err);
        }
      }
      /**
       * Called upon engine `close`.
       *
       * @param reason
       * @param description
       * @private
       */
      onclose(reason, description) {
        this.connected = false;
        delete this.id;
        this.emitReserved("disconnect", reason, description);
        this._clearAcks();
      }
      /**
       * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
       * the server.
       *
       * @private
       */
      _clearAcks() {
        Object.keys(this.acks).forEach((id) => {
          const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
          if (!isBuffered) {
            const ack = this.acks[id];
            delete this.acks[id];
            if (ack.withError) {
              ack.call(this, new Error("socket has been disconnected"));
            }
          }
        });
      }
      /**
       * Called with socket packet.
       *
       * @param packet
       * @private
       */
      onpacket(packet) {
        const sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace)
          return;
        switch (packet.type) {
          case PacketType.CONNECT:
            if (packet.data && packet.data.sid) {
              this.onconnect(packet.data.sid, packet.data.pid);
            } else {
              this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
            }
            break;
          case PacketType.EVENT:
          case PacketType.BINARY_EVENT:
            this.onevent(packet);
            break;
          case PacketType.ACK:
          case PacketType.BINARY_ACK:
            this.onack(packet);
            break;
          case PacketType.DISCONNECT:
            this.ondisconnect();
            break;
          case PacketType.CONNECT_ERROR:
            this.destroy();
            const err = new Error(packet.data.message);
            err.data = packet.data.data;
            this.emitReserved("connect_error", err);
            break;
        }
      }
      /**
       * Called upon a server event.
       *
       * @param packet
       * @private
       */
      onevent(packet) {
        const args = packet.data || [];
        if (null != packet.id) {
          args.push(this.ack(packet.id));
        }
        if (this.connected) {
          this.emitEvent(args);
        } else {
          this.receiveBuffer.push(Object.freeze(args));
        }
      }
      emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
          const listeners = this._anyListeners.slice();
          for (const listener of listeners) {
            listener.apply(this, args);
          }
        }
        super.emit.apply(this, args);
        if (this._pid && args.length && typeof args[args.length - 1] === "string") {
          this._lastOffset = args[args.length - 1];
        }
      }
      /**
       * Produces an ack callback to emit with an event.
       *
       * @private
       */
      ack(id) {
        const self2 = this;
        let sent = false;
        return function(...args) {
          if (sent)
            return;
          sent = true;
          self2.packet({
            type: PacketType.ACK,
            id,
            data: args
          });
        };
      }
      /**
       * Called upon a server acknowledgement.
       *
       * @param packet
       * @private
       */
      onack(packet) {
        const ack = this.acks[packet.id];
        if (typeof ack !== "function") {
          return;
        }
        delete this.acks[packet.id];
        if (ack.withError) {
          packet.data.unshift(null);
        }
        ack.apply(this, packet.data);
      }
      /**
       * Called upon server connect.
       *
       * @private
       */
      onconnect(id, pid) {
        this.id = id;
        this.recovered = pid && this._pid === pid;
        this._pid = pid;
        this.connected = true;
        this.emitBuffered();
        this.emitReserved("connect");
        this._drainQueue(true);
      }
      /**
       * Emit buffered events (received and emitted).
       *
       * @private
       */
      emitBuffered() {
        this.receiveBuffer.forEach((args) => this.emitEvent(args));
        this.receiveBuffer = [];
        this.sendBuffer.forEach((packet) => {
          this.notifyOutgoingListeners(packet);
          this.packet(packet);
        });
        this.sendBuffer = [];
      }
      /**
       * Called upon server disconnect.
       *
       * @private
       */
      ondisconnect() {
        this.destroy();
        this.onclose("io server disconnect");
      }
      /**
       * Called upon forced client/server side disconnections,
       * this method ensures the manager stops tracking us and
       * that reconnections don't get triggered for this.
       *
       * @private
       */
      destroy() {
        if (this.subs) {
          this.subs.forEach((subDestroy) => subDestroy());
          this.subs = void 0;
        }
        this.io["_destroy"](this);
      }
      /**
       * Disconnects the socket manually. In that case, the socket will not try to reconnect.
       *
       * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
       *
       * @example
       * const socket = io();
       *
       * socket.on("disconnect", (reason) => {
       *   // console.log(reason); prints "io client disconnect"
       * });
       *
       * socket.disconnect();
       *
       * @return self
       */
      disconnect() {
        if (this.connected) {
          this.packet({ type: PacketType.DISCONNECT });
        }
        this.destroy();
        if (this.connected) {
          this.onclose("io client disconnect");
        }
        return this;
      }
      /**
       * Alias for {@link disconnect()}.
       *
       * @return self
       */
      close() {
        return this.disconnect();
      }
      /**
       * Sets the compress flag.
       *
       * @example
       * socket.compress(false).emit("hello");
       *
       * @param compress - if `true`, compresses the sending data
       * @return self
       */
      compress(compress) {
        this.flags.compress = compress;
        return this;
      }
      /**
       * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
       * ready to send messages.
       *
       * @example
       * socket.volatile.emit("hello"); // the server may or may not receive it
       *
       * @returns self
       */
      get volatile() {
        this.flags.volatile = true;
        return this;
      }
      /**
       * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
       * given number of milliseconds have elapsed without an acknowledgement from the server:
       *
       * @example
       * socket.timeout(5000).emit("my-event", (err) => {
       *   if (err) {
       *     // the server did not acknowledge the event in the given delay
       *   }
       * });
       *
       * @returns self
       */
      timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback.
       *
       * @example
       * socket.onAny((event, ...args) => {
       *   console.log(`got ${event}`);
       * });
       *
       * @param listener
       */
      onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback. The listener is added to the beginning of the listeners array.
       *
       * @example
       * socket.prependAny((event, ...args) => {
       *   console.log(`got event ${event}`);
       * });
       *
       * @param listener
       */
      prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
      }
      /**
       * Removes the listener that will be fired when any event is emitted.
       *
       * @example
       * const catchAllListener = (event, ...args) => {
       *   console.log(`got event ${event}`);
       * }
       *
       * socket.onAny(catchAllListener);
       *
       * // remove a specific listener
       * socket.offAny(catchAllListener);
       *
       * // or remove all listeners
       * socket.offAny();
       *
       * @param listener
       */
      offAny(listener) {
        if (!this._anyListeners) {
          return this;
        }
        if (listener) {
          const listeners = this._anyListeners;
          for (let i = 0; i < listeners.length; i++) {
            if (listener === listeners[i]) {
              listeners.splice(i, 1);
              return this;
            }
          }
        } else {
          this._anyListeners = [];
        }
        return this;
      }
      /**
       * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
       * e.g. to remove listeners.
       */
      listenersAny() {
        return this._anyListeners || [];
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback.
       *
       * Note: acknowledgements sent to the server are not included.
       *
       * @example
       * socket.onAnyOutgoing((event, ...args) => {
       *   console.log(`sent event ${event}`);
       * });
       *
       * @param listener
       */
      onAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.push(listener);
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback. The listener is added to the beginning of the listeners array.
       *
       * Note: acknowledgements sent to the server are not included.
       *
       * @example
       * socket.prependAnyOutgoing((event, ...args) => {
       *   console.log(`sent event ${event}`);
       * });
       *
       * @param listener
       */
      prependAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.unshift(listener);
        return this;
      }
      /**
       * Removes the listener that will be fired when any event is emitted.
       *
       * @example
       * const catchAllListener = (event, ...args) => {
       *   console.log(`sent event ${event}`);
       * }
       *
       * socket.onAnyOutgoing(catchAllListener);
       *
       * // remove a specific listener
       * socket.offAnyOutgoing(catchAllListener);
       *
       * // or remove all listeners
       * socket.offAnyOutgoing();
       *
       * @param [listener] - the catch-all listener (optional)
       */
      offAnyOutgoing(listener) {
        if (!this._anyOutgoingListeners) {
          return this;
        }
        if (listener) {
          const listeners = this._anyOutgoingListeners;
          for (let i = 0; i < listeners.length; i++) {
            if (listener === listeners[i]) {
              listeners.splice(i, 1);
              return this;
            }
          }
        } else {
          this._anyOutgoingListeners = [];
        }
        return this;
      }
      /**
       * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
       * e.g. to remove listeners.
       */
      listenersAnyOutgoing() {
        return this._anyOutgoingListeners || [];
      }
      /**
       * Notify the listeners for each packet sent
       *
       * @param packet
       *
       * @private
       */
      notifyOutgoingListeners(packet) {
        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
          const listeners = this._anyOutgoingListeners.slice();
          for (const listener of listeners) {
            listener.apply(this, packet.data);
          }
        }
      }
    };
  }
});

// node_modules/socket.io-client/build/esm/contrib/backo2.js
function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 1e4;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}
var init_backo2 = __esm({
  "node_modules/socket.io-client/build/esm/contrib/backo2.js"() {
    "use strict";
    Backoff.prototype.duration = function() {
      var ms = this.ms * Math.pow(this.factor, this.attempts++);
      if (this.jitter) {
        var rand = Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
      }
      return Math.min(ms, this.max) | 0;
    };
    Backoff.prototype.reset = function() {
      this.attempts = 0;
    };
    Backoff.prototype.setMin = function(min) {
      this.ms = min;
    };
    Backoff.prototype.setMax = function(max) {
      this.max = max;
    };
    Backoff.prototype.setJitter = function(jitter) {
      this.jitter = jitter;
    };
  }
});

// node_modules/socket.io-client/build/esm/manager.js
var Manager;
var init_manager = __esm({
  "node_modules/socket.io-client/build/esm/manager.js"() {
    "use strict";
    init_esm4();
    init_socket2();
    init_esm5();
    init_on();
    init_backo2();
    init_esm3();
    Manager = class extends Emitter {
      constructor(uri, opts) {
        var _a;
        super();
        this.nsps = {};
        this.subs = [];
        if (uri && "object" === typeof uri) {
          opts = uri;
          uri = void 0;
        }
        opts = opts || {};
        opts.path = opts.path || "/socket.io";
        this.opts = opts;
        installTimerFunctions(this, opts);
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1e3);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
        this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
        this.backoff = new Backoff({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor()
        });
        this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
        this._readyState = "closed";
        this.uri = uri;
        const _parser = opts.parser || esm_exports;
        this.encoder = new _parser.Encoder();
        this.decoder = new _parser.Decoder();
        this._autoConnect = opts.autoConnect !== false;
        if (this._autoConnect)
          this.open();
      }
      reconnection(v) {
        if (!arguments.length)
          return this._reconnection;
        this._reconnection = !!v;
        if (!v) {
          this.skipReconnect = true;
        }
        return this;
      }
      reconnectionAttempts(v) {
        if (v === void 0)
          return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
      }
      reconnectionDelay(v) {
        var _a;
        if (v === void 0)
          return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
      }
      randomizationFactor(v) {
        var _a;
        if (v === void 0)
          return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
      }
      reconnectionDelayMax(v) {
        var _a;
        if (v === void 0)
          return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
      }
      timeout(v) {
        if (!arguments.length)
          return this._timeout;
        this._timeout = v;
        return this;
      }
      /**
       * Starts trying to reconnect if reconnection is enabled and we have not
       * started reconnecting yet
       *
       * @private
       */
      maybeReconnectOnOpen() {
        if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
          this.reconnect();
        }
      }
      /**
       * Sets the current transport `socket`.
       *
       * @param {Function} fn - optional, callback
       * @return self
       * @public
       */
      open(fn) {
        if (~this._readyState.indexOf("open"))
          return this;
        this.engine = new Socket(this.uri, this.opts);
        const socket = this.engine;
        const self2 = this;
        this._readyState = "opening";
        this.skipReconnect = false;
        const openSubDestroy = on(socket, "open", function() {
          self2.onopen();
          fn && fn();
        });
        const onError = (err) => {
          this.cleanup();
          this._readyState = "closed";
          this.emitReserved("error", err);
          if (fn) {
            fn(err);
          } else {
            this.maybeReconnectOnOpen();
          }
        };
        const errorSub = on(socket, "error", onError);
        if (false !== this._timeout) {
          const timeout = this._timeout;
          const timer = this.setTimeoutFn(() => {
            openSubDestroy();
            onError(new Error("timeout"));
            socket.close();
          }, timeout);
          if (this.opts.autoUnref) {
            timer.unref();
          }
          this.subs.push(() => {
            this.clearTimeoutFn(timer);
          });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
      }
      /**
       * Alias for open()
       *
       * @return self
       * @public
       */
      connect(fn) {
        return this.open(fn);
      }
      /**
       * Called upon transport open.
       *
       * @private
       */
      onopen() {
        this.cleanup();
        this._readyState = "open";
        this.emitReserved("open");
        const socket = this.engine;
        this.subs.push(
          on(socket, "ping", this.onping.bind(this)),
          on(socket, "data", this.ondata.bind(this)),
          on(socket, "error", this.onerror.bind(this)),
          on(socket, "close", this.onclose.bind(this)),
          // @ts-ignore
          on(this.decoder, "decoded", this.ondecoded.bind(this))
        );
      }
      /**
       * Called upon a ping.
       *
       * @private
       */
      onping() {
        this.emitReserved("ping");
      }
      /**
       * Called with data.
       *
       * @private
       */
      ondata(data) {
        try {
          this.decoder.add(data);
        } catch (e) {
          this.onclose("parse error", e);
        }
      }
      /**
       * Called when parser fully decodes a packet.
       *
       * @private
       */
      ondecoded(packet) {
        nextTick(() => {
          this.emitReserved("packet", packet);
        }, this.setTimeoutFn);
      }
      /**
       * Called upon socket error.
       *
       * @private
       */
      onerror(err) {
        this.emitReserved("error", err);
      }
      /**
       * Creates a new socket for the given `nsp`.
       *
       * @return {Socket}
       * @public
       */
      socket(nsp, opts) {
        let socket = this.nsps[nsp];
        if (!socket) {
          socket = new Socket2(this, nsp, opts);
          this.nsps[nsp] = socket;
        } else if (this._autoConnect && !socket.active) {
          socket.connect();
        }
        return socket;
      }
      /**
       * Called upon a socket close.
       *
       * @param socket
       * @private
       */
      _destroy(socket) {
        const nsps = Object.keys(this.nsps);
        for (const nsp of nsps) {
          const socket2 = this.nsps[nsp];
          if (socket2.active) {
            return;
          }
        }
        this._close();
      }
      /**
       * Writes a packet.
       *
       * @param packet
       * @private
       */
      _packet(packet) {
        const encodedPackets = this.encoder.encode(packet);
        for (let i = 0; i < encodedPackets.length; i++) {
          this.engine.write(encodedPackets[i], packet.options);
        }
      }
      /**
       * Clean up transport subscriptions and packet buffer.
       *
       * @private
       */
      cleanup() {
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs.length = 0;
        this.decoder.destroy();
      }
      /**
       * Close the current socket.
       *
       * @private
       */
      _close() {
        this.skipReconnect = true;
        this._reconnecting = false;
        this.onclose("forced close");
      }
      /**
       * Alias for close()
       *
       * @private
       */
      disconnect() {
        return this._close();
      }
      /**
       * Called when:
       *
       * - the low-level engine is closed
       * - the parser encountered a badly formatted packet
       * - all sockets are disconnected
       *
       * @private
       */
      onclose(reason, description) {
        var _a;
        this.cleanup();
        (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason, description);
        if (this._reconnection && !this.skipReconnect) {
          this.reconnect();
        }
      }
      /**
       * Attempt a reconnection.
       *
       * @private
       */
      reconnect() {
        if (this._reconnecting || this.skipReconnect)
          return this;
        const self2 = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
          this.backoff.reset();
          this.emitReserved("reconnect_failed");
          this._reconnecting = false;
        } else {
          const delay2 = this.backoff.duration();
          this._reconnecting = true;
          const timer = this.setTimeoutFn(() => {
            if (self2.skipReconnect)
              return;
            this.emitReserved("reconnect_attempt", self2.backoff.attempts);
            if (self2.skipReconnect)
              return;
            self2.open((err) => {
              if (err) {
                self2._reconnecting = false;
                self2.reconnect();
                this.emitReserved("reconnect_error", err);
              } else {
                self2.onreconnect();
              }
            });
          }, delay2);
          if (this.opts.autoUnref) {
            timer.unref();
          }
          this.subs.push(() => {
            this.clearTimeoutFn(timer);
          });
        }
      }
      /**
       * Called upon successful reconnect.
       *
       * @private
       */
      onreconnect() {
        const attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
      }
    };
  }
});

// node_modules/socket.io-client/build/esm/index.js
function lookup2(uri, opts) {
  if (typeof uri === "object") {
    opts = uri;
    uri = void 0;
  }
  opts = opts || {};
  const parsed = url(uri, opts.path || "/socket.io");
  const source = parsed.source;
  const id = parsed.id;
  const path = parsed.path;
  const sameNamespace = cache[id] && path in cache[id]["nsps"];
  const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
  let io;
  if (newConnection) {
    io = new Manager(source, opts);
  } else {
    if (!cache[id]) {
      cache[id] = new Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.queryKey;
  }
  return io.socket(parsed.path, opts);
}
var cache;
var init_esm6 = __esm({
  "node_modules/socket.io-client/build/esm/index.js"() {
    "use strict";
    init_url();
    init_manager();
    init_socket2();
    init_esm5();
    init_esm4();
    cache = {};
    Object.assign(lookup2, {
      Manager,
      Socket: Socket2,
      io: lookup2,
      connect: lookup2
    });
  }
});

// src/app/services/websocket.service.ts
var websocket_service_exports = {};
__export(websocket_service_exports, {
  WebSocketService: () => WebSocketService
});
var WebSocketService;
var init_websocket_service = __esm({
  "src/app/services/websocket.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_esm();
    init_esm6();
    init_brand_config_service();
    WebSocketService = class WebSocketService2 {
      brand = inject(BrandConfigService);
      injector = inject(Injector);
      socket;
      messageSubject = new BehaviorSubject(null);
      connectionStatus = new BehaviorSubject(false);
      reconnectAttempts = 0;
      maxReconnectAttempts = 5;
      reconnectInterval = 5e3;
      getMessages() {
        return this.messageSubject.asObservable();
      }
      getConnectionStatus() {
        return this.connectionStatus.asObservable();
      }
      connect() {
        try {
          const authService = this.injector.get((init_auth_service(), __toCommonJS(auth_service_exports)).AuthService);
          const user = authService.getCurrentUser();
          const token = authService.getToken();
          this.connectWithAuth(user, token);
        } catch (error) {
          console.error("Failed to initialize WebSocket connection:", error);
        }
      }
      connectWithAuth(user, token) {
        console.log("connectWithAuth called - user:", user?.id || user?._id, "token:", !!token);
        const userId = user?.id || user?._id;
        if (!user || !userId || !token) {
          console.log("WebSocket: No authenticated user or token, skipping connection");
          return;
        }
        if (this.socket?.connected) {
          console.log("WebSocket: Disconnecting existing connection before reconnecting");
          this.socket.disconnect();
        }
        try {
          const socketUrl = this.getSocketUrl();
          console.log("WebSocket: Attempting to connect to:", socketUrl);
          this.socket = lookup2(socketUrl, {
            auth: { token },
            transports: ["websocket", "polling"],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 2e4,
            forceNew: true,
            reconnection: false,
            autoConnect: true
          });
          this.socket.on("connect", () => {
            console.log("Socket.IO connected successfully");
            this.connectionStatus.next(true);
            this.reconnectAttempts = 0;
            const userId2 = user.id || user._id;
            this.send("join", { room: `user:${userId2}` });
          });
          this.socket.on("disconnect", (reason) => {
            console.log("Socket.IO disconnected. Reason:", reason);
            this.connectionStatus.next(false);
            if (reason !== "io client disconnect") {
              this.attemptReconnect();
            }
          });
          this.socket.on("connect_error", (error) => {
            console.error("Socket.IO connection error:", error);
            this.connectionStatus.next(false);
            this.attemptReconnect();
          });
          this.socket.onAny((eventName, ...args) => {
            const message = {
              type: eventName,
              payload: args.length === 1 ? args[0] : args
            };
            this.messageSubject.next(message);
          });
        } catch (error) {
          console.error("Failed to create Socket.IO connection:", error);
          this.attemptReconnect();
        }
      }
      disconnect() {
        if (this.socket) {
          this.socket.disconnect();
          this.socket = void 0;
        }
        this.connectionStatus.next(false);
      }
      isConnected() {
        return this.socket?.connected ?? false;
      }
      send(type, payload) {
        if (this.socket && this.socket.connected) {
          console.log("Sending Socket.IO event:", type, payload);
          this.socket.emit(type, payload);
        } else {
          console.warn("Socket.IO not connected, cannot send message:", { type, payload });
        }
      }
      joinRoom(room) {
        this.send("join", { room });
      }
      leaveRoom(room) {
        this.send("leave", { room });
      }
      sendMessage(conversationId, senderId, content) {
        this.send("message:send", { conversationId, senderId, content });
      }
      startTyping(conversationId, userId, userName) {
        this.send("typing:start", { conversationId, userId, userName });
      }
      stopTyping(conversationId, userId) {
        this.send("typing:stop", { conversationId, userId });
      }
      markAsRead(conversationId, userId) {
        this.send("message:read", { conversationId, userId });
      }
      getSocketUrl() {
        const apiUrl = this.brand.getApiUrl();
        const socketUrl = apiUrl.replace(/\/api$/, "");
        console.log("API URL:", apiUrl);
        console.log("Socket.IO URL:", socketUrl);
        return socketUrl;
      }
      attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Socket.IO: Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => {
            this.connect();
          }, this.reconnectInterval);
        } else {
          console.warn("Socket.IO: Max reconnection attempts reached. Real-time features will be disabled.");
        }
      }
    };
    WebSocketService = __decorate([
      Injectable({ providedIn: "root" })
    ], WebSocketService);
  }
});

// src/app/services/auth.service.ts
var auth_service_exports = {};
__export(auth_service_exports, {
  AuthService: () => AuthService
});
var AuthService;
var init_auth_service = __esm({
  "src/app/services/auth.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    init_router();
    init_esm();
    init_operators();
    init_brand_config_service();
    init_dialog2();
    init_session_timeout_dialog_component2();
    AuthService = class AuthService2 {
      http = inject(HttpClient);
      router = inject(Router);
      brandConfig = inject(BrandConfigService);
      dialog = inject(MatDialog);
      injector = inject(Injector);
      get apiUrl() {
        return this.brandConfig.getApiUrl();
      }
      currentUserSubject = new BehaviorSubject(null);
      currentUser$ = this.currentUserSubject.asObservable();
      constructor() {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          const user = localStorage.getItem("user");
          if (token && user) {
            this.currentUserSubject.next(JSON.parse(user));
          }
        }
      }
      login(credentials) {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(tap((response) => {
          const normalizedUser = this.normalizeUser(response.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.access_token);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
          this.connectWebSocketWithAuth(normalizedUser, response.access_token);
        }));
      }
      signup(userData) {
        return this.http.post(`${this.apiUrl}/auth/signup`, userData).pipe(tap((response) => {
          const normalizedUser = this.normalizeUser(response.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.access_token);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
          this.connectWebSocketWithAuth(normalizedUser, response.access_token);
        }));
      }
      getOrganizations() {
        return this.http.get(`${this.apiUrl}/organizations`);
      }
      getMyOrganizations() {
        return this.http.get(`${this.apiUrl}/organizations/my-organizations`);
      }
      getPublicOrganizations() {
        return this.http.get(`${this.apiUrl}/organizations/public`);
      }
      logout() {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        this.disconnectWebSocket();
        this.currentUserSubject.next(null);
        this.router.navigate(["/login"]);
      }
      isSessionTimeoutDialogOpen = false;
      showSessionTimeout() {
        if (this.isSessionTimeoutDialogOpen) {
          return;
        }
        this.isSessionTimeoutDialogOpen = true;
        const dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
          disableClose: true,
          width: "400px"
        });
        dialogRef.afterClosed().subscribe(() => {
          this.isSessionTimeoutDialogOpen = false;
        });
        this.logout();
      }
      isAuthenticated() {
        if (typeof window !== "undefined") {
          return !!localStorage.getItem("token");
        }
        return false;
      }
      getToken() {
        if (typeof window !== "undefined") {
          return localStorage.getItem("token");
        }
        return null;
      }
      getCurrentUser() {
        return this.currentUserSubject.value;
      }
      updateUserOrganization(organizationId) {
        return this.http.patch(`${this.apiUrl}/auth/update-organization`, { organizationId }).pipe(tap((updatedUser) => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        }));
      }
      hasRole(role) {
        const user = this.getCurrentUser();
        return user?.roles?.some((r) => r.type === role) || false;
      }
      getProfile() {
        return this.http.get(`${this.apiUrl}/auth/profile`);
      }
      updateProfile(profileData) {
        return this.http.patch(`${this.apiUrl}/auth/profile`, profileData).pipe(tap((updatedUser) => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        }));
      }
      uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);
        return this.http.post(`${this.apiUrl}/auth/profile/avatar`, formData).pipe(tap((updatedUser) => {
          const normalizedUser = this.normalizeUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
          this.currentUserSubject.next(normalizedUser);
        }));
      }
      getAvatarUrl(avatarPath) {
        if (!avatarPath) {
          return "/assets/default-avatar.svg";
        }
        return `${this.apiUrl}${avatarPath}`;
      }
      connectWebSocket() {
        try {
          const wsService = this.injector.get((init_websocket_service(), __toCommonJS(websocket_service_exports)).WebSocketService);
          const user = this.getCurrentUser();
          const token = this.getToken();
          wsService.connectWithAuth(user, token);
        } catch (e) {
        }
      }
      connectWebSocketWithAuth(user, token) {
        console.log("connectWebSocketWithAuth called with user:", user?.id, "token:", !!token);
        try {
          const wsService = this.injector.get((init_websocket_service(), __toCommonJS(websocket_service_exports)).WebSocketService);
          console.log("Got wsService, calling connectWithAuth");
          wsService.connectWithAuth(user, token);
        } catch (e) {
          console.error("Error getting wsService:", e);
        }
      }
      disconnectWebSocket() {
        try {
          const wsService = this.injector.get((init_websocket_service(), __toCommonJS(websocket_service_exports)).WebSocketService);
          wsService.disconnect();
        } catch (e) {
        }
      }
      normalizeUser(user) {
        if (!user)
          return user;
        return __spreadProps(__spreadValues({}, user), {
          id: user.id || user._id,
          organizations: user.organizations?.map((org) => __spreadProps(__spreadValues({}, org), {
            id: org.id || org._id
          })) || []
        });
      }
      // Common module access methods
      userAccessibleModules = [];
      getUserAccessibleModules(modulesService) {
        return __async(this, null, function* () {
          const user = this.getCurrentUser();
          if (!user)
            return [];
          try {
            let modules = [];
            if (user.organizationId) {
              modules = yield modulesService.getOrganizationModules(user.organizationId).toPromise();
            }
            if (!modules || modules.length === 0) {
              modules = yield modulesService.getPersonalModules().toPromise();
            }
            this.userAccessibleModules = modules || [];
            return modules || [];
          } catch (error) {
            console.error("Error loading user accessible modules:", error);
            return [];
          }
        });
      }
      hasModuleAccess(moduleId) {
        if (!moduleId)
          return false;
        return this.userAccessibleModules.some((m) => m.id === moduleId || m.name === moduleId);
      }
      filterModulesWithPermissions(modules, brandKey, moduleRegistry, allowedModules) {
        if (!modules || modules.length === 0)
          return [];
        const filtered = modules.filter((m) => {
          const registryModule = this.getModuleFromRegistry(m.name || m.id, moduleRegistry);
          return registryModule && registryModule.widgetComponent;
        });
        const brandFiltered = filtered.filter((m) => {
          const moduleId = m.name || m.id;
          return allowedModules.some((am) => am.id === moduleId || am.name === moduleId);
        });
        return brandFiltered;
      }
      getModuleFromRegistry(moduleId, moduleRegistry) {
        if (!moduleId)
          return void 0;
        const normalize = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "");
        let module = moduleRegistry.find((m) => m.id === moduleId || m.name === moduleId || m.displayName === moduleId);
        if (module)
          return module;
        const target = normalize(moduleId);
        module = moduleRegistry.find((m) => normalize(m.id) === target || normalize(m.name) === target || normalize(m.displayName) === target);
        if (module)
          return module;
        const kebabCase = moduleId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        module = moduleRegistry.find((m) => m.name === kebabCase || m.id === kebabCase);
        if (module)
          return module;
        module = moduleRegistry.find((m) => target.includes(normalize(m.name)) || normalize(m.name).includes(target) || target.includes(normalize(m.displayName)));
        if (module)
          return module;
        return void 0;
      }
      static ctorParameters = () => [];
    };
    AuthService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], AuthService);
  }
});

// src/app/app.spec.ts
init_core();

// src/app/app.ts
init_tslib_es6();

// angular:jit:template:src/app/app.html
var app_default = '<main id="main" tabindex="-1" role="main">\n  <router-outlet />\n  <br><br><br><br>\n</main>';

// angular:jit:style:src/app/app.scss
var app_default2 = "/* src/app/app.scss */\n/*# sourceMappingURL=app.css.map */\n";

// src/app/app.ts
init_core();
init_router();
init_common();
init_core();

// node_modules/@angular/material/fesm2022/snack-bar.mjs
init_core();
init_core();
init_esm();
init_button();
init_a11y();
init_platform();
init_portal();
init_animation();
init_layout();
init_overlay();
init_operators();
init_common_module();
var MAX_TIMEOUT = Math.pow(2, 31) - 1;
var MatSnackBarRef = class {
  _overlayRef;
  /** The instance of the component making up the content of the snack bar. */
  instance;
  /**
   * The instance of the component making up the content of the snack bar.
   * @docs-private
   */
  containerInstance;
  /** Subject for notifying the user that the snack bar has been dismissed. */
  _afterDismissed = new Subject();
  /** Subject for notifying the user that the snack bar has opened and appeared. */
  _afterOpened = new Subject();
  /** Subject for notifying the user that the snack bar action was called. */
  _onAction = new Subject();
  /**
   * Timeout ID for the duration setTimeout call. Used to clear the timeout if the snackbar is
   * dismissed before the duration passes.
   */
  _durationTimeoutId;
  /** Whether the snack bar was dismissed using the action button. */
  _dismissedByAction = false;
  constructor(containerInstance, _overlayRef) {
    this._overlayRef = _overlayRef;
    this.containerInstance = containerInstance;
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }
  /** Dismisses the snack bar. */
  dismiss() {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }
  /** Marks the snackbar action clicked. */
  dismissWithAction() {
    if (!this._onAction.closed) {
      this._dismissedByAction = true;
      this._onAction.next();
      this._onAction.complete();
      this.dismiss();
    }
    clearTimeout(this._durationTimeoutId);
  }
  /**
   * Marks the snackbar action clicked.
   * @deprecated Use `dismissWithAction` instead.
   * @breaking-change 8.0.0
   */
  closeWithAction() {
    this.dismissWithAction();
  }
  /** Dismisses the snack bar after some duration */
  _dismissAfter(duration) {
    this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
  }
  /** Marks the snackbar as opened */
  _open() {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }
  /** Cleans up the DOM after closing. */
  _finishDismiss() {
    this._overlayRef.dispose();
    if (!this._onAction.closed) {
      this._onAction.complete();
    }
    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }
  /** Gets an observable that is notified when the snack bar is finished closing. */
  afterDismissed() {
    return this._afterDismissed;
  }
  /** Gets an observable that is notified when the snack bar has opened and appeared. */
  afterOpened() {
    return this.containerInstance._onEnter;
  }
  /** Gets an observable that is notified when the snack bar action is called. */
  onAction() {
    return this._onAction;
  }
};
var MAT_SNACK_BAR_DATA = new InjectionToken("MatSnackBarData");
var MatSnackBarConfig = class {
  /** The politeness level for the MatAriaLiveAnnouncer announcement. */
  politeness = "polite";
  /**
   * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage = "";
  /**
   * The view container that serves as the parent for the snackbar for the purposes of dependency
   * injection. Note: this does not affect where the snackbar is inserted in the DOM.
   */
  viewContainerRef;
  /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
  duration = 0;
  /** Extra CSS classes to be added to the snack bar container. */
  panelClass;
  /** Text layout direction for the snack bar. */
  direction;
  /** Data being injected into the child component. */
  data = null;
  /** The horizontal position to place the snack bar. */
  horizontalPosition = "center";
  /** The vertical position to place the snack bar. */
  verticalPosition = "bottom";
};
var MatSnackBarLabel = class _MatSnackBarLabel {
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarLabel, deps: [], target: FactoryTarget.Directive });
  static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatSnackBarLabel, isStandalone: true, selector: "[matSnackBarLabel]", host: { classAttribute: "mat-mdc-snack-bar-label mdc-snackbar__label" }, ngImport: core_exports });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBarLabel, decorators: [{
  type: Directive,
  args: [{
    selector: `[matSnackBarLabel]`,
    host: {
      "class": "mat-mdc-snack-bar-label mdc-snackbar__label"
    }
  }]
}] });
var MatSnackBarActions = class _MatSnackBarActions {
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarActions, deps: [], target: FactoryTarget.Directive });
  static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatSnackBarActions, isStandalone: true, selector: "[matSnackBarActions]", host: { classAttribute: "mat-mdc-snack-bar-actions mdc-snackbar__actions" }, ngImport: core_exports });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBarActions, decorators: [{
  type: Directive,
  args: [{
    selector: `[matSnackBarActions]`,
    host: {
      "class": "mat-mdc-snack-bar-actions mdc-snackbar__actions"
    }
  }]
}] });
var MatSnackBarAction = class _MatSnackBarAction {
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarAction, deps: [], target: FactoryTarget.Directive });
  static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatSnackBarAction, isStandalone: true, selector: "[matSnackBarAction]", host: { classAttribute: "mat-mdc-snack-bar-action mdc-snackbar__action" }, ngImport: core_exports });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBarAction, decorators: [{
  type: Directive,
  args: [{
    selector: `[matSnackBarAction]`,
    host: {
      "class": "mat-mdc-snack-bar-action mdc-snackbar__action"
    }
  }]
}] });
var SimpleSnackBar = class _SimpleSnackBar {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);
  constructor() {
  }
  /** Performs the action on the snack bar. */
  action() {
    this.snackBarRef.dismissWithAction();
  }
  /** If the action button should be shown. */
  get hasAction() {
    return !!this.data.action;
  }
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _SimpleSnackBar, deps: [], target: FactoryTarget.Component });
  static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: _SimpleSnackBar, isStandalone: true, selector: "simple-snack-bar", host: { classAttribute: "mat-mdc-simple-snack-bar" }, exportAs: ["matSnackBar"], ngImport: core_exports, template: '<div matSnackBarLabel>\n  {{data.message}}\n</div>\n\n@if (hasAction) {\n  <div matSnackBarActions>\n    <button matButton matSnackBarAction (click)="action()">\n      {{data.action}}\n    </button>\n  </div>\n}\n', styles: [".mat-mdc-simple-snack-bar{display:flex}\n"], dependencies: [{ kind: "component", type: MatButton, selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", inputs: ["matButton"], exportAs: ["matButton", "matAnchor"] }, { kind: "directive", type: MatSnackBarLabel, selector: "[matSnackBarLabel]" }, { kind: "directive", type: MatSnackBarActions, selector: "[matSnackBarActions]" }, { kind: "directive", type: MatSnackBarAction, selector: "[matSnackBarAction]" }], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: SimpleSnackBar, decorators: [{
  type: Component,
  args: [{ selector: "simple-snack-bar", exportAs: "matSnackBar", encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatButton, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction], host: {
    "class": "mat-mdc-simple-snack-bar"
  }, template: '<div matSnackBarLabel>\n  {{data.message}}\n</div>\n\n@if (hasAction) {\n  <div matSnackBarActions>\n    <button matButton matSnackBarAction (click)="action()">\n      {{data.action}}\n    </button>\n  </div>\n}\n', styles: [".mat-mdc-simple-snack-bar{display:flex}\n"] }]
}], ctorParameters: () => [] });
var ENTER_ANIMATION = "_mat-snack-bar-enter";
var EXIT_ANIMATION = "_mat-snack-bar-exit";
var MatSnackBarContainer = class _MatSnackBarContainer extends BasePortalOutlet {
  _ngZone = inject(NgZone);
  _elementRef = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _platform = inject(Platform);
  _animationsDisabled = _animationsDisabled();
  snackBarConfig = inject(MatSnackBarConfig);
  _document = inject(DOCUMENT);
  _trackedModals = /* @__PURE__ */ new Set();
  _enterFallback;
  _exitFallback;
  _injector = inject(Injector);
  /** The number of milliseconds to wait before announcing the snack bar's content. */
  _announceDelay = 150;
  /** The timeout for announcing the snack bar's content. */
  _announceTimeoutId;
  /** Whether the component has been destroyed. */
  _destroyed = false;
  /** The portal outlet inside of this container into which the snack bar content will be loaded. */
  _portalOutlet;
  /** Subject for notifying that the snack bar has announced to screen readers. */
  _onAnnounce = new Subject();
  /** Subject for notifying that the snack bar has exited from view. */
  _onExit = new Subject();
  /** Subject for notifying that the snack bar has finished entering the view. */
  _onEnter = new Subject();
  /** The state of the snack bar animations. */
  _animationState = "void";
  /** aria-live value for the live region. */
  _live;
  /**
   * Element that will have the `mdc-snackbar__label` class applied if the attached component
   * or template does not have it. This ensures that the appropriate structure, typography, and
   * color is applied to the attached view.
   */
  _label;
  /**
   * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
   * JAWS does not read out aria-live message.
   */
  _role;
  /** Unique ID of the aria-live element. */
  _liveElementId = inject(_IdGenerator).getId("mat-snack-bar-container-live-");
  constructor() {
    super();
    const config = this.snackBarConfig;
    if (config.politeness === "assertive" && !config.announcementMessage) {
      this._live = "assertive";
    } else if (config.politeness === "off") {
      this._live = "off";
    } else {
      this._live = "polite";
    }
    if (this._platform.FIREFOX) {
      if (this._live === "polite") {
        this._role = "status";
      }
      if (this._live === "assertive") {
        this._role = "alert";
      }
    }
  }
  /** Attach a component portal as content to this snack bar container. */
  attachComponentPortal(portal) {
    this._assertNotAttached();
    const result = this._portalOutlet.attachComponentPortal(portal);
    this._afterPortalAttached();
    return result;
  }
  /** Attach a template portal as content to this snack bar container. */
  attachTemplatePortal(portal) {
    this._assertNotAttached();
    const result = this._portalOutlet.attachTemplatePortal(portal);
    this._afterPortalAttached();
    return result;
  }
  /**
   * Attaches a DOM portal to the snack bar container.
   * @deprecated To be turned into a method.
   * @breaking-change 10.0.0
   */
  attachDomPortal = (portal) => {
    this._assertNotAttached();
    const result = this._portalOutlet.attachDomPortal(portal);
    this._afterPortalAttached();
    return result;
  };
  /** Handle end of animations, updating the state of the snackbar. */
  onAnimationEnd(animationName) {
    if (animationName === EXIT_ANIMATION) {
      this._completeExit();
    } else if (animationName === ENTER_ANIMATION) {
      clearTimeout(this._enterFallback);
      this._ngZone.run(() => {
        this._onEnter.next();
        this._onEnter.complete();
      });
    }
  }
  /** Begin animation of snack bar entrance into view. */
  enter() {
    if (!this._destroyed) {
      this._animationState = "visible";
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
      this._screenReaderAnnounce();
      if (this._animationsDisabled) {
        afterNextRender(() => {
          this._ngZone.run(() => queueMicrotask(() => this.onAnimationEnd(ENTER_ANIMATION)));
        }, { injector: this._injector });
      } else {
        clearTimeout(this._enterFallback);
        this._enterFallback = setTimeout(() => {
          this._elementRef.nativeElement.classList.add("mat-snack-bar-fallback-visible");
          this.onAnimationEnd(ENTER_ANIMATION);
        }, 200);
      }
    }
  }
  /** Begin animation of the snack bar exiting from view. */
  exit() {
    if (this._destroyed) {
      return of(void 0);
    }
    this._ngZone.run(() => {
      this._animationState = "hidden";
      this._changeDetectorRef.markForCheck();
      this._elementRef.nativeElement.setAttribute("mat-exit", "");
      clearTimeout(this._announceTimeoutId);
      if (this._animationsDisabled) {
        afterNextRender(() => {
          this._ngZone.run(() => queueMicrotask(() => this.onAnimationEnd(EXIT_ANIMATION)));
        }, { injector: this._injector });
      } else {
        clearTimeout(this._exitFallback);
        this._exitFallback = setTimeout(() => this.onAnimationEnd(EXIT_ANIMATION), 200);
      }
    });
    return this._onExit;
  }
  /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
  ngOnDestroy() {
    this._destroyed = true;
    this._clearFromModals();
    this._completeExit();
  }
  _completeExit() {
    clearTimeout(this._exitFallback);
    queueMicrotask(() => {
      this._onExit.next();
      this._onExit.complete();
    });
  }
  /**
   * Called after the portal contents have been attached. Can be
   * used to modify the DOM once it's guaranteed to be in place.
   */
  _afterPortalAttached() {
    const element = this._elementRef.nativeElement;
    const panelClasses = this.snackBarConfig.panelClass;
    if (panelClasses) {
      if (Array.isArray(panelClasses)) {
        panelClasses.forEach((cssClass) => element.classList.add(cssClass));
      } else {
        element.classList.add(panelClasses);
      }
    }
    this._exposeToModals();
    const label = this._label.nativeElement;
    const labelClass = "mdc-snackbar__label";
    label.classList.toggle(labelClass, !label.querySelector(`.${labelClass}`));
  }
  /**
   * Some browsers won't expose the accessibility node of the live element if there is an
   * `aria-modal` and the live element is outside of it. This method works around the issue by
   * pointing the `aria-owns` of all modals to the live element.
   */
  _exposeToModals() {
    const id = this._liveElementId;
    const modals = this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute("aria-owns");
      this._trackedModals.add(modal);
      if (!ariaOwns) {
        modal.setAttribute("aria-owns", id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute("aria-owns", ariaOwns + " " + id);
      }
    }
  }
  /** Clears the references to the live element from any modals it was added to. */
  _clearFromModals() {
    this._trackedModals.forEach((modal) => {
      const ariaOwns = modal.getAttribute("aria-owns");
      if (ariaOwns) {
        const newValue = ariaOwns.replace(this._liveElementId, "").trim();
        if (newValue.length > 0) {
          modal.setAttribute("aria-owns", newValue);
        } else {
          modal.removeAttribute("aria-owns");
        }
      }
    });
    this._trackedModals.clear();
  }
  /** Asserts that no content is already attached to the container. */
  _assertNotAttached() {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error("Attempting to attach snack bar content after content is already attached");
    }
  }
  /**
   * Starts a timeout to move the snack bar content to the live region so screen readers will
   * announce it.
   */
  _screenReaderAnnounce() {
    if (this._announceTimeoutId) {
      return;
    }
    this._ngZone.runOutsideAngular(() => {
      this._announceTimeoutId = setTimeout(() => {
        if (this._destroyed) {
          return;
        }
        const element = this._elementRef.nativeElement;
        const inertElement = element.querySelector("[aria-hidden]");
        const liveElement = element.querySelector("[aria-live]");
        if (inertElement && liveElement) {
          let focusedElement = null;
          if (this._platform.isBrowser && document.activeElement instanceof HTMLElement && inertElement.contains(document.activeElement)) {
            focusedElement = document.activeElement;
          }
          inertElement.removeAttribute("aria-hidden");
          liveElement.appendChild(inertElement);
          focusedElement?.focus();
          this._onAnnounce.next();
          this._onAnnounce.complete();
        }
      }, this._announceDelay);
    });
  }
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarContainer, deps: [], target: FactoryTarget.Component });
  static \u0275cmp = \u0275\u0275ngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: _MatSnackBarContainer, isStandalone: true, selector: "mat-snack-bar-container", host: { listeners: { "animationend": "onAnimationEnd($event.animationName)", "animationcancel": "onAnimationEnd($event.animationName)" }, properties: { "class.mat-snack-bar-container-enter": '_animationState === "visible"', "class.mat-snack-bar-container-exit": '_animationState === "hidden"', "class.mat-snack-bar-container-animations-enabled": "!_animationsDisabled" }, classAttribute: "mdc-snackbar mat-mdc-snack-bar-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }, { propertyName: "_label", first: true, predicate: ["label"], descendants: true, static: true }], usesInheritance: true, ngImport: core_exports, template: '<div class="mdc-snackbar__surface mat-mdc-snackbar-surface">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class="mat-mdc-snack-bar-label" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden="true">\n      <ng-template cdkPortalOutlet />\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]="_live" [attr.role]="_role" [attr.id]="_liveElementId"></div>\n  </div>\n</div>\n', styles: ["@keyframes _mat-snack-bar-enter{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}@keyframes _mat-snack-bar-exit{from{opacity:1}to{opacity:0}}.mat-mdc-snack-bar-container{display:flex;align-items:center;justify-content:center;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0,0,0,0);margin:8px}.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container{width:100vw}.mat-snack-bar-container-animations-enabled{opacity:0}.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible{opacity:1}.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter{animation:_mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit{animation:_mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards}.mat-mdc-snackbar-surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;padding-left:0;padding-right:8px}[dir=rtl] .mat-mdc-snackbar-surface{padding-right:0;padding-left:8px}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{min-width:344px;max-width:672px}.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface{width:100%;min-width:0}@media(forced-colors: active){.mat-mdc-snackbar-surface{outline:solid 1px}}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{color:var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));background-color:var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface))}.mdc-snackbar__label{width:100%;flex-grow:1;box-sizing:border-box;margin:0;padding:14px 8px 14px 16px}[dir=rtl] .mdc-snackbar__label{padding-left:8px;padding-right:16px}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-family:var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));font-weight:var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));line-height:var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height))}.mat-mdc-snack-bar-actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){--mat-button-text-state-layer-color: currentColor;--mat-button-text-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed{color:var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary))}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{opacity:.1}\n"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBarContainer, decorators: [{
  type: Component,
  args: [{ selector: "mat-snack-bar-container", changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, imports: [CdkPortalOutlet], host: {
    "class": "mdc-snackbar mat-mdc-snack-bar-container",
    "[class.mat-snack-bar-container-enter]": '_animationState === "visible"',
    "[class.mat-snack-bar-container-exit]": '_animationState === "hidden"',
    "[class.mat-snack-bar-container-animations-enabled]": "!_animationsDisabled",
    "(animationend)": "onAnimationEnd($event.animationName)",
    "(animationcancel)": "onAnimationEnd($event.animationName)"
  }, template: '<div class="mdc-snackbar__surface mat-mdc-snackbar-surface">\n  <!--\n    This outer label wrapper will have the class `mdc-snackbar__label` applied if\n    the attached template/component does not contain it.\n  -->\n  <div class="mat-mdc-snack-bar-label" #label>\n    <!-- Initialy holds the snack bar content, will be empty after announcing to screen readers. -->\n    <div aria-hidden="true">\n      <ng-template cdkPortalOutlet />\n    </div>\n\n    <!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n    <div [attr.aria-live]="_live" [attr.role]="_role" [attr.id]="_liveElementId"></div>\n  </div>\n</div>\n', styles: ["@keyframes _mat-snack-bar-enter{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}@keyframes _mat-snack-bar-exit{from{opacity:1}to{opacity:0}}.mat-mdc-snack-bar-container{display:flex;align-items:center;justify-content:center;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0,0,0,0);margin:8px}.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container{width:100vw}.mat-snack-bar-container-animations-enabled{opacity:0}.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible{opacity:1}.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter{animation:_mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit{animation:_mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards}.mat-mdc-snackbar-surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;padding-left:0;padding-right:8px}[dir=rtl] .mat-mdc-snackbar-surface{padding-right:0;padding-left:8px}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{min-width:344px;max-width:672px}.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface{width:100%;min-width:0}@media(forced-colors: active){.mat-mdc-snackbar-surface{outline:solid 1px}}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{color:var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));background-color:var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface))}.mdc-snackbar__label{width:100%;flex-grow:1;box-sizing:border-box;margin:0;padding:14px 8px 14px 16px}[dir=rtl] .mdc-snackbar__label{padding-left:8px;padding-right:16px}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-family:var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));font-weight:var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));line-height:var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height))}.mat-mdc-snack-bar-actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){--mat-button-text-state-layer-color: currentColor;--mat-button-text-ripple-color: currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed{color:var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary))}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{opacity:.1}\n"] }]
}], ctorParameters: () => [], propDecorators: { _portalOutlet: [{
  type: ViewChild,
  args: [CdkPortalOutlet, { static: true }]
}], _label: [{
  type: ViewChild,
  args: ["label", { static: true }]
}] } });
function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
  return new MatSnackBarConfig();
}
var MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken("mat-snack-bar-default-options", {
  providedIn: "root",
  factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY
});
var MatSnackBar = class _MatSnackBar {
  _live = inject(LiveAnnouncer);
  _injector = inject(Injector);
  _breakpointObserver = inject(BreakpointObserver);
  _parentSnackBar = inject(_MatSnackBar, { optional: true, skipSelf: true });
  _defaultConfig = inject(MAT_SNACK_BAR_DEFAULT_OPTIONS);
  _animationsDisabled = _animationsDisabled();
  /**
   * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
   * If there is a parent snack-bar service, all operations should delegate to that parent
   * via `_openedSnackBarRef`.
   */
  _snackBarRefAtThisLevel = null;
  /** The component that should be rendered as the snack bar's simple component. */
  simpleSnackBarComponent = SimpleSnackBar;
  /** The container component that attaches the provided template or component. */
  snackBarContainerComponent = MatSnackBarContainer;
  /** The CSS class to apply for handset mode. */
  handsetCssClass = "mat-mdc-snack-bar-handset";
  /** Reference to the currently opened snackbar at *any* level. */
  get _openedSnackBarRef() {
    const parent = this._parentSnackBar;
    return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
  }
  set _openedSnackBarRef(value2) {
    if (this._parentSnackBar) {
      this._parentSnackBar._openedSnackBarRef = value2;
    } else {
      this._snackBarRefAtThisLevel = value2;
    }
  }
  constructor() {
  }
  /**
   * Creates and dispatches a snack bar with a custom component for the content, removing any
   * currently opened snack bars.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromComponent(component, config) {
    return this._attach(component, config);
  }
  /**
   * Creates and dispatches a snack bar with a custom template for the content, removing any
   * currently opened snack bars.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromTemplate(template, config) {
    return this._attach(template, config);
  }
  /**
   * Opens a snackbar with a message and an optional action.
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   */
  open(message, action = "", config) {
    const _config = __spreadValues(__spreadValues({}, this._defaultConfig), config);
    _config.data = { message, action };
    if (_config.announcementMessage === message) {
      _config.announcementMessage = void 0;
    }
    return this.openFromComponent(this.simpleSnackBarComponent, _config);
  }
  /**
   * Dismisses the currently-visible snack bar.
   */
  dismiss() {
    if (this._openedSnackBarRef) {
      this._openedSnackBarRef.dismiss();
    }
  }
  ngOnDestroy() {
    if (this._snackBarRefAtThisLevel) {
      this._snackBarRefAtThisLevel.dismiss();
    }
  }
  /**
   * Attaches the snack bar container component to the overlay.
   */
  _attachSnackBarContainer(overlayRef, config) {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: MatSnackBarConfig, useValue: config }]
    });
    const containerPortal = new ComponentPortal(this.snackBarContainerComponent, config.viewContainerRef, injector);
    const containerRef = overlayRef.attach(containerPortal);
    containerRef.instance.snackBarConfig = config;
    return containerRef.instance;
  }
  /**
   * Places a new component or a template as the content of the snack bar container.
   */
  _attach(content, userConfig) {
    const config = __spreadValues(__spreadValues(__spreadValues({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
    const overlayRef = this._createOverlay(config);
    const container = this._attachSnackBarContainer(overlayRef, config);
    const snackBarRef = new MatSnackBarRef(container, overlayRef);
    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null, {
        $implicit: config.data,
        snackBarRef
      });
      snackBarRef.instance = container.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, snackBarRef);
      const portal = new ComponentPortal(content, void 0, injector);
      const contentRef = container.attachComponentPortal(portal);
      snackBarRef.instance = contentRef.instance;
    }
    this._breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(takeUntil(overlayRef.detachments())).subscribe((state) => {
      overlayRef.overlayElement.classList.toggle(this.handsetCssClass, state.matches);
    });
    if (config.announcementMessage) {
      container._onAnnounce.subscribe(() => {
        this._live.announce(config.announcementMessage, config.politeness);
      });
    }
    this._animateSnackBar(snackBarRef, config);
    this._openedSnackBarRef = snackBarRef;
    return this._openedSnackBarRef;
  }
  /** Animates the old snack bar out and the new one in. */
  _animateSnackBar(snackBarRef, config) {
    snackBarRef.afterDismissed().subscribe(() => {
      if (this._openedSnackBarRef == snackBarRef) {
        this._openedSnackBarRef = null;
      }
      if (config.announcementMessage) {
        this._live.clear();
      }
    });
    if (config.duration && config.duration > 0) {
      snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(config.duration));
    }
    if (this._openedSnackBarRef) {
      this._openedSnackBarRef.afterDismissed().subscribe(() => {
        snackBarRef.containerInstance.enter();
      });
      this._openedSnackBarRef.dismiss();
    } else {
      snackBarRef.containerInstance.enter();
    }
  }
  /**
   * Creates a new overlay and places it in the correct location.
   * @param config The user-specified snack bar config.
   */
  _createOverlay(config) {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = config.direction;
    const positionStrategy = createGlobalPositionStrategy(this._injector);
    const isRtl = config.direction === "rtl";
    const isLeft = config.horizontalPosition === "left" || config.horizontalPosition === "start" && !isRtl || config.horizontalPosition === "end" && isRtl;
    const isRight = !isLeft && config.horizontalPosition !== "center";
    if (isLeft) {
      positionStrategy.left("0");
    } else if (isRight) {
      positionStrategy.right("0");
    } else {
      positionStrategy.centerHorizontally();
    }
    if (config.verticalPosition === "top") {
      positionStrategy.top("0");
    } else {
      positionStrategy.bottom("0");
    }
    overlayConfig.positionStrategy = positionStrategy;
    overlayConfig.disableAnimations = this._animationsDisabled;
    return createOverlayRef(this._injector, overlayConfig);
  }
  /**
   * Creates an injector to be used inside of a snack bar component.
   * @param config Config that was used to create the snack bar.
   * @param snackBarRef Reference to the snack bar.
   */
  _createInjector(config, snackBarRef) {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRef },
        { provide: MAT_SNACK_BAR_DATA, useValue: config.data }
      ]
    });
  }
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBar, deps: [], target: FactoryTarget.Injectable });
  static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBar, providedIn: "root" });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBar, decorators: [{
  type: Injectable,
  args: [{ providedIn: "root" }]
}], ctorParameters: () => [] });
var DIRECTIVES = [MatSnackBarContainer, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction];
var MatSnackBarModule = class _MatSnackBarModule {
  static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarModule, deps: [], target: FactoryTarget.NgModule });
  static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarModule, imports: [
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatCommonModule,
    SimpleSnackBar,
    MatSnackBarContainer,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction
  ], exports: [MatCommonModule, MatSnackBarContainer, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction] });
  static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _MatSnackBarModule, providers: [MatSnackBar], imports: [
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatCommonModule,
    SimpleSnackBar,
    MatCommonModule
  ] });
};
\u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: MatSnackBarModule, decorators: [{
  type: NgModule,
  args: [{
    imports: [
      OverlayModule,
      PortalModule,
      MatButtonModule,
      MatCommonModule,
      SimpleSnackBar,
      ...DIRECTIVES
    ],
    exports: [MatCommonModule, ...DIRECTIVES],
    providers: [MatSnackBar]
  }]
}] });

// src/app/services/theme.service.ts
init_tslib_es6();
init_core();
init_common();

// src/app/services/preferences.service.ts
init_tslib_es6();
init_core();
init_http();
init_esm();
init_brand_config_service();
var PreferencesService = class PreferencesService2 {
  http = inject(HttpClient);
  brandConfig = inject(BrandConfigService);
  pinnedModulesSubject = new BehaviorSubject([]);
  pinnedModules$ = this.pinnedModulesSubject.asObservable();
  get apiUrl() {
    return this.brandConfig.getApiUrl();
  }
  getUserPreferences() {
    return this.http.get(`${this.apiUrl}/preferences`);
  }
  saveUserPreferences(preferences) {
    const payload = {};
    if (preferences.theme)
      payload.theme = preferences.theme;
    if (preferences.primaryColor)
      payload.primaryColor = preferences.primaryColor;
    if (preferences.accentColor)
      payload.accentColor = preferences.accentColor;
    if (preferences.secondaryColor)
      payload.secondaryColor = preferences.secondaryColor;
    if (preferences.currency)
      payload.currency = preferences.currency;
    if (preferences.currencySymbol)
      payload.currencySymbol = preferences.currencySymbol;
    if (preferences.pinnedModules)
      payload.pinnedModules = preferences.pinnedModules;
    if (preferences.dashboardPreferences)
      payload.dashboardPreferences = preferences.dashboardPreferences;
    return this.http.post(`${this.apiUrl}/preferences`, payload);
  }
  togglePinnedModule(moduleId) {
    return this.http.post(`${this.apiUrl}/preferences/toggle-pinned-module`, { moduleId });
  }
  saveDashboardPreferences(preferences) {
    return this.http.post(`${this.apiUrl}/preferences/dashboard`, preferences);
  }
  updatePinnedModules(pinnedModules) {
    this.pinnedModulesSubject.next(pinnedModules);
  }
};
PreferencesService = __decorate([
  Injectable({ providedIn: "root" })
], PreferencesService);

// src/app/services/theme.service.ts
init_auth_service();
init_esm();
var MODULE_THEMES = {
  "user-management": { primary: "#2196f3", accent: "#ff9800", secondary: "#607d8b" },
  "organization-management": { primary: "#4caf50", accent: "#ffc107", secondary: "#795548" },
  "project-management": { primary: "#9c27b0", accent: "#e91e63", secondary: "#673ab7" },
  "crm": { primary: "#ff5722", accent: "#00bcd4", secondary: "#3f51b5" },
  "hr-management": { primary: "#8bc34a", accent: "#ff9800", secondary: "#607d8b" },
  "tasks-management": { primary: "#f44336", accent: "#ffeb3b", secondary: "#9e9e9e" },
  "project-tracking": { primary: "#00bcd4", accent: "#4caf50", secondary: "#795548" },
  "project-timesheet": { primary: "#673ab7", accent: "#e91e63", secondary: "#607d8b" },
  "messages": { primary: "#10B981", accent: "#EF4444", secondary: "#374151" },
  "notifications": { primary: "#8b5cf6", accent: "#f59e0b", secondary: "#64748b" },
  "search": { primary: "#6366f1", accent: "#f59e0b", secondary: "#64748b" }
};
var ThemeService = class ThemeService2 {
  platformId;
  preferencesService = inject(PreferencesService);
  authService = inject(AuthService);
  currentPreferences = {};
  mediaQuery;
  themeSubject = new BehaviorSubject("light");
  moduleThemeSubject = new BehaviorSubject(null);
  currentTheme$ = this.themeSubject.asObservable();
  currentModuleTheme$ = this.moduleThemeSubject.asObservable();
  isDarkTheme = signal(false);
  constructor(platformId) {
    this.platformId = platformId;
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaQuery.addEventListener("change", () => this.handleSystemThemeChange());
    }
  }
  loadAndApplyUserTheme() {
    if (!isPlatformBrowser(this.platformId))
      return;
    const brandColors = this.getBrandColors();
    const defaultPrefs = {
      theme: "light",
      primaryColor: brandColors.primary,
      secondaryColor: brandColors.secondary,
      accentColor: brandColors.accent
    };
    if (!this.authService.isAuthenticated()) {
      this.applyTheme(defaultPrefs);
      return;
    }
    this.preferencesService.getUserPreferences().subscribe({
      next: (userPrefs) => {
        if (userPrefs && (userPrefs.theme || userPrefs.primaryColor)) {
          this.applyTheme(__spreadValues(__spreadValues({}, defaultPrefs), userPrefs));
        } else {
          this.loadOrganizationTheme(defaultPrefs);
        }
      },
      error: (error) => {
        console.log("No user preferences found, checking organization theme");
        this.loadOrganizationTheme(defaultPrefs);
      }
    });
  }
  loadOrganizationTheme(defaultPrefs) {
    const user = this.authService.getCurrentUser();
    if (user?.organizationId) {
      const currentOrg = user.organizations?.find((org) => org.id === user.organizationId);
      if (currentOrg?.settings) {
        const orgSettings = currentOrg.settings;
        const orgPrefs = __spreadProps(__spreadValues({}, defaultPrefs), {
          primaryColor: orgSettings.primaryColor || defaultPrefs.primaryColor,
          secondaryColor: orgSettings.secondaryColor || defaultPrefs.secondaryColor,
          accentColor: orgSettings.accentColor || defaultPrefs.accentColor,
          theme: orgSettings.theme || defaultPrefs.theme
        });
        console.log("Applying organization theme:", orgPrefs);
        this.applyTheme(orgPrefs);
        return;
      }
    }
    console.log("Applying app default theme:", defaultPrefs);
    this.applyTheme(defaultPrefs);
  }
  onOrganizationChange() {
    this.loadAndApplyUserTheme();
  }
  handleSystemThemeChange() {
    if (this.currentPreferences.theme === "auto") {
      this.applyTheme(this.currentPreferences, this.moduleThemeSubject.value || void 0);
    }
  }
  applyTheme(preferences = {}, moduleTheme) {
    if (!isPlatformBrowser(this.platformId))
      return;
    this.currentPreferences = __spreadValues({}, preferences);
    const root = document.documentElement;
    const body = document.body;
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = preferences.theme || "light";
    if (theme === "auto") {
      theme = isDarkMode ? "dark" : "light";
    }
    this.isDarkTheme.set(theme === "dark");
    this.themeSubject.next(theme);
    if (moduleTheme) {
      this.moduleThemeSubject.next(moduleTheme);
    }
    const baseColors = this.getBaseThemeColors(theme, preferences);
    const finalColors = moduleTheme ? __spreadValues(__spreadValues({}, baseColors), moduleTheme.colors) : baseColors;
    this.applyCSSVariables(finalColors);
    this.applyThemeClass(theme);
  }
  getBaseThemeColors(theme, preferences) {
    const brandColors = this.getBrandColors();
    const themeColors = {
      light: {
        primary: preferences.primaryColor || brandColors.primary || "#1976d2",
        secondary: preferences.secondaryColor || brandColors.secondary || "#dc004e",
        accent: preferences.accentColor || brandColors.accent || "#ffc107",
        background: "#fafafa",
        surface: "#ffffff",
        onSurface: "#212121",
        onPrimary: "#ffffff",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336"
      },
      dark: {
        primary: preferences.primaryColor || this.adjustColorForDarkMode(brandColors.primary) || "#90caf9",
        secondary: preferences.secondaryColor || this.adjustColorForDarkMode(brandColors.secondary) || "#f48fb1",
        accent: preferences.accentColor || this.adjustColorForDarkMode(brandColors.accent) || "#ffcc02",
        background: "#121212",
        surface: "#1e1e1e",
        onSurface: "#e0e0e0",
        onPrimary: "#000000",
        success: "#66bb6a",
        warning: "#ffb74d",
        error: "#ef5350"
      }
    };
    return themeColors[theme] || themeColors.light;
  }
  getBrandColors() {
    if (typeof window !== "undefined" && window.brandConfig) {
      return window.brandConfig.colors;
    }
    return { primary: "#1976d2", secondary: "#dc004e", accent: "#ffc107" };
  }
  adjustColorForDarkMode(color) {
    if (!color)
      return color;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const newR = Math.min(255, Math.floor(r * 1.4));
    const newG = Math.min(255, Math.floor(g * 1.4));
    const newB = Math.min(255, Math.floor(b * 1.4));
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }
  applyCSSVariables(colors) {
    const root = document.documentElement;
    Object.entries({
      "--theme-primary": colors.primary,
      "--theme-secondary": colors.secondary,
      "--theme-accent": colors.accent,
      "--theme-background": colors.background,
      "--theme-surface": colors.surface,
      "--theme-on-surface": colors.onSurface,
      "--theme-on-primary": colors.onPrimary,
      "--theme-success": colors.success,
      "--theme-warning": colors.warning,
      "--theme-error": colors.error,
      "--mdc-theme-primary": colors.primary,
      "--mdc-theme-secondary": colors.secondary,
      "--mat-toolbar-background-color": colors.primary
    }).forEach(([property, value2]) => {
      root.style.setProperty(property, value2);
    });
  }
  applyThemeClass(theme) {
    const body = document.body;
    body.className = body.className.replace(/\b\w+-theme\b/g, "").trim();
    body.classList.add(`${theme}-theme`);
    document.documentElement.style.setProperty("color-scheme", theme);
  }
  setModuleTheme(moduleTheme) {
    this.applyTheme(this.currentPreferences, moduleTheme);
  }
  clearModuleTheme() {
    this.moduleThemeSubject.next(null);
    this.applyTheme(this.currentPreferences);
  }
  getModuleTheme(moduleId) {
    const colors = MODULE_THEMES[moduleId];
    if (!colors)
      return null;
    return {
      id: moduleId,
      name: moduleId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      colors,
      enabled: true
    };
  }
  applyModuleTheme(moduleId) {
    const moduleTheme = this.getModuleTheme(moduleId);
    if (moduleTheme) {
      this.setModuleTheme(moduleTheme);
    }
  }
  toggleTheme() {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    const newPrefs = __spreadProps(__spreadValues({}, this.currentPreferences), { theme: newTheme });
    this.applyTheme(newPrefs);
    if (this.authService.isAuthenticated()) {
      this.preferencesService.saveUserPreferences({ theme: newTheme }).subscribe({
        error: (error) => console.warn("Failed to save theme preference:", error)
      });
    }
  }
  getCurrentTheme() {
    return this.themeSubject.value;
  }
  getAvailableModuleThemes() {
    return Object.keys(MODULE_THEMES);
  }
  previewTheme(colors, duration = 3e3) {
    const originalColors = this.getCurrentColors();
    const previewColors = __spreadValues(__spreadValues({}, this.getBaseThemeColors(this.getCurrentTheme(), this.currentPreferences)), colors);
    this.applyCSSVariables(previewColors);
    setTimeout(() => {
      this.applyCSSVariables(originalColors);
    }, duration);
  }
  getCurrentColors() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    return {
      primary: style.getPropertyValue("--theme-primary").trim(),
      secondary: style.getPropertyValue("--theme-secondary").trim(),
      accent: style.getPropertyValue("--theme-accent").trim(),
      background: style.getPropertyValue("--theme-background").trim(),
      surface: style.getPropertyValue("--theme-surface").trim(),
      onSurface: style.getPropertyValue("--theme-on-surface").trim(),
      onPrimary: style.getPropertyValue("--theme-on-primary").trim(),
      success: style.getPropertyValue("--theme-success").trim(),
      warning: style.getPropertyValue("--theme-warning").trim(),
      error: style.getPropertyValue("--theme-error").trim()
    };
  }
  static ctorParameters = () => [
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID] }] }
  ];
};
ThemeService = __decorate([
  Injectable({
    providedIn: "root"
  })
], ThemeService);

// src/app/app.ts
init_auth_service();
init_brand_config_service();

// src/app/services/pwa.service.ts
init_tslib_es6();
init_core();
init_common();
init_esm();
var PwaService = class PwaService2 {
  platformId = inject(PLATFORM_ID);
  deferredPrompt;
  swRegistration = null;
  installableSubject = new BehaviorSubject(false);
  updateAvailableSubject = new BehaviorSubject(false);
  installable$ = this.installableSubject.asObservable();
  updateAvailable$ = this.updateAvailableSubject.asObservable();
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initPWA();
    }
  }
  initPWA() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installableSubject.next(true);
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        this.swRegistration = registration;
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                this.updateAvailableSubject.next(true);
              }
            });
          }
        });
      }).catch((error) => console.log("SW registration failed:", error));
    }
  }
  installPWA() {
    return __async(this, null, function* () {
      if (!this.deferredPrompt)
        return false;
      this.deferredPrompt.prompt();
      const { outcome } = yield this.deferredPrompt.userChoice;
      if (outcome === "accepted") {
        this.deferredPrompt = null;
        this.installableSubject.next(false);
        return true;
      }
      return false;
    });
  }
  updatePWA() {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  }
  isInstallable() {
    return this.installableSubject.value;
  }
  isUpdateAvailable() {
    return this.updateAvailableSubject.value;
  }
  static ctorParameters = () => [];
};
PwaService = __decorate([
  Injectable({
    providedIn: "root"
  })
], PwaService);

// src/app/components/pwa-update-alert.component.ts
init_tslib_es6();

// angular:jit:style:inline:src/app/components/pwa-update-alert.component.ts;CiAgICAudXBkYXRlLWFsZXJ0IHsKICAgICAgZGlzcGxheTogZmxleDsKICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwogICAgICBnYXA6IDE2cHg7CiAgICAgIHBhZGRpbmc6IDRweDsKICAgICAgbWluLXdpZHRoOiAzNTBweDsKICAgIH0KCiAgICAuYWxlcnQtY29udGVudCB7CiAgICAgIGRpc3BsYXk6IGZsZXg7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgIGdhcDogMTJweDsKICAgICAgZmxleDogMTsKICAgIH0KCiAgICAudXBkYXRlLWljb24gewogICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzNCODJGNik7CiAgICAgIGZvbnQtc2l6ZTogMjRweDsKICAgIH0KCiAgICAuYWxlcnQtdGV4dCB7CiAgICAgIGRpc3BsYXk6IGZsZXg7CiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgICAgIGdhcDogMnB4OwogICAgfQoKICAgIC5hbGVydC10aXRsZSB7CiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7CiAgICAgIGNvbG9yOiAjMWUyOTNiOwogICAgICBmb250LXNpemU6IDAuOTVyZW07CiAgICB9CgogICAgLmFsZXJ0LW1lc3NhZ2UgewogICAgICBmb250LXNpemU6IDAuODVyZW07CiAgICAgIGNvbG9yOiAjNjQ3NDhiOwogICAgfQoKICAgIC5hbGVydC1hY3Rpb25zIHsKICAgICAgZGlzcGxheTogZmxleDsKICAgICAgZ2FwOiA4cHg7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICB9CgogICAgLmRpc21pc3MtYnRuIHsKICAgICAgY29sb3I6ICM2NDc0OGI7CiAgICAgIGZvbnQtc2l6ZTogMC45cmVtOwogICAgfQoKICAgIC51cGRhdGUtYnRuIHsKICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tcHJpbWFyeS1jb2xvciwgIzNCODJGNiksIHZhcigtLWFjY2VudC1jb2xvciwgI0Y1OUUwQikpOwogICAgICBjb2xvcjogd2hpdGU7CiAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7CiAgICAgIHBhZGRpbmc6IDhweCAxNnB4OwogICAgICBmb250LXNpemU6IDAuOXJlbTsKICAgICAgZm9udC13ZWlnaHQ6IDUwMDsKICAgIH0KCiAgICAudXBkYXRlLWJ0biBtYXQtaWNvbiB7CiAgICAgIGZvbnQtc2l6ZTogMThweDsKICAgICAgbWFyZ2luLXJpZ2h0OiA0cHg7CiAgICB9CgogICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4MHB4KSB7CiAgICAgIC51cGRhdGUtYWxlcnQgewogICAgICAgIG1pbi13aWR0aDogMjgwcHg7CiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsKICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDsKICAgICAgICBnYXA6IDEycHg7CiAgICAgIH0KICAgICAgCiAgICAgIC5hbGVydC1hY3Rpb25zIHsKICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOwogICAgICB9CiAgICB9CiAg
var pwa_update_alert_component_default = "/* angular:styles/component:scss;9f5f3ab46ac79385bd3a7b78bb4f0398bf776a24a6ac47832437d9037fae9a04;/Users/rvshekhar/Desktop/Projects_Dev/Bhuri-SAP/frontend/src/app/components/pwa-update-alert.component.ts */\n.update-alert {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 4px;\n  min-width: 350px;\n}\n.alert-content {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex: 1;\n}\n.update-icon {\n  color: var(--primary-color, #3B82F6);\n  font-size: 24px;\n}\n.alert-text {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.alert-title {\n  font-weight: 600;\n  color: #1e293b;\n  font-size: 0.95rem;\n}\n.alert-message {\n  font-size: 0.85rem;\n  color: #64748b;\n}\n.alert-actions {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.dismiss-btn {\n  color: #64748b;\n  font-size: 0.9rem;\n}\n.update-btn {\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary-color, #3B82F6),\n      var(--accent-color, #F59E0B));\n  color: white;\n  border-radius: 20px;\n  padding: 8px 16px;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.update-btn mat-icon {\n  font-size: 18px;\n  margin-right: 4px;\n}\n@media (max-width: 480px) {\n  .update-alert {\n    min-width: 280px;\n    flex-direction: column;\n    align-items: stretch;\n    gap: 12px;\n  }\n  .alert-actions {\n    justify-content: flex-end;\n  }\n}\n/*# sourceMappingURL=pwa-update-alert.component.css.map */\n";

// src/app/components/pwa-update-alert.component.ts
init_core();
init_common();
init_button();
init_icon();
var PwaUpdateAlertComponent = class PwaUpdateAlertComponent2 {
  pwaService = inject(PwaService);
  snackBarRef = inject(MatSnackBarRef);
  updateApp() {
    this.pwaService.updatePWA();
    this.snackBarRef.dismiss();
  }
  dismiss() {
    this.snackBarRef.dismiss();
  }
};
PwaUpdateAlertComponent = __decorate([
  Component({
    selector: "app-pwa-update-alert",
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    template: `
    <div class="update-alert">
      <div class="alert-content">
        <mat-icon class="update-icon">system_update</mat-icon>
        <div class="alert-text">
          <span class="alert-title">New version available!</span>
          <span class="alert-message">Update now to get the latest features</span>
        </div>
      </div>
      <div class="alert-actions">
        <button mat-button (click)="dismiss()" class="dismiss-btn">Later</button>
        <button mat-raised-button color="primary" (click)="updateApp()" class="update-btn">
          <mat-icon>refresh</mat-icon>
          Update
        </button>
      </div>
    </div>
  `,
    styles: [pwa_update_alert_component_default]
  })
], PwaUpdateAlertComponent);

// src/app/app.ts
init_websocket_service();

// src/app/services/messages.service.ts
init_tslib_es6();
init_core();
init_http();
init_esm();
init_operators();
init_brand_config_service();
init_websocket_service();
init_auth_service();
var MessagesApiService = class MessagesApiService2 {
  initialLoadHandled = false;
  http = inject(HttpClient);
  brand = inject(BrandConfigService);
  injector = inject(Injector);
  get api() {
    return this.brand.getApiUrl();
  }
  // Merged from MessageCountService
  wsService = inject(WebSocketService);
  messageCount = signal(0);
  onlineUsers = signal(/* @__PURE__ */ new Set());
  constructor() {
    this.setupSocketListeners();
    this.listenToAuthChanges();
  }
  listenToAuthChanges() {
    try {
      const authService = this.injector.get(AuthService);
      authService.currentUser$.subscribe((user) => {
        if (user) {
          this.fetchInitialUnreadCount();
        } else {
          this.setMessageCount(0);
        }
      });
    } catch (e) {
      console.warn("AuthService not available for subscription");
    }
  }
  setupSocketListeners() {
    this.wsService.getMessages().subscribe((message) => {
      if (message?.type === "message:count") {
        this.setMessageCount(message.payload.count);
      } else if (message?.type === "user:online") {
        this.onlineUsers.update((users) => {
          const newSet = new Set(users);
          newSet.add(message.payload.userId);
          return newSet;
        });
      } else if (message?.type === "user:offline") {
        this.onlineUsers.update((users) => {
          const newSet = new Set(users);
          newSet.delete(message.payload.userId);
          return newSet;
        });
      }
    });
    this.wsService.getConnectionStatus().subscribe((connected) => {
      if (connected) {
        this.fetchInitialUnreadCount();
      }
    });
  }
  fetchInitialUnreadCount() {
    let authService;
    try {
      authService = this.injector.get(AuthService);
    } catch (e) {
      console.warn("AuthService not available yet");
      return;
    }
    if (!authService.isAuthenticated()) {
      return;
    }
    this.getUnreadCount().subscribe({
      next: (counts) => {
        const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
        this.setMessageCount(totalUnread);
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error("Failed to fetch initial unread count:", err);
        }
      }
    });
  }
  setMessageCount(count) {
    this.messageCount.set(count);
  }
  isUserOnline(userId) {
    return this.onlineUsers().has(userId);
  }
  // Merged from MessagesUtilsService
  getOrgInitials(orgName) {
    if (!orgName)
      return "ORG";
    return orgName.split(" ").map((word) => word.charAt(0).toUpperCase()).slice(0, 2).join("");
  }
  getOrgGradient(orgName) {
    const colors = ["#667eea,#764ba2", "#f093fb,#f5576c", "#4facfe,#00f2fe", "#43e97b,#38f9d7"];
    const index = orgName.length % colors.length;
    return `linear-gradient(135deg, ${colors[index]})`;
  }
  avatarUrl(email) {
    const hash = encodeURIComponent(email || "user");
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }
  filterMembers(members, query) {
    if (!query.trim())
      return members;
    const q = query.toLowerCase();
    return members.filter((m) => `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q));
  }
  getAttachmentIcon(type) {
    if (type.startsWith("image/"))
      return "image";
    if (type.includes("pdf"))
      return "picture_as_pdf";
    if (type.includes("document") || type.includes("word"))
      return "description";
    return "attach_file";
  }
  getStatusIcon(status) {
    switch (status) {
      case "sending":
        return "schedule";
      case "sent":
        return "check";
      case "delivered":
        return "done_all";
      case "read":
        return "done_all";
      default:
        return "check";
    }
  }
  // State management
  messageState = signal({ loading: false, error: null, sending: false });
  typingUsers = new BehaviorSubject({});
  unreadMessages = new BehaviorSubject({});
  getMessageState = this.messageState.asReadonly();
  getTypingUsers = () => this.typingUsers.asObservable();
  getUnreadMessages = () => this.unreadMessages.asObservable();
  setUnreadMessage(userId, hasUnread) {
    const current = this.unreadMessages.value;
    this.unreadMessages.next(__spreadProps(__spreadValues({}, current), { [userId]: hasUnread }));
  }
  clearUnreadMessage(userId) {
    const current = this.unreadMessages.value;
    const updated = __spreadValues({}, current);
    delete updated[userId];
    this.unreadMessages.next(updated);
  }
  getOrganizationsWithMembers() {
    this.messageState.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: null }));
    return this.http.get(`${this.api}/messages/org-members`).pipe(finalize(() => this.messageState.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }))));
  }
  getOrCreateDM(organizationId, otherUserId) {
    return this.http.post(`${this.api}/messages/dm/${organizationId}/${otherUserId}`, {});
  }
  listConversations(organizationId) {
    return this.http.get(`${this.api}/messages/conversations/${organizationId}`);
  }
  listMessages(conversationId, limit = 50, before) {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (before)
      params.set("before", before);
    return this.http.get(`${this.api}/messages/chat/${conversationId}?${params.toString()}`);
  }
  sendMessage(conversationId, content) {
    this.messageState.update((s) => __spreadProps(__spreadValues({}, s), { sending: true }));
    return this.http.post(`${this.api}/messages/chat/${conversationId}`, {
      content
    }).pipe(finalize(() => this.messageState.update((s) => __spreadProps(__spreadValues({}, s), { sending: false }))));
  }
  // Enhanced messaging features
  addReaction(messageId, emoji) {
    return this.http.post(`${this.api}/messages/${messageId}/reactions`, { emoji });
  }
  removeReaction(messageId, emoji) {
    return this.http.delete(`${this.api}/messages/${messageId}/reactions/${emoji}`);
  }
  markAsRead(conversationId) {
    return this.http.post(`${this.api}/messages/chat/${conversationId}/read`, {}).pipe(finalize(() => {
      this.getUnreadCount().subscribe((counts) => {
        const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
        this.setMessageCount(totalUnread);
      });
    }));
  }
  setTyping(conversationId, isTyping) {
    return this.http.post(`${this.api}/messages/chat/${conversationId}/typing`, { isTyping });
  }
  uploadAttachment(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.api}/messages/attachments`, formData);
  }
  searchMessages(query, conversationId) {
    const params = new URLSearchParams();
    params.set("q", query);
    if (conversationId)
      params.set("conversationId", conversationId);
    return this.http.get(`${this.api}/messages/search?${params.toString()}`);
  }
  // Create group conversation
  createGroup(organizationId, name, memberIds) {
    return this.http.post(`${this.api}/messages/group/${organizationId}`, {
      name,
      memberIds
    });
  }
  getUnreadCount() {
    return this.http.get(`${this.api}/messages/unread-count`);
  }
  static ctorParameters = () => [];
};
MessagesApiService = __decorate([
  Injectable({ providedIn: "root" })
], MessagesApiService);

// src/app/app.ts
init_operators();
var App = class App2 {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  brandConfigService = inject(BrandConfigService);
  pwaService = inject(PwaService);
  wsService = inject(WebSocketService);
  messagesService = inject(MessagesApiService);
  snackBar = inject(MatSnackBar);
  platformId = inject(PLATFORM_ID);
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const colors = this.brandConfigService.getColors();
      document.documentElement.style.setProperty("--primary-color", colors.primary);
      document.documentElement.style.setProperty("--accent-color", colors.accent);
      document.documentElement.style.setProperty("--secondary-color", colors.secondary);
    }
    this.authService.currentUser$.pipe(delay(100)).subscribe((user) => {
      if (user && this.authService.getToken()) {
        console.log("User changed:", user);
        this.themeService.loadAndApplyUserTheme();
        if (isPlatformBrowser(this.platformId)) {
          this.wsService.connectWithAuth(user, this.authService.getToken());
          this.wsService.getMessages().subscribe((msg) => {
            console.log("App component received WebSocket message:", msg);
            if (msg?.type === "message:count" && msg?.payload?.count !== void 0) {
              console.log("Backend sent message count:", msg.payload.count, "- ignoring and fetching correct count");
              this.messagesService.getUnreadCount().subscribe({
                next: (counts) => {
                  const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
                  console.log("Fetched correct unread count:", totalUnread);
                  this.messagesService.setMessageCount(totalUnread);
                },
                error: (err) => console.error("Failed to fetch correct message count:", err)
              });
            } else if (msg?.type === "notification:new") {
              console.log("Received notification, updating notification badge");
            } else if (msg?.type === "notification:count" && msg?.payload?.count !== void 0) {
              console.log("Received notification count:", msg.payload.count);
            } else if (msg?.type === "notification:new" && msg?.payload?.notification?.type === "message") {
              console.log("Received message notification, fetching updated count");
              this.messagesService.getUnreadCount().subscribe({
                next: (counts) => {
                  const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
                  this.messagesService.setMessageCount(totalUnread);
                },
                error: (err) => console.error("Failed to fetch updated message count:", err)
              });
            }
          });
          setTimeout(() => {
            this.messagesService.getUnreadCount().subscribe({
              next: (counts) => {
                const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
                this.messagesService.setMessageCount(totalUnread);
              },
              error: (err) => console.error("Failed to fetch initial message count:", err)
            });
          }, 500);
        }
      } else {
        this.themeService.applyTheme();
        if (isPlatformBrowser(this.platformId)) {
          this.wsService.disconnect();
          this.messagesService.setMessageCount(0);
        }
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      this.pwaService.updateAvailable$.subscribe((updateAvailable) => {
        if (updateAvailable) {
          this.showUpdateAlert();
        }
      });
    }
  }
  showUpdateAlert() {
    this.snackBar.openFromComponent(PwaUpdateAlertComponent, {
      duration: 0,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ["pwa-update-snackbar"]
    });
  }
};
App = __decorate([
  Component({
    selector: "app-root",
    imports: [RouterOutlet],
    template: app_default,
    styles: [app_default2]
  })
], App);

// src/app/app.spec.ts
describe("App", () => {
  beforeEach(() => __async(null, null, function* () {
    yield TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  }));
  it("should create the app", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it("should render title", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("h1")?.textContent).toContain("Hello, beax-rm");
  });
});
//# sourceMappingURL=spec-app-app.spec.js.map
