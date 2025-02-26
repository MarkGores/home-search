"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/thumbs';
import Image from 'next/image';
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
          <div className="relative w-full h-64">
            <Image
              src={m.MediaURL}
              alt={`Media ${m.MediaObjectID}`}
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PhotoCarousel;