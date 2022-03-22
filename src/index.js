const styles = /*css*/ `
:host {
  background: red;
  width: 2rem;
  height: 2rem;
  mask: var(--icon) center / contain no-repeat;
  -webkit-mask: var(--icon) center / contain no-repeat;
}
`

class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    this._mode = 'light';

    this.attachShadow({mode: 'open'});
    const style = document.createElement('style');
    style.textContent = styles;
    this.shadowRoot.appendChild(style);
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    this._mode = mode;
    this._isForced = false;
    this.update();
    this.onChangeMode()
  }

  onChangeMode() {
    const html = document.documentElement;
    const isDark = this.mode == 'dark';
    html.classList.toggle('theme-dark', isDark);
    html.classList.toggle('theme-light', !isDark);
    html.dataset.colorScheme = this.mode;
    html.setAttribute('color-scheme', this.mode);
  }

  initDefault() {
    const mq = window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)');
    const setModeFromMq = () => {
      if (this._isForced) { return }
      this.mode = mq.matches? 'dark' : 'light'
    };

    setModeFromMq();
    this._mqEvent = mq.addEventListener('change', setModeFromMq);
  }

  connectedCallback() {
    this.setAttribute('aria-role', 'button');
    this.initDefault();
    this._toggleEvent = this.addEventListener('click', () => {
      this._isForced = true;
      this.mode = this.mode == 'light' ? 'dark' : 'light';
    });
  }

  disconnectedCallback() {
    this.removeEventListener(this._toggleEvent);
    this.removeEventListener(this._mqEvent);
  }

  update() {
    let icon = this.mode == 'light' ? 'sun-bold' : 'moon-fill'
    this.setAttribute('style', `--icon: url(https://api.iconify.design/ph:${icon}.svg)`);
  }
}

customElements.define("theme-switch", ThemeSwitch);
