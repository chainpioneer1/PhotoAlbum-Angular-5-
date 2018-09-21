import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Albums, Photo} from '../_models/index';
import { Subject } from 'rxjs';



const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'})
  };

@Injectable()
export class PhotoService {
   
    album: Albums = new Albums();
    private photos =  new Subject<string>();

    constructor(private http: HttpClient) { }
    apiUrl = "http://127.0.0.1:8080/"

    setAlbum(album: Albums){
        console.log('setAlbum');
        this.album = album;
        
    }

    getPhotos(){
        if(this.album !== null){
            console.log('setAlbum is not null');
            this.http.post<any>(this.apiUrl + 'api/photos', {album_id: this.album.album_id})
            .subscribe(
                data=>{
                    if(data.status === 'success'){
                        // pre-processing for photo_uploaded_name
                        // this.photos = JSON.stringify(data.photos);
                        for(let i = 0; i<data.photos.length; i++){
                            data.photos[i].photo_uploaded_name = "http://127.0.0.1:8080/"+data.photos[i].photo_uploaded_name
                        }
                        this.photos.next(JSON.stringify(data.photos));
                    }else{
    
                    }
                }
            )
        }else{
            console.log('setAlbum is null');
            this.photos.next('');
        }
    }

    getAll(): Observable<any>{
        return this.photos.asObservable();
    }
    
    savePhotos(tmpFiles: any[]){
        this.http.post<any>(this.apiUrl + 'api/savePhoto', {album: this.album, tmpFiles: tmpFiles})
            .subscribe(
                data=>{
                    if(data.status === 'success'){
                        for(let i = 0; i<data.photos.length; i++){
                            data.photos[i].photo_uploaded_name = "http://127.0.0.1:8080/"+data.photos[i].photo_uploaded_name;
                        }
                         this.photos.next(JSON.stringify(data.photos));
                    }
                }
            )
    }
}