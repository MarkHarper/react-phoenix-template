import matchPath from './matchPath'

class Route extends HTMLElement {
  static get observedAttributes() {return ['path', 'exact']; }

  constructor() {
    super();

    this.router = document.querySelector('a-router');
    this.parent = this.getParent();
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <slot name="active"></slot>
    `;

    if (this.parent.initialized) {
      this.initialize();

      return;
    }

    this.parent.addEventListener('initialized', () => {
      this.initialize();
    });
  }

  initialize() {
    this.path = this.getAttribute('path');
    this.block = this.getAttribute('block');
    
    this.setAnimationSettings();

    this.registerEvents();

    this.path = this.resolvePathFromHistory(this.path);
    this.setInit();
    this.handleRender();

    this.router.history.listen(() => {
      this.handleRender();
    });
  }

  setInit() {
    this.dispatchEvent(new CustomEvent('initialized', {
      detail: {
        initialized: true
      }
    }));
    this.initialized = true;
  }

  setAnimationSettings() {
    if (this.router.transition) {
      this.transition = this.router.transition;
      this.enterTimeout = this.router.enterTimeout;
      this.exitTimeout = this.router.exitTimeout;
    } else if (this.parent.tagName === 'A-GROUP' && this.parent.transition) {
      this.transition = this.parent.transition ? this.parent.transition : this.getAttribute('transition');
      this.enterTimeout = this.parent.enterTimeout ? this.parent.enterTimeout : this.getAttribute('enterTimeout');
      this.exitTimeout = this.parent.exitTimeout ? this.parent.exitTimeout : this.getAttribute('exitTimeout');
    } else {
      this.transition = this.getAttribute('transition');
      this.enterTimeout = this.getAttribute('enterTimeout');
      this.exitTimeout = this.getAttribute('exitTimeout');
    }

    if (this.transition && this.enterTimeout && this.exitTimeout) {
      this.transitionValid = true;
    }
  }

  getParent() {
    let found = false;
    let parent = this.parentNode;

    while(!found) {
      if (parent.tagName === 'A-ROUTER' || 
          parent.tagName === 'A-ROUTE' || 
          parent.tagName === 'A-GROUP') {
        found = true;
      } else if (parent.tagName === 'BODY') {
        throw('You should not use a Switch outside of a router.');
      } else {
        parent = parent.parentNode;
      }
    }

    return parent;
  }

  resolvePathFromHistory(path) {
    const basePath = this.parent.path;
    const historyType = this.router.historyType;
    
    const correctPath = (!path || path === '/') ? '' : path;
    const fullPath = (correctPath != null && correctPath.match(basePath)) ? correctPath : basePath + correctPath;
    if (historyType === 'hash' && fullPath != null && !fullPath.match('#')) {
      return `#${fullPath}`;
    } 

    return fullPath;
  }

  checkMatch() {
    const path = this.getAttribute('path') || null;
    
    return matchPath(location[this.router.historyType], { 
      path: this.resolvePathFromHistory(path), 
      exact: this.getAttribute('exact') || false
    });
  }

  registerEvents() {
    const data = { 
      detail: {
        route: this,
        redirect: this.router.redirect
      }
    };

    if (this.block) {
      data.detail.render = this.render;
    }

    this.enter = new CustomEvent(`willEnter`, 
      data);
    this.entered = new CustomEvent(`hasEntered`, 
      data);
    this.exit = new CustomEvent(`willExit`, 
      data);
    this.exited = new CustomEvent(`hasExited`, 
      data
    );
  }

  dispatch(event) {
    this.dispatchEvent(this[event]);
  }

  show() {
    this.dispatch('enter');
    
    if (this.transitionValid) this.classList.add(`${this.transition}-enter`);
    
    Array.from(this.children).forEach(c => {        
      if (c.getAttribute('slot') !== 'active') c.setAttribute('slot', 'active');
    });

    if (this.transitionValid) this.classList.add(`${this.transition}-enter-active`);

    if (this.transitionValid) {
      if (this.showTimeout) clearTimeout(this.showTimeout);
      this.showTimeout = setTimeout(() => {
        this.classList.add(`${this.transition}-exit`);
        this.classList.remove(`${this.transition}-enter`, `${this.transition}-enter-active`);
      }, parseInt(this.enterTimeout));
    }

    this.dispatch('entered');
  }

  hide() {
    this.dispatch('exit');
    
    if (this.transitionValid) {
      this.classList.add(`${this.transition}-exit-active`);

      if (this.hideTimeout) clearTimeout(this.hideTimeout);

      this.hideTimeout = setTimeout(() => {
        this.classList.add(`${this.transition}-enter`);
        this.classList.remove(`${this.transition}-exit`, `${this.transition}-exit-active`);
        Array.from(this.children).forEach(c => {
          if (c.getAttribute('slot') !== '') c.setAttribute('slot', '');
        });
      }, parseInt(this.exitTimeout));
    } else {
      Array.from(this.children).forEach(c => {
        if (c.getAttribute('slot') !== '') c.setAttribute('slot', '');
      });
    }    
    
    this.dispatch('exited');
  }

  handleRender() {
    if (this.block) return;

    if (this.parent.tagName !== 'A-GROUP') {
      this.render();
    } else {
      this.parent.render(this);
    }
  }

  render() {
    const match = this.checkMatch();
    const slot = this.getAttribute('slot');
    
    if (match && slot !== 'active' && this.getAttribute('path')) {
      this.show();
    } else {
      this.hide();
    }

    return {
      active: match ? true : false,
      unknownPath: !this.getAttribute('path') ? true : false
    };
  }
}

window.addEventListener('WebComponentsReady', function () {
  customElements.define("a-route", Route);
});