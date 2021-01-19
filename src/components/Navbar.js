import React from "react";

export default function Navbar() {
  return (
    <nav className="sm:flex sm:items-center sm:justify-between sm:flex-wrap p-6 bg-black">
      <div className="flex items-center justify-center sm:justify-start flex-shrink-0 text-yellow-400 mr-6">
        <a href="/" className="font-bold text-2xl sm:text-3xl">
          💬 VaccinatePA
        </a>
      </div>
    </nav>
  );
}
