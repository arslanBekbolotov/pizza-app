import React from "react";
import "./App.css";
import Layout from "./containers/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home/Home";
import NotFoundBlock from "./containers/NotFoundBlock/NotFoundBlock";
import Categories from "./containers/Categories/Categories";
import Cart from "./containers/Cart/Cart";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <div className="App">
      <ScrollToTop />

      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route path={""} element={<Home />} />
          <Route path={"/dishes/:category"} element={<Categories />} />
          <Route path={"/cart"} element={<Cart />} />
          <Route path="*" element={<NotFoundBlock />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
