import { Component, OnInit } from '@angular/core';

import { PhotoService } from '../_services/index';
import { Photo } from '../_models/index';
import { SlicePipe } from '@angular/common';


@Component({
    moduleId: module.id.toString(),
    selector: 'photo',
    templateUrl: 'photo.component.html',
    styleUrls: ['photo.style.css']
})

export class PhotoComponent {
    photos: Photo[] = [];

    album_id: string;
    user_id: string;
    group_id: string;

    slideIndex: number;
    

    constructor(private photoService: PhotoService) { }

    ngOnInit() {
        console.log('photo_ngOnInit');
        this.photoService.getAll()
        .subscribe(
            data=>{
                try{
                    this.photos = JSON.parse(data);
                }catch(e){
                    this.photos = [];
                }
                
            }
        );

        this.showSlides(0);
    }

    showSlides(n: number){
        let counts = this.photos.length;
        this.slideIndex = n;
        if(n > counts-1){
            this.slideIndex = 0;
        }
        if(n <0){
            this.slideIndex = counts - 1;
        }
    }
    
    plusSlides(n: number){
        this.showSlides(this.slideIndex + n);
    }

    currentSlide(n: number){
       
        this.showSlides(n);
    }
}