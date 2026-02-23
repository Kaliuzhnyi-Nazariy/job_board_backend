import cloudinary from "./config";

export const uploadPhoto = async (
  file: Express.Multer.File,
  userId?: string,
) => {
  // console.log(file);

  const ret = await cloudinary.uploader.upload(file.path, {
    folder: "job_board_account_images",
    public_id: `user_${userId}`,
    overwrite: true,
  });

  return ret;
};

export const deleteCloudPhoto = async (userId: string) => {
  return await cloudinary.uploader.destroy(
    `job_board_account_images/user_${userId}`,
  );
};
