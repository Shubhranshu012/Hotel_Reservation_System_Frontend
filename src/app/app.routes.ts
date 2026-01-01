import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Signin } from './components/signin/signin';
import { Login } from './components/login/login';

export const routes: Routes = [
    {path:"",component:Home},{path:"home",component:Home},
    {path:"signin",component:Signin},{path:"login",component:Login}
];
