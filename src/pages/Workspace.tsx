import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";

type SortField = "id" | "description" | "status" | "createdBy" | "assignedTo" | "dateCreated" | "gitRepo";
type SortDirection = "asc" | "desc";

interface PDN {
  id: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdBy: string;
  assignedTo: string;
  dateCreated: string;
  gitRepo: string;
}

const mockPDNs: PDN[] = [
  {
    id: "PDN-001",
    description: "Login authentication issue with OAuth integration",
    status: "Open",
    createdBy: "John Doe",
    assignedTo: "Jane Smith",
    dateCreated: "2024-01-15",
    gitRepo: "frontend-app"
  },
  {
    id: "PDN-002", 
    description: "Database connection timeout in production",
    status: "In Progress",
    createdBy: "Alice Johnson",
    assignedTo: "Bob Wilson",
    dateCreated: "2024-01-14",
    gitRepo: "backend-services"
  },
  {
    id: "PDN-003",
    description: "UI layout breaks on mobile devices",
    status: "Resolved",
    createdBy: "Mike Chen",
    assignedTo: "Sarah Davis",
    dateCreated: "2024-01-13",
    gitRepo: "mobile-client"
  },
  {
    id: "PDN-004",
    description: "Performance degradation in data processing pipeline",
    status: "Closed",
    createdBy: "Tom Anderson",
    assignedTo: "Lisa Wang",
    dateCreated: "2024-01-12",
    gitRepo: "data-pipeline"
  },
  {
    id: "PDN-005",
    description: "Email notifications not being sent",
    status: "Open",
    createdBy: "Emma Brown",
    assignedTo: "David Lee",
    dateCreated: "2024-01-11",
    gitRepo: "notification-service"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Open":
      return "destructive";
    case "In Progress":
      return "default";
    case "Resolved":
      return "secondary";
    case "Closed":
      return "outline";
    default:
      return "default";
  }
};

export default function Workspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedPDNs = useMemo(() => {
    let filtered = mockPDNs.filter(pdn => 
      pdn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.gitRepo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === "dateCreated") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [searchTerm, sortField, sortDirection]);

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Workspace</h1>
        <p className="text-muted-foreground">View and manage all PDNs in your workspace</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary" />
          <Input
            placeholder="Search PDNs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="border rounded-lg shadow-colorful overflow-hidden bg-gradient-card backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="id">PDN ID</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="description">Description</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="status">Status</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="createdBy">Created By</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="assignedTo">Assigned To</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="dateCreated">Date Created</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="gitRepo">Git Repo</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPDNs.map((pdn) => (
              <TableRow key={pdn.id}>
                <TableCell>
                  <Link 
                    to={`/pdn/${pdn.id}`}
                    className="font-medium text-primary hover:text-primary-glow hover:underline transition-colors"
                  >
                    {pdn.id}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={pdn.description}>
                    {pdn.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(pdn.status)}>
                    {pdn.status}
                  </Badge>
                </TableCell>
                <TableCell>{pdn.createdBy}</TableCell>
                <TableCell>{pdn.assignedTo}</TableCell>
                <TableCell>{pdn.dateCreated}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pdn.gitRepo}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedPDNs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No PDNs found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}