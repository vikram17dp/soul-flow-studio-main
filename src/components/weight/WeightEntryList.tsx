
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Edit2, Trash2, StickyNote } from 'lucide-react';
import { WeightEntry } from '@/types/weight';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { format } from 'date-fns';

interface WeightEntryListProps {
  entries: WeightEntry[];
}

const WeightEntryList = ({ entries }: WeightEntryListProps) => {
  const { updateWeightEntry, deleteWeightEntry } = useWeightTracking();
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [editForm, setEditForm] = useState({ weight: '', notes: '' });

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setEditForm({
      weight: entry.weight.toString(),
      notes: entry.notes || ''
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !editForm.weight) return;

    await updateWeightEntry(
      editingEntry.id,
      parseFloat(editForm.weight),
      editForm.notes || undefined
    );
    setEditingEntry(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this weight entry?')) {
      await deleteWeightEntry(id);
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Weight History
          </CardTitle>
          <CardDescription>Your weight entries will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No weight entries yet. Start logging your weight to track progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
          Weight History
        </CardTitle>
        <CardDescription>
          Your recent weight entries ({entries.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-900">{entry.weight} kg</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(entry.entry_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {entry.notes && (
                    <div className="flex items-start space-x-2 max-w-md">
                      <StickyNote className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">{entry.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog open={editingEntry?.id === entry.id} onOpenChange={(open) => !open && setEditingEntry(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Weight Entry</DialogTitle>
                      <DialogDescription>
                        Update your weight entry for {format(new Date(entry.entry_date), 'MMM dd, yyyy')}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label htmlFor="editWeight" className="block text-sm font-medium text-gray-700">
                          Weight (kg)
                        </label>
                        <Input
                          id="editWeight"
                          type="number"
                          step="0.1"
                          value={editForm.weight}
                          onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="editNotes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <Textarea
                          id="editNotes"
                          value={editForm.notes}
                          onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          Update Entry
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingEntry(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightEntryList;
