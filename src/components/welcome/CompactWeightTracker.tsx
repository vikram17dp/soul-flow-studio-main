
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scale, Target, TrendingDown, Plus } from 'lucide-react';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionRequiredModal } from '@/components/SubscriptionRequiredModal';
import { WeightEntry, WeightGoal } from '@/types/weight';

interface CompactWeightTrackerProps {
  weightGoal: WeightGoal | null;
  weightEntries: WeightEntry[];
}

const CompactWeightTracker = ({ weightGoal, weightEntries }: CompactWeightTrackerProps) => {
  const { profile } = useAuth();
  const { createWeightGoal, addWeightEntry } = useWeightTracking();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ startWeight: '', targetWeight: '' });
  const [entryForm, setEntryForm] = useState({ weight: '', notes: '' });

  // Check if user has active membership
  const hasActiveMembership = profile?.membership_type && profile.membership_type !== 'basic';

  const handleSetGoalClick = () => {
    if (!hasActiveMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    
    // Set default values if updating existing goal
    if (weightGoal) {
      setGoalForm({
        startWeight: weightGoal.start_weight.toString(),
        targetWeight: weightGoal.target_weight?.toString() || ''
      });
    } else {
      setGoalForm({ startWeight: '', targetWeight: '' });
    }
    setIsGoalDialogOpen(true);
  };

  const handleLogWeightClick = () => {
    if (!hasActiveMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsEntryDialogOpen(true);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.startWeight) return;

    await createWeightGoal(
      parseFloat(goalForm.startWeight),
      goalForm.targetWeight ? parseFloat(goalForm.targetWeight) : undefined
    );
    setIsGoalDialogOpen(false);
    setGoalForm({ startWeight: '', targetWeight: '' });
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.weight) return;

    await addWeightEntry(
      parseFloat(entryForm.weight),
      entryForm.notes || undefined
    );
    setIsEntryDialogOpen(false);
    setEntryForm({ weight: '', notes: '' });
  };

  const currentWeight = weightEntries[0]?.weight;
  const weightLost = weightGoal && currentWeight ? weightGoal.start_weight - currentWeight : 0;

  if (!weightGoal) {
    return (
      <>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-lg">
              <Scale className="h-5 w-5 mr-2 text-purple-600" />
              Weight Progress
            </CardTitle>
            <CardDescription>
              Track your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Set your weight goal to start tracking</p>
            </div>
            <Button 
              onClick={handleSetGoalClick}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Set Goal
            </Button>
          </CardContent>
        </Card>

        <SubscriptionRequiredModal 
          isOpen={showSubscriptionModal} 
          onClose={() => setShowSubscriptionModal(false)} 
        />

        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Your Weight Goal</DialogTitle>
              <DialogDescription>
                Enter your starting weight and optional target weight to begin tracking
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <Label htmlFor="startWeight">Starting Weight (kg) *</Label>
                <Input
                  id="startWeight"
                  type="number"
                  step="0.1"
                  value={goalForm.startWeight}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, startWeight: e.target.value }))}
                  placeholder="e.g., 75.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={goalForm.targetWeight}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetWeight: e.target.value }))}
                  placeholder="e.g., 65.0 (optional)"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Scale className="h-5 w-5 mr-2 text-purple-600" />
            Weight Progress
          </CardTitle>
          <CardDescription>
            Track your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-lg font-semibold text-blue-600">
                {currentWeight ? `${currentWeight} kg` : 'No data'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lost</p>
              <p className="text-lg font-semibold text-green-600">
                {weightLost > 0 ? `${weightLost.toFixed(1)} kg` : '0 kg'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Target</p>
              <p className="text-lg font-semibold text-purple-600">
                {weightGoal.target_weight ? `${weightGoal.target_weight} kg` : 'Not set'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleLogWeightClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              Update Weight
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleSetGoalClick}
            >
              <Target className="h-4 w-4 mr-2" />
              Update Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Required Modal */}
      <SubscriptionRequiredModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />

      {/* Weight Entry Dialog */}
      <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Weight Entry</DialogTitle>
            <DialogDescription>
              Record your current weight. You'll earn 5 points for each entry!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={entryForm.weight}
                onChange={(e) => setEntryForm(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 74.2"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={entryForm.notes}
                onChange={(e) => setEntryForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How are you feeling? Any thoughts on your progress?"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Log Weight Entry
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Goal Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{weightGoal ? 'Update Weight Goal' : 'Set Weight Goal'}</DialogTitle>
            <DialogDescription>
              {weightGoal ? 'Modify your starting weight or target weight' : 'Enter your starting weight and optional target weight'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <Label htmlFor="startWeight">Starting Weight (kg) *</Label>
              <Input
                id="startWeight"
                type="number"
                step="0.1"
                value={goalForm.startWeight}
                onChange={(e) => setGoalForm(prev => ({ ...prev, startWeight: e.target.value }))}
                placeholder="e.g., 75.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                value={goalForm.targetWeight}
                onChange={(e) => setGoalForm(prev => ({ ...prev, targetWeight: e.target.value }))}
                placeholder="e.g., 65.0 (optional)"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              {weightGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompactWeightTracker;
