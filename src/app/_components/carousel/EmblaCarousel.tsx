import React, { useState, useEffect, useCallback } from 'react'
import styles from './carousel.module.css'

import useEmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType
} from 'embla-carousel-react'
import {
  DotButton,
  PrevButton,
  NextButton
} from './EmblaCarouselArrowsDotsButtons'

type PropType = {
  photos: { photoUrl: string }[];
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { photos, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  const emblaDot = 'embla__dot--selected' 

  return (
    <>
      <div className={styles.embla}>
  <div className={styles.embla__viewport} ref={emblaRef}>
    <div className={styles.embla__container}>
      {photos.map((photo, index) => (
              <div className={styles.embla__slide} key={index}>
                <div className={styles.embla__slide__number}>
                  <span>{index + 1}</span>
                </div>
                <img
                  className={`${styles.embla__slide__img} `}
                  src={photo.photoUrl}
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
    </div>
  </div>

  {photos.length > 1 && (
    <div className={styles.embla__buttons} style={{ pointerEvents: 'none' }}>
      <div className="flex flex-row justify-between">
        <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
        <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
      </div>
    </div>
  )}
{/* TODO: carousel page indicator */}
  {/* <div className={styles.embla__dots}>
    {scrollSnaps.map((_, index) => (
      <DotButton
        key={index}
        onClick={() => scrollTo(index)}
        className={`${styles.embla__dot}${index === selectedIndex ? ` ${styles.emblaDot}` : ''}`}
      />
    ))}
  </div> */}
</div>



    </>
  )
}

export default EmblaCarousel
