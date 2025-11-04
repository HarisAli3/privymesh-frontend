// Route definitions for the React app
export const routes = {
  home: '/',
  dashboard: '/dashboard',
  peers: '/peers',
  'peers.add': '/peers/add',
  'device.authorize': '/device/authorize',
  'settings.appearance': '/settings/appearance',
  'settings.profile': '/settings/profile',
  'settings.password': '/settings/password',
  login: '/login',
  register: '/register',
  logout: '/logout',
} as const;

export type RouteKey = keyof typeof routes;
