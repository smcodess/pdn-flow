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

type SortField = "id" | "description" | "status" | "assignedTo" | "dateCreated" | "lastUpdated";
type SortDirection = "asc" | "desc";

interface MyPDN {
  id: string;
  description: string;
  status: "Draft" | "Submitted" | "In Review" | "Approved" | "Rejected" | "Closed";
  assignedTo: string;
  dateCreated: string;
  lastUpdated: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}

const mockMyPDNs: MyPDN[] = [
  {
    id: "PDN-006",
    description: "Implement two-factor authentication for user accounts",
    status: "Submitted",
    assignedTo: "Security Team",
    dateCreated: "2024-01-16",
    lastUpdated: "2024-01-17",
    priority: "High"
  },
  {
    id: "PDN-007",
    description: "Optimize database queries for better performance",
    status: "In Review", 
    assignedTo: "DB Team",
    dateCreated: "2024-01-15",
    lastUpdated: "2024-01-16",
    priority: "Medium"
  },
  {
    id: "PDN-008",
    description: "Add export functionality to reports dashboard",
    status: "Approved",
    assignedTo: "Frontend Team",
    dateCreated: "2024-01-14",
    lastUpdated: "2024-01-15",
    priority: "Low"
  },
  {
    id: "PDN-009",
    description: "Fix memory leak in background processing service",
    status: "Draft",
    assignedTo: "Not Assigned",
    dateCreated: "2024-01-13",
    lastUpdated: "2024-01-13",
    priority: "Critical"
  },
  {
    id: "PDN-010",
    description: "Update API documentation for new endpoints",
    status: "Rejected",
    assignedTo: "Documentation Team", 
    dateCreated: "2024-01-12",
    lastUpdated: "2024-01-14",
    priority: "Low"
  }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Draft":
      return "secondary";
    case "Submitted":
      return "default";
    case "In Review":
      return "outline";
    case "Approved": 
      return "secondary";
    case "Rejected":
      return "destructive";
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

export default function MyPDN() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
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
    let filtered = mockMyPDNs.filter(pdn => 
      pdn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdn.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === "dateCreated" || sortField === "lastUpdated") {
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
        <h1 className="text-3xl font-bold">My PDNs</h1>
        <p className="text-muted-foreground">Manage and track all PDNs you have created</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your PDNs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button asChild>
          <Link to="/new-pdn">Create New PDN</Link>
        </Button>
      </div>

      <div className="border rounded-lg">
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
              <TableHead>Priority</TableHead>
              <TableHead>
                <SortButton field="assignedTo">Assigned To</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="dateCreated">Created</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="lastUpdated">Last Updated</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPDNs.map((pdn) => (
              <TableRow key={pdn.id}>
                <TableCell>
                  <Link 
                    to={`/pdn/${pdn.id}`}
                    className="font-medium text-primary hover:underline"
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
                <TableCell>
                  <Badge variant={getPriorityVariant(pdn.priority)}>
                    {pdn.priority}
                  </Badge>
                </TableCell>
                <TableCell>{pdn.assignedTo}</TableCell>
                <TableCell>{pdn.dateCreated}</TableCell>
                <TableCell>{pdn.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedPDNs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No PDNs found matching your search criteria.</p>
          <Button asChild className="mt-4">
            <Link to="/new-pdn">Create Your First PDN</Link>
          </Button>
        </div>
      )}
    </div>
  );
}