
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, Clock, Repeat } from 'lucide-react';
import { YogaClass } from '../forms/ClassFormTypes';

interface ClassesTableProps {
  classes: YogaClass[];
  onEditClick: (yogaClass: YogaClass) => void;
  onSelectClass: (yogaClass: YogaClass) => void;
  onGenerateInstances: (classId: string) => void;
  onToggleStatus: (classId: string, currentStatus: boolean | null) => void;
  onDeleteClass: (classId: string, title: string) => void;
}

export const ClassesTable = ({ 
  classes, 
  onEditClick, 
  onSelectClass, 
  onGenerateInstances, 
  onToggleStatus, 
  onDeleteClass 
}: ClassesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Instructor</TableHead>
          <TableHead>Type & Level</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Recurrence</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((yogaClass) => (
          <TableRow key={yogaClass.id}>
            <TableCell>
              <div>
                <div className="font-medium text-gray-900">{yogaClass.title}</div>
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {yogaClass.description || 'No description'}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-900">{yogaClass.instructor_name}</span>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Badge variant="outline">{yogaClass.class_type}</Badge>
                <Badge variant="secondary">{yogaClass.class_level}</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {yogaClass.recurrence_days && yogaClass.recurrence_days.length > 0 ? (
                  <div>
                    <div className="font-medium">
                      {yogaClass.recurrence_days.map(day => 
                        day.charAt(0).toUpperCase() + day.slice(1)
                      ).join(', ')}
                    </div>
                    <div className="text-gray-500">
                      {yogaClass.schedule_time ? new Date(`1970-01-01T${yogaClass.schedule_time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'No time set'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">
                      {yogaClass.schedule_day?.charAt(0).toUpperCase() + yogaClass.schedule_day?.slice(1) || 'N/A'}
                    </div>
                    <div className="text-gray-500">
                      {yogaClass.schedule_time ? new Date(`1970-01-01T${yogaClass.schedule_time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'No time set'}
                    </div>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {yogaClass.recurrence_type ? (
                <div className="flex items-center space-x-1">
                  <Repeat className="h-4 w-4 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800">
                    {yogaClass.recurrence_type === 'never_ending' ? 'Never Ending' : 'Weekly'}
                  </Badge>
                </div>
              ) : (
                <span className="text-gray-500">One-time</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{yogaClass.duration} min</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">
                ₹{yogaClass.price?.toFixed(2) || '0.00'}
              </span>
            </TableCell>
            <TableCell>
              <Badge className={yogaClass.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {yogaClass.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditClick(yogaClass)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {yogaClass.recurrence_type && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectClass(yogaClass)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
                {yogaClass.recurrence_type && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGenerateInstances(yogaClass.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    Generate
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(yogaClass.id, yogaClass.is_active)}
                  className={yogaClass.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                >
                  {yogaClass.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteClass(yogaClass.id, yogaClass.title)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
