import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import apiClient from "@/utils/apiClient";

export default function EmailVerification() {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL query param
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing or invalid.");
        return;
      }

      try {
        await apiClient.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login...");

        // redirect after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Verification failed. Please try again.";
        setStatus("error");
        setMessage(errorMsg);
      }
    }

    verifyEmail();
  }, [token, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-16 h-16 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "error":
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Mail className="w-16 h-16 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-primary";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-elegant p-4">
      <Card className="w-full max-w-md shadow-strong border-elegant bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Email Verification
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className={`text-lg font-medium ${getStatusColor()}`}>
            {message}
          </p>
          
          {status === "loading" && (
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your email address...
            </p>
          )}
          
          {status === "success" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                You will be automatically redirected to the login page.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-primary hover:shadow-medium transition-all duration-300"
              >
                Continue to Login
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                If you continue to experience issues, please contact support.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="flex-1 border-elegant"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="flex-1 bg-gradient-primary hover:shadow-medium transition-all duration-300"
                >
                  Register Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}