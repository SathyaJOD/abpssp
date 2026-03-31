import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Objectives from './pages/Objectives';
import Membership from './pages/Membership';
import MembersList from './pages/MembersList';
import Status from './pages/Status';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import PlaceholderPage from './pages/PlaceholderPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname === 'admin.abpsspandhra.com' || hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Admin />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="objectives" element={<Objectives />} />
          <Route path="leadership" element={<PlaceholderPage title="Leadership" />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="membership" element={<Membership />} />
          <Route path="members" element={<MembersList />} />
          <Route path="status" element={<Status />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </Router>
  );
}
