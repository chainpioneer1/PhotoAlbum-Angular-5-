import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';



const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'})
  };

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    
    getById(id: number) {
        return this.http.get('/api/users/' + id);
    }

   
    delete(id: number) {
        return this.http.delete('/api/users/' + id);
    }
}