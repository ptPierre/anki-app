import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LearningPackageService } from '../../services/learning-package.service';
import { WebSocketService } from '../../services/websocket.service';
import { LearningPackage } from '../../models/learning-package.model';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community'; 
import { ColumnAutoSizeModule } from 'ag-grid-community'; 

ModuleRegistry.registerModules([ ColumnAutoSizeModule ]);

ModuleRegistry.registerModules([ ClientSideRowModelModule ]); 

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule, AgGridModule],
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

      <ag-grid-angular
        class="ag-theme-alpine"
        [rowData]="packages"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowHeight]="35"
        (gridReady)="onGridReady($event)"
        style="width: 100%; height: 600px;">
      </ag-grid-angular>
    </div>
  `,
  styles: [`
    @import 'ag-grid-community/styles/ag-grid.css';
    @import 'ag-grid-community/styles/ag-theme-alpine.css';
  `]
})
export class PackageListComponent implements OnInit {
  packages: LearningPackage[] = [];

  columnDefs: ColDef[] = [
    { field: 'title', sortable: true, filter: true },
    { field: 'category', sortable: true, filter: true },
    { field: 'targetAudience', sortable: true, filter: true },
    { field: 'difficultyLevel', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: (params: ICellRendererParams) => {
        const div = document.createElement('div');
        const viewBtn = document.createElement('button');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        viewBtn.classList.add('btn', 'btn-sm', 'btn-info', 'me-2');
        editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
        deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');

        viewBtn.textContent = 'View';
        editBtn.textContent = 'Edit';
        deleteBtn.textContent = 'Delete';

        viewBtn.addEventListener('click', () => this.viewDetails(params.data.id));
        editBtn.addEventListener('click', () => this.editPackage(params.data.id));
        deleteBtn.addEventListener('click', () => this.deletePackage(params.data.id));

        div.appendChild(viewBtn);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        
        return div;
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true
  };

  constructor(
    private packageService: LearningPackageService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

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
