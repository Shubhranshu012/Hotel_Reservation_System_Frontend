import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Signin } from './components/signin/signin';

export const routes: Routes = [
    {path:"",component:Home},{path:"home",component:Home},
    {path:"signin",component:Signin}
];
