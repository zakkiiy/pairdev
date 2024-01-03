"use client";
import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import Login from './components/Login';
import Logout from './components/Logout';

export default function Home() {

  const { data: session, status } = useSession();

  return (
    <>
      <div>
        {status === 'authenticated' ? (
          <div>
            <p>ようこそ、{session.user?.name}さん</p>
            <img
              src={session.user?.image ?? ``}
              alt=""
              style={{ borderRadius: '50px' }}
            />
            <div>
              <Logout />
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}