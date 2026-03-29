import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HomePage } from "@/pages/HomePage";
import { SetupPage } from "@/pages/SetupPage";
import { InterviewPage } from "@/pages/InterviewPage";
import { ProcessingPage } from "@/pages/ProcessingPage";
import { ReportPage } from "@/pages/ReportPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminPage } from "@/pages/AdminPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { CoachingPage } from "@/pages/CoachingPage";
import { CalibrationPage } from "@/pages/CalibrationPage";
import { AcceptInvitePage } from "@/pages/AcceptInvitePage";
import { CandidateInvitePage } from "@/pages/CandidateInvitePage";
import { CandidatesPage } from "@/pages/CandidatesPage";
import { CandidateProfilePage } from "@/pages/CandidateProfilePage";
import { CandidateComparePage } from "@/pages/CandidateComparePage";
import { ReferenceFormPage } from "@/pages/ReferenceFormPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/accept-invite" component={AcceptInvitePage} />
      <Route path="/invite/:token" component={CandidateInvitePage} />
      <Route path="/reference/:token" component={ReferenceFormPage} />

      <Route path="/">
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      </Route>

      <Route path="/setup">
        <ProtectedRoute minimumRole="interviewer">
          <SetupPage />
        </ProtectedRoute>
      </Route>

      <Route path="/interview">
        <ProtectedRoute minimumRole="interviewer">
          <ErrorBoundary label="Interview">
            <InterviewPage />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>

      <Route path="/processing">
        <ProtectedRoute minimumRole="interviewer">
          <ProcessingPage />
        </ProtectedRoute>
      </Route>

      <Route path="/report/:id">
        <ProtectedRoute>
          <ErrorBoundary label="Report">
            <ReportPage />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>

      <Route path="/coaching/:id">
        <ProtectedRoute>
          <CoachingPage />
        </ProtectedRoute>
      </Route>

      <Route path="/calibration/:id">
        <ProtectedRoute>
          <CalibrationPage />
        </ProtectedRoute>
      </Route>

      <Route path="/analytics">
        <ProtectedRoute minimumRole="viewer">
          <AnalyticsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/candidates">
        <ProtectedRoute minimumRole="interviewer">
          <CandidatesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/candidates/compare">
        <ProtectedRoute minimumRole="interviewer">
          <CandidateComparePage />
        </ProtectedRoute>
      </Route>

      <Route path="/candidates/:id">
        <ProtectedRoute minimumRole="interviewer">
          <CandidateProfilePage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute requiredRoles={['owner', 'admin']}>
          <AdminPage />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={(import.meta.env.BASE_URL || '/').replace(/\/$/, '') || ''}>
              <Router />
            </WouterRouter>
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
