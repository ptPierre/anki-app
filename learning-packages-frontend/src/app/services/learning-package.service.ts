import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LearningPackage } from '../models/learning-package.model';

@Injectable({
  providedIn: 'root',
})
export class LearningPackageService {
  private apiUrl = 'http://localhost:3000/api/package';

  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<LearningPackage[]> {
    return this.http.get<LearningPackage[]>(this.apiUrl);
  }

  getPackageById(id: number): Observable<LearningPackage> {
    return this.http.get<LearningPackage>(`${this.apiUrl}/${id}`);
  }

  createPackage(pkg: Partial<LearningPackage>): Observable<LearningPackage> {
    return this.http.post<LearningPackage>(this.apiUrl, pkg);
  }

  updatePackage(id: number, pkg: Partial<LearningPackage>): Observable<LearningPackage> {
    return this.http.put<LearningPackage>(`${this.apiUrl}/${id}`, pkg);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
