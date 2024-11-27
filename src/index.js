import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom"; // Impor BrowserRouter

ReactDOM.render(
  <Router>
    {" "}
    {/* Bungkus App dengan BrowserRouter */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);

// Jika Anda ingin mulai mengukur performa di aplikasi Anda,
// berikan fungsi untuk mencatat hasilnya (misalnya: reportWebVitals(console.log))
// atau kirim ke endpoint analitik.
reportWebVitals();
