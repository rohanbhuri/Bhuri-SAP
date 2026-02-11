import { Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import { BlogsPageComponent } from './pages/blogs-page.component';
import { NewsMediaPageComponent } from './pages/news-media-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';
import { CmsApiDocsComponent } from './pages/api-docs-page.component';

export const CMS_ROUTES: Routes = [
  {
    path: '',
    component: CmsComponent
  },
  {
    path: 'blogs',
    component: BlogsPageComponent
  },
  {
    path: 'news-media',
    component: NewsMediaPageComponent
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent
  },
  {
    path: 'api-doc',
    component: CmsApiDocsComponent
  }
];