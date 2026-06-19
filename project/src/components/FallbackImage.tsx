import { useEffect, useState, type ImgHTMLAttributes } from 'react';

type FallbackImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  fallbackSrc: string;
};

export default function FallbackImage({ src, fallbackSrc, alt, onError, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src && !hasError ? src : fallbackSrc);
  }, [src, fallbackSrc, hasError]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={(event) => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
        if (onError) onError(event);
      }}
    />
  );
}
