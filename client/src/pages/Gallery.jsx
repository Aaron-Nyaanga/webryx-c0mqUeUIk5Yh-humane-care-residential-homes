import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, staggerFast, cardItem, vp } from '../utils/motionVariants'

const photos = [
  { src: '/images/widefronthouse.jpg', caption: 'Our Home — Exterior View' },
  { src: '/images/frontHouseClose.jpg', caption: 'Front of the House' },
  { src: '/images/livingroom.jpg', caption: 'Living Room' },
  { src: '/images/diningroom.jpg', caption: 'Dining Room' },
  { src: '/images/diningroom2.jpg', caption: 'Dining Area' },
  { src: '/images/kitchen.jpg', caption: 'Kitchen' },
  { src: '/images/kitchen2.jpg', caption: 'Kitchen & Prep Area' },
  { src: '/images/bedroom1.jpg', caption: 'Private Bedroom' },
  { src: '/images/bathroom.jpg', caption: 'Accessible Bathroom' },
  { src: '/images/balcony.jpg', caption: 'Balcony' },
  { src: '/images/backyard.jpg', caption: 'Backyard' },
  { src: '/images/elderlyPhoto.jpg', caption: 'Caring Environment' },
]

export default function Gallery() {
  usePageTitle('Facility Gallery')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : photos.length - 1)), [])
  const next = useCallback(() => setLightboxIndex((i) => (i < photos.length - 1 ? i + 1 : 0)), [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, prev, next])

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="py-36 flex items-center justify-center text-white text-center px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 mb-4"
          >
            Photo Gallery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Facility
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-lg text-white/80"
          >
            Take a look inside Humane Care Residential Homes — a comfortable, welcoming place to call home.
          </motion.p>
        </div>
      </section>

      {/* ── Photo Grid ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>
              Inside Our Home
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">A Glimpse Inside</h2>
            <p className="text-gray-500 text-sm mt-2">Click any photo to view it full screen</p>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {photos.map((photo, i) => (
              <motion.button
                key={photo.src}
                variants={cardItem}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-4 focus:ring-green-400/50"
                aria-label={`View photo: ${photo.caption}`}
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0"
                />
                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-3 left-0 right-0 text-white text-sm font-semibold text-center px-3"
                >
                  {photo.caption}
                </motion.p>
                {/* Expand icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-20 px-6 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="relative max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to See It in Person?</h2>
          <p className="text-white/85 text-lg mb-9">Schedule a tour and meet our team.</p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-block px-10 py-3.5 rounded-lg font-semibold bg-white text-gray-800 hover:bg-gray-50"
            >
              Schedule a Tour
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo: ${photos[lightboxIndex]?.caption}`}
          >
            <div
              className="relative max-w-5xl w-full mx-4 flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Caption */}
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-sm font-medium tracking-wide"
              >
                {photos[lightboxIndex]?.caption}
              </motion.p>

              {/* Image — key on index so AnimatePresence re-animates on photo change */}
              <div className="relative w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIndex}
                    src={photos[lightboxIndex]?.src}
                    alt={photos[lightboxIndex]?.caption}
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                  />
                </AnimatePresence>

                {/* Prev */}
                <motion.button
                  whileHover={{ scale: 1.12, x: -2 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white focus:outline-none"
                  aria-label="Previous photo"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                {/* Next */}
                <motion.button
                  whileHover={{ scale: 1.12, x: 2 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white focus:outline-none"
                  aria-label="Next photo"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-xs">{lightboxIndex + 1} / {photos.length}</span>
                <div className="flex gap-1.5">
                  {photos.map((_, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      animate={idx === lightboxIndex
                        ? { width: 20, backgroundColor: '#4E8C52' }
                        : { width: 8, backgroundColor: 'rgba(255,255,255,0.3)' }
                      }
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                      className="h-2 rounded-full"
                      aria-label={`Go to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={closeLightbox}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white focus:outline-none"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
