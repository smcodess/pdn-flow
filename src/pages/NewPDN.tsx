import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PDNFormData {
  description: string;
  problemStatement: string;
  workspace: string;
  components: string;
  defectId: string;
  defectType: string;
  moduleImpacted: string;
  subModuleImpacted: string;
}

const workspaces = ["Frontend Development", "Backend Services", "Mobile App", "Data Platform", "Infrastructure"];
const defectTypes = ["Bug", "Enhancement", "Performance", "Security", "Documentation"];
const modules = ["Authentication", "User Management", "Reporting", "API Gateway", "Database"];

export default function NewPDN() {
  const { toast } = useToast();
  const [generatedId] = useState(`PDN-${Date.now().toString().slice(-6)}`);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PDNFormData>({
    defaultValues: {
      description: "",
      problemStatement: "",
      workspace: "",
      components: "",
      defectId: "",
      defectType: "",
      moduleImpacted: "",
      subModuleImpacted: ""
    }
  });

  const selectedModule = watch("moduleImpacted");
  const getSubModules = (module: string) => {
    const subModuleMap: Record<string, string[]> = {
      "Authentication": ["OAuth", "JWT", "Session Management", "Password Reset"],
      "User Management": ["User Profiles", "Permissions", "Roles", "Account Settings"],
      "Reporting": ["Dashboard", "Analytics", "Export", "Scheduling"],
      "API Gateway": ["Routing", "Rate Limiting", "Authentication", "Logging"],
      "Database": ["Queries", "Migrations", "Backup", "Performance"]
    };
    return subModuleMap[module] || [];
  };

  const onSubmit = (data: PDNFormData) => {
    console.log("Submitting PDN:", { id: generatedId, ...data });
    toast({
      title: "PDN Created Successfully",
      description: `PDN ${generatedId} has been created and submitted for review.`,
    });
    reset();
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Form Reset",
      description: "All form fields have been cleared.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New PDN</h1>
        <p className="text-muted-foreground">Fill in the details to create a new Problem Description Note</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <span>PDN Details</span>
            <div className="text-sm font-mono bg-muted px-3 py-1 rounded">
              ID: {generatedId}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the issue or requirement..."
                  className="min-h-[100px]"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemStatement">Problem Statement/ID *</Label>
                <Textarea
                  id="problemStatement"
                  placeholder="Detailed problem statement or reference ID..."
                  className="min-h-[100px]"
                  {...register("problemStatement", { required: "Problem statement is required" })}
                />
                {errors.problemStatement && (
                  <p className="text-sm text-destructive">{errors.problemStatement.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace *</Label>
                <Select onValueChange={(value) => setValue("workspace", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.workspace && (
                  <p className="text-sm text-destructive">{errors.workspace.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="defectId">Defect ID</Label>
                <Input
                  id="defectId"
                  placeholder="e.g., DEF-12345"
                  {...register("defectId")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="components">Components Changed *</Label>
              <Textarea
                id="components"
                placeholder="List file paths of components that need changes (one per line)..."
                className="min-h-[120px] font-mono text-sm"
                {...register("components", { required: "Components list is required" })}
              />
              {errors.components && (
                <p className="text-sm text-destructive">{errors.components.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: src/components/Login.tsx, src/utils/auth.js, config/database.yml
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defectType">Defect Type *</Label>
                <Select onValueChange={(value) => setValue("defectType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {defectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.defectType && (
                  <p className="text-sm text-destructive">{errors.defectType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleImpacted">Module Impacted *</Label>
                <Select onValueChange={(value) => setValue("moduleImpacted", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module} value={module}>
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.moduleImpacted && (
                  <p className="text-sm text-destructive">{errors.moduleImpacted.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subModuleImpacted">Sub Module Impacted *</Label>
                <Select 
                  onValueChange={(value) => setValue("subModuleImpacted", value)}
                  disabled={!selectedModule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedModule ? "Select sub module" : "Select module first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubModules(selectedModule).map((subModule) => (
                      <SelectItem key={subModule} value={subModule}>
                        {subModule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subModuleImpacted && (
                  <p className="text-sm text-destructive">{errors.subModuleImpacted.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" variant="gradient" className="flex-1">
                Save PDN
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}