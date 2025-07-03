import { Loader2Icon, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useRegister } from "@/services/auth-service/hooks";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { toast } from "sonner";

interface RegisterForm {
  email: string;
  password: string;
  username: string;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    // formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const { mutate } = useRegister();

  const handleClickRegister = useCallback(
    async (value: RegisterForm) => {
      mutate(
        {
          email: value.email,
          password: value.password,
          username: value.username,
        },
        {
          onSuccess: (data) => {
            console.log("Registration successful:", data);
            signIn("credentials", {
              redirect: false,
              username: value.email,
              password: value.password,
              callbackUrl: "/",
            }).then((result) => {
              if (result?.error) {
                console.error("Login failed:", result.error);
              } else {
                router.push("/");
              }
            });
          },
          onError: (error) => {
            toast.error("Registration failed: " + error.message, {
              position: "top-center",
            });
            console.error("Registration failed:", error.message);
          },
        },
      );
    },
    [mutate, router],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to register for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleClickRegister)}
            className="space-y-6"
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  )}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">username</Label>

                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      required
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
