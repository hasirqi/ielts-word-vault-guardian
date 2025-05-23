
import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface WordImageProps {
  word: string;
}

const WordImage: React.FC<WordImageProps> = ({ word }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Generate a more unique image for each word using deterministic hashing
  const generateImageUrl = (word: string, retry = 0) => {
    // Create a simple hash from the word to get variety in images
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    const hash = hashString(word) + retry;
    
    // Use a variety of Unsplash collections for more diverse images
    const collections = [
      // Nature and landscapes
      "1118905", "3178572", "4332580", "1976082", 
      // Objects and abstract
      "2489501", "3106804", "1242150", "1103088",
      // Educational concepts
      "3657445", "4587498", "1242150", "2489501",
      // Technology
      "4322575", "2276562", "8934890", "1210032",
      // People and lifestyle
      "3678149", "2756272", "1241688", "4424267",
      // Food and cuisine
      "3698173", "4813745", "2489605", "4349748",
      // Travel and places
      "3846912", "2278389", "1507691", "2734867",
      // Business and work
      "2476111", "3389432", "2893961", "4427377"
    ];
    
    // Different image sizes for variety
    const sizes = ["400x300", "450x300", "500x350", "400x320"];
    
    // Select collection and size based on the word's hash
    const collection = collections[hash % collections.length];
    const size = sizes[hash % sizes.length];
    
    // Add a timestamp and retry parameter to prevent caching issues
    const timestamp = new Date().getTime();
    return `https://source.unsplash.com/collection/${collection}/${size}?${encodeURIComponent(word)}&t=${timestamp}&retry=${retry}`;
  };

  // Use Pixabay API as a fallback option
  const generatePixabayUrl = (word: string) => {
    // Use a proxy to avoid CORS issues with the browser preview
    const encodedWord = encodeURIComponent(word);
    return `https://pixabay.com/api/?key=39666206-330a421da9842acf3d844353c&q=${encodedWord}&image_type=photo&per_page=3&safesearch=true`;
  };

  // Load image when component mounts or word/retryCount changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    
    // First, try with Unsplash collections
    const unsplashUrl = generateImageUrl(word, retryCount);
    setImageSrc(unsplashUrl);
    
  }, [word, retryCount]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    if (retryCount < 2) {
      // Try again with Unsplash with increased retry count
      setRetryCount(prev => prev + 1);
      setImageError(false);
    } else if (retryCount === 2) {
      // If Unsplash failed after retries, switch to Pixabay API
      fetch(generatePixabayUrl(word))
        .then(response => response.json())
        .then(data => {
          if (data.hits && data.hits.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 3));
            setImageSrc(data.hits[randomIndex].webformatURL);
            setImageError(false);
          } else {
            // If no Pixabay results, show error state
            setImageError(true);
            setImageLoading(false);
          }
        })
        .catch(() => {
          setImageError(true);
          setImageLoading(false);
        });
      setRetryCount(prev => prev + 1);
    } else {
      // All attempts failed
      setImageError(true);
      setImageLoading(false);
    }
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
          {imageSrc && (
            <img
              src={imageSrc}
              alt={`Visual for ${word}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
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
