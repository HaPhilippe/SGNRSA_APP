
// export default welcome_routes

import { lazy } from "react";
import { Route } from "react-router-dom";
// const LoginPage = lazy(() => import("../../pages/welcome/LoginPage__v11"));
const LoginPage = lazy(() => import("../../pages/welcome/LoginPage"));

export const welcome_routes_items = {
          login: {
                    path: "login",
                    name: "Connexion",
                    component: LoginPage
          }
          
}
var welcome_routes = []
for(let key in welcome_routes_items) {
          const route = welcome_routes_items[key]
          welcome_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default welcome_routes