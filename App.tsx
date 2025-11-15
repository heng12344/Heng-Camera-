
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { editImageWithControls } from './services/geminiService';
import { EditControls } from './types';
import { INITIAL_CONTROLS } from './constants';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageType, setOriginalImageType] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<EditControls>(INITIAL_CONTROLS);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume key selection is successful to avoid race condition
      setIsApiKeySelected(true);
      setError(null); // Clear previous errors
    } catch (e) {
      console.error("Error opening API key selection dialog:", e);
      setError("Could not open API key selection. Please try again.");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage((reader.result as string).split(',')[1]);
        setOriginalImageType(file.type);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !originalImageType) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithControls(originalImage, originalImageType, controls);
      setEditedImage(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      if (errorMessage.includes("API key not valid") || errorMessage.includes("Requested entity was not found")) {
        setError("Your API key appears to be invalid. Please select a valid key to continue.");
        setIsApiKeySelected(false);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalImageType, controls]);

  const handleUseAsOriginal = () => {
    if (editedImage) {
      setOriginalImage(editedImage);
      setOriginalImageType('image/png'); // Gemini API returns png
      setEditedImage(null);
      setError(null);
      setControls(INITIAL_CONTROLS);
    }
  };
  
  if (!isApiKeySelected) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-2xl text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            API Key Required
          </h1>
          <p className="mb-6 text-gray-300">
            To use the AI Image Controller, you need to select a Gemini API key.
          </p>
          {error && <p className="text-red-400 mb-4 break-words">{error}</p>}
          <button
            onClick={handleSelectApiKey}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Select Your API Key
          </button>
          <p className="text-xs text-gray-500 mt-6">
            For information on billing, please visit{' '}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              ai.google.dev/gemini-api/docs/billing
            </a>.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
       <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10 flex justify-between items-center">
        <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            ឧបករណ៍បញ្ជារូបភាព AI (AI Image Controller)
            </h1>
            <p className="text-center text-gray-400 text-sm mt-1">បញ្ជាវត្ថុ មនុស្ស និងទិដ្ឋភាពកាមេរ៉ាដោយប្រើ Gemini (Control objects, people, and camera perspectives with Gemini)</p>
        </div>
        <button
            onClick={handleSelectApiKey}
            className="bg-gray-700/80 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600/80 transition-all duration-300 flex-shrink-0 ml-4"
        >
            Change Key
        </button>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        <div className="flex-grow lg:w-2/3 flex flex-col">
          <ImageDisplay 
            originalImage={originalImage}
            originalImageType={originalImageType}
            editedImage={editedImage}
            isLoading={isLoading}
            error={error}
            onImageUpload={handleImageUpload}
            onUseAsOriginal={handleUseAsOriginal}
          />
        </div>
        
        <div className="lg:w-1/3 flex flex-col">
          <ControlPanel 
            controls={controls}
            setControls={setControls}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isImageUploaded={!!originalImage}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
