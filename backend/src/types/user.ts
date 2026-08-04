export interface UpdateProfileDto {
    name?: string;
    bio?: string;
    profileImage?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}