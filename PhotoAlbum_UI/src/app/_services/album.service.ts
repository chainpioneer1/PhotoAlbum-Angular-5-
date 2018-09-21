import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Albums } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AlbumService {
    constructor(private http: HttpClient) { }
    apiUrl = "http://127.0.0.1:8080/"

    validate(user_id:string, album_name: string) {
        return user_id===undefined||album_name===undefined;
    }

    getAll(user_id: string){
        return this.http.get<any>(this.apiUrl + 'api/allAlbum/'+user_id);
    }

    addAlbum(user_id:string, group_id: string, album_name: string){
        return this.http.post<any>(this.apiUrl+'api/addAlbum', { user_id: user_id, group_id: group_id, album_name: album_name });
    }
}