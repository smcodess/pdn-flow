import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  GitBranch,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
  X,
  Target,
  Activity,
  Clock,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendApiRequest } from "@/lib/utils";

interface viewPDNdetails {
  pdnId: string;
  description: string;
  currentStatus: string;
  createdByFirstName: string;
  currentOwnerFirstName: string;
  createdDate: string;
  workspace: string;
  priority?: string;
  updatedDate?: string;
  problemId: string;
  impactedArea: string;
  module: string;
  subModule: string;
  product: string;
}

interface ComponentDetailsType {
  status: number;
  message: string;
  data: {
    component: string;
    createdDate: string;
    updatedDate: string;
    createdBy: number;
    pdnId: string;
  }[];
}

interface TrackingEntry {
  createdDate: string;
  details: string;
  eventCode: string;
  eventType: string;
  updatedDate: string;
  empId: number;
  pdnId: string;
}

interface TrackingDetailsType {
  status: number;
  message: string;
  data: TrackingEntry[];
}

interface CommentDetailsType {
  status: number;
  message: string;
  data: {
    commentBody: string;
    createdDate: string;
    updatedDate: string;
    commentedBy: number;
    pdnId: string;
  }[];
}

const statuses = [
  "Open",
  "In Progress",
  "Under Review",
  "Resolved",
  "Closed",
  "Rejected",
];
const users = [
  "Jane Smith",
  "Bob Wilson",
  "Sarah Davis",
  "Mike Chen",
  "Lisa Wang",
];

