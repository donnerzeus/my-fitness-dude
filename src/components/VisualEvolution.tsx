import React, { useState, useEffect } from 'react';
import { Camera, Trash2, Plus, Calendar, Image as ImageIcon } from 'lucide-react';

interface PhotoEntry {
    id: string;
    date: string;
    image: string; // Base64
}

const VisualEvolution: React.FC = () => {
    const [photos, setPhotos] = useState<PhotoEntry[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('spartan_photos');
        if (saved) setPhotos(JSON.parse(saved));
    }, []);

    const savePhotos = (newPhotos: PhotoEntry[]) => {
        setPhotos(newPhotos);
        try {
            localStorage.setItem('spartan_photos', JSON.stringify(newPhotos));
        } catch (e) {
            alert('Storage full! Please delete some photos.');
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newPhoto: PhotoEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                image: reader.result as string
            };
            savePhotos([newPhoto, ...photos]);
        };
        reader.readAsDataURL(file);
    };

    const deletePhoto = (id: string) => {
        if (confirm('Delete this progress photo?')) {
            savePhotos(photos.filter(p => p.id !== id));
        }
    };

    return (
        <div className="visual-evolution">
            <div className="section-title">
                <Camera className="gold" />
                <h2>Visual Evolution</h2>
                <label className="add-photo-btn">
                    <Plus size={18} />
                    <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
            </div>

            {photos.length === 0 ? (
                <div className="glass-card empty-state">
                    <ImageIcon size={48} className="gold opacity-20" />
                    <p>No photos yet. Start tracking your physical transformation.</p>
                </div>
            ) : (
                <div className="photo-grid">
                    {photos.map(photo => (
                        <div key={photo.id} className="photo-card glass-card">
                            <div className="img-container">
                                <img src={photo.image} alt="Progress" />
                                <button className="delete-btn" onClick={() => deletePhoto(photo.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="photo-meta">
                                <Calendar size={12} />
                                <span>{new Date(photo.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .visual-evolution { display: flex; flex-direction: column; gap: 1.25rem; }
                .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
                .add-photo-btn {
                    margin-left: auto; background: var(--primary-color); color: var(--bg-color);
                    width: 36px; height: 36px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; cursor: pointer;
                }
                .empty-state { text-align: center; padding: 4rem 2rem !important; opacity: 0.6; }
                .photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .photo-card { padding: 0.5rem !important; overflow: hidden; }
                .img-container { position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 0.5rem; overflow: hidden; background: #000; }
                .img-container img { width: 100%; height: 100%; object-fit: cover; }
                .delete-btn {
                    position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.5);
                    color: #ff4d4d; border: none; padding: 0.4rem; border-radius: 0.5rem; backdrop-filter: blur(4px);
                }
                .photo-meta { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem; color: var(--text-secondary); font-size: 0.7rem; font-weight: 700; }
            `}</style>
        </div>
    );
};

export default VisualEvolution;
