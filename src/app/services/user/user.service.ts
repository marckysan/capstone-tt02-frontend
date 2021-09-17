import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.API_REST_URL + '/user';

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<any[]> {
    console.log('getUsersService');
    // this.httpClient
    //   .get<any>(this.baseUrl + '/get-all-users')
    //   .pipe(catchError(handleError))
    //   .subscribe((response) => {
    //     console.log(response[0].fullName);
    //   });
    return this.httpClient
      .get<any[]>(this.baseUrl + '/get-all-users')
      .pipe(catchError(handleError));
  }

  getDepartments(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-departments')
      .pipe(catchError(handleError));
  }

  getManagedDepartments(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + '/get-managed-departments')
      .pipe(catchError(handleError));
  }
}