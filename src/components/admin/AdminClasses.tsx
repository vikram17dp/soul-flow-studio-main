
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YogaClass } from './forms/ClassFormTypes';
import { ClassInstancesTab } from './classes/ClassInstancesTab';
import { useClassManagement } from './classes/useClassManagement';
import { ClassEditManager } from './classes/ClassEditManager';
import { ClassesMainView } from './classes/ClassesMainView';
import { ClassesLoadingState } from './classes/ClassesLoadingState';

const AdminClasses = () => {
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [activeTab, setActiveTab] = useState('classes');

  const {
    filteredClasses,
    searchTerm,
    setSearchTerm,
    isLoading,
    fetchClasses,
    toggleClassStatus,
    deleteClass,
    generateInstances
  } = useClassManagement();

  const handleEditClick = (yogaClass: YogaClass) => {
    setEditingClass(yogaClass);
  };

  const handleEditSuccess = () => {
    setEditingClass(null);
    fetchClasses();
  };

  const handleClassSelect = (yogaClass: YogaClass) => {
    setSelectedClass(yogaClass);
    setActiveTab('instances');
  };

  const handleInstancesClassSelect = (classId: string) => {
    const foundClass = filteredClasses.find(cls => cls.id === classId);
    if (foundClass) {
      setSelectedClass(foundClass);
    }
  };

  if (editingClass) {
    return (
      <ClassEditManager 
        editingClass={editingClass}
        onSuccess={handleEditSuccess}
      />
    );
  }

  if (isLoading) {
    return <ClassesLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="classes">All Classes</TabsTrigger>
          <TabsTrigger value="instances">
            Class Instances {selectedClass && `(${selectedClass.title})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <ClassesMainView
            filteredClasses={filteredClasses}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            onClassCreated={fetchClasses}
            onEditClick={handleEditClick}
            onSelectClass={handleClassSelect}
            onGenerateInstances={generateInstances}
            onToggleStatus={toggleClassStatus}
            onDeleteClass={deleteClass}
          />
        </TabsContent>

        <TabsContent value="instances">
          <ClassInstancesTab 
            selectedClass={selectedClass}
            availableClasses={filteredClasses}
            onClassSelect={handleInstancesClassSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminClasses;
