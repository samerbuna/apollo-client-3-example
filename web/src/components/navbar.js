import React from 'react';

import { useLocalMutation, AppLink } from '../store';

export default function Navbar({ user }) {
  const setLocalAppState = useLocalMutation();

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('azdev:user');
    setLocalAppState({
      component: { name: 'Home' },
      user: null,
    });
  };

  return (
    <nav>
      <AppLink to="Home" className="logo">
        AZdev
      </AppLink>
      <ul className="center">
        <li className="item">
          <AppLink to="NewTask">Create New Task</AppLink>
        </li>
        <li className="sep">|</li>
        {user ? (
          <>
            <li className="item">
              <AppLink to="MyTasks">{user.name}</AppLink>
            </li>
            <li className="sep">|</li>
            <li className="item">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="item">
              <AppLink to="Signup">Signup</AppLink>
            </li>
            <li className="sep">|</li>
            <li className="item">
              <AppLink to="Login">Login</AppLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
