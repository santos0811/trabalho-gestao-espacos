import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'espacos', renderMode: RenderMode.Server },
  { path: 'admin', renderMode: RenderMode.Server },
  {
    path: 'espacos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/form/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
