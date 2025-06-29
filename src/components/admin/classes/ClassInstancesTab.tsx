
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import ClassInstanceManager from '../ClassInstanceManager';
import { YogaClass } from '../forms/ClassFormTypes';

interface ClassInstancesTabProps {
  selectedClass: YogaClass | null;
  availableClasses: YogaClass[];
  onClassSelect: (classId: string) => void;
}

export const ClassInstancesTab = ({ selectedClass, availableClasses, onClassSelect }: ClassInstancesTabProps) => {
  // Filter classes that have recurrence (recurring classes only)
  const recurringClasses = availableClasses.filter(cls => 
    cls.recurrence_type && cls.recurrence_days && cls.recurrence_days.length > 0
  );

  if (recurringClasses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recurring Classes Found</h3>
          <p className="text-gray-500">
            Create some recurring classes first to manage their instances here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select a Recurring Class</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedClass?.id || ""} 
            onValueChange={onClassSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a recurring class to manage instances..." />
            </SelectTrigger>
            <SelectContent>
              {recurringClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{cls.title}</span>
                    <span className="text-sm text-gray-500">
                      {cls.instructor_name} • {cls.recurrence_days?.join(', ')}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClass && (
        <ClassInstanceManager 
          classId={selectedClass.id} 
          className={selectedClass.title}
        />
      )}
    </div>
  );
};
