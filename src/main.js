import { Router } from '@vaadin/router';
import { routes } from './routes';
import { i18nInit } from './i18n';

i18nInit.then(() => {
  const router = new Router(document.getElementById('app'));
  router.setRoutes(routes);
});
