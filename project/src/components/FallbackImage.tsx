import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type FallbackImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  fallbackSrc: string;
};

export default function FallbackImage({ src, fallbackSrc, alt, onError, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    setHasError(false);

    if (!src) {
      setImgSrc(fallbackSrc);
      return;
    }

    setImgSrc(fallbackSrc);

    const image = new Image();
    const timeout = window.setTimeout(() => {
      if (active) {
        setHasError(true);
        setImgSrc(fallbackSrc);
      }
    }, 800);

    image.onload = () => {
      if (!active) return;
      clearTimeout(timeout);
      setImgSrc(src);
      setHasError(false);
    };

    image.onerror = (event) => {
      if (!active) return;
      clearTimeout(timeout);
      setHasError(true);
      setImgSrc(fallbackSrc);
      if (onError) onError(event as unknown as SyntheticEvent<HTMLImageElement>);
    };

    image.src = src;

    return () => {
      active = false;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
    };
  }, [src, fallbackSrc, onError]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      loading={props.loading ?? 'eager'}
      decoding="async"
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
