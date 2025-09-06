import { useState, useMemo, useEffect } from "react";
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
import { sendApiRequest } from "@/lib/utils";
import { ClimbingBoxLoader } from "react-spinners";

type SortField =
  | "pdnId"
  | "description"
  | "currentStatus"
  | "currentOwnerFirstName"
  | "createdDate"
  | "workspace"
  | "updatedDate";
type SortDirection = "asc" | "desc";

interface MyPDNProps {
  user: {
    empId: number;
    firstName: string;
    role: string;
    token?: string;
    lastName: string;
  } | null;
}

interface MyPDN {
  pdnId: string;
  description: string;
  currentStatus: string;
  createdByFirstName: string;
  currentOwnerFirstName: string;
  createdDate: string;
  workspace: string;
  priority?: string;
  updatedDate?: string;
}

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

export default function MyPDN({ user }: MyPDNProps) {
  console.log(user);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("updatedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [myPDNs, setMyPDNs] = useState<MyPDN[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserPDNs = async () => {
      if (!user?.empId) return;

      try {
        setIsLoading(true);

        const response = await sendApiRequest(
          `http://localhost:8080/api/pdn/all/createdBy/${user.empId}`,
          null,
          { method: "GET" }
        );

        // const response = {
        //   data: [{
        //     pdnId: "IM345",
        //     description: "Something",
        //     currentStatus: "Raised",
        //     createdByFirstName: "Satwik",
        //     currentOwnerFirstName: "Satwik",
        //     createdDate: "06/09/2025",
        //     workspace: "IM"
        //   }]
        // }

        console.log(response.data);

        if (response.data && response.data.length > 0) {
          setMyPDNs(response.data);
        } else {
          setMyPDNs([]);
        }
      } catch (error) {
        console.error("Failed to fetch PDNs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPDNs();
  }, [user?.empId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedPDNs = useMemo(() => {
    let filtered = myPDNs.filter(
      (pdn) =>
        pdn.pdnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.currentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.currentOwnerFirstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "pdnId":
          aValue = a.pdnId;
          bValue = b.pdnId;
          break;
        case "currentStatus":
          aValue = a.currentStatus;
          bValue = b.currentStatus;
          break;
        case "currentOwnerFirstName":
          aValue = a.currentOwnerFirstName;
          bValue = b.currentOwnerFirstName;
          break;
        case "createdDate":
          aValue = new Date(a.createdDate).getTime();
          bValue = new Date(b.createdDate).getTime();
          break;
        case "updatedDate":
          aValue = a.updatedDate ? new Date(a.updatedDate).getTime() : 0;
          bValue = b.updatedDate ? new Date(b.updatedDate).getTime() : 0;
          break;
        default:
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [searchTerm, sortField, sortDirection, myPDNs]);

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
        <h1 className="text-3xl font-bold">My PDNs</h1>
        <p className="text-muted-foreground">
          Manage and track all PDNs you have created
        </p>
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
        <Button asChild variant="gradient">
          <Link to="/app/new-pdn">Create New PDN</Link>
        </Button>
      </div>

      <div className="border rounded-lg shadow-colorful overflow-hidden bg-gradient-card backdrop-blur-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <ClimbingBoxLoader color="#3B82F6" size={15} />
          </div>
        ) : (
          <>
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
                  <TableHead>Priority</TableHead>
                  <TableHead>
                    <SortButton field="currentOwnerFirstName">
                      Assigned To
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="createdDate">Created</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="updatedDate">Last Updated</SortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPDNs.map((pdn) => (
                  <TableRow key={pdn.pdnId}>
                    <TableCell>
                      <Link
                        to={`/app/pdn/${pdn.pdnId}`}
                        className="font-medium text-primary hover:underline"
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
                    <TableCell>
                      {pdn.priority ? (
                        <Badge variant={getPriorityVariant(pdn.priority)}>
                          {pdn.priority}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{pdn.currentOwnerFirstName}</TableCell>
                    <TableCell>{pdn.createdDate}</TableCell>
                    <TableCell>{pdn.updatedDate || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedPDNs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No PDNs found matching your search criteria.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/new-pdn">Create Your First PDN</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
