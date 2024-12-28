import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { PackageFormComponent } from './components/package-form/package-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/packages', pathMatch: 'full' },
  { path: 'packages', component: PackageListComponent },
  { path: 'packages/new', component: PackageFormComponent },
  { path: 'packages/edit/:id', component: PackageFormComponent },
  { path: 'packages/:id', component: PackageDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
