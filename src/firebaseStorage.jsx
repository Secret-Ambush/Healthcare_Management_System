import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Upload file to Firebase Storage
export const uploadFile = async (file, userId, folder = "health-records") => {
  const fileRef = ref(storage, `${userId}/${folder}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

// Delete file from Firebase Storage
export const deleteFile = async (filePath) => {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
};
