import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    register() {
        if(this.model.password !== this.model.confirmpassword){
            this.alertService.error("Password is not match");
            return;
        }
        if(!this.authenticationService.validateEmail(this.model.email)){
            this.alertService.error("Please input correct email.");
            return;
        }
        this.loading = true;
        this.authenticationService.register(this.model)
            .subscribe(
                data => {
                    if(data.status === 'success'){
                        this.alertService.success('Registration successful', true);
                        this.router.navigate(['/home']);
                    }
                    if(data.status === 'fail'){
                        this.loading = false;
                        this.alertService.error(data.error);    
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
