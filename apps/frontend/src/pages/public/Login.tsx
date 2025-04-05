
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authContext } from '@/services/authcontext';
import { formFields } from '@/utils/utilsAuth';
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthenticationShape } from "@metavest/types/authentication";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function Login() {
  const [error, setError] = useState("");
  const { login, removeToken,} = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    removeToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<z.infer<typeof AuthenticationShape>>({
    resolver: zodResolver(AuthenticationShape),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = useCallback(async (e: z.infer<typeof AuthenticationShape>) => {
    try {
      const { email, password } = e;
      login(
        {
          email,
          password,
          onSuccess: () => {
            navigate({
              to: "/otp-verification",
              replace: true,
              search: {
                email,
              }
            });
          },
          onError: () => {
            setError("Login failed");
          }
        }
      );
    } catch (err) {
      setError("Login failed");
    }
  }, [login, navigate]);

  return (
    <div className='flex flex-col md:col-span-2 justify-between m-auto p-10'>
      <FormProvider {...form}>
        <div className="my-4">
          <h1 className="text-3xl font-semibold ">Metavest</h1>
          <p className="mt-2 text-lg">

          </p>
        </div>
        <form className="space-y-8">
          {
            formFields.map((formField) => (
              <FormField name={formField.name}
                key={formField.name}
                control={form.control}
                render={({ field }) => <FormItem key={field.name}>
                  <FormLabel>{formField.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={formField.type}
                      placeholder={formField.placeholder}
                      {...form.register(field.name)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                } />
            ))
          }
          <FormMessage>{error}</FormMessage>
          <Button onClick={(e) => {
            e.preventDefault();
            handleLogin(form.getValues());
            setError("");
          }}>Login</Button>
        </form>
      </FormProvider>
      <p className='text-xs mt-10'>
        If you continue, you are accepting <a href="#/terms-of-service" className="font-bold">Terms of Service</a>, <a href="#/privacy-policy" className="font-bold">Privacy Policy</a> and <a href="#/cookies-policy" className="font-bold">Cookies Policy</a>
      </p>
    </div>
  );
}


// better ui -> https://ui.shadcn.com/blocks#login-01

