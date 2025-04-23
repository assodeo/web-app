import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeService {
  private readonly apiUrl = '/api/me';

  constructor(private readonly http: HttpClient) { }

  /**
   * Fetches the current user's associations.
   *
   * @returns an observable containing the list of the user's association ids
   */
  getAssociations(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/associations`);
  }
}
