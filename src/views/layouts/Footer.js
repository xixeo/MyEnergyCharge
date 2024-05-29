import React from "react";

export default function Footer() {
  if (window.location.pathname === '/') return null;
    return (
        <footer className="bg-black text-gray-50 p-2 text-xs">FOOTER</footer>
    );
}
