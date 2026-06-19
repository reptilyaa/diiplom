import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type FallbackImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  fallbackSrc: string;
};

export default function FallbackImage({ src, fallbackSrc, alt, onError, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      loading={props.loading ?? 'lazy'}
      decoding="async"
      onError={(event) => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        if (onError) onError(event);
      }}
    />
  );
}
