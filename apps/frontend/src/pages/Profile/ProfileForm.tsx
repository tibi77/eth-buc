import { UserDto } from '@/__generated__/dto-schemas';
import { CoolSelector } from '@/components/CoolSelector';
import { Label } from '@/components/ui/label';
import { UserProfileVerificationShape, WorkingDays, WorkingHours } from '@metavest/types/user';
import { utcList } from '@metavest/types/user/ianaTimezonesList';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';


export const ProfileForm = ({
    form,
    isEditable,
    handleEditClick,
    handleReset,
    onSubmit,
    defaultEditable = false
}: {
    form: ReturnType<typeof useForm<UserDto>>;
    isEditable: boolean;
    handleEditClick: () => void;
    handleReset: () => void;
    onSubmit: (data: UserDto) => void;
    defaultEditable?: boolean;
}) => {

    return <Form {...form}>
        <form onSubmit={(e) => {
            form.clearErrors();
            e.preventDefault();
            try {
                if (isEditable || defaultEditable) {
                    UserProfileVerificationShape.parse(form.getValues());
                    const data = form.getValues();
                    onSubmit(data);
                }
                handleEditClick();
            } catch (err) {
                if (err instanceof ZodError) {
                    const errors = err.errors;
                    errors.forEach((error) => {
                        form.setError(error.path[0] as keyof UserDto, {
                            message: error.message
                        });
                    });
                }

            }
        }} className="grid md:grid-cols-2 sm:grid-col-1 gap-4" style={{
            rowGap: "2rem"
        }}>
            <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="First Name" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="Last Name" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                disabled={defaultEditable}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="Email Address" className="bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" disabled={!isEditable} placeholder="Phone Number" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <hr className="col-span-2" />
            <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="Company Name" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="company_tax_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company Tax ID</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="Company Tax ID" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                    <FormItem
                        className="col-span-2"
                    >
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                            <Input disabled={!isEditable} placeholder="Company Address" className='bg-white' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="timezone"
                render={() => (
                    <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                            <CoolSelector
                                data={utcList}
                                placeholder="Select Timezone"
                                disabled={!isEditable}
                                value={form.getValues("timezone") ?? ""}
                                onChange={(value) => {
                                    form.setValue("timezone", value as UserDto["timezone"]);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex flex-col justify-between'>
                <Label>Public availability</Label>
                <div className='grid grid-cols-3 gap-1'>
                    <FormField
                        control={form.control}
                        name="week_days"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <CoolSelector
                                        data={WorkingDays.slice()}
                                        placeholder="Week Days"
                                        disabled={!isEditable}
                                        value={form.getValues("week_days") ?? ""}
                                        onChange={(value) => {
                                            form.setValue("week_days", value as UserDto["week_days"]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <CoolSelector
                                        data={WorkingHours.slice()}
                                        placeholder="Start Time"
                                        disabled={!isEditable}
                                        value={form.getValues("start_time") ?? ""}
                                        onChange={(value) => {
                                            form.setValue("start_time", value as UserDto["start_time"]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_time"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <CoolSelector
                                        data={WorkingHours.slice()}
                                        placeholder="End Time"
                                        disabled={!isEditable}
                                        value={form.getValues("end_time") ?? ""}
                                        onChange={(value) => {
                                            form.setValue("end_time", value as UserDto["end_time"]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>



            <div className='grid md:grid-cols-2 sm:grid-col-1 md:gap-4 col-span-2'>
                <Button
                    type="submit"
                >
                    {defaultEditable
                        ? 'Save Profile'
                        : isEditable
                            ? 'Update Profile'
                            : 'Edit Profile'
                    }
                </Button>
                {isEditable && !defaultEditable && (
                    <Button
                        type="reset"
                        onClick={handleReset}
                        variant='outline'
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    </Form >;
};

