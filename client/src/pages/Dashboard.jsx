import { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import WebBucketList from '../components/WebBucket/WebBucketList';
import WebBucketModal from '../components/WebBucket/WebBucketModal';
import api from '../api/axios';
import '../styles/web.css';

export default function Dashboard() {
  const [buckets, setBuckets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  const load = async ()=> {
    const res = await api.get('/buckets');
    setBuckets(res.data);
  };
  useEffect(()=>{ load(); }, []);

  const onSave = async (payload) => {
    if (toEdit) {
      await api.put(`/buckets/${toEdit.id}`, payload);
    } else {
      await api.post(`/buckets`, payload);
    }
    setModalOpen(false); setToEdit(null);
    await load();
  };

  const onEdit = (item) => { setToEdit(item); setModalOpen(true); };
  const onDelete = async (item) => {
    if (!confirm("Are you sure you want to delete this website?")) return;
    await api.delete(`/buckets/${item.id}`);
    await load();
  };

  return (
    <div>
      <Header onOpenBucket={()=>{ setToEdit(null); setModalOpen(true); }} />
      <h2 className='header-h2'>Available Store</h2>
      <WebBucketList items={buckets} onEdit={onEdit} onDelete={onDelete} />
      <WebBucketModal open={modalOpen} onClose={()=>setModalOpen(false)} initial={toEdit} onSave={onSave} />
    </div>
  )
}
