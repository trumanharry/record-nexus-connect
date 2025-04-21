
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Award, Star, ArrowUp } from "lucide-react";

interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  reason: string;
  createdAt: Date;
}

interface Leaderboard {
  id: string;
  name: string | null;
  email: string;
  points: number;
  role: string;
}

const PointsPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch user's point transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["pointTransactions", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(transaction => ({
        id: transaction.id,
        userId: transaction.user_id,
        points: transaction.points,
        reason: transaction.reason,
        createdAt: new Date(transaction.created_at),
      })) as PointTransaction[];
    },
    enabled: !!user
  });

  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, points, role")
        .order("points", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        role: user.role,
      })) as Leaderboard[];
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Points & Rewards</h1>
        <p className="text-muted-foreground mt-2">
          Track your activity points and see how you compare with others
        </p>
      </div>

      {/* User's current points */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-3 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Your Points</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{user?.points || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Keep contributing to earn more!
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>
              Points are awarded for various activities in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-3 border rounded-md">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-brand-700" />
              </div>
              <span className="font-medium">Add Records</span>
              <span className="text-sm text-center text-muted-foreground">
                5 points per new record
              </span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-md">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-2">
                <ArrowUp className="h-5 w-5 text-brand-700" />
              </div>
              <span className="font-medium">Comments</span>
              <span className="text-sm text-center text-muted-foreground">
                1 point per comment, 2 points per upvote
              </span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-md">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-brand-700" />
              </div>
              <span className="font-medium">Daily Login</span>
              <span className="text-sm text-center text-muted-foreground">
                2 points per day you log in
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Point history */}
      <Card>
        <CardHeader>
          <CardTitle>Your Point History</CardTitle>
          <CardDescription>
            Recent point transactions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">
                No point transactions yet. Start contributing to earn points!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            Top contributors based on points earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLeaderboard ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((leader, index) => (
                  <TableRow key={leader.id} className={leader.id === user?.id ? "bg-brand-50" : ""}>
                    <TableCell className="font-medium">
                      {index + 1}
                      {index < 3 && (
                        <span className="ml-2">
                          {index === 0 && "🥇"}
                          {index === 1 && "🥈"}
                          {index === 2 && "🥉"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {leader.name || leader.email}
                      {leader.id === user?.id && <span className="ml-2 text-xs text-brand-600">(You)</span>}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {leader.points}
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

export default PointsPage;
