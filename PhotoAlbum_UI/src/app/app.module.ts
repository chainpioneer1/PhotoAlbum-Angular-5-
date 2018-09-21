import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent,ModalComponent, PhotoComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';
import { AlertService, AuthenticationService, UserService,ModalService, GroupService,AlbumService, PhotoService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AlbumFilterPipe } from './shared/album-filter.pipe';
import { DropzoneModule, DropzoneConfigInterface,
    DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';

    const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
        // Change this to your upload POST address:
        url: 'http://127.0.0.1:8080/api/upload_photo',
        acceptedFiles: 'image/*',
        createImageThumbnails: true
      };
      

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing,
        DropzoneModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ModalComponent,
        AlbumFilterPipe,
        PhotoComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        GroupService,
        AlbumService,
        ModalService,
        PhotoService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }