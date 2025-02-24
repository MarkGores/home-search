// frontend/components/PhotoCarousel.tsx
"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/thumbs';
import { Media } from '../types/Listing';

interface PhotoCarouselProps {
  media: Media[] | undefined;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ media }) => {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      {media.map((m) => (
        <SwiperSlide key={m.MediaKey}>
          <img src={m.MediaURL} alt={`Media ${m.MediaObjectID}`} className="object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PhotoCarousel;