import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  /**
   * Get data
   * @author Jainam Shah
   * @param requrl
   * @returns object
   */
  getData(requrl, params?): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.get<any>(url, { params });
  }

  /**
   * Sending Post data to server
   * @author Jainam Shah
   * @param requrl
   * @param payload
   */
  postData(requrl, payload): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.post<any>(url, payload);
  }

  /**
   * Sending PUT (Update request) to server
   * @author Jainam Shah
   * @param requrl
   * @param payload
   */
  putData(requrl, payload): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.put<any>(url, payload);
  }

  /**
   * Delete data
   * @author Jainam Shah
   * @param requrl
   * @param payload
   */
  deleteData(requrl): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.delete<any>(url);
  }
}
