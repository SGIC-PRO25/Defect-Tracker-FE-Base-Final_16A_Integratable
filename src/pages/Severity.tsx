import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { ChevronLeft, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/ui/Toast';
import { HexColorPicker } from 'react-colorful';
import { createSeverity, deleteSeverity, getSeverities,updateSeverity}from '../api/severity'
import { usePermission } from '../context/PermissionContext';
import { isAxiosError } from 'axios';
import { OrbitProgress } from 'react-loading-indicators';

const normalizeColor = (color: string): string => {
  if (!color) return "#000000";

  const cleanColor = color.replace(/[^0-9A-Fa-f]/g, "");

 switch (cleanColor.length) {
    case 1:
      return `#${cleanColor.repeat(6)}`;

    case 2:
      return `#${cleanColor}${cleanColor}${cleanColor}`;

    case 3:
      return `#${cleanColor[0]}${cleanColor[0]}${cleanColor[1]}${cleanColor[1]}${cleanColor[2]}${cleanColor[2]}`;

    case 4:
      return `#${cleanColor}${cleanColor[0]}${cleanColor[1]}`;

    case 5:
      return `#${cleanColor}${cleanColor[0]}`;

    default:
      return `#${cleanColor.substring(0, 6)}`;
  }
};



interface SeverityType {
  id: number;
  name: string;
  color: string;
  weight: number;
}

const Severity: React.FC = () => {
  const navigate = useNavigate();
  const [severities, setSeverities] = useState<SeverityType[]>([]);
//  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [totalPages,setTotalPages]=useState(0);

  const {can} = usePermission();

  
 // const totalPages = Math.ceil(severities.length / pageSize);
 // const paginatedSeverities = severities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSeverity, setEditingSeverity] = useState<SeverityType | null>(null);
  const [deletingSeverity, setDeletingSeverity] = useState<SeverityType | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#000000', weight: 1 });

  const [showColorPickerCreate, setShowColorPickerCreate] = useState(false);
  const [showColorPickerEdit, setShowColorPickerEdit] = useState(false);

  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' }>({ isOpen: false, message: '', type: 'success' });
  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ isOpen: true, message, type });
    const validateName = (name: string) => {
    // Only alphabets and spaces, at least one letter
    return /^[A-Za-z ]+$/.test(name.trim());
  };

  const [colorError, setColorError] = useState('');

  const fetchSeverity = async (page:number,pageSize:number)=>{
    try{
      setLoading(true)
      const res=await getSeverities(page,pageSize);
      setTotalPages(res.data.totalPages);
      setSeverities(res.data.content);
    }catch(error){
      setLoading(false)
      showToast('Failed to fetch Severity : ' + error, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSeverity(currentPage-1,pageSize);
    setToast({isOpen:false,message:'',type:'success'})
  },[currentPage]);




  useEffect(() => {
    if (isCreateModalOpen) {
      const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(formData.color);
    if (!isValidHex) {
      setColorError('');
      return;
    }
      const isDuplicate = severities.some(s => s.color.toLowerCase() === formData.color.toLowerCase());
      setColorError(isDuplicate ? 'This color is already in use. Please choose a different color.' : '');
    } else {
      setColorError('');
    }
  }, [formData.color, severities, isCreateModalOpen]);

  const resetForm = () => setFormData({ name: '', color: '#000000', weight: 1 });

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value.replace(/[^0-9A-Fa-f]/gi, '');
    value = '#' + value.slice(1).replace(/[^0-9A-Fa-f]/gi, '');
    value = value.slice(0, 7);
    setFormData({ ...formData, color: value });
  };

  // const handleCreate = () => {
  //   const exists = severities.some(s => s.name.trim().toLowerCase() === formData.name.trim().toLowerCase());
  //   if (exists) { 
  //     setIsCreateModalOpen(false);
  //      resetForm(); 
  //      showToast('Severity Name already exists.', 'error'); return; 
  //   }
    
  //   setSeverities(prev => [...prev, { id: nextId, name: formData.name.trim(),
  //  color: formData.color, 
  // weight: formData.weight }]);
  //   setNextId(prev => prev + 1);
  //   setIsCreateModalOpen(false); 
  // resetForm(); 
  // showToast('Severity created successfully!', 'success');
  // };
  
  const handleCreate = async () => {
    // Duplicate name check (case-insensitive, trimmed)
    const exists = severities.some(s => s.name.trim().toLowerCase() === formData.name.trim().toLowerCase());
    if (exists) { 
      setIsCreateModalOpen(false);
       resetForm(); 
       showToast('Severity Name already exists.', 'error'); return; 
    }
    
    // Duplicate color check
    if (colorError) {
      // Close modal and show validation error on main page
      setIsCreateModalOpen(false);
      resetForm();
      showToast('This color is already in use. Please choose a different color.', 'error');
      return;
    }
    
    // Validate name before creating
    if (formData.name && !validateName(formData.name)) {
      // Close modal and show validation error on main page
      setIsCreateModalOpen(false);
      resetForm();
      showToast('Severity name can only contain alphabets and spaces.', 'error');
      return;
    }
    
    try {
       const normalizedColor = normalizeColor(formData.color);
      const res = await createSeverity({
        name: formData.name,
        color: normalizedColor,
        weight:formData.weight,
      });
      const refreshed = await getSeverities(currentPage-1,pageSize);
      const mapped = refreshed.data.content.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color.startsWith('#') ? item.color : `#${item.color}`,
         weight: item.weight,
      }));
      setSeverities(mapped);
      setTotalPages(refreshed.data.totalPages);
      setIsCreateModalOpen(false);
      resetForm();
      showToast('Severity created successfully!');
    } catch (err: any) {
      // Close modal and show validation error on main page for all errors
      setIsCreateModalOpen(false);
      resetForm();
      
      // Extract meaningful error message from the error object
      let errorMessage = 'Failed to create Severity';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid Severity name. Please check your input.';
      }
      
      showToast(errorMessage, 'error');
    }
  };

  const handleEdit = async () => {

  if (!editingSeverity) return;

  // No changes check
  if (
    formData.name.trim() === editingSeverity.name.trim() &&
    formData.color.toLowerCase() === editingSeverity.color.toLowerCase() &&
    formData.weight === editingSeverity.weight
  ) {
    showToast(
      'No changes were made to the severity',
      'error'
    );
    return;
  }

  // Duplicate name check
  const exists = severities.some(
    s =>
      s.name.trim().toLowerCase() ===
        formData.name.trim().toLowerCase() &&
      s.id !== editingSeverity.id
  );

  if (exists) {
    showToast(
      'Severity Name already exists.',
      'error'
    );
    return;
  }

  // // Valid hex check
  // const isValidHex =
  //   /^#[0-9A-Fa-f]{6}$/.test(formData.color);

  // if (!isValidHex) {
  //   showToast(
  //     'Please enter a valid color code.',
  //     'error'
  //   );
  //   return;
  // }

  // Duplicate color check
  const isDuplicateColor = severities.some(
    s =>
      s.color.toLowerCase() ===
        formData.color.toLowerCase() &&
      s.id !== editingSeverity.id
  );

  if (isDuplicateColor) {
    showToast(
      'This color is already in use. Please choose a different color.',
      'error'
    );
    return;
  }

  // Name validation
  if (
    formData.name &&
    !validateName(formData.name)
  ) {
    showToast(
      'Severity name can only contain alphabets and spaces.',
      'error'
    );
    return;
  }

  try {
    const normalizedColor = normalizeColor(formData.color);
    await updateSeverity(
      editingSeverity.id,
      {
        name: formData.name.trim(),
        color: normalizedColor,
        weight: formData.weight,
      }
    );

    // Refresh data
    const refreshed = await getSeverities(currentPage-1,pageSize);

    const mapped = refreshed.data.content.map(
      (item) => ({
        id: item.id,
        name: item.name,
        color: item.color.startsWith('#')
          ? item.color
          : `#${item.color}`,
        weight: item.weight,
      })
    );

    setSeverities(mapped);

    setIsEditModalOpen(false);
    setEditingSeverity(null);

    resetForm();

    showToast(
      'Severity updated successfully!',
      'success'
    );

  } catch (err: any) {

    let errorMessage =
      'Failed to update Severity';

    if (err.response?.data?.message) {
      errorMessage =
        err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    showToast(errorMessage, 'error');
  }
};


  const handleDelete = async () => {
  if (!deletingSeverity) return;

  try {
    await deleteSeverity(deletingSeverity.id);

    showToast("Severity deleted successfully!", "success");
    setIsDeleteModalOpen(false);
    setDeletingSeverity(null);

    if (severities.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      await fetchSeverity(currentPage - 1, pageSize);
    }
  } catch (e: any) {
    const errorMessage = isAxiosError(e)
      ? e.response?.data?.message || e.message
      : "Unable to delete.";

    showToast(errorMessage, "error");

    setIsDeleteModalOpen(false);
    setDeletingSeverity(null);
  }
};

  const openEditModal = (severity: SeverityType) => {
    setEditingSeverity(severity);
    setFormData({ name: severity.name, color: severity.color, weight: severity.weight });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (severity: SeverityType) => { setDeletingSeverity(severity); setIsDeleteModalOpen(true); };



  return (
    <div className="max-w-6xl mx-auto p-8">
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
      <div className="mb-6 flex justify-end">
        <Button variant="secondary" onClick={() => navigate('/configurations')} className="flex items-center">
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Severity Management</h1>
        </div>
        {can.severity.create && <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Create Severity
        </Button>}
      </div>
      <Card>
        <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Severity Levels</h2>
        </div>
        <CardContent>
          {loading ? <div className="flex justify-center items-center py-20 min-h-[200px]">
            <OrbitProgress
                variant="dotted"
                color="#3B82F6"
                size="medium"
                text="Loading ..."
                textColor="#6b7280"
            />
          </div> :
              <Table>
                <thead className="bg-gray-50">
                <TableRow>
                  <TableCell header>Name</TableCell>
                  <TableCell header>Color</TableCell>
                  <TableCell header>Weight</TableCell>
                  {(can.severity.edit || can.severity.delete) && <TableCell header>Actions</TableCell>}
                </TableRow>
                </thead>
                <TableBody>
                  {severities.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-gray-500 py-4">No severities found.</td></tr>
                  ) : (
                      severities.map((severity) => (
                          <TableRow key={severity.id}>
                            <TableCell className="font-medium">{severity.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: severity.color }} />
                                <span className="text-sm text-gray-600">{severity.color}</span>
                              </div>
                            </TableCell>
                            <TableCell>{severity.weight}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {can.severity.edit && <Button variant="ghost" size="sm" onClick={() => openEditModal(severity)}><Edit2 className="w-4 h-4" /></Button>}
                                {can.severity.delete && <Button variant="ghost" size="sm" onClick={() => openDeleteModal(severity)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>}
                              </div>
                            </TableCell>
                          </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (<button key={i + 1} className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>))}
          <button className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); resetForm(); setShowColorPickerCreate(false); }} title="Create New Severity">
        <div className="space-y-4 items-start flex flex-col">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Severity Name</label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter severity name" /></div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-3 w-full">
                <Input value={formData.color} onChange={handleColorInput} placeholder="#000000" className={`flex-1 ${colorError ? 'border-red-500' : ''}`} maxLength={7} />
                <div className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer" style={{ backgroundColor: formData.color }} onClick={() => setShowColorPickerCreate(v => !v)} aria-label="Pick color" />
              </div>
              {colorError && <div className="text-red-600 text-sm w-full mt-1">{colorError}</div>}
              {showColorPickerCreate && (<div className="z-50 mt-2"><HexColorPicker color={formData.color} onChange={color => setFormData({ ...formData, color })} /></div>)}
            </div>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <Input type="number" value={formData.weight} min={1} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })} placeholder="Enter severity weight" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 w-full">
            <Button variant="secondary" onClick={() => { setIsCreateModalOpen(false); resetForm(); setShowColorPickerCreate(false); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!formData.name || !!colorError}>Create</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingSeverity(null); resetForm(); setShowColorPickerEdit(false); }} title="Edit Severity">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Severity Name</label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter severity name" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-3 w-full">
                <Input value={formData.color} onChange={handleColorInput} placeholder="#000000" className="flex-1" maxLength={7} />
                <div className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer" style={{ backgroundColor: formData.color }} onClick={() => setShowColorPickerEdit(v => !v)} aria-label="Pick color" />
              </div>
              {showColorPickerEdit && (<div className="z-50 mt-2"><HexColorPicker color={formData.color} onChange={color => setFormData({ ...formData, color })} /></div>)}
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Weight</label><Input type="number" value={formData.weight} min={1} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })} placeholder="Enter severity weight" /></div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => { setIsEditModalOpen(false); setEditingSeverity(null); resetForm(); setShowColorPickerEdit(false); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!formData.name}>Update</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setDeletingSeverity(null); }} title="Delete Severity">
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete the severity "{deletingSeverity?.name}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setDeletingSeverity(null); }}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Severity;
