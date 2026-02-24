/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import Projects from "./pages/Projects";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import PalettePreview from "./pages/PalettePreview";
import BrandKit from "./pages/BrandKit";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

import { AuraProvider } from "./context/AuraContext";

export default function App() {
  return (
    <AuraProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/brandkit" element={<BrandKit />} />
            <Route path="/projects/:id" element={<BrandKit />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<PalettePreview />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
          </Routes>
        </Layout>
      </Router>
    </AuraProvider>
  );
}
