import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function WebBucketModal({ open, onClose, initial }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setLink(initial.link);
      setImage(initial.image);
    } else {
      setTitle("");
      setLink("");
      setImage("");
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initial) {
        // This is for editing an existing website
        await api.put(`/buckets/${initial._id}`, { title, link, image });
      } else {
        // This is for adding a new website
        await api.post('/buckets', { title, link, image });
      }
      
      // Call onClose to close the modal. The parent component will handle refreshing the list.
      onClose(); 
    } catch (err) {
      console.error("Failed to save website:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal1" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <div className="settings-section">
          <h3>{initial ? "Edit Website" : "Add New Web Store"}</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Website Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="url" placeholder="Website Link" value={link} onChange={e => setLink(e.target.value)} required />
            <input type="url" placeholder="Image URL (optional)" value={image} onChange={e => setImage(e.target.value)} />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (initial ? "Save Changes" : "Add Store")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}