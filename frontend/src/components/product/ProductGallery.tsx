import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import { ChevronLeftIcon, ChevronRightIcon, ZoomIcon } from '../ui/icons';

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

const ProductGallery = ({ images, alt }: ProductGalleryProps) => {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const activeImage = safeImages[activeIndex] ?? safeImages[0] ?? '';

  if (!safeImages.length) {
    return <div className="surface aspect-square bg-white" />;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-md border border-border bg-white"
        aria-label={`Zoom ${alt}`}
      >
        <img src={activeImage} alt={alt} className="h-full w-full object-cover transition-fast group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink shadow-level1">
          <ZoomIcon className="h-4 w-4" />
        </span>
      </button>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-fast ${
              index === activeIndex ? 'border-ink' : 'border-border hover:border-ink'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setActiveIndex((value) => (value - 1 + safeImages.length) % safeImages.length)}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => setActiveIndex((value) => (value + 1) % safeImages.length)}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title={alt}>
        <div className="space-y-3">
          <div className="overflow-hidden rounded-md border border-border bg-white">
            <img src={activeImage} alt={alt} className="max-h-[70vh] w-full object-contain" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {safeImages.map((image, index) => (
              <button
                key={`${image}-zoom-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border ${
                  index === activeIndex ? 'border-ink' : 'border-border'
                }`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductGallery;
