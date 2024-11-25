import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LearningPackageService } from '../../services/learning-package.service';
import { LearningPackage } from '../../models/learning-package.model';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {
  packages: LearningPackage[] = [];

  constructor(
    private packageService: LearningPackageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe((data) => {
      this.packages = data;
    });
  }

  addPackage(): void {
    this.router.navigate(['/packages/new']);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/packages', id]);
  }

  editPackage(id: number): void {
    this.router.navigate(['/packages/edit', id]);
  }

  deletePackage(id: number): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.packageService.deletePackage(id).subscribe(() => {
        this.loadPackages();
      });
    }
  }
}
