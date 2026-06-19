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

export default function FallbackImage({ src, fallbackSrc, alt, onError, className = '', ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let triedProxy = false;
    let timeoutId: ReturnType<typeof window.setTimeout>;

    if (!src) {
      setImgSrc(fallbackSrc);
      setLoading(false);
      return;
    }

    setLoading(true);
    setImgSrc(fallbackSrc);
    const proxyUrl = getProxiedUrl(src);
    const image = new Image();

    const finishWithFallback = () => {
      if (!active) return;
      setImgSrc(fallbackSrc);
      setLoading(false);
      if (onError) onError(new Event('error') as unknown as SyntheticEvent<HTMLImageElement>);
    };

    const loadUrl = (url: string) => {
      image.onload = () => {
        if (!active) return;
        clearTimeout(timeoutId);
        setImgSrc(url);
        setLoading(false);
      };

      image.onerror = () => {
        if (!active) return;
        if (!triedProxy && proxyUrl && url === src) {
          triedProxy = true;
          loadUrl(proxyUrl);
          return;
        }
        finishWithFallback();
      };

      image.src = url;
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!active) return;
        if (!triedProxy && proxyUrl && url === src) {
          triedProxy = true;
          loadUrl(proxyUrl);
          return;
        }
        finishWithFallback();
      }, 8000);
    };

    loadUrl(src);

    return () => {
      active = false;
      clearTimeout(timeoutId);
      image.onload = null;
      image.onerror = null;
    };
  }, [src, fallbackSrc, onError]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 text-6xl transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span role="img" aria-label="dog paw">
          🐾
        </span>
      </div>
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        loading={props.loading ?? 'lazy'}
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={(event) => {
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          } else {
            setLoading(false);
          }
          if (onError) onError(event);
        }}
      />
    </div>
  );
}
