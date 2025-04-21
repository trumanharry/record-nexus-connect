
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  BarChart3,
  Building,
  User,
  LineChart,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMINISTRATOR;
  const navigate = useNavigate();

  // Navigation handler functions
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name}!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              +5 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">
              +28 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Physicians</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">
              +8 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your team's latest actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start pb-3 border-b">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand-700" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Jane Smith</span> added a new contact
                    <span className="font-medium"> John Doe</span>
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start pb-3 border-b">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <Building className="h-4 w-4 text-brand-700" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Mark Johnson</span> updated company info for
                    <span className="font-medium"> Acme Corp</span>
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start pb-3 border-b">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <LineChart className="h-4 w-4 text-brand-700" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Sarah Lee</span> linked
                    <span className="font-medium"> Dr. Wilson</span> to 
                    <span className="font-medium"> General Hospital</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-brand-700" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">System</span> generated monthly report for
                    <span className="font-medium"> Q2 Performance</span>
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>
              Users with most points this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    JS
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Distributor</p>
                  </div>
                </div>
                <div className="text-sm font-medium">1,245 pts</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    MJ
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mark Johnson</p>
                    <p className="text-xs text-muted-foreground">Corporate</p>
                  </div>
                </div>
                <div className="text-sm font-medium">980 pts</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    SL
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Lee</p>
                    <p className="text-xs text-muted-foreground">Distributor</p>
                  </div>
                </div>
                <div className="text-sm font-medium">865 pts</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    RB
                  </div>
                  <div>
                    <p className="text-sm font-medium">Robert Brown</p>
                    <p className="text-xs text-muted-foreground">Corporate</p>
                  </div>
                </div>
                <div className="text-sm font-medium">740 pts</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    AD
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Davis</p>
                    <p className="text-xs text-muted-foreground">Distributor</p>
                  </div>
                </div>
                <div className="text-sm font-medium">605 pts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <Button 
              className="h-20 flex flex-col gap-1 w-full" 
              variant="outline"
              onClick={() => handleNavigation("/companies/add")}
            >
              <Building className="h-5 w-5" />
              <span>Add Company</span>
            </Button>
            
            <Button 
              className="h-20 flex flex-col gap-1 w-full" 
              variant="outline"
              onClick={() => handleNavigation("/hospitals/add")}
            >
              <Building className="h-5 w-5" />
              <span>Add Hospital</span>
            </Button>
            
            <Button 
              className="h-20 flex flex-col gap-1 w-full" 
              variant="outline"
              onClick={() => handleNavigation("/contacts/add")}
            >
              <User className="h-5 w-5" />
              <span>Add Contact</span>
            </Button>
            
            <Button 
              className="h-20 flex flex-col gap-1 w-full" 
              variant="outline"
              onClick={() => handleNavigation("/physicians/add")}
            >
              <FileText className="h-5 w-5" />
              <span>Add Physician</span>
            </Button>
            
            <Button 
              className="h-20 flex flex-col gap-1 w-full" 
              variant="outline"
              onClick={() => handleNavigation("/reports")}
            >
              <LineChart className="h-5 w-5" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Only Section */}
      {isAdmin && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle>Administrator Actions</CardTitle>
            <CardDescription>
              Manage system settings and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              <Button 
                className="h-16 flex gap-2 w-full" 
                variant="default"
                onClick={() => handleNavigation("/settings")}
              >
                <Settings className="h-5 w-5" />
                <span>System Settings</span>
              </Button>
              
              <Button 
                className="h-16 flex gap-2 w-full" 
                variant="default"
                onClick={() => handleNavigation("/settings/users")}
              >
                <User className="h-5 w-5" />
                <span>User Management</span>
              </Button>
              
              <Button 
                className="h-16 flex gap-2 w-full" 
                variant="default"
                onClick={() => handleNavigation("/settings/fields")}
              >
                <FileText className="h-5 w-5" />
                <span>Field Configuration</span>
              </Button>
              
              <Button 
                className="h-16 flex gap-2 w-full" 
                variant="default"
                onClick={() => handleNavigation("/settings/points")}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Point System</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
