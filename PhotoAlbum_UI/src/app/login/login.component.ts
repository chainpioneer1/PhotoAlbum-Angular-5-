import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html',
    
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    if(data.status === 'success'){
                        console.log(data);
                        localStorage.setItem("currentUser", JSON.stringify(data));
                        console.log(localStorage.getItem('currentUser'));
                        this.router.navigate(['/']);
                    }
                    if(data.status === 'fail'){
                        this.alertService.error('Email and password is not matched.');
                        this.loading = false;
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
    logout() {
        this.authenticationService.logout();
    }
}
