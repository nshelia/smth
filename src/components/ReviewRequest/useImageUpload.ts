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
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageUrls,setImageUrls] = useState<string[]>([])
  const uploadedRef = useRef<StorageReference>();
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedImages) {
      setPreviews([]);
      return;
    }
    if (selectedImages.length) {
      const allPreviews = selectedImages.map(item => {
        const objectUrl = URL.createObjectURL(item);
        return objectUrl
      })
      setPreviews(allPreviews);
    }


    // free memory when ever this component is unmounted
  }, [selectedImages]);

  const onSelectImages = async (files: any) => {
    if (!files || files.length === 0) {
      setSelectedImages([]);
      return;
    }
    setFailed(false);
    const realImages: string[] = []
    await Promise.all(files.map((item: any) => {
      const fileRef = ref(userImagesRef, 'image-' + uuidv4());

      return uploadBytes(fileRef, item)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL: string) => {
        realImages.push(downloadURL)
        setUploading(false);
      })
      .catch((e) => {
        setFailed(true);
        setUploading(false);
      });

    }))

    setImageUrls(realImages)

    setSelectedImages(files)

  };

  const resetImage = async (image: any) => {
    setFailed(false);
    setPreviews(previews.filter(blob => blob !== image));
    if (!uploading && uploadedRef.current) {
      await deleteObject(uploadedRef.current);
    }
  };

  return {
    failed,
    uploading,
    resetImage,
    onSelectImages,
    setSelectedImages,
    selectedImages,
    previews,
    imageUrls
  };
}

export default useImageUpload;
