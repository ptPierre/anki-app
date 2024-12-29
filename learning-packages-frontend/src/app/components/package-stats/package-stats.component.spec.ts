import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageStatsComponent } from './package-stats.component';
import { LearningPackageService } from '../../services/learning-package.service';
import { of } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';

describe('PackageStatsComponent', () => {
  let component: PackageStatsComponent;
  let fixture: ComponentFixture<PackageStatsComponent>;
  let mockPackageService: jasmine.SpyObj<LearningPackageService>;

  beforeEach(async () => {
    mockPackageService = jasmine.createSpyObj('LearningPackageService', ['getPackageCreationHistory']);
    mockPackageService.getPackageCreationHistory.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PackageStatsComponent, HighchartsChartModule],
      providers: [
        { provide: LearningPackageService, useValue: mockPackageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chart data on init', () => {
    expect(mockPackageService.getPackageCreationHistory).toHaveBeenCalled();
  });
}); 