import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { LearningPackageService } from '../../services/learning-package.service';

@Component({
  selector: 'app-package-stats',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './package-stats.component.html',
  styleUrls: ['./package-stats.component.css']
})
export class PackageStatsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private packageService: LearningPackageService) {}

  ngOnInit() {
    this.loadChartData();
  }

  private loadChartData() {
    console.log('Loading chart data...');
    this.packageService.getPackageCreationHistory().subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.updateChartOptions(data);
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
      }
    });
  }

  private updateChartOptions(data: { date: string; count: number }[]) {
    console.log('Updating chart with data:', data);
    
    const options: Highcharts.Options = {
      chart: { type: 'column' },
      title: { text: 'Activity' },
      xAxis: {
        categories: data.map(item => item.date),
        title: { text: 'Date' }
      },
      yAxis: {
        title: { text: 'Packages Created' },
        allowDecimals: false,
        min: 0
      },
      series: [{
        name: 'Packages',
        type: 'column',
        data: data.map(item => item.count)
      }],
      credits: { enabled: false }
    };

    console.log('New chart options:', options);
    this.chartOptions = options;
    
    // Force chart update
    if (this.chartOptions && this.Highcharts) {
      this.Highcharts.chart('chart-container', this.chartOptions);
    }
  }
} 