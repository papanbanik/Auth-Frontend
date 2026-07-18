"use client";

import Image from "next/image";
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";
import { assets } from "../assets/assets";
import { Form, Input, Button } from "antd";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(AppContent);

  if (!context) {
    throw new Error("AppContent provider is missing");
  }

  const { backendUrl, loginUser, checkAuth } = context;

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const token = searchParams.get("token");
  const processedToken = useRef(false);

  // ================= GOOGLE LOGIN =================
  useEffect(() => {
    if (!token || token.length < 10) return;
    if (processedToken.current) return;

    const isLoggedOut = localStorage.getItem("logout") === "true";
    if (isLoggedOut) {
      window.history.replaceState({}, "", "/login");
      return;
    }

    processedToken.current = true;

    const handleGoogleLogin = async () => {
      setGoogleLoading(true);

      try {
        localStorage.setItem("token", token);
        localStorage.removeItem("logout");

        await checkAuth();

        window.history.replaceState({}, "", "/login");
        toast.success("Google login successful");
        router.push("/");
      } catch {
        toast.error("Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    };

    handleGoogleLogin();
  }, [token, checkAuth, router]);

  // ================= EMAIL LOGIN =================
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const success = await loginUser(values.email, values.password);

      if (success) {
        router.push("/");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE REDIRECT =================
  const googleLogin = () => {
    localStorage.removeItem("logout");
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <Image src={assets.logo} alt="logo" className="w-28 p-4" />

      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 w-96 p-10 rounded-lg shadow-lg">
          <h2 className="text-white text-center text-2xl font-semibold mb-6">
            Login
          </h2>

          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Email"
                size="large"
                className="!bg-[#333A5C] !text-white !border-none placeholder:!text-gray-400"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                size="large"
                className="!bg-[#333A5C] !border-none [&_input]:!bg-[#333A5C] [&_input]:!text-white [&_input]:placeholder:!text-gray-400 [&_.anticon]:!text-gray-400"
              />
            </Form.Item>

            <Form.Item className="mb-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <div className="flex justify-between text-sm mb-5">
            <p className="text-white">
              Don&apos;t have an account?
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-400 cursor-pointer ml-2"
              >
                Sign up
              </span>
            </p>
          </div>

          <p
            onClick={() => router.push("/forgot-password")}
            className="text-center text-[#ED7D13] cursor-pointer mb-5"
          >
            Forgot password?
          </p>

          <div className="text-gray-400 text-center mb-4">OR</div>

          <Button
            onClick={googleLogin}
            loading={googleLoading}
            block
            size="large"
            style={{
              background: "#ED7D13",
              color: "#000",
              border: "none",
            }}
          >
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </Button>
        </div>
      </div>
    </>
  );
}
