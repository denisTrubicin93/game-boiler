import React, { useEffect } from 'react';
import { Switch, useHistory } from 'react-router-dom';
import './App.global.css';
import Routes from 'Routes';

export default function App() {
  const history = useHistory();

  useEffect(() => {
    history.push('/');
  }, []);

  return (
    <Switch>
      <Routes />
    </Switch>
  );
}
