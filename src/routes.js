import '@/components';
import '@/layouts';
import '@/pages';
import { Path } from './lib';

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
        redirect: Path.EmployeeList,
      },
      {
        path: Path.EmployeeList,
        component: 'employee-list',
      },
      {
        path: Path.AddEmployee,
        component: 'add-employee',
      },
      {
        path: Path.EditEmployee,
        component: 'edit-employee',
      },
      {
        path: '(.*)',
        component: 'not-found',
      },
    ],
  },
];
