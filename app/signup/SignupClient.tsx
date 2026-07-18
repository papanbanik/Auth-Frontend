"use client";

import Image from "next/image";
import { useState, useEffect, useContext, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContent";
import { Input } from "antd";

type AppContextType = {
  backendUrl: string;
  setIsLoggedin: (value: boolean) => void;
  checkAuth: () => Promise<void>;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setIsLoggedin, checkAuth } = useContext(
    AppContent,
  ) as AppContextType;

  const token = searchParams.get("token");
  const processedToken = useRef(false);

  // ================= GOOGLE TOKEN HANDLER =================
  useEffect(() => {
    if (!token || token.length < 10) return;
    if (processedToken.current) return;

    const isLoggedOut = localStorage.getItem("logout") === "true";
    if (isLoggedOut) {
      window.history.replaceState({}, "", "/signup");
      return;
    }

    processedToken.current = true;

    const handleGoogleLogin = async () => {
      try {
        localStorage.setItem("token", token);
        localStorage.removeItem("logout");

        await checkAuth();
        setIsLoggedin(true);

        window.history.replaceState({}, "", "/signup");
        toast.success("Google signup successful");
        router.push("/");
      } catch {
        toast.error("Google login failed");
      }
    };

    handleGoogleLogin();
  }, [token, checkAuth, setIsLoggedin, router]);

  // ================= EMAIL SIGNUP =================
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/signup`, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.removeItem("logout");

        setIsLoggedin(true);
        await checkAuth();

        toast.success(data.message);
        router.push("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  // ================= GOOGLE REDIRECT =================
  const googleLogin = () => {
    localStorage.removeItem("logout");
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div>
      <Image src={assets.logo} alt="logo" className="w-28 p-4" />
      <div className="flex min-h-screen flex-col">
        <form
          onSubmit={handleSignup}
          className="bg-slate-900 w-96 m-auto p-10 rounded-lg"
        >
          <h2 className="text-white text-center text-2xl font-semibold mb-2">
            Create Account
          </h2>

          <h2 className="text-center text-sm text-indigo-300 mb-6">
            Create your Account
          </h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 px-5 py-2.5 rounded-full bg-[#333A5C] text-white outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-5 py-2.5 rounded-full bg-[#333A5C] text-white outline-none"
            required
          />

          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="!mb-3 !px-5 !py-2.5 !rounded-full !bg-[#333A5C] !border-none [&_.ant-input]:!bg-[#333A5C] [&_.ant-input]:!text-white [&_.ant-input]:!rounded-full [&_.ant-input]:placeholder:!text-gray-400 [&_.ant-input-suffix]:!bg-transparent [&_.anticon]:!text-gray-400"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 w-full p-2 text-white rounded-full"
          >
            Sign Up
          </button>

          <p className="text-white mt-4 text-sm">
            Already have account?
            <span
              onClick={() => router.push("/login")}
              className="text-blue-400 cursor-pointer ml-2"
            >
              Login
            </span>
          </p>

          <button
            type="button"
            onClick={googleLogin}
            className="w-full mt-4 bg-[#ED7D13] text-black py-2 rounded-full flex items-center justify-center gap-2"
          >
            <img
              src="https://img.icons8.com/?size=100&id=60984&format=png&color=000000"
              alt="Google logo"
              className="w-5"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
