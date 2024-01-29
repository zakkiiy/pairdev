'use client'
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Logout() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session, status } = useSession();

	const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

	useEffect(() => {
    const closeMenu = (e :any) => {
      if (isOpen && !e.target.closest(".menu-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [isOpen]);

	if (status === 'authenticated') {
    return (
      <div className="relative menu-container">
        <button onClick={toggleMenu}>
          <Image
            src={session.user?.image ?? ''}
            height={35}
            width={35}
            style={{ borderRadius: '50px' }}
            alt="User Avatar"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
            <Link href="/profile">
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                プロフィール
              </div>
            </Link>
            <button
              onClick={() => {
                signOut();
                toggleMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    );
  }
  return null;
}