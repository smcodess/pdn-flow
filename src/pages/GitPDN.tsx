import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Filter, X } from "lucide-react";
import { sendApiRequest } from "@/lib/utils";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

type SortField =
  | "id"
  | "description"
  | "status"
  | "assignedTo"
  | "dateCreated"
  | "lastUpdated";
type SortDirection = "asc" | "desc";

interface FilterOptions {
  createdBy: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface GitPDN {
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
    case "RAISED":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    case "In Progress":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "Resolved":
      return "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30";
    case "Closed":
      return "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
  }
};

export default function GitPDN() {
  const { gitRepo } = useParams<{ gitRepo: string }>();
  const prefix = gitRepo.split("-")[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [gitPDNs, setGitPDNs] = useState<GitPDN[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    createdBy: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const filterRef = useRef<HTMLDivElement>(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchGitPDNs = async () => {
      if (!gitRepo) return;

      try {
        setIsLoading(true);
        setGitPDNs([]);

        let apiLink = "";
        if (prefix !== "All") {
          apiLink = `/workspace/${prefix}`;
        }

        // console.log("link", apiLink);

        const response = await sendApiRequest(
          `http://localhost:8080/api/pdn/all${apiLink}`,
          null,
          { method: "GET" }
        );
        if (response.status == 401) {
          Navigate("/signup");
        }
        if (
          response &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setGitPDNs(response.data);
        } else {
          setGitPDNs([]);
        }
      } catch (error) {
        console.error("Failed to fetch Git PDNs:", error);
        setGitPDNs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitPDNs();
  }, [gitRepo, prefix]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const uniqueCreators = useMemo(() => {
    const creators = gitPDNs.map((pdn) => pdn.createdByFirstName);
    return [...new Set(creators)].sort();
  }, [gitPDNs]);

  const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

  const filteredAndSortedPDNs = useMemo(() => {
    let filtered = gitPDNs.filter((pdn) => {
      const matchesSearch =
        pdn.pdnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.currentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdn.currentOwnerFirstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCreator =
        !filters.createdBy || pdn.createdByFirstName === filters.createdBy;

      const matchesStatus =
        !filters.status || pdn.currentStatus === filters.status;

      const pdnDate = new Date(pdn.createdDate);
      const matchesDateFrom =
        !filters.dateFrom || pdnDate >= new Date(filters.dateFrom);
      const matchesDateTo =
        !filters.dateTo || pdnDate <= new Date(filters.dateTo);

      return (
        matchesSearch &&
        matchesCreator &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "id":
          aValue = a.pdnId;
          bValue = b.pdnId;
          break;
        case "status":
          aValue = a.currentStatus;
          bValue = b.currentStatus;
          break;
        case "assignedTo":
          aValue = a.currentOwnerFirstName;
          bValue = b.currentOwnerFirstName;
          break;
        case "dateCreated":
          aValue = new Date(a.createdDate).getTime();
          bValue = new Date(b.createdDate).getTime();
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
  }, [searchTerm, sortField, sortDirection, gitPDNs, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      createdBy: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      {/* Search and Filter Bar */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative" ref={filterRef}>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search PDNs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                hasActiveFilters || showFilters
                  ? "text-blue-600 bg-blue-100/80 dark:bg-blue-900/50 shadow-sm"
                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-blue-900/30"
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/30 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Created By Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Created By
                    </label>
                    <select
                      value={filters.createdBy}
                      onChange={(e) =>
                        handleFilterChange("createdBy", e.target.value)
                      }
                      className="w-full p-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    >
                      <option value="">All creators</option>
                      {uniqueCreators.map((creator) => (
                        <option key={creator} value={creator}>
                          {creator}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full p-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    >
                      <option value="">All statuses</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        handleFilterChange("dateFrom", e.target.value)
                      }
                      className="w-full p-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        handleFilterChange("dateTo", e.target.value)
                      }
                      className="w-full p-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-600/50 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      {Object.values(filters).filter((v) => v).length} filter(s)
                      active
                    </span>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-lg transition-all"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <ClimbingBoxLoader color="#3B82F6" size={12} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-3">
            {filteredAndSortedPDNs.map((pdn) => (
              <div
                key={pdn.pdnId}
                className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border border-white/20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-center">
                  {/* PDN ID */}
                  <div className="lg:col-span-1">
                    <Link
                      to={`/app/pdn/${pdn.pdnId}`}
                      className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      {pdn.pdnId}
                    </Link>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-xs mb-1">
                      Description
                    </p>
                    <p
                      className="text-slate-600 dark:text-slate-400 text-sm line-clamp-1"
                      title={pdn.description}
                    >
                      {pdn.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-1">
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-xs mb-1">
                      Status
                    </p>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm border ${getStatusVariant(
                        pdn.currentStatus
                      )}`}
                    >
                      {pdn.currentStatus}
                    </span>
                  </div>

                  {/* People */}
                  <div className="lg:col-span-1">
                    <div className="space-y-1">
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                          Created by
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          {pdn.createdByFirstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                          Assigned to
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          {pdn.currentOwnerFirstName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="lg:col-span-1">
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-xs mb-1">
                      Created
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs">
                      {pdn.createdDate}
                    </p>
                    <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 h-0.5 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedPDNs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 max-w-sm mx-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  No PDNs found
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 rounded-lg text-sm"
                >
                  <Link to="/app/new-pdn">Create New PDN</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
