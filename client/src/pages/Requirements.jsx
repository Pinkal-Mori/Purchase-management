import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RequirementList from '../components/Requirements/RequirementList';
import Header from '../components/Layout/Header';
import '../styles/form.css';

export default function Requirements() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const save = async (payload) => {
    // handled inside table file in this trimmed page version
  };

  return (
    <div>
      <Header onOpenBucket={()=>{}}/>
      <RequirementList user={user} />
    </div>
  )
}
