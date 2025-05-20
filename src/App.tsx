
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { VocabularyProvider } from "@/contexts/VocabularyContext";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import VocabularyPage from "./pages/VocabularyPage";
import ReviewPage from "./pages/ReviewPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <VocabularyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } />
                <Route path="/learn" element={
                  <Layout>
                    <LearnPage />
                  </Layout>
                } />
                <Route path="/vocabulary" element={
                  <Layout>
                    <VocabularyPage />
                  </Layout>
                } />
                <Route path="/review" element={
                  <Layout>
                    <ReviewPage />
                  </Layout>
                } />
                <Route path="/stats" element={
                  <Layout>
                    <StatsPage />
                  </Layout>
                } />
                <Route path="/settings" element={
                  <Layout>
                    <SettingsPage />
                  </Layout>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </VocabularyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
