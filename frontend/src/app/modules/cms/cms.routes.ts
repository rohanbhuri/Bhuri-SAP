import { Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import { PagesPageComponent } from './pages/pages-page.component';
import { BlogsPageComponent } from './pages/blogs-page.component';
import { MenusPageComponent } from './pages/menus-page.component';
import { MediaPageComponent } from './pages/media-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';

export const CMS_ROUTES: Routes = [
  {
    path: '',
    component: CmsComponent
  },
  {
    path: 'pages',
    component: PagesPageComponent
  },
  {
    path: 'blogs',
    component: BlogsPageComponent
  },
  {
    path: 'menus',
    component: MenusPageComponent
  },
  {
    path: 'media',
    component: MediaPageComponent
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent
  }
];