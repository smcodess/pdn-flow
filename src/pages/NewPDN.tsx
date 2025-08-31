import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendApiRequest } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PDNFormData {
  description: string,
  createdBy: number;
  problemSource: string;
  problemId: string;
  workspace: string;
  module: string;
  subModule: string;
  product: string;
  impactedArea: string;
  component: string;
}

const workspaces = ["IM", "DELL", "PL"];
const defectTypes = ["IM", "CR"];
const modules = ["Policy", "Claim"];

export default function NewPDN() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPDN, setCreatedPDN] = useState<any>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PDNFormData>({
    defaultValues: {
      description: "",
      createdBy: null,
      problemSource: "",
      problemId: "",
      workspace: "",
      module: "",
      subModule: "",
      product: "",
      impactedArea: "",
      component: ""
    }
  });

  const selectedModule = watch("impactedArea");
  const getSubModules = (module: string) => {
    const subModuleMap: Record<string, string[]> = {
      "Policy": ["OAuth", "JWT", "Session Management", "Password Reset"],
      "Claim": ["User Profiles", "Permissions", "Roles", "Account Settings"],
    };
    return subModuleMap[module] || [];
  };

  const onSubmit = async (data: PDNFormData) => {
    try {
      setIsSubmitting(true);

      const requestData = {
        ...data,
        eventCode: "CREATE_PDN",
        createdBy: 2732290
      };

      const response = await sendApiRequest('http://localhost:8080/api/pdn/create', requestData, { method: "POST" });

      setCreatedPDN(response);
      console.log("PDN Created:", response);

      toast({
        title: "PDN Created Successfully",
        description: `PDN ${response.id} has been created and submitted for review.`,
      });

      navigate(`/pdn/PDN-002`);
      // navigate(`/pdn/${response.id}`);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create PDN. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating PDN:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <CardTitle>
            PDN Details
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
                <Label htmlFor="problemId">Problem Statement/ID *</Label>
                <Textarea
                  id="problemId"
                  placeholder="Detailed problem statement or reference ID..."
                  className="min-h-[100px]"
                  {...register("problemId", { required: "Problem statement is required" })}
                />
                {errors.problemId && (
                  <p className="text-sm text-destructive">{errors.problemId.message}</p>
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
                <Label htmlFor="problemId">Defect ID</Label>
                <Input
                  id="problemId"
                  placeholder="e.g., DEF-12345"
                  {...register("problemId")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="components">Components Changed *</Label>
              <Textarea
                id="components"
                placeholder="List file paths of components that need changes (one per line)..."
                className="min-h-[120px] font-mono text-sm"
                {...register("component", { required: "Components list is required" })}
              />
              {errors.component && (
                <p className="text-sm text-destructive">{errors.component.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: src/components/Login.tsx, src/utils/auth.js, config/database.yml
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="problemSource">Defect Type *</Label>
                <Select onValueChange={(value) => setValue("problemSource", value)}>
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
                {errors.problemSource && (
                  <p className="text-sm text-destructive">{errors.problemSource.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleImpacted">Module Impacted *</Label>
                <Select onValueChange={(value) => setValue("impactedArea", value)}>
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
                {errors.impactedArea && (
                  <p className="text-sm text-destructive">{errors.impactedArea.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subModuleImpacted">Sub Module Impacted *</Label>
                <Select
                  onValueChange={(value) => setValue("subModule", value)}
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
                {errors.subModule && (
                  <p className="text-sm text-destructive">{errors.subModule.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" variant="gradient" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating PDN..." : "Save PDN"}
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