import React, { lazy } from "react";
import { useParams, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout";

// Lazy loaded page components following Next.js App-Router file convention
const HomePage = lazy(() => import("./(pages)/home/page"));
const CarsPage = lazy(() => import("./(pages)/cars/page"));
const CarDetailPage = lazy(() => import("./(pages)/cars/[slug]/page"));
const OutletsPage = lazy(() => import("./(pages)/outlets/page"));
const ServicePage = lazy(() => import("./(pages)/service/page"));
const ContactPage = lazy(() => import("./(pages)/contact/page"));
const NotFoundPage = lazy(() => import("./(pages)/not-found"));

function CarDetailRouter() {
  const { slug } = useParams();
  return <CarDetailPage key={slug} />;
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "cars",
          element: <CarsPage />,
        },
        {
          path: "cars/:slug",
          element: <CarDetailRouter />,
        },
        {
          path: "outlets",
          element: <OutletsPage />,
        },
        {
          path: "service",
          element: <ServicePage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    // Provide clean fallback if PUBLIC_URL is relative dot or base
    basename:
      process.env.PUBLIC_URL && process.env.PUBLIC_URL !== "."
        ? process.env.PUBLIC_URL
        : "/",
  },
);
