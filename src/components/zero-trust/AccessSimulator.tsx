import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert } from "lucide-react";

export interface AccessRequestData {
  employee: string;
  role: string;
  device: string;
  location: string;
  ip_address: string;
  login_time: string;
  vpn_enabled: boolean;
  admin_request: boolean;
  mfa_enabled: boolean;
}

export function AccessSimulator({ onSimulate, loading }: { onSimulate: (data: AccessRequestData) => void, loading: boolean }) {
  const [formData, setFormData] = useState<AccessRequestData>({
    employee: "John Doe",
    role: "User",
    device: "Corporate Laptop",
    location: "USA",
    ip_address: "192.168.1.50",
    login_time: "09:00 AM",
    vpn_enabled: true,
    admin_request: false,
    mfa_enabled: true,
  });

  const handleChange = (field: keyof AccessRequestData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSimulate = () => {
    onSimulate(formData);
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent pointer-events-none" />
      <div className="absolute -inset-px bg-gradient-to-r from-cyber-cyan/30 to-cyber-purple/30 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }} />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center">
          <ShieldAlert className="h-5 w-5 text-cyber-cyan" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Access Request Simulator</h3>
          <p className="text-sm text-muted-foreground">Configure login scenario for AI evaluation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Employee Name</Label>
          <Input value={formData.employee} onChange={(e) => handleChange("employee", e.target.value)} className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={formData.role} onValueChange={(v) => handleChange("role", v)}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">Standard User</SelectItem>
              <SelectItem value="Admin">System Admin</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Device Type</Label>
          <Input value={formData.device} onChange={(e) => handleChange("device", e.target.value)} className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={formData.location} onChange={(e) => handleChange("location", e.target.value)} className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label>Login Time</Label>
          <Input value={formData.login_time} onChange={(e) => handleChange("login_time", e.target.value)} className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label>IP Address</Label>
          <Input value={formData.ip_address} onChange={(e) => handleChange("ip_address", e.target.value)} className="bg-background/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50">
        <div className="flex items-center justify-between">
          <Label className="cursor-pointer">VPN Enabled</Label>
          <Switch checked={formData.vpn_enabled} onCheckedChange={(v) => handleChange("vpn_enabled", v)} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="cursor-pointer">MFA Enabled</Label>
          <Switch checked={formData.mfa_enabled} onCheckedChange={(v) => handleChange("mfa_enabled", v)} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="cursor-pointer">Admin Access</Label>
          <Switch checked={formData.admin_request} onCheckedChange={(v) => handleChange("admin_request", v)} />
        </div>
      </div>

      <Button 
        onClick={handleSimulate} 
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:opacity-90 text-background font-semibold"
      >
        {loading ? "Simulating..." : "Simulate Access Request"}
      </Button>
    </div>
  );
}
