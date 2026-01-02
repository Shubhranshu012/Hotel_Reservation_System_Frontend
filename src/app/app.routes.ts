import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Signin } from './components/signin/signin';
import { Login } from './components/login/login';
import { Hotels } from './components/hotels/hotels';
import { Rooms } from './components/rooms/rooms';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { ManagerDashboard } from './components/manager/manager-dashboard/manager-dashboard';
import { ReceptionDashboard } from './components/reception/reception-dashboard/reception-dashboard';

export const routes: Routes = [
    {path:"",component:Home},{path:"home",component:Home},
    {path:"signin",component:Signin},{path:"login",component:Login},
    {path:"hotels",component:Hotels},{path:"rooms/:hotelId", component:Rooms},
    {path:"admin/dashboard",component:AdminDashboard},
    {path:"manager/dashboard",component:ManagerDashboard},
    {path:"reception/dashboard",component:ReceptionDashboard}
];
