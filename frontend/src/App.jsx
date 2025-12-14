// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";



import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import About from "./pages/About";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewBlog from "./pages/NewBlog";
import Drafts from "./pages/Drafts";
import EditBlog from "./pages/EditBlog";



// If you have AuthProvider, wrap <AppContent /> with it in main.jsx
function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin routes */}
            <Route path="/admin/new" element={<ProtectedRoute element={<NewBlog />} />} />
            <Route path="/admin/drafts" element={<ProtectedRoute element={<Drafts />} />} />
            <Route path="/admin/blogs/:id" element={<ProtectedRoute element={<EditBlog />} />} />


            {/* Optional: 404 */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