export default function ViewPDN() {
  const { id } = useParams();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [pdnDetails, setpdnDetails] = useState<viewPDNdetails | null>(null);
  const [componentDetails, setcomponentDetails] =
    useState<ComponentDetailsType | null>(null);
  const [trackingDetails, settrackingDetails] =
    useState<TrackingDetailsType | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
    new Set()
  );
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("history");
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [newComponentPath, setNewComponentPath] = useState("");
  const [newComponents, setNewComponents] = useState<Array<{
    component: string;
  }>>([]);

  const Navigate = useNavigate();

  useEffect(() => {
    const loadFiles = async () => {
      try {
        // const response = await sendApiRequest(
        //   `http://localhost:8080/api/pdn/all/pdnId/${id}`,
        //   {},
        //   { method: "GET" }
        // );

        const response = {
          status: 200,
          message: "Success",
          data: [
            {
              pdnId: "IM350",
              description: "Login authentication issue with OAuth integration",
              currentStatus: "Raised",
              createdByFirstName: "Satwik",
              currentOwnerFirstName: "Sudipto",
              createdDate: "2024-01-15T10:30:00Z",
              workspace: "Frontend Development",
              priority: "High",
              updatedDate: "2024-01-17T14:20:00Z",
              problemId: "DEF-4721",
              impactedArea: "Authentication Module",
              module: "Authentication",
              subModule: "OAuth",
              product: "Web Application",
            },
          ],
        };

        if (response.status == 401) {
          Navigate("/signup");
        }

        console.log("PDN Details:", response);
        setpdnDetails(response.data[0]);
      } catch (err) {
        console.log(
          err instanceof Error ? err.message : "Failed to fetch PDN details"
        );
      }

      // Component Details
      try {
        // const response = await sendApiRequest(
        //   `http://localhost:8080/api/pdn/component/${id}`,
        //   {},
        //   { method: "GET" }
        // );

        const response = {
          status: 200,
          message: "Success",
          data: [
            {
              component:
                "Base_Source_Code/JDK17UPGRADE/GradleBuild/BaNCSDomainData/src/main/java/com/tcs/bancs/insurance/core/acc/dao/GSTTaxDataAccess.java\nBase_Source_Code/JDK17UPGRADE/GradleBuild/BaNCSInterface/src/main/java/com/tcs/bancs/insurance/rein/service/consumer/impl/AccountPostingTransfer.java\nBase_Source_Code/CUSTOMER_LAYER/CUST_LAYER_IL/Database/HLTH_PRD/8001_Product_movement/29082025/Script for Multi City GST Payment Purpose CR_REF_CODES.sql",
              createdDate: "2025-09-01T15:51:15.331996",
              updatedDate: "2025-09-01T15:51:15.331996",
              createdBy: 2732290,
              pdnId: "IM356",
            },
            {
              component: "comp",
              createdDate: "2025-09-01T15:55:50.280639",
              updatedDate: "2025-09-01T15:55:50.280639",
              createdBy: 2779524,
              pdnId: "IM356",
            },
          ],
        };

        console.log("Component Details:", response);
        setcomponentDetails(response);
      } catch (err) {
        console.log(
          err instanceof Error
            ? err.message
            : "Failed to fetch component details"
        );
      }

      // Tracking Details
      await fetchTrackingData();
    };

    loadFiles();
  }, [id]);

  const handleAddUpdate = async () => {
    if (
      !newComment.trim() &&
      !newStatus &&
      !newAssignee &&
      attachedFiles.length === 0
    ) {
      toast({
        title: "Error",
        description:
          "Please provide at least a comment, status update, assignment change, or file attachment.",
        variant: "destructive",
      });
      return;
    }

    const updateInfo = {
      pdnId: id,
      comment: newComment,
      status: newStatus,
      assignee: newAssignee,
      files: attachedFiles,
      timestamp: new Date().toISOString(),
    };

    console.log(updateInfo);
    // console.log(updateData);

    try {
      const formData = new FormData();
      formData.append("pdnId", id || "");
      formData.append("comment", newComment);
      formData.append("status", newStatus);
      formData.append("assignee", newAssignee);

      attachedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      console.log(formData);

      // await sendApiRequest(
      //   `http://localhost:8080/api/pdn/update/${id}`,
      //   formData,
      //   { method: "POST" }
      // );

      toast({
        title: "Update Added",
        description: "The tracking history has been updated successfully.",
      });

      setNewComment("");
      setNewStatus("");
      setNewAssignee("");
      setAttachedFiles([]);

      await fetchTrackingData();
      setActiveTab("history");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add update. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchTrackingData = async () => {
    try {
      // const response = await sendApiRequest(
      //   `http://localhost:8080/api/pdn/tracking/${id}`,
      //   {},
      //   { method: "GET" }
      // );

      const response = {
        status: 200,
        message: "Something",
        data: [
          {
            createdDate: "04/09/2025",
            details: "",
            eventCode: "UPDATE",
            eventType: "",
            updatedDate: "",
            empId: 2732290,
            pdnId: "IM921",
          },
        ],
      };

      console.log("Tracking Details:", response);
      settrackingDetails(response);
    } catch (err) {
      console.log(
        err instanceof Error ? err.message : "Failed to fetch tracking details"
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleEntryExpansion = (index: number) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEntries(newExpanded);
  };

  const handleSaveComponent = () => {
    if (!newComponentPath.trim()) {
      toast({
        title: "Error",
        description: "Please enter a component path.",
        variant: "destructive",
      });
      return;
    }

    const newComponent = {
      component: newComponentPath,
    };

    setNewComponents(prev => [...prev, newComponent]);
    setNewComponentPath("");
    setShowAddComponent(false);

    toast({
      title: "Component Added",
      description: "New component has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => Navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {pdnDetails?.pdnId || "Loading..."}
              </h1>
              {pdnDetails?.currentStatus && (
                <Badge
                  variant={getStatusVariant(pdnDetails.currentStatus)}
                  className="text-sm"
                >
                  {pdnDetails.currentStatus}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {pdnDetails?.description || "Loading description..."}
            </p>
          </div>
        </div>

        {/* Quick Info Grid */}
        {pdnDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Created by</p>
                <p className="text-sm text-muted-foreground">
                  {pdnDetails.createdByFirstName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Assigned to</p>
                <p className="text-sm text-muted-foreground">
                  {pdnDetails.currentOwnerFirstName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(pdnDetails.createdDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <GitBranch className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Workspace</p>
                <p className="text-sm text-muted-foreground">
                  {pdnDetails.workspace}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDN Details */}
      {pdnDetails && (
        <Card>
          <CardHeader>{/* <CardTitle>PDN Details</CardTitle> */}</CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Created by:</span>{" "}
                  {pdnDetails.createdByFirstName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Assigned to:</span>{" "}
                  {pdnDetails.currentOwnerFirstName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Created on:</span>{" "}
                  {formatDate(pdnDetails.createdDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Repository:</span>{" "}
                  {pdnDetails.workspace}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Defect ID:</span>{" "}
                  {pdnDetails.problemId}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Module:</span>{" "}
                  {pdnDetails.module} / {pdnDetails.subModule}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Problem Statement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pdnDetails.description}
              </p>
            </div>
            
            {/* Components Affected */}
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Components Affected</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddComponent(true)}
                  className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 max-w-4xl bg-white scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                {componentDetails?.data?.map((component, componentIndex) => (
                  <code
                    key={componentIndex}
                    className="block text-sm bg-muted px-2 py-1 font-mono whitespace-pre overflow-x-auto scrollbar-thin"
                  >
                    {component.component.split("\n").map((line) => line.trim()).join("\n")}
                  </code>
                ))}

                {newComponents.map((component, index) => (
                  <code
                    key={`new-${index}`}
                    className="block text-sm bg-muted px-2 py-1 font-mono whitespace-pre overflow-x-auto scrollbar-thin"
                  >
                    {component.component.split("\n").map((line) => line.trim()).join("\n")}
                  </code>
                ))}
              </div>

              {showAddComponent && (
                <div className="mt-4 border border-border rounded-lg p-4 bg-accent/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Add New Component</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddComponent(false);
                        setNewComponentPath("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Enter the component path..."
                    value={newComponentPath}
                    onChange={(e) => setNewComponentPath(e.target.value)}
                    className="min-h-[80px] font-mono text-sm"
                  />

                  <div className="flex space-x-3">
                    <Button onClick={handleSaveComponent} size="sm">
                      Save Component
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddComponent(false);
                        setNewComponentPath("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          </CardContent>
        </Card>
      )}

      {/* Tracking History */}
      <Card className="shadow-card border-border/50 bg-card">
        <CardHeader className="bg-muted/30 dark:bg-muted/50 rounded-t-xl">
          <CardTitle className="text-xl font-semibold flex items-center text-card-foreground">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Tracking History & Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-6">
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="add-update"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Add Update
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="p-6 space-y-4">
              {trackingDetails?.data && trackingDetails?.data?.length > 0 ? (
                <div className="space-y-3">
                  {trackingDetails?.data?.map((entry, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => toggleEntryExpansion(index)}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <button className="p-1 hover:bg-muted rounded-md transition-colors">
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 text-foreground ${expandedEntries.has(index)
                                ? "rotate-0"
                                : "-rotate-90"
                                }`}
                            />
                          </button>

                          <Badge
                            variant="outline"
                            className="bg-primary/5 border-primary/20 text-primary font-medium"
                          >
                            {entry.eventCode}
                          </Badge>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {entry.eventType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {entry.empId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(entry.createdDate)}
                          </p>
                        </div>
                      </div>

                      {expandedEntries.has(index) && (
                        <div className="border-t border-border bg-muted/20 p-4 space-y-4 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                <span className="font-medium">Employee:</span>{" "}
                                {entry.empId}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                <span className="font-medium">Created:</span>{" "}
                                {formatDate(entry.createdDate)}
                              </span>
                            </div>
                            {entry.updatedDate !== entry.createdDate && (
                              <div className="flex items-center space-x-2 sm:col-span-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  <span className="font-medium">Updated:</span>{" "}
                                  {formatDate(entry.updatedDate)}
                                </span>
                              </div>
                            )}
                          </div>

                          {entry.details && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium flex items-center text-foreground">
                                <FileText className="h-4 w-4 mr-1" />
                                Details:
                              </span>
                              <div className="bg-card border border-border rounded-lg p-3">
                                <p className="text-sm text-foreground leading-relaxed">
                                  {entry.details}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No tracking history available
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    Updates will appear here as they're added
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-update" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium flex items-center"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Update Status
                  </Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Select new status (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusVariant(
                                status
                              )}`}
                            ></div>
                            <span>{status}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="assignee"
                    className="text-sm font-medium flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Reassign To
                  </Label>
                  <Select value={newAssignee} onValueChange={setNewAssignee}>
                    <SelectTrigger className="bg-card border-border">
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

              <div className="space-y-3">
                <Label
                  htmlFor="comment"
                  className="text-sm font-medium flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Add your comment or update details..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[120px] bg-card border-border resize-none"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Attachments
                </Label>

                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary mt-1">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground/70 mt-1">
                      PDF, DOC, JPG, PNG up to 10MB
                    </span>
                  </label>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-sm font-medium">
                      Attached Files ({attachedFiles.length}):
                    </span>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-accent/30 border border-accent rounded-lg group hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-primary/10 rounded">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-48">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleAddUpdate}
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium py-2.5"
              >
                <Activity className="h-4 w-4 mr-2" /> Add Update{" "}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
