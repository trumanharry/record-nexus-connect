
import React from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border flex items-center px-6 sticky top-0 bg-background z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9 w-full"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
