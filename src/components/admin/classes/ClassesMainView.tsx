
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassesHeader } from './ClassesHeader';
import { ClassesTable } from './ClassesTable';
import { YogaClass } from '../forms/ClassFormTypes';

interface ClassesMainViewProps {
  filteredClasses: YogaClass[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onClassCreated: () => void;
  onEditClick: (yogaClass: YogaClass) => void;
  onSelectClass: (yogaClass: YogaClass) => void;
  onGenerateInstances: (classId: string) => void;
  onToggleStatus: (classId: string, currentStatus: boolean | null) => void;
  onDeleteClass: (classId: string, title: string) => void;
}

export const ClassesMainView = ({
  filteredClasses,
  searchTerm,
  setSearchTerm,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onClassCreated,
  onEditClick,
  onSelectClass,
  onGenerateInstances,
  onToggleStatus,
  onDeleteClass
}: ClassesMainViewProps) => {
  return (
    <>
      <ClassesHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        onClassCreated={onClassCreated}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Classes ({filteredClasses.length})</CardTitle>
          <CardDescription>Complete list of yoga classes</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassesTable
            classes={filteredClasses}
            onEditClick={onEditClick}
            onSelectClass={onSelectClass}
            onGenerateInstances={onGenerateInstances}
            onToggleStatus={onToggleStatus}
            onDeleteClass={onDeleteClass}
          />
        </CardContent>
      </Card>
    </>
  );
};
