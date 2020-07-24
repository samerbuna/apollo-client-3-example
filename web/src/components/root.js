import React from 'react';

import { useLocalQuery } from '../store';

import * as mainComponents from './index';
import Navbar from './navbar';

export default function Root() {
  const [component, user] = useLocalQuery('component', 'user');
  const Component = mainComponents[component.name];

  return (
    <div className="route-container">
      <Navbar user={user} />
      <div className="main-component">
        <Component {...component.props} />
      </div>
    </div>
  );
}
