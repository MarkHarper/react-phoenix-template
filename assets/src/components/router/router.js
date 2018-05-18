import {createBrowserHistory, createHashHistory} from 'history'

class Router extends HTMLElement {
  static get observedAttributes() {return ['root', 'history']; }

  constructor() {
    super();

    this.dispatchEvent(new CustomEvent('registered', {
      detail: {
        registered: true
      }
    }));

    this.registered = true;
  }

  initialize() {
    this.historyType = this.getAttribute('history') === 'hash' ? 'hash' : 'pathname';
    this.path = this.getAttribute('root');
    this.transition = this.getAttribute('transition');
    this.enterTimeout = this.getAttribute('enterTimeout');
    this.exitTimeout = this.getAttribute('exitTimeout');

    this.routes = [];
    this.subrouters = [];
    this.unknownRoutes = [];

    this.history = this.historyType === 'pathname' ? 
      createBrowserHistory({
        basename: this.path,
        forceRefresh: false
      }) :
      createHashHistory({
        basename: this.path,
        hashType: 'slash'
      });

    this.dispatchEvent(new CustomEvent('initialized', {
      detail: {
        initialized: true
      }
    }));
    this.initialized = true;

    this.history.listen((location, action) => {
      this.dispatchEvent(new CustomEvent('historyChange', {
        detail: {
          location: location,
          action: action
        }
      }));
    });
  }

  connectedCallback() {
    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
      <slot></slot>
    `;

    if (this.getAttribute('defer')) {
      return;
    }

    this.initialize();
  }

  redirect(path) {
    this.history.push(path, {});
  }
}

window
  .addEventListener('WebComponentsReady', function () {
    customElements.define("a-router", Router);
  });