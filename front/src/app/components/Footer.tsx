import React from 'react';
import { FaRobot, FaRegHandshake, FaShieldAlt } from 'react-icons/fa';
const Footer = () => {
  return(
    <footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <FaRobot className="text-4xl text-blue-400" />
          <span className="text-xl font-bold">PairDev</span>
        </div>
        <nav className="flex justify-center items-center space-x-6">
          <a href="/terms_of_use" className="flex flex-col items-center hover:text-blue-400">
            <FaRegHandshake className="text-2xl"/>
            <span className="mt-1">利用規約</span>
          </a>
          <a href="/privacy_policy" className="flex flex-col items-center hover:text-blue-400">
            <FaShieldAlt className="text-2xl"/>
            <span className="mt-1">プライバシーポリシー</span>
          </a>
          <a href="/contact" className="flex flex-col items-center hover:text-blue-400">
            <FaRobot className="text-2xl"/>
            <span className="mt-1">連絡先</span>
          </a>
        </nav>
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} PairDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;