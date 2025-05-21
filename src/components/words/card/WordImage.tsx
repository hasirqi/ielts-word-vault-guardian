
import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface WordImageProps {
  word: string;
}

const WordImage: React.FC<WordImageProps> = ({ word }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Generate a consistent image for each word using a more reliable method
  const generateImageUrl = (word: string) => {
    // Use placeholder images for predictable results
    // We'll use the first character of the word to determine which placeholder to use
    const firstChar = word.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0);
    
    // Use one of 4 placeholder images based on the character code
    const placeholders = [
      "photo-1618160702438-9b02ab6515c9",
      "photo-1472396961693-142e6e269027",
      "photo-1535268647677-300dbf3d78d1",
      "photo-1501286353178-1ec881214838"
    ];
    
    const index = charCode % placeholders.length;
    return `https://images.unsplash.com/${placeholders[index]}?w=300&h=200&fit=crop&q=80`;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
      {!imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          <img
            src={generateImageUrl(word)}
            alt={`Visual for ${word}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Image className="h-8 w-8 mb-2" />
          <p className="text-sm">Image not available</p>
        </div>
      )}
    </div>
  );
};

export default WordImage;
