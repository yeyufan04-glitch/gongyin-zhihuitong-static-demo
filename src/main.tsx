import React from 'react';import{createRoot}from'react-dom/client';import{DemoProvider}from'./app/DemoContext';import{App}from'./app/App';import'./styles/global.css';import'./styles/confirm.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><DemoProvider><App/></DemoProvider></React.StrictMode>);
