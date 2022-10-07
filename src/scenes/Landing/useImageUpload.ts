import { useState, useEffect, useRef } from 'react';
import {
  uploadBytes,
  ref,
  getDownloadURL,
  StorageReference,
  deleteObject,
} from 'firebase/storage';
import { userImagesRef } from '../../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

function useImageUpload() {
  const [selectedImage, setSelectedImage] = useState();
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [failed, setFailed] = useState(false);

  const uploadedRef = useRef<StorageReference>();
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedImage) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const onSelectImage = (files: any) => {
    if (!files || files.length === 0) {
      setSelectedImage(undefined);
      return;
    }
    setFailed(false);

    const fileRef = ref(userImagesRef, 'image-' + uuidv4());
    // 'file' comes from the Blob or File API
    setUploading(true);

    uploadBytes(fileRef, files[0])
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        uploadedRef.current = fileRef;
        setImageUrl(downloadURL);
        setUploading(false);
      })
      .catch((e) => {
        setFailed(true);
        setUploading(false);
      });

    setSelectedImage(files[0]);
  };

  const resetImage = async () => {
    setFailed(false);
    setSelectedImage(undefined);
    if (!uploading && uploadedRef.current) {
      await deleteObject(uploadedRef.current);
    }
  };

  return {
    failed,
    imageUrl,
    uploading,
    resetImage,
    onSelectImage,
    setSelectedImage,
    selectedImage,
    preview,
  };
}

export default useImageUpload;
