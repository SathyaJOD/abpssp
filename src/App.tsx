import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Membership from './pages/Membership';
import MembersList from './pages/MembersList';
import Status from './pages/Status';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<PlaceholderPage title="About Us" />} />
          <Route path="objectives" element={<PlaceholderPage title="Our Objectives" />} />
          <Route path="leadership" element={<PlaceholderPage title="Leadership" />} />
          <Route path="privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="membership" element={<Membership />} />
          <Route path="members" element={<MembersList />} />
          <Route path="status" element={<Status />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}
