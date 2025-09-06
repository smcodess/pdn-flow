import { useState, useMemo, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import { sendApiRequest } from "@/lib/utils";
import { ClimbingBoxLoader } from "react-spinners";

type SortField =
  | "pdnId"
  | "description"
  | "currentStatus"
  | "createdByFirstName"
  | "currentOwnerFirstName"
  | "createdDate"
  | "workspace";
type SortDirection = "asc" | "desc";

interface PDN {
  pdnId: string;
  description: string;
  currentStatus: "Open" | "In Progress" | "Resolved" | "Closed";
  createdByFirstName: string;
  currentOwnerFirstName: string;
  createdDate: string;
  workspace: string;
}

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
  const [sortField, setSortField] = useState<SortField>("createdDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [PDNList, setPDNList] = useState<PDN[]>([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  const BearerToken = localStorage.getItem("token");

  console.log(BearerToken);
  useEffect(() => {

    const loadFiles = async () => {
      try {
        setLoading(true);
        const response = await sendApiRequest(
          "http://localhost:8080/api/pdn/all",
          {},
          {
            method: "GET",
          }
        );
        const data = response.data;
        
        if (response.status == 401) {
          Navigate("/signup");
        }

        setPDNList(data);
        console.log(data);
      } catch (err) {
        console.log(
          err instanceof Error ? err.message : "Failed to fetch files"
        );
        setPDNList([]);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedPDNs = useMemo(() => {
    if (!Array.isArray(PDNList)) {
      return [];
    }

    let filtered = PDNList.filter(
      (pdn) =>
        pdn.pdnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.currentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.createdByFirstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pdn.currentOwnerFirstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pdn.workspace.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdDate") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [PDNList, searchTerm, sortField, sortDirection]);

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
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
        <p className="text-muted-foreground">
          View and manage all PDNs in your workspace
        </p>
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <ClimbingBoxLoader color="#3B82F6" size={15} />
          </div>
        ) : (
          <div className="border rounded-lg shadow-colorful overflow-hidden bg-gradient-card backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="pdnId">PDN ID</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="description">Description</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="currentStatus">Status</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="createdByFirstName">
                      Created By
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="currentOwnerFirstName">
                      Assigned To
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="createdDate">Date Created</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="workspace">Git Repo</SortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPDNs.map((pdn) => (
                  <TableRow key={pdn.pdnId}>
                    <TableCell>
                      <Link
                        to={`/app/pdn/${pdn.pdnId}`}
                        className="font-medium text-primary hover:text-primary-glow hover:underline transition-colors"
                      >
                        {pdn.pdnId}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={pdn.description}>
                        {pdn.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(pdn.currentStatus)}>
                        {pdn.currentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{pdn.createdByFirstName}</TableCell>
                    <TableCell>{pdn.currentOwnerFirstName}</TableCell>
                    <TableCell>{pdn.createdDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pdn.workspace}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {filteredAndSortedPDNs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No PDNs found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
