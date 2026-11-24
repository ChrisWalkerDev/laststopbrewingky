import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/runtime-config';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_CONFIG).apiBaseUrl.replace(/\/$/, '');

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path.replace(/^\//, '')}`);
  }
}
