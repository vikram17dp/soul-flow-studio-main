
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PointRule } from '@/types/points';
import { Edit, Save, X } from 'lucide-react';

interface AdminPointRulesProps {
  rules: PointRule[];
  isLoading: boolean;
  onUpdateRule: (ruleId: string, updates: Partial<PointRule>) => Promise<void>;
}

const AdminPointRules = ({ rules, isLoading, onUpdateRule }: AdminPointRulesProps) => {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PointRule>>({});

  const handleEditStart = (rule: PointRule) => {
    setEditingRule(rule.id);
    setEditForm({
      points_awarded: rule.points_awarded,
      description: rule.description,
      is_active: rule.is_active,
    });
  };

  const handleEditCancel = () => {
    setEditingRule(null);
    setEditForm({});
  };

  const handleEditSave = async (ruleId: string) => {
    try {
      await onUpdateRule(ruleId, editForm);
      setEditingRule(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating rule:', error);
    }
  };

  const getActivityLabel = (activityType: string) => {
    const labels: Record<string, string> = {
      class_attendance: 'Class Attendance',
      class_booking: 'Class Booking',
      referral: 'Referral',
      signup_bonus: 'Signup Bonus',
      weekly_streak: 'Weekly Streak',
      monthly_streak: 'Monthly Streak',
      review_submission: 'Review Submission',
      profile_completion: 'Profile Completion',
      admin_adjustment: 'Admin Adjustment',
      habit_completion: '🍽️ Habit Completion',
      daily_habit_bonus: '🏆 Daily Habit Bonus',
      habit_streak_bonus: '🔥 Habit Streak Bonus',
    };
    return labels[activityType] || activityType;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading point rules...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Point Rules Configuration</CardTitle>
          <CardDescription>
            Manage how many points are awarded for different activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 border rounded-lg ${
                  rule.is_active ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">
                        {getActivityLabel(rule.activity_type)}
                      </h3>
                      <Switch
                        checked={editingRule === rule.id ? editForm.is_active : rule.is_active}
                        onCheckedChange={(checked) => {
                          if (editingRule === rule.id) {
                            setEditForm(prev => ({ ...prev, is_active: checked }));
                          } else {
                            onUpdateRule(rule.id, { is_active: checked });
                          }
                        }}
                        disabled={editingRule === rule.id}
                      />
                    </div>
                    
                    {editingRule === rule.id ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label htmlFor={`points-${rule.id}`}>Points Awarded</Label>
                          <Input
                            id={`points-${rule.id}`}
                            type="number"
                            value={editForm.points_awarded || ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              points_awarded: parseInt(e.target.value) || 0 
                            }))}
                            className="w-32"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`desc-${rule.id}`}>Description</Label>
                          <Input
                            id={`desc-${rule.id}`}
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              description: e.target.value 
                            }))}
                            placeholder="Optional description"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{rule.points_awarded} points</span>
                          {rule.description && ` - ${rule.description}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Activity: {rule.activity_type}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {editingRule === rule.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(rule.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPointRules;
