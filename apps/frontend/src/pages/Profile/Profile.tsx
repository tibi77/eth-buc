import { UserDto } from "@/__generated__/dto-schemas";
import {
  getUsersGetProfileQueryKey,
  useUsersGetProfile,
  useUsersUpdate,
} from "@/__generated__/endpoints/users.gen";
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "@/pages/Profile/ProfileForm";
import { authContext } from "@/services/authcontext";
import { defaultValues } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserShapeNoId } from "@bookIt/types/user/user.types";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const Profile = () => {
  const { data: userData, isLoading } = useUsersGetProfile();
  const queryClient = useQueryClient();
  const userUpdate = useUsersUpdate();
  const { toast } = useToast();

  const [isEditable, setIsEditable] = useState(false);
  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const form = useForm<UserDto>({
    resolver: zodResolver(UserShapeNoId),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form]);
  const { logout } = useContext(authContext);

  const onSubmit = useCallback(
    async (data: UserDto) => {
      try {
        if (userData) {
          const result = await userUpdate.mutateAsync({
            id: userData._id ?? "",
            data,
          });
          queryClient.setQueryData(getUsersGetProfileQueryKey(), result);
          toast({
            description: "Profile updated successfully",
          });
          if (userData.status !== "active") {
            setTimeout(() => {
              logout();
              window.location.href = "/login";
            }, 1000);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [logout, queryClient, toast, userData, userUpdate]
  );

  const handleReset = useCallback(() => {
    form.reset(userData);
    setIsEditable(false);
  }, [form, userData]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="md:w-[50%] rounded-xl bg-muted/50 md:min-h-min m-8 p-8">
      <h1 className="text-2xl font-semibold mb-10">Update Profile</h1>

      <hr className="col-span-2 mb-6" />

      <hr className="col-span-2 mb-6" />

      <ProfileForm
        form={form}
        isEditable={userData?.status !== "active" || isEditable}
        handleEditClick={handleEditClick}
        handleReset={handleReset}
        onSubmit={onSubmit}
        defaultEditable={userData?.status !== "active"}
      />
    </div>
  );
};
