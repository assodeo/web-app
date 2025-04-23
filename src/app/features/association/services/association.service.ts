import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Association } from '../models/association.model';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  private readonly apiUrl = '/api/association';

  constructor(private readonly http: HttpClient) { }

  /**
   * Fetches an association by its id.
   *
   * @param id the id of the association to fetch
   * @returns an observable containing the association
   */
  getAssociation(id: number): Observable<Association> {
    return this.http.get<Association>(`${this.apiUrl}/${id}`);
  }
}
