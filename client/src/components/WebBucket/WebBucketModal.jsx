import { useState, useEffect } from 'react';

export default function WebBucketModal({ open, onClose, initial, onSave }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");

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

  return (
    <div className="modal1" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <div className="settings-section">
          <h3>{initial ? "Edit Website" : "Add New Web Store"}</h3>
          <form onSubmit={(e) => { e.preventDefault(); onSave({ title, link, image }); }}>
            <input type="text" placeholder="Website Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="url" placeholder="Website Link" value={link} onChange={e => setLink(e.target.value)} required />
            <input type="url" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
            <button type="submit">{initial ? "Save Changes" : "Add Store"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}