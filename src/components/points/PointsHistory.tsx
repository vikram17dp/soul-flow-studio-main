
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PointTransaction } from '@/types/points';
import { Plus, Minus, Gift, AlertTriangle, Settings } from 'lucide-react';

interface PointsHistoryProps {
  transactions: PointTransaction[];
  isLoading: boolean;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'earned':
      return <Plus className="h-4 w-4 text-green-600" />;
    case 'redeemed':
      return <Minus className="h-4 w-4 text-red-600" />;
    case 'bonus':
      return <Gift className="h-4 w-4 text-purple-600" />;
    case 'penalty':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'adjustment':
      return <Settings className="h-4 w-4 text-blue-600" />;
    default:
      return <Plus className="h-4 w-4 text-gray-600" />;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case 'earned':
      return 'bg-green-100 text-green-800';
    case 'redeemed':
      return 'bg-red-100 text-red-800';
    case 'bonus':
      return 'bg-purple-100 text-purple-800';
    case 'penalty':
      return 'bg-orange-100 text-orange-800';
    case 'adjustment':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatActivityType = (activityType: string) => {
  return activityType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PointsHistory = ({ transactions, isLoading }: PointsHistoryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Loading your point transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points History</CardTitle>
        <CardDescription>Your recent point transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No point transactions yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start attending classes to earn your first points!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {transaction.description || formatActivityType(transaction.activity_type)}
                      </h3>
                      <Badge className={getTransactionColor(transaction.transaction_type)}>
                        {transaction.transaction_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy at h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.transaction_type === 'redeemed' || transaction.transaction_type === 'penalty'
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {transaction.transaction_type === 'redeemed' || transaction.transaction_type === 'penalty' 
                      ? '-' : '+'}{transaction.points}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsHistory;
