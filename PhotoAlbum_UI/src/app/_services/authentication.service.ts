import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }
    apiUrl = "http://127.0.0.1:8080/"

    validateEmail(email:string) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    login(email: string, password: string) {
        return this.http.post<any>(this.apiUrl+'api/login', { email: email, password: password });
    }

    register(user: User){
        
        return this.http.post<any>(this.apiUrl+'api/register', user);
    }


    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
    }
}