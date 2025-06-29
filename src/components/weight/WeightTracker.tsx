
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Scale, Target, TrendingDown, Plus, Trophy } from 'lucide-react';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionRequiredModal } from '@/components/SubscriptionRequiredModal';
import WeightChart from './WeightChart';
import WeightEntryList from './WeightEntryList';
import AchievementsBadges from './AchievementsBadges';

const WeightTracker = () => {
  const { profile } = useAuth();
  const { weightEntries, weightGoal, achievements, isLoading, createWeightGoal, addWeightEntry } = useWeightTracking();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ startWeight: '', targetWeight: '' });
  const [entryForm, setEntryForm] = useState({ weight: '', notes: '' });

  // Check if user has active membership
  const hasActiveMembership = profile?.membership_type && profile.membership_type !== 'basic';

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

  const handleLogWeightClick = () => {
    if (!hasActiveMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsEntryDialogOpen(true);
  };

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
    }
    setIsGoalDialogOpen(true);
  };

  const currentWeight = weightEntries[0]?.weight;
  const weightLost = weightGoal && currentWeight ? weightGoal.start_weight - currentWeight : 0;
  const progressPercentage = weightGoal && weightGoal.target_weight && currentWeight 
    ? Math.min(((weightGoal.start_weight - currentWeight) / (weightGoal.start_weight - weightGoal.target_weight)) * 100, 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Scale className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading your weight tracking data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weightGoal) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Target className="h-6 w-6 mr-2 text-purple-600" />
              Set Your Weight Loss Goal
            </CardTitle>
            <CardDescription>
              Start your weight loss journey by setting your starting weight and target goal
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-md mx-auto">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleSetGoalClick}
            >
              <Target className="h-4 w-4 mr-2" />
              Set Weight Goal
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentWeight ? `${currentWeight} kg` : 'No entries yet'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Weight Lost</p>
                <p className="text-2xl font-bold text-green-600">
                  {weightLost > 0 ? `${weightLost.toFixed(1)} kg` : '0 kg'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Target Weight</p>
                <p className="text-2xl font-bold text-purple-600">
                  {weightGoal.target_weight ? `${weightGoal.target_weight} kg` : 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {weightGoal.target_weight && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Goal</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleLogWeightClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Weight
        </Button>

        <Button 
          variant="outline"
          onClick={handleSetGoalClick}
        >
          <Target className="h-4 w-4 mr-2" />
          Update Goal
        </Button>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <AchievementsBadges achievements={achievements} />
      )}

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

      {/* Weight Chart */}
      {weightEntries.length > 0 && (
        <WeightChart entries={weightEntries} startWeight={weightGoal.start_weight} />
      )}

      {/* Weight Entries List */}
      <WeightEntryList entries={weightEntries} />
    </div>
  );
};

export default WeightTracker;
