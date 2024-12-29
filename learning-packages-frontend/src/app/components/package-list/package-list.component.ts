import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LearningPackageService } from '../../services/learning-package.service';
import { WebSocketService } from '../../services/websocket.service';
import { LearningPackage } from '../../models/learning-package.model';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Learning Packages</h2>
        <div>
          <button class="btn btn-info me-2" (click)="viewStats()">View Stats</button>
          <button class="btn btn-success me-2" (click)="exportPackages()">
            Export Packages
          </button>
          <button class="btn btn-primary" (click)="addPackage()">
            Add Package
          </button>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Target Audience</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let pkg of packages">
            <td>{{ pkg.title }}</td>
            <td>{{ pkg.category }}</td>
            <td>{{ pkg.targetAudience }}</td>
            <td>{{ pkg.difficultyLevel }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" (click)="viewDetails(pkg.id)">View</button>
              <button class="btn btn-sm btn-warning me-2" (click)="editPackage(pkg.id)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="deletePackage(pkg.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PackageListComponent implements OnInit {
  packages: LearningPackage[] = [];

  constructor(
    private packageService: LearningPackageService,
    private webSocketService: WebSocketService,
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

  exportPackages() {
    console.log('Starting export');
    this.webSocketService.exportPackages().subscribe({
      next: (data) => {
        console.log('Export successful:', data);
      },
      error: (error) => {
        console.error('Export error:', error);
        alert('Error exporting packages. Please try again.');
      },
      complete: () => {
        console.log('Export completed');
      }
    });
  }

  viewStats(): void {
    this.router.navigate(['/stats']);
  }
}
