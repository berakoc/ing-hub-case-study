import { directive, AsyncDirective } from 'lit/async-directive.js';
import { nothing } from 'lit';
import i18next from '@/i18n';

export class TranslateDirective extends AsyncDirective {
  render(key, options) {
    return i18next.t(key, options) || nothing;
  }

  update(_part, [key, options]) {
    if (!this._listener) {
      this._listener = () => this._updateValue(key, options);
      i18next.on('languageChanged', this._listener);
    }

    if (this._key !== key || this._options !== options) {
      this._key = key;
      this._options = options;
      this._updateValue(key, options);
    }

    return this.render(key, options);
  }

  _updateValue(key, options) {
    this.setValue(i18next.t(key, options));
  }

  disconnected() {
    if (this._listener) {
      i18next.off('languageChanged', this._listener);
    }
  }
}

export const translate = directive(TranslateDirective);
