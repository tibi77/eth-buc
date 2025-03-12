import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpVerificationRoute } from "@/routes/public";
import { authContext } from "@/services/authcontext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OtpVerification = () => {
  const { email } = useSearch({
    from: otpVerificationRoute.id,
  });

  const navigate = useNavigate();

  const { otpLogin } = useContext(authContext);
  const [error, setError] = useState("");
  const firstOtpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstOtpRef.current?.focus();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: "" },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        otpLogin({
          email,
          otp: data.pin,
          onSuccess: (data) => {
            const currentStatus = data.status ?? "inactive";
            if (currentStatus === "inactive") {
              navigate({
                to: "/passwordRecovery",
                replace: true,
                search: {
                  email,
                },
              });
              return;
            }
            if (currentStatus === "onboarding") {
              navigate({
                to: "/profile",
                replace: true,
              });
              return;
            }
            navigate({
              to: "/dashboard",
              replace: true,
            });
          },
          onError: (err) => {
            setError("OTP verification failed");
            console.error("OTP Login Error:", err);
          },
        });
      } catch (err) {
        setError("OTP verification failed");
        console.error("OTP Login Error:", err);
      }
    },
    [email, navigate, otpLogin]
  );

  return (
    <div className="flex flex-col md:col-span-2 justify-between m-auto p-10 gap-4">
      <h1 className="text-3xl font-semibold ">Bookit</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} ref={firstOtpRef} tabIndex={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password received by your email.
                </FormDescription>
                <FormMessage>{error}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;
