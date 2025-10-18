import '@/components';
import '@/layouts';
import '@/pages';

/**
 * @type {import('@vaadin/router').Route[]}
 */
export const routes = [
  {
    path: '/',
    component: 'main-layout',
    children: [
      {
        path: '',
        redirect: '/employee-list',
      },
      {
        path: '/employee-list',
        component: 'employee-list',
      },
      {
        path: '/add-employee',
        component: 'add-employee',
      },
      {
        path: '/edit-employee/:employeeId',
        component: 'edit-employee',
      },
      {
        path: '(.*)',
        component: 'not-found',
      },
    ],
  },
];
