import { useAuthenticationPasswordReset } from '@/__generated__/endpoints/authentication.gen';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { passwordRecoveryRoute } from '@/routes/public';
import { defaultValues } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthenticationShape, PasswordRecoveryChecker, TPasswordRecoveryChecker } from '@metavest/types/authentication';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const PasswordRecovery = () => {
    const { email } = useSearch({
        from: passwordRecoveryRoute.id,
    });

    const updatePassword = useAuthenticationPasswordReset();
    const { toast } = useToast();
    const form = useForm<TPasswordRecoveryChecker>({
        resolver: zodResolver(PasswordRecoveryChecker),
        defaultValues,
        mode: "onChange",
    });
    const navigate = useNavigate();
    const onSubmit = useCallback(async (data: TPasswordRecoveryChecker) => {
        try {
            form.clearErrors();
            if (data.password !== data.confirmPassword) {
                form.setError("confirmPassword", {
                    type: "manual",
                    message: "Passwords do not match"
                });
                return;
            }
            try {
                AuthenticationShape.parse(data);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    if (error.errors.find(e => e.path[0] === "password")) {
                        form.setError("password", {
                            type: "manual",
                            message: error.errors.find(e => e.path[0] === "password")?.message
                        });
                    }
                }
            }

            await updatePassword.mutateAsync({
                data: { ...data, email }
            });
            navigate({
                to: "/login"
            });
            toast({
                description: "Password updated successfully",
            });
        } catch (error) {
            console.error(error);
        }
    }, [email, form, navigate, toast, updatePassword]);

    return (
        <div className='w-full flex flex-col md:col-span-2 justify-between m-auto p-20'>
            <div className="rounded-xl bg-muted/50 md:min-h-min p-8" >
                <h1 className="text-2xl font-semibold mb-10">Update Password</h1>
                <Form {...form}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(form.getValues());
                    }}
                        className="grid grid-col-1 gap-4" style={{
                            rowGap: "2rem"
                        }}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Change Password</FormLabel>
                                    <Input className="bg-white" type="password" {...form.register("password")} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input className="bg-white" type="password"  {...form.register("confirmPassword")} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            className='mt-4'
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>

    );
};
