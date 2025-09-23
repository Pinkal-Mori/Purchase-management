import { useState } from 'react';
import Header from '../components/Layout/Header';
import WebBucketList from '../components/WebBucket/WebBucketList';
import WebBucketModal from '../components/WebBucket/WebBucketModal';
import '../styles/web.css';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  // Add a new state variable to trigger a refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

useEffect(() => {
  const justSignedUp = localStorage.getItem("justSignedUp");
  if (justSignedUp === "true") {
    toast.success("🎉 Welcome! Your account has been created.On this page, you can add new web site and share your requirements. even, you can view the  requirements of other.");
    localStorage.removeItem("justSignedUp");
  }
}, []);


  const handleOpenAddModal = () => {
    setToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setToEdit(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setToEdit(null);
    // When the modal closes after a successful save, update the trigger
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    <div>
      <Header onOpenBucket={handleOpenAddModal} />
      <h2 className='header-h2'>Available Store</h2>
      
      {/* Pass the refreshTrigger to WebBucketList */}
      <WebBucketList onEdit={handleOpenEditModal} refreshTrigger={refreshTrigger} />
      
      <WebBucketModal
        open={modalOpen}
        onClose={handleCloseModal}
        initial={toEdit}
      />
    </div>
  );
}