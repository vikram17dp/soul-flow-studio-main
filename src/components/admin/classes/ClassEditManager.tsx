
import { useState } from 'react';
import EditClassForm from '../EditClassForm';
import { YogaClass } from '../forms/ClassFormTypes';

interface ClassEditManagerProps {
  onSuccess: () => void;
  editingClass: YogaClass;
}

export const ClassEditManager = ({ onSuccess, editingClass }: ClassEditManagerProps) => {
  const [isEditing, setIsEditing] = useState(true);

  const handleEditSuccess = () => {
    setIsEditing(false);
    onSuccess();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    onSuccess();
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Class</h2>
          <p className="text-gray-600">Update class details and schedule</p>
        </div>
      </div>
      <EditClassForm 
        yogaClass={editingClass}
        onSuccess={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    </div>
  );
};
