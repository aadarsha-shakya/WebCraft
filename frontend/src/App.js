import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import StoreUsers from './StoreUsers';
import Categories from './Categories';
import Products from './Products';
import Inventory from './Inventory';
import Customers from './Customers';
import Orders from './Orders';
import Issues from './Issues';
import BarcodeGeneration from './BarcodeGeneration';
import Analytics from './Analytics';
import Settlement from './Settlement';
import PaymentSettings from './PaymentSettings';
import Plugins from './Plugins';
import Appearance from './Appearance';
import StoreSettings from './StoreSettings';
import Accounts from './Accounts';
import Subscription from './Subscription';
import Pages from './Pages';
import YourWeb from './YourWeb';
import Checkout from './Checkout';
import ProductFilter from './ProductFilter';
import ProductDetail from './ProductDetail';
import PaymentSuccess from './PaymentSuccess'; 
import { CartProvider } from './CartContext'; // Import CartProvider
import CartPanel from './CartPanel'; // Import CartPanel
import YourOrders from './YourOrders';
import WebCraft from './WebCraft';
import Instore from './Instore';
import ForgotPassword from './forgotpassword'; // Import the ForgotPassword component

function App() {
    return (
        <BrowserRouter> 
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/StoreUsers" element={<StoreUsers />} />
                    <Route path="/Categories" element={<Categories />} />
                    <Route path="/Products" element={<Products />} />
                    <Route path="/Inventory" element={<Inventory />} />
                    <Route path="/Customers" element={<Customers />} />
                    <Route path="/Orders" element={<Orders />} />
                    <Route path="/Issues" element={<Issues />} />
                    <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
                    <Route path="/Analytics" element={<Analytics />} />
                    <Route path="/Settlement" element={<Settlement />} />
                    <Route path="/PaymentSettings" element={<PaymentSettings />} />
                    <Route path="/Pages" element={<Pages />} />
                    <Route path="/Plugins" element={<Plugins />} />
                    <Route path="/Appearance" element={<Appearance />} />
                    <Route path="/StoreSettings" element={<StoreSettings />} />
                    <Route path="/Accounts" element={<Accounts />} />
                    <Route path="/Subscription" element={<Subscription />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/YourWeb" element={<YourWeb />} />
                    <Route path="/Checkout" element={<Checkout />} />
                    <Route path="/ProductFilter" element={<ProductFilter />} />
                    <Route path="/ProductDetail" element={<ProductDetail />} />
                    <Route path="/ProductDetail/:productId" element={<ProductDetail />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} /> 
                    <Route path="/YourOrders" element={<YourOrders />} />
                    <Route path="/WebCraft" element={<WebCraft />} />
                    <Route path="/Instore" element={<Instore />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this line */}
                </Routes>
                <CartPanel />
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;