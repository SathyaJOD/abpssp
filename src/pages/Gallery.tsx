import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Image as ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(
          collection(db, 'gallery'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const galleryData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((selectedImageIndex + 1) % items.length);
    } else {
      setSelectedImageIndex((selectedImageIndex - 1 + items.length) % items.length);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <ImageIcon className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900">Photo Gallery</h2>
          <p className="mt-4 text-lg text-slate-600">
            A visual journey of our events, activities, and community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  {item.date && (
                    <p className="text-emerald-300 text-sm font-medium">
                      {new Date(item.date.toDate()).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg">No photos uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>

          {items.length > 1 && (
            <button 
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-all"
              onClick={(e) => navigateLightbox('prev', e)}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={items[selectedImageIndex].imageUrl} 
              alt={items[selectedImageIndex].title} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-6 text-center">
              <h3 className="text-white font-bold text-xl">{items[selectedImageIndex].title}</h3>
              {items[selectedImageIndex].date && (
                <p className="text-emerald-400 mt-1">
                  {new Date(items[selectedImageIndex].date.toDate()).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {items.length > 1 && (
            <button 
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-all"
              onClick={(e) => navigateLightbox('next', e)}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
