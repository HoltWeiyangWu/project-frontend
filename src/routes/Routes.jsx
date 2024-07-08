import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';


export default function Routes() {
    const route = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path='/' element={<Dashboard />}/>
                
                <Route path='/user'>
                    <Route path='signin' element={<SignIn />}/>
                    <Route path='signup' element={<SignUp />}/>
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={route}/>
} 