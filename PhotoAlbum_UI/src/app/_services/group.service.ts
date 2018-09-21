import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Group } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class GroupService {
    constructor(private http: HttpClient) { }
    apiUrl = "http://127.0.0.1:8080/"

    validate(user_id:string, group_name: string) {
        return user_id===undefined||group_name===undefined;
    }

    getAll(user_id: string){
        return this.http.get<any>(this.apiUrl + 'api/allGroup/'+user_id);
    }

    addGroup(user_id:string, group_name: string){
        return this.http.post<any>(this.apiUrl+'api/addGroup', { user_id: user_id, group_name: group_name });
    }
}