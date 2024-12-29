import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageFormComponent } from './components/package-form/package-form.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { PackageStatsComponent } from './components/package-stats/package-stats.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'packages', component: PackageListComponent, canActivate: [AuthGuard] },
  { path: 'packages/new', component: PackageFormComponent, canActivate: [AuthGuard] },
  { path: 'packages/edit/:id', component: PackageFormComponent, canActivate: [AuthGuard] },
  { path: 'packages/:id', component: PackageDetailComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: PackageStatsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/packages', pathMatch: 'full' },
  { path: '**', redirectTo: '/packages' }
];