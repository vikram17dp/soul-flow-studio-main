
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Award } from 'lucide-react';
import { UserPoints, PointActivityType } from '@/types/points';

interface AdminAwardPointsProps {
  users: (UserPoints & { profiles: { full_name: string; email: string } })[];
  onAwardPoints: (userId: string, activityType: PointActivityType, customPoints?: number, description?: string) => Promise<void>;
  onComplete: () => void;
}

const AdminAwardPoints = ({ users, onAwardPoints, onComplete }: AdminAwardPointsProps) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [activityType, setActivityType] = useState<PointActivityType>('admin_adjustment');
  const [customPoints, setCustomPoints] = useState('');
  const [description, setDescription] = useState('');
  const [isAwarding, setIsAwarding] = useState(false);

  const activityTypes: { value: PointActivityType; label: string }[] = [
    { value: 'class_attendance', label: 'Class Attendance' },
    { value: 'class_booking', label: 'Class Booking' },
    { value: 'referral', label: 'Referral' },
    { value: 'signup_bonus', label: 'Signup Bonus' },
    { value: 'weekly_streak', label: 'Weekly Streak' },
    { value: 'monthly_streak', label: 'Monthly Streak' },
    { value: 'review_submission', label: 'Review Submission' },
    { value: 'profile_completion', label: 'Profile Completion' },
    { value: 'admin_adjustment', label: 'Admin Adjustment' }
  ];

  const handleAwardPoints = async () => {
    if (!selectedUser || !customPoints) return;

    setIsAwarding(true);
    try {
      await onAwardPoints(
        selectedUser,
        activityType,
        parseInt(customPoints),
        description || undefined
      );
      
      // Reset form
      setSelectedUser('');
      setCustomPoints('');
      setDescription('');
      onComplete();
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Award Points Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2 text-purple-600" />
            Award Points to User
          </CardTitle>
          <CardDescription>Manually award points to users for special activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.profiles?.full_name || 'Unknown User'} ({user.total_points} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-type">Activity Type</Label>
            <Select value={activityType} onValueChange={(value: PointActivityType) => setActivityType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Points to Award</Label>
            <Input
              id="points"
              type="number"
              value={customPoints}
              onChange={(e) => setCustomPoints(e.target.value)}
              placeholder="Enter points (positive or negative)"
            />
            <p className="text-xs text-gray-500">
              Use positive numbers to award points, negative to deduct points
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason for awarding these points..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleAwardPoints}
            disabled={!selectedUser || !customPoints || isAwarding}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Award className="h-4 w-4 mr-2" />
            {isAwarding ? 'Awarding Points...' : 'Award Points'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Award Actions</CardTitle>
          <CardDescription>Common point awards for quick access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setActivityType('signup_bonus');
                setCustomPoints('100');
                setDescription('Welcome bonus for new member');
              }}
              className="h-auto p-4 flex flex-col items-center"
            >
              <Gift className="h-6 w-6 mb-2 text-purple-600" />
              <span className="text-sm font-medium">Welcome Bonus</span>
              <span className="text-xs text-gray-500">100 points</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setActivityType('class_attendance');
                setCustomPoints('10');
                setDescription('Class attendance bonus');
              }}
              className="h-auto p-4 flex flex-col items-center"
            >
              <Award className="h-6 w-6 mb-2 text-green-600" />
              <span className="text-sm font-medium">Class Bonus</span>
              <span className="text-xs text-gray-500">10 points</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setActivityType('referral');
                setCustomPoints('50');
                setDescription('Referral bonus');
              }}
              className="h-auto p-4 flex flex-col items-center"
            >
              <Gift className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-sm font-medium">Referral</span>
              <span className="text-xs text-gray-500">50 points</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setActivityType('admin_adjustment');
                setCustomPoints('-10');
                setDescription('Point adjustment');
              }}
              className="h-auto p-4 flex flex-col items-center"
            >
              <Award className="h-6 w-6 mb-2 text-red-600" />
              <span className="text-sm font-medium">Deduct Points</span>
              <span className="text-xs text-gray-500">-10 points</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAwardPoints;
