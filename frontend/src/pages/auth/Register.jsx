import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, User, Mail, Lock, MapPin, Phone, Calendar, Users } from "lucide-react";
import { registerUserJson as register } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Register() {
  // State for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    address: "",
    birthday: "",
    phone: "",
    sex: "",
  });
  // State for the current step of the multi-step form
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle Select component changes specifically for gender
  const handleSelectChange = (value) => {
    setForm({ ...form, sex: value });
  };

  // Move to the next step
  const nextStep = () => {
    // Basic validation for step 1
    if (step === 1) {
      if (!form.name || !form.email) {
        toast.error("Please fill in all required fields.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  // Move to the previous step
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Handle form submission on the final step
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address || null,
        birthday: form.birthday || null,
        phone: form.phone || null,
        sex: form.sex || null,
      };

      // Assuming `register` is a function that makes an API call
      await register(payload);
      toast.success("Registration successful! Please check your email to verify your account.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirm: "",
        address: "",
        birthday: "",
        phone: "",
        sex: "",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err?.detail?.[0]?.msg || err?.detail || "Registration failed.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Step 1: Account Details</h2>
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <Button onClick={nextStep} type="button" className="w-full">
              Next
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Step 2: Personal Information (Optional)</h2>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Your address"
                  value={form.address}
                  onChange={handleChange}
                  className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-sm font-medium">Birthday</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                    className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm font-medium">Gender</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={form.sex} onValueChange={handleSelectChange}>
                  <SelectTrigger className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} type="button" variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={nextStep} type="button" className="flex-1">
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Step 3: Security</h2>
            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="pl-10 transition-smooth border-elegant focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} type="button" variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex-1 bg-gradient-primary hover:shadow-medium transition-all duration-300 font-semibold py-3 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-elegant p-4">
      <Card className="w-full max-w-lg shadow-strong border-elegant bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Create Account
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Step {step} of 3
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
          </form>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-glow transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
