"use client";
import { useForm } from "react-hook-form";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input {...register("username")} required autoComplete="username" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            {...register("password")}
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
