// upload image to cloudinary
// cloudinary: Preset의 Mode를 unsigned로 할 것. Signed로 설정하면 cors관련 문제발생.

// upload images
// upload image to cloudinary

// upload images
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // from cloudinary homepage
  const presetName = process.env.REACT_APP_UPLOAD_PRESET;
  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  formData.append("upload_preset", presetName);
  const url = `http://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  const data = await response.json();
  return data.secure_url;
};
