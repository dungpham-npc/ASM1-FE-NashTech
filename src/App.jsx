import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import {Login} from "./pages/Login/Login.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import {AuthProvider} from "./context/AuthProvider.jsx";
import {ToastContainer} from "react-toastify";
import {Register} from "./pages/Register/Register.jsx";
import Product from "./pages/Products/Product.jsx";
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx";

const AppRoutes = () => {

  return (
    <Routes>
      <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="min-h-screen bg-white">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Product />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
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
              <Footer />
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
            <ToastContainer position="top-right" autoClose={1000} />
            <AppRoutes />
          </BrowserRouter>
      </AuthProvider>
  );
};

export default App
