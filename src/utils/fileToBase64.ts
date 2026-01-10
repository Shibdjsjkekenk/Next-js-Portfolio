const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // IMPORTANT: Image / PDF dono ke liye correct
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result as string); // prefix + base64
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default fileToBase64;
