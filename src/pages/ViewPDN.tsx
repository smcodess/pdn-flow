import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, GitBranch, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackingEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  comment?: string;
  status?: string;
  assignedTo?: string;
}

const mockPDNDetails = {
  id: "PDN-001",
  description: "Login authentication issue with OAuth integration",
  status: "In Progress",
  priority: "High",
  createdBy: "John Doe",
  assignedTo: "Jane Smith",
  dateCreated: "2024-01-15",
  lastUpdated: "2024-01-17",
  gitRepo: "frontend-app",
  problemStatement: "Users are experiencing intermittent authentication failures when using OAuth providers (Google, GitHub) for login. The issue appears to be related to token refresh handling and occurs approximately 10% of the time during login attempts.",
  workspace: "Frontend Development",
  defectType: "Bug",
  defectId: "DEF-4721",
  moduleImpacted: "Authentication",
  subModuleImpacted: "OAuth",
  components: [
    "src/components/auth/OAuthLogin.tsx",
    "src/utils/tokenManager.js", 
    "src/services/authService.ts",
    "config/oauth-config.json"
  ]
};

const mockTrackingHistory: TrackingEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-17 14:30",
    action: "Status Updated",
    user: "Jane Smith",
    status: "In Progress",
    comment: "Started investigating the OAuth token refresh mechanism. Found potential race condition in token validation."
  },
  {
    id: "2", 
    timestamp: "2024-01-16 10:15",
    action: "Assigned",
    user: "Project Manager",
    assignedTo: "Jane Smith",
    comment: "Assigned to Jane Smith from the Authentication team for investigation."
  },
  {
    id: "3",
    timestamp: "2024-01-15 16:45", 
    action: "Created",
    user: "John Doe",
    status: "Open",
    comment: "Initial PDN created based on user reports and error logs analysis."
  }
];

const statuses = ["Open", "In Progress", "Under Review", "Resolved", "Closed", "Rejected"];
const users = ["Jane Smith", "Bob Wilson", "Sarah Davis", "Mike Chen", "Lisa Wang"];

export default function ViewPDN() {
  const { id } = useParams();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const handleAddUpdate = () => {
    if (!newComment.trim() && !newStatus && !newAssignee) {
      toast({
        title: "Error",
        description: "Please provide at least a comment, status update, or assignment change.",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding update
    toast({
      title: "Update Added",
      description: "The tracking history has been updated successfully.",
    });

    // Reset form
    setNewComment("");
    setNewStatus("");  
    setNewAssignee("");
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "In Progress":
        return "default";
      case "Under Review":
        return "outline";
      case "Resolved":
        return "secondary";
      case "Closed":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/workspace">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">{mockPDNDetails.id}</h1>
            <Badge variant={getStatusVariant(mockPDNDetails.status)}>
              {mockPDNDetails.status}
            </Badge>
            <Badge variant={getPriorityVariant(mockPDNDetails.priority)}>
              {mockPDNDetails.priority}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{mockPDNDetails.description}</p>
        </div>
      </div>

      {/* PDN Details */}
      <Card>
        <CardHeader>
          <CardTitle>PDN Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Created by:</span> {mockPDNDetails.createdBy}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Assigned to:</span> {mockPDNDetails.assignedTo}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Created:</span> {mockPDNDetails.dateCreated}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Repository:</span> {mockPDNDetails.gitRepo}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Defect ID:</span> {mockPDNDetails.defectId}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                <span className="font-medium">Module:</span> {mockPDNDetails.moduleImpacted} / {mockPDNDetails.subModuleImpacted}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Problem Statement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mockPDNDetails.problemStatement}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Components Affected</h3>
            <div className="space-y-1">
              {mockPDNDetails.components.map((component, index) => (
                <code key={index} className="block text-sm bg-muted px-2 py-1 rounded font-mono">
                  {component}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="history" className="w-full">
            <TabsList>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="add-update">Add Update</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="space-y-4 mt-4">
              {mockTrackingHistory.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{entry.action}</Badge>
                      <span className="text-sm text-muted-foreground">by {entry.user}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  
                  {entry.status && (
                    <div className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <Badge variant={getStatusVariant(entry.status)} className="ml-2">
                        {entry.status}
                      </Badge>
                    </div>
                  )}
                  
                  {entry.assignedTo && (
                    <div className="text-sm">
                      <span className="font-medium">Assigned to:</span> {entry.assignedTo}
                    </div>
                  )}
                  
                  {entry.comment && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {entry.comment}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="add-update" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignee">Reassign To</Label>
                  <Select value={newAssignee} onValueChange={setNewAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Add your comment or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button onClick={handleAddUpdate} className="w-full">
                Add Update
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}