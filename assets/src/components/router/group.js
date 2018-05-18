class Group extends HTMLElement {
  static get observedAttributes() {return ['root', 'history']; }

  constructor() {
    super();

    this.router = document.querySelector('a-router');
    this.parent = this.getParent();
  }

  initialize() {
    this.routes = [];
    this.renderGroup = [];
    this.noMatchGroup = [];
    this.hideGroup = [];

    this.transition = this.getAttribute('transition');
    this.enterTimeout = this.getAttribute('enterTimeout');
    this.exitTimeout = this.getAttribute('exitTimeout');

    this.path = this.parent.path;
    this.setInit();
  }

  connectedCallback() {
    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
      <slot></slot>
    `;

    if (this.parent.initialized) {
      this.initialize();
      return;
    }

    this.parent.addEventListener('initialized', () => {
      this.initialize();
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

  getParent() {
    let found = false;
    let parent = this.parentNode;

    while(!found) {
      if (parent.tagName === 'A-ROUTER' || 
          parent.tagName === 'A-ROUTE') {
        found = true;
      } else if (parent.tagName === 'BODY') {
        throw('You should not use a Switch outside of a router.');
      } else {
        parent = parent.parentNode;
      }
    }

    return parent;
  }

  render(route) {
    const children = Array.from(this.children).filter(c => c.tagName === 'A-ROUTE');
    
    this.routes.push(route);

    if (!route.getAttribute('path')) {
      this.noMatchGroup.push(route);
    } else if (route.checkMatch() && route.path) {
      this.renderGroup.push(route);
    } else {
      this.hideGroup.push(route);
    }

    if (this.routes.length === children.length) {
      if (this.renderGroup.length) {
        this.renderGroup.forEach(r => {
          r.show();
        });
        this.noMatchGroup.forEach(r => {
          r.hide();
        });
      } else {
        this.noMatchGroup.forEach(r => {
          r.show();
        });
      }

      this.hideGroup.forEach(r => {
        r.hide();
      });

      this.routes = [];
      this.renderGroup = [];
      this.noMatchGroup = [];
      this.hideGroup = [];
    }
  }
}

window
  .addEventListener('WebComponentsReady', function () {
    customElements.define("a-group", Group);
  });