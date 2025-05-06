import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import {Login} from "./pages/Login/Login.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {AuthProvider} from "./context/AuthProvider.jsx";
import {ToastContainer} from "react-toastify";
import {Register} from "./pages/Register/Register.jsx";
import Product from "./pages/Products/Product.jsx";
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx";
import 'antd/dist/reset.css';
import useAuth from "./hooks/useAuth.js";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import DashboardLayout from "./pages/Dashboard/DashboardLayout.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard/AdminDashboard.jsx";
import ProductDashboard from "./pages/Dashboard/ProductDashboard/ProductDashboard.jsx";
import ProductCreate from "./pages/Dashboard/ProductDashboard/ProductCreate.jsx";
import ProductUpdate from "./pages/Dashboard/ProductDashboard/ProductUpdate.jsx";

const AppRoutes = () => {

    const {isAuthenticated, user} = useAuth();

    const getDashboardRedirect = () => {
        if (!isAuthenticated || !user) return null;

        if (user.includes("ADMIN")) {
            return <Navigate to="/dashboard" replace/>;
        } else if (user.includes("STAFF")) {
            return <Navigate to="/dashboard" replace/>;
        }

        return null;
    };

    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]} redirectPath="/"/>
                }
            >
                <Route element={<DashboardLayout/>}>
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="user-management"
                        element={
                            <ProtectedRoute
                                allowedRoles={["ADMIN"]}
                                redirectPath="/dashboard"
                            />
                        }
                    >
                        {/*<Route index element={<UserManagement />}/>*/}
                    </Route>

                    <Route path="products">
                        <Route index element={<ProductDashboard />} />
                        <Route path="create" element={<ProductCreate />} />
                        <Route path="update/:id" element={<ProductUpdate />} />
                    </Route>

                    <Route path="orders" element={<div>Orders Management</div>}/>

                    <Route path="reports" element={<div>Reports</div>}/>

                    <Route path="settings" element={<div>Settings</div>}/>
                </Route>
            </Route>

            <Route
                path="/"
                element={
                    <>
                        <Navbar />
                        <div className="min-h-screen bg-white">
                            {getDashboardRedirect() || <Product />}
                        </div>
                        <Footer />
                    </>
                }
            />

            <Route
                path="*"
                element={
                    <>
                        <Navbar/>
                        <div className="min-h-screen bg-white">
                            <Routes>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/" element={<Product/>}/>
                                <Route path="/product/:id" element={<ProductDetails/>}/>
                                {/*<Route path="/cart" element={<CartPage />} />*/}
                                {/*<Route path="/checkout" element={<CheckoutPage />} />*/}
                                {/*<Route*/}
                                {/*    path="/order-confirmation/:preorderId"*/}
                                {/*    element={<OrderConfirmationPage />}*/}
                                {/*/>*/}
                                {/*<Route path="/account" element={<AccountPage />} />*/}
                                {/*<Route*/}
                                {/*    path="/account/preorders"*/}
                                {/*    element={<PreorderHistoryPage />}*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/account/preorders/:id"*/}
                                {/*    element={<PreorderDetailsPage />}*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/forgot-password"*/}
                                {/*    element={<ForgotPasswordPage />}*/}
                                {/*/>*/}
                                {/*<Route path="/account/profile" element={<ProfilePage />} />*/}
                                {/*<Route*/}
                                {/*    path="*"*/}
                                {/*    element={*/}
                                {/*      <NotFoundPage*/}
                                {/*          title="Oops! Page Not Found"*/}
                                {/*          subTitle="The page you're looking for might have been moved or deleted."*/}
                                {/*      />*/}
                                {/*    }*/}
                                {/*/>*/}
                            </Routes>
                        </div>
                        <Footer/>
                    </>
                }
            />
        </Routes>
    )
}

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ToastContainer position="top-right" autoClose={1000}/>
                <AppRoutes/>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App
