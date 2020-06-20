import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  message: string = "";
  userError: any;


  constructor(public fb: FormBuilder, public authService: AuthService) { 
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: this.checkIfMatchingPassword("password", "confirmPassword")
    })
   }

   checkIfMatchingPassword(passwordKey: string, confirmPasswordKey: string) {
     return(group: FormGroup) => {
       let password = group.controls[passwordKey];
       let confirmPassword = group.controls[confirmPasswordKey];

       if(password.value == confirmPassword.value) {
         return;
       }
       else {
         confirmPassword.setErrors({
           notEqualToPassword: true
         })
       }
     }
   }

  onSubmit(signupForm) {
    let email: string = signupForm.value.email;
    let password: string = signupForm.value.password;
    let firstName: string = signupForm.value.firstName;
    let lastName: string = signupForm.value.lastName;

    this.authService.signup(email, password, firstName, lastName).then((user: any) => {
      firebase.firestore().collection("users").doc(user.uid).set({
        firstName: signupForm.value.firstName,
        lastName:signupForm.value.lastName,
        email: signupForm.value.email,
        photoURL: user.photoURL,
        interests: "",
        bio: "",
        hobbies: ""
      }).then(() => {
        this.message = "You have been signed up successfully. Please login.";
      })
    }).catch((error) => {
      console.log(error);
      this.userError = error;
      
    })
    console.log(signupForm.value);
  }

  ngOnInit(): void {
  }

}
