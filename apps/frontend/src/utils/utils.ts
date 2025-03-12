import { UserDto } from '@/__generated__/dto-schemas';

export const defaultValues: Partial<UserDto> = {
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    company_name: "",
    company_address: "",
    company_tax_id: "",
    status: "inactive",
    timezone: "Europe/Bucharest",
};
