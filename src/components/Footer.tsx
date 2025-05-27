
import React from "react";
import { Link } from "@/components/ui/link";

const Footer = () => {
  return (
    <footer className="footer-fixed">
      <div className="container flex justify-center items-center">
        <p className="text-xs md:text-sm text-gray-400 hover:text-gray-300 transition-colors">
          Vibe-coded by{" "}
          <Link
            href="https://www.linkedin.com/in/vmvadivel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
          >
            Vadivel
          </Link>
          . &copy; 2025.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
