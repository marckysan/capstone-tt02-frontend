import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { handleError } from '../services-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  baseUrl: string = `${environment.API_REST_URL}` + '/meeting';

  constructor(private httpClient: HttpClient) {}

  createNewMeeting(meeting: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/create-meeting`, meeting, httpOptions)
      .pipe(catchError(handleError));
  }

  getAllMeetingsOrganiser(organiserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-meetings-user-organiser/' + organiserId
      )
      .pipe(catchError(handleError));
  }

  getAllMeetingsByParticipantId(participantId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + '/get-all-meetings-user-partipant/' + participantId
      )
      .pipe(catchError(handleError));
  }
}
