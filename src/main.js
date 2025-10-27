import { Router } from '@vaadin/router';
import { routes } from './routes';
import { i18nInit } from './i18n';
import './flatpickr-overrides.css';

i18nInit.then(() => {
  const router = new Router(document.getElementById('app'));
  router.setRoutes(routes);
});
