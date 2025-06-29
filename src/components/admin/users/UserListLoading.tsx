
import { Card, CardContent } from '@/components/ui/card';

const UserListLoading = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserListLoading;
