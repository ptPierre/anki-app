import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { PackageFormComponent } from './components/package-form/package-form.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/packages', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'packages', component: PackageListComponent, canActivate: [AuthGuard] },
  { path: 'packages/new', component: PackageFormComponent, canActivate: [AuthGuard] },
  { path: 'packages/edit/:id', component: PackageFormComponent, canActivate: [AuthGuard] },
  { path: 'packages/:id', component: PackageDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
