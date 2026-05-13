import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ObjectScrollExperience from './components/ObjectScrollExperience';
import WorkshopExperience from './components/WorkshopExperience';
import ProductShowcase from './components/ProductShowcase';
import ProductCollectionPage from './components/ProductCollectionPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import About from './components/About';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import CustomOrderForm from './components/CustomOrderForm';
import FAQs from './components/FAQs';
import Gallery from './components/Gallery';
import LoginPage from './components/LoginPage';
import OrderHistory from './components/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';
import Services from './components/Services';
import SignUpPage from './components/SignUpPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import UserProfile from './components/UserProfile';
import VerifyEmailPanel from './components/VerifyEmailPanel';
import AdminLayout from './components/admin/AdminLayout';
import CustomOrderManagement from './components/admin/CustomOrderManagement';
import Dashboard from './components/admin/Dashboard';
import InquiryManagement from './components/admin/InquiryManagement';
import OrderManagement from './components/admin/OrderManagement';
import ProductManagement from './components/admin/ProductManagement';
import { syncCurrentUser } from './lib/api';

export default function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const hasSyncedUser = useRef(false);
  const path = window.location.pathname;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      hasSyncedUser.current = false;
      return;
    }

    if (hasSyncedUser.current) {
      return;
    }

    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token || !active) {
          return;
        }
        await syncCurrentUser(token);
        if (active) {
          hasSyncedUser.current = true;
        }
      } catch {
        // User record sync will be retried on next app load/navigation.
      }
    })();

    return () => {
      active = false;
    };
  }, [getToken, isLoaded, isSignedIn]);

  if (path === '/login' || path.startsWith('/login/')) {
    return <LoginPage />;
  }

  if (path === '/signup' || path.startsWith('/signup/')) {
    return <SignUpPage />;
  }

  if (path === '/profile') {
    return (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    );
  }

  if (path === '/orders') {
    return (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    );
  }

  if (path === '/verify-email') {
    return (
      <ProtectedRoute>
        <VerifyEmailPanel />
      </ProtectedRoute>
    );
  }

  if (path === '/cart') return <Cart />;
  if (path === '/checkout') return <Checkout />;
  if (path === '/collection') return <ProductCollectionPage />;
  if (path === '/custom-order') return <CustomOrderForm />;
  if (path === '/about') return <About />;
  if (path === '/gallery') return <Gallery />;
  if (path === '/services') return <Services />;
  if (path === '/faqs') return <FAQs />;
  if (path === '/contact') return <Contact />;
  if (path === '/privacy') return <PrivacyPolicy />;
  if (path === '/terms') return <TermsOfService />;
  if (path.startsWith('/products/')) {
    const slug = path.slice('/products/'.length).split('/')[0];
    if (slug) {
      return <ProductDetailsPage slug={slug} />;
    }
  }

  if (path.startsWith('/admin')) {
    let adminPage = <Dashboard />;
    if (path === '/admin/products') adminPage = <ProductManagement />;
    if (path === '/admin/orders') adminPage = <OrderManagement />;
    if (path === '/admin/custom-orders') adminPage = <CustomOrderManagement />;
    if (path === '/admin/inquiries') adminPage = <InquiryManagement />;

    return (
      <ProtectedRoute requireAdmin>
        <AdminLayout>{adminPage}</AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <div className="bg-void text-beige overflow-x-hidden">
      <Navigation />
      <Hero />
      <ObjectScrollExperience />
      <WorkshopExperience />
      <ProductShowcase />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
