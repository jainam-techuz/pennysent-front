import { RouteInfo } from './vertical-menu.metadata';

export const ROUTES: RouteInfo[] = [
  /* {
    path: '', title: 'Reports', icon: 'ft-home', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { path: '/report/users', title: 'User Report', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/report/events', title: 'Event Report', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  }, */
  { path: '/user', title: 'Users', icon: 'ft-users', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/category', title: 'Categories', icon: 'ft-file-text', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/event', title: 'Events', icon: 'ft-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/faq', title: 'FAQs', icon: 'ft-help-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
]
