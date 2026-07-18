"use client";

import Image from "next/image";
import { assets } from "../assets/assets";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSendResetOtp } from "./hooks/useSendResetOtp";
import OtpInput from "./../context/OtpInput";
import { useVerifyOtp } from "./hooks/useVerifyOtp";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { useResetPassword } from "./hooks/useResetPassword";

const Page = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const { mutate, isPending } = useSendResetOtp();
  const { mutate: verifyOtpMutate, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resetPasswordMutate, isPending: isResetting } =
    useResetPassword();
  const router = useRouter();
  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    mutate(email.trim(), {
      onSuccess: (data) => {
        toast.success(data.message || "OTP sent successfully");
        setStep(1);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to send reset OTP",
        );
      },
    });
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6 digit OTP");
      return;
    }
    verifyOtpMutate(
      { email, otp },
      {
        onSuccess: (data) => {
          toast.success(data.message || "OTP verifid sucessfully");
          setStep(2);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Invalid OTP");
        },
      },
    );
  };
  const handleResetPassword = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    resetPasswordMutate(
      { email, newPassword: values.password },
      {
        onSuccess: (data) => {
          toast.success(data.message || "password reset successful");
          router.push("/login");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to reset password ",
          );
        },
      },
    );
  };
  return (
    <div className="px-4 md:px-8 min-h-screen">
      <Image src={assets.logo} alt="logo" className="w-25 p-4" />

      <div className="flex justify-center items-center min-h-screen">
        {step === 0 && (
          <div className="bg-slate-900 w-[400px] h-[250px] flex justify-center items-center rounded-lg">
            <form onSubmit={handleSendOtp} className="w-96 p-10 rounded-lg">
              <h2 className="text-white text-center text-2xl mb-6">
                Forgot Password
              </h2>

              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-[#333A5C] text-white outline-none"
              />

              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer bg-indigo-600 text-white w-full mt-5 p-2 rounded-lg"
              >
                {isPending ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        )}

        {step === 1 && (
          <div className="bg-slate-900 w-[400px] h-[250px] flex justify-center items-center rounded-lg">
            <form onSubmit={handleVerifyOtp} className="w-96 p-10 rounded-lg">
              <h2 className="text-white text-center text-2xl mb-6">
                OTP Verification
              </h2>

              <OtpInput length={6} onComplete={(value) => setOtp(value)} />

              <button
                type="submit"
                className="cursor-pointer bg-indigo-600 text-white w-full mt-5 p-2 rounded-lg"
              >
                {isVerifying ? "Verifying.." : "Verify"}
              </button>
            </form>
          </div>
        )}
        {step === 2 && (
          <div className="bg-slate-900 w-[400px] h-[340px] flex justify-center items-center rounded-lg">
            <div className="w-96 p-10">
              <h2 className="text-white text-center text-2xl mb-6">
                Reset Password
              </h2>

              <Form
                layout="vertical"
                onFinish={(values) => {
                  setPassword(values.password);
                  setConfirmPassword(values.confirmPassword);
                  handleResetPassword(values);
                }}
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Enter a new password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[0-9]).*$/,
                      message: "Password must contain a letter and number",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter new password"
                    maxLength={10}
                    size="large"
                    className="!mb-3 !px-5 !py-2.5 !rounded-full !bg-[#333A5C] !border-none [&_.ant-input]:!bg-[#333A5C] [&_.ant-input]:!text-white [&_.ant-input]:!rounded-full [&_.ant-input]:placeholder:!text-gray-400 [&_.ant-input-suffix]:!bg-transparent [&_.anticon]:!text-gray-400 "
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Retype new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Password does not match"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Retype new password"
                    maxLength={100}
                    size="large"
                    className="!mb-3 !px-5 !py-2.5 !rounded-full !bg-[#333A5C] !border-none [&_.ant-input]:!bg-[#333A5C] [&_.ant-input]:!text-white [&_.ant-input]:!rounded-full [&_.ant-input]:placeholder:!text-gray-400 [&_.ant-input-suffix]:!bg-transparent [&_.anticon]:!text-gray-400 "
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isResetting}
                    block
                    size="large"
                  >
                    Reset password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
