class Link extends HTMLElement {
  static get observedAttributes() {return ['to', 'replace']; }

  constructor() {
    super();

    this.addEventListener('click', this.onClick);

    this.router = document.querySelector('a-router');
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        .link {
          text-decoration: var(--link-decoration, none);
          color: var(--link-color, #000);
        }
      </style>
      <a class="link" href="${this.getAttribute('to')}">
        <slot></slot>
      </a>
    `;
  }

  historyPush(path) {
    this.router.history.push(path);
  }
  
  historyReplace(path) {
    this.router.history.replace(path);
  }

  onClick(event) {
    const to = this.getAttribute('to');
    const replace = this.getAttribute('replace');
    event.preventDefault();

    replace ? this.historyReplace(to) : this.historyPush(to);
  }
}

window.addEventListener('WebComponentsReady', function () {
  customElements.define("a-link", Link, {
    extends: HTMLLinkElement
  });
});