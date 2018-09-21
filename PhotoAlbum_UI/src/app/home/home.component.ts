import { Component, OnInit, ViewChild } from '@angular/core';

import { User, Group, Albums } from '../_models/index';
import { UserService, ModalService, GroupService, AlertService, AlbumService, PhotoService } from '../_services/index';
import * as $ from 'jquery';
import './js/jquery-ui.js';
import {
    DropzoneComponent, DropzoneDirective,
    DropzoneConfigInterface
} from 'ngx-dropzone-wrapper';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ["css/style.css"]
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    currentGroup: Group = new Group();
    groups: Group[] = [];
    new_group_name: string;
    group_error: string = '';
    group_success: string = '';

    new_album_name: string;
    myAlbums: Albums[] = [];
    currentAlbum: Albums;

    filter: Albums = new Albums();

    tmpUploadedPhoto: any[] = [];

    public config: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 5,
        autoReset: null,
        errorReset: null,
        cancelReset: null
    };

    @ViewChild(DropzoneComponent) componentRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

    constructor(private userService: UserService, private modalService: ModalService, private groupService: GroupService,
        private alertService: AlertService, private albumService: AlbumService, private photoService: PhotoService) {

    }

    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(this.currentUser);
        try {
            this.currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
        } catch (e) {
            this.currentGroup = null;
        }

        this.albumService.getAll(this.currentUser.user_id)
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        this.myAlbums = data.albums;
                    } else {
                        this.myAlbums = [];
                    }
                }
            );
        this.groupService.getAll(this.currentUser.user_id)
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        this.groups = data.groups;
                        console.log(data);
                        console.log(this.currentGroup);
                        if (this.currentGroup === undefined || this.currentGroup === null) {
                            if (this.groups.length > 0) {
                                this.currentGroup = this.groups[0];
                            }
                        }
                        this.setCurrentGroup(this.currentGroup);
                    } else {
                        this.groups = [];
                    }
                }
            )

        // this.photoService.setAlbum(this.currentAlbum);
        // this.filter.user_id = this.currentGroup.user_id;
        // this.filter.group_id = this.currentGroup.group_id;
        // this.filter.user_id = this.currentUser.user_id;

        //this.loadPhotos(this.currentAlbum);
    }
    openDropMenu() {
        if ($('#dropDownBtn').hasClass('active')) {
            $('#dropDownBtn').removeClass('active');
            return;
        } else {
            $('#dropDownBtn').addClass('active');
            return;
        }
    }
    openModal() {
        //this.modalService.open(id); 
        $('#openAddDlgBtn').trigger('click');
        //$('#addGroupModal').modal('show');
    }

    openUploadDlg() {
        //this.toggleAutoReset();
        console.log(this.currentAlbum);
        if (this.currentAlbum === null || this.currentAlbum === undefined) {
            alert('Please select the album. if you have no album, you need to create album.');
            return;
        }
        this.resetDropzoneUploads();
        this.tmpUploadedPhoto = [];
        $('#openPhotoDlgBtn').trigger('click');
        //$('#addGroupModal').modal('show');
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    setCurrentGroup(group: Group) {
        this.currentGroup = group;
        localStorage.setItem('currentGroup', JSON.stringify(group));
        if (group !== null) {
            this.filter.group_id = group.group_id;
            let albums = this.myAlbums.filter(item => item.group_id == group.group_id);

            if (albums.length > 0) {
                this.loadPhotos(albums[0]);
            } else {
                this.loadPhotos(null);
            }

        }

    }

    addGroup() {
        console.log(this.currentUser.user_id + ' ' + this.new_group_name);
        if (this.groupService.validate(this.currentUser.user_id, this.new_group_name)) {
            this.group_error = "Please input group name.";
            return;
        }
        this.groupService.addGroup(this.currentUser.user_id, this.new_group_name)
            .subscribe(
                data => {
                    if (data.status == 'success') {
                        this.group_success = 'Add new group successfully.';
                        this.groups.push(data.group);
                        this.openModal();
                    }
                },
                error => {
                    this.group_error = error;
                }
            )
    }

    // add new album
    addAlbum() {
        if (this.albumService.validate(this.currentUser.user_id, this.new_album_name)) {

            return;
        }
        this.albumService.addAlbum(this.currentUser.user_id, this.currentGroup.group_id, this.new_album_name)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.status == 'success') {

                        this.myAlbums.push(data.album);
                        console.log(this.myAlbums);
                    }
                },
                error => {
                    this.alertService.error(error);
                }
            );
    }

    // open album side bar
    openAlbumSidebar() {
        let w = document.getElementById("albumsidenav").style.width;
        if (w === "0px") {
            document.getElementById("albumsidenav").style.width = "200px";
            return;
        } else {
            document.getElementById("albumsidenav").style.width = "0";
        }

    }

    // photo functions

    // loadPhotos
    loadPhotos(album: Albums) {
        console.log(album);
        this.currentAlbum = album;
        localStorage.setItem("currentAlbum", JSON.stringify(album));
        this.photoService.setAlbum(album);
        this.photoService.getPhotos();
        // this.photoService.
    }


    // dropzone part
    public toggleAutoReset(): void {
        this.config.autoReset = this.config.autoReset ? null : 5000;
        this.config.errorReset = this.config.errorReset ? null : 5000;
        this.config.cancelReset = this.config.cancelReset ? null : 5000;
    }

    public toggleMultiUpload(): void {
        this.config.maxFiles = this.config.maxFiles ? null : 1;
    }

    public toggleClickAction(): void {
        this.config.clickable = !this.config.clickable;
    }

    public resetDropzoneUploads(): void {
        // if (this.type === 'directive') {
        //   this.directiveRef.reset();
        // } else {
        //     this.componentRef.directiveRef.reset();
        // }
        this.componentRef.directiveRef.reset();
    }

    public onUploadError(args: any): void {
        console.log('onUploadError:', args);
    }

    public onUploadSuccess(args: any): void {
        console.log('onUploadSuccess:', args[1].success);
        this.tmpUploadedPhoto.push(args[1].success);
    }

    public savePhotos() {
        this.photoService.savePhotos(this.tmpUploadedPhoto);
    }
}