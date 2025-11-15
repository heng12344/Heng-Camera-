
import React from 'react';

interface ImageDisplayProps {
  originalImage: string | null;
  originalImageType: string | null;
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUseAsOriginal: () => void;
}

const ImageContainer: React.FC<{ title: string; imageSrc: string | null; children?: React.ReactNode }> = ({ title, imageSrc, children }) => (
    <div className="w-full h-full bg-gray-800 rounded-xl border border-gray-700 flex flex-col items-center justify-center p-4 relative overflow-hidden aspect-square">
        <h3 className="absolute top-2 left-4 text-lg font-semibold bg-black/50 px-3 py-1 rounded-full">{title}</h3>
        {imageSrc ? (
            <img src={imageSrc} alt={title} className="max-w-full max-h-full object-contain rounded-lg" />
        ) : (
            children
        )}
    </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, originalImageType, editedImage, isLoading, error, onImageUpload, onUseAsOriginal }) => {
    const originalImageSrc = originalImage && originalImageType ? `data:${originalImageType};base64,${originalImage}` : null;
    const editedImageSrc = editedImage ? `data:image/png;base64,${editedImage}` : null;

    const handleSave = () => {
        if (!editedImageSrc) return;
        const link = document.createElement('a');
        link.href = editedImageSrc;
        link.download = 'edited-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!originalImage) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-600 p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">ផ្ទុករូបភាពដើម្បីចាប់ផ្តើម (Upload an Image to Start)</h2>
                    <p className="text-gray-400 mb-6">ដំណើរច្នៃប្រឌិតរបស់អ្នកចាប់ផ្តើមពីរូបភាព។ តោះបង្កើតអ្វីដែលអស្ចារ្យ។ (Your creative journey begins with an image. Let's make something amazing.)</p>
                    <label htmlFor="file-upload" className="cursor-pointer bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">
                        ជ្រើសរើសរូបភាព (Select Image)
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
                </div>
            </div>
        );
    }
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="relative w-full h-full">
        <ImageContainer title="ដើម (Original)" imageSrc={originalImageSrc} />
        <label htmlFor="file-upload-new" className="absolute top-2 right-4 cursor-pointer bg-gray-700/80 backdrop-blur-sm text-white font-bold py-1 px-3 rounded-lg hover:bg-gray-600/80 transition-all duration-300 text-sm z-10">
            ផ្ទុក​រូបភាព​ថ្មី (Upload New)
        </label>
        <input id="file-upload-new" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
      </div>
      
      <div className="relative w-full h-full">
        <ImageContainer title="បានកែសម្រួល (Edited)" imageSrc={editedImageSrc}>
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <p className="text-xl font-semibold">Gemini កំពុងគិត... (Gemini is thinking...)</p>
              <p className="text-gray-400">កំពុងបង្កើតរូបភាពថ្មីរបស់អ្នក។ (Generating your new image.)</p>
            </div>
          )}
          {!isLoading && !editedImage && (
              <div className="text-center text-gray-400 p-4">
                  <p>រូបភាពដែលបានកែសម្រួលរបស់អ្នកនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីបង្កើតរួច។ (Your edited image will appear here once generated.)</p>
                  {error && <p className="text-red-400 mt-4 break-words">កំហុស (Error): {error}</p>}
              </div>
          )}
        </ImageContainer>
        {editedImage && !isLoading && (
            <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
                <button
                    onClick={handleSave}
                    className="bg-gray-700 text-gray-200 font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    aria-label="Save edited image"
                >
                    រក្សាទុក (Save)
                </button>
                <button
                    onClick={onUseAsOriginal}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    aria-label="Use edited image as the new original and continue editing"
                >
                    បន្ត (Continue)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
