import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type FallbackImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  fallbackSrc: string;
};

function getProxiedUrl(url: string) {
  if (url.startsWith('/') || url.startsWith('data:')) return null;
  try {
    const normalized = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(normalized)}`;
  } catch {
    return null;
  }
}

export default function FallbackImage({ src, fallbackSrc, alt, onError, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc);

  useEffect(() => {
    let active = true;
    let triedProxy = false;
    let timeout = 0;

    if (!src) {
      setImgSrc(fallbackSrc);
      return;
    }

    setImgSrc(fallbackSrc);
    const proxyUrl = getProxiedUrl(src);
    const image = new Image();

    const finishWithFallback = () => {
      if (!active) return;
      setImgSrc(fallbackSrc);
      if (onError) onError(new Event('error') as unknown as SyntheticEvent<HTMLImageElement>);
    };

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (!active) return;
        if (!triedProxy && proxyUrl) {
          triedProxy = true;
          loadImage(proxyUrl);
          return;
        }
        finishWithFallback();
      }, 8000);
    };

    const loadImage = (url: string) => {
      image.onload = () => {
        if (!active) return;
        clearTimeout(timeout);
        setImgSrc(url);
      };

      image.onerror = () => {
        if (!active) return;
        if (!triedProxy && proxyUrl && url === src) {
          triedProxy = true;
          resetTimeout();
          image.src = proxyUrl;
          return;
        }
        finishWithFallback();
      };

      image.src = url;
      resetTimeout();
    };

    loadImage(src);

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
