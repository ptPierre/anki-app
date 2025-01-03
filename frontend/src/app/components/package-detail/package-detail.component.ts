import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningPackageService } from '../../services/learning-package.service';
import { LearningPackage } from '../../models/learning-package.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  packageId!: number;
  package!: LearningPackage;

  constructor(
    private route: ActivatedRoute,
    private packageService: LearningPackageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.packageId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPackage();
  }

  loadPackage(): void {
    this.packageService.getPackageById(this.packageId).subscribe((data) => {
      this.package = data;
    });
  }

  editPackage(): void {
    this.router.navigate(['/packages/edit', this.package.id]);
  }

  deletePackage(): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.packageService.deletePackage(this.package.id).subscribe(
        () => {
          this.router.navigate(['/packages']);
        },
        (error) => {
          console.error('Error deleting package:', error);
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/packages']);
  }
}
