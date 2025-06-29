
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CreateRecurringClassForm from '../CreateRecurringClassForm';

interface ClassesHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onClassCreated: () => void;
}

export const ClassesHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  isCreateDialogOpen, 
  setIsCreateDialogOpen,
  onClassCreated 
}: ClassesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
        <p className="text-gray-600">Manage yoga classes and schedules</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateRecurringClassForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                onClassCreated();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
