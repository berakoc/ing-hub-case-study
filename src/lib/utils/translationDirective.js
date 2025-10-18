// src/directives/translate.js
import { directive, AsyncDirective } from 'lit/async-directive.js';
import { nothing } from 'lit';
import i18next from '@/i18n';

class TranslateDirective extends AsyncDirective {
  render(key) {
    return i18next.t(key) || nothing;
  }

  update(_part, [key]) {
    if (!this._listener) {
      this._listener = () => this.setValue(i18next.t(key));
      i18next.on('languageChanged', this._listener);
    }
    return this.render(key);
  }

  disconnected() {
    if (this._listener) {
      i18next.off('languageChanged', this._listener);
    }
  }
}

export const translate = directive(TranslateDirective);
