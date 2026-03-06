import { Routes } from '@angular/router';
import { Home } from "./home/home";
import { Login } from "./auth/login/login";
import { Register } from "./auth/register/register";

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: "passwords",
        loadComponent: () => import("./features/passwords/password-view/password-view").then(m => m.PasswordView)
    },
    {
        path: "password/:id",
        loadComponent: () => import("./features/passwords/password-detail/password-detail").then(m => m.PasswordDetail)
    },
    {
        path: "**",
        redirectTo: ""
    }
];
