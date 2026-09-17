import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { KalyaniProvider } from './context/KalyaniContext';

export default function App() {
  return (
    <KalyaniProvider>
      <RouterProvider router={router} />
    </KalyaniProvider>
  );
}
