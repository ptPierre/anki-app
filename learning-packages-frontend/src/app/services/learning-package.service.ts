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

  private getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  }

  getAllPackages(): Observable<LearningPackage[]> {
    const userId = this.getCurrentUserId();
    return this.http.get<LearningPackage[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getPackageById(id: number): Observable<LearningPackage> {
    const userId = this.getCurrentUserId();
    return this.http.get<LearningPackage>(`${this.apiUrl}/${id}?userId=${userId}`);
  }

  createPackage(pkg: Partial<LearningPackage>): Observable<LearningPackage> {
    const userId = this.getCurrentUserId();
    return this.http.post<LearningPackage>(this.apiUrl, { ...pkg, userId });
  }

  updatePackage(id: number, pkg: Partial<LearningPackage>): Observable<LearningPackage> {
    const userId = this.getCurrentUserId();
    return this.http.put<LearningPackage>(`${this.apiUrl}/${id}`, { ...pkg, userId });
  }

  deletePackage(id: number): Observable<void> {
    const userId = this.getCurrentUserId();
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }
}