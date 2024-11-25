import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningPackageService } from '../../services/learning-package.service';

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css'],
})
export class PackageFormComponent implements OnInit {
  isEditMode = false;
  packageId!: number;

  // Data model for the form
  package = {
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    difficultyLevel: 1,
  };

  constructor(
    private route: ActivatedRoute,
    private packageService: LearningPackageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the component is in edit mode
    this.packageId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.packageId;

    if (this.isEditMode) {
      this.loadPackage();
    }
  }

  loadPackage(): void {
    // Load the existing package data for editing
    this.packageService.getPackageById(this.packageId).subscribe((data) => {
      this.package = data;
    });
  }

  setPackageField(field: keyof typeof this.package, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (field === 'difficultyLevel') {
      this.package[field] = +value as typeof this.package[typeof field];
    } else {
      this.package[field] = value as typeof this.package[typeof field];
    }
  }


  onSubmit(): void {
    if (this.isEditMode) {
      this.packageService.updatePackage(this.packageId, this.package).subscribe(() => {
        this.router.navigate(['/packages']);
      });
    } else {
      this.packageService.createPackage(this.package).subscribe(() => {
        this.router.navigate(['/packages']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/packages']);
  }
}
