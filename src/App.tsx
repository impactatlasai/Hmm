import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { FreeMasterclassPage } from './pages/FreeMasterclassPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ToolsPage } from './pages/ToolsPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { MenuPage } from './pages/MenuPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { SitemapPage } from './pages/SitemapPage';
import { WomensSafetyProgrammePage } from './pages/WomensSafetyProgrammePage';
import { InstitutionalServiceDetailsPage } from './pages/InstitutionalServiceDetailsPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { DashboardProfilePage } from './pages/dashboard/DashboardProfilePage';
import { DashboardCoursesPage } from './pages/dashboard/DashboardCoursesPage';
import { DashboardLearningPage } from './pages/dashboard/DashboardLearningPage';
import { DashboardAssignmentsPage } from './pages/dashboard/DashboardAssignmentsPage';
import { DashboardCertificatesPage } from './pages/dashboard/DashboardCertificatesPage';
import { DashboardPaymentsPage } from './pages/dashboard/DashboardPaymentsPage';
import { DashboardNotificationsPage } from './pages/dashboard/DashboardNotificationsPage';
import { DashboardSettingsPage } from './pages/dashboard/DashboardSettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PWAInstallNotification } from './components/pwa/PWAInstallNotification';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };
      if (!scrollToEl()) {
        const timer = window.setTimeout(scrollToEl, 60);
        return () => window.clearTimeout(timer);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <PWAInstallNotification />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route
            path="/programmes/ai-literacy"
            element={<Navigate to="/programmes#ai-literacy" replace />}
          />
          <Route
            path="/programmes/applied-ai"
            element={<Navigate to="/programmes#applied-ai" replace />}
          />
          <Route
            path="/programmes/professional-development"
            element={<Navigate to="/programmes#professional-development" replace />}
          />
          <Route
            path="/programmes/specialised-programmes"
            element={<Navigate to="/programmes#specialised-programmes" replace />}
          />
          <Route
            path="/programmes/womens-safety-in-the-ai-era"
            element={<WomensSafetyProgrammePage />}
          />
          <Route
            path="/programmes/SP-WSAI"
            element={<WomensSafetyProgrammePage />}
          />
          <Route path="/programmes/:code" element={<CourseDetailsPage />} />
          <Route
            path="/institutional-services/:slug"
            element={<InstitutionalServiceDetailsPage />}
          />
          <Route path="/free-masterclass" element={<FreeMasterclassPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/tools" element={<ToolsPage />} />

          {/* Authentication & Verification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
          <Route path="/verify-certificate/:code" element={<VerifyCertificatePage />} />
          <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />

          {/* Learner Dashboard & LMS Routes */}
          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
          <Route path="/dashboard/courses" element={<DashboardCoursesPage />} />
          <Route path="/dashboard/learning" element={<DashboardLearningPage />} />
          <Route path="/dashboard/learning/:courseCode" element={<DashboardLearningPage />} />
          <Route path="/dashboard/assignments" element={<DashboardAssignmentsPage />} />
          <Route path="/dashboard/certificates" element={<DashboardCertificatesPage />} />
          <Route path="/dashboard/payments" element={<DashboardPaymentsPage />} />
          <Route path="/dashboard/notifications" element={<DashboardNotificationsPage />} />
          <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />

          {/* Admin & Instructor Console */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          <Route path="/menu" element={<MenuPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
