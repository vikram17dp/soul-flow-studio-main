
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { UserPoints } from '@/types/points';

interface AdminPointsOverviewProps {
  userPoints: (UserPoints & { profiles: { full_name: string; email: string } })[];
  isLoading: boolean;
}

const AdminPointsOverview = ({ userPoints, isLoading }: AdminPointsOverviewProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalUsers = userPoints.length;
  const totalPointsAwarded = userPoints.reduce((sum, user) => sum + user.lifetime_earned, 0);
  const totalPointsRedeemed = userPoints.reduce((sum, user) => sum + user.lifetime_redeemed, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Awarded</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsAwarded.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Redeemed</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsRedeemed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Points Leaderboard</CardTitle>
          <CardDescription>Users ranked by total points</CardDescription>
        </CardHeader>
        <CardContent>
          {userPoints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users with points found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Lifetime Earned</TableHead>
                  <TableHead>Lifetime Redeemed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPoints.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {index < 3 && (
                          <Trophy className={`h-4 w-4 mr-2 ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-amber-600'
                          }`} />
                        )}
                        #{index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.profiles?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-600">
                        {user.total_points.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>{user.lifetime_earned.toLocaleString()}</TableCell>
                    <TableCell>{user.lifetime_redeemed.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={user.total_points > 0 ? "default" : "secondary"}>
                        {user.total_points > 0 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPointsOverview;
