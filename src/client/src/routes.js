import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {HomePage} from "./pages/HomePage";
import {ProductDetailPage} from "./pages/product/ProductDetailPage";

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Route path="/product/:id" exact>
                <ProductDetailPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
