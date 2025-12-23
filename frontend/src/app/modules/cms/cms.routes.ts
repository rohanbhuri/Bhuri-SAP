import { Routes } from '@angular/router';
import { PageListComponent } from './components/page-list/page-list.component';
import { PageEditorComponent } from './components/page-editor/page-editor.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogEditorComponent } from './components/blog-editor/blog-editor.component';

export const CMS_ROUTES: Routes = [
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: 'pages', component: PageListComponent },
    { path: 'pages/new', component: PageEditorComponent },
    { path: 'pages/:id/edit', component: PageEditorComponent },
    { path: 'blogs', component: BlogListComponent },
    { path: 'blogs/new', component: BlogEditorComponent },
    { path: 'blogs/:id/edit', component: BlogEditorComponent }
];
