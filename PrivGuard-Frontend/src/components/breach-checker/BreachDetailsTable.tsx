// src/components/breach-checker/BreachDetailsTable.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, Shield, Search, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { BreachDetails } from "@/types/breach-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BreachDetailsTableProps {
    breaches: BreachDetails[];
}

export default function BreachDetailsTable({ breaches }: BreachDetailsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<keyof BreachDetails>("xposed_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    
    // Filter breaches based on search term
    const filteredBreaches = breaches.filter(breach => 
        breach.breach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breach.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort breaches based on selected field and direction
    const sortedBreaches = [...filteredBreaches].sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return sortDirection === "asc" 
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
            return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
        }
        return 0;
    });
    
    // Handle sorting when column header is clicked
    const handleSort = (field: keyof BreachDetails) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };
    
    const SortableHeader = ({ field, children }: { field: keyof BreachDetails, children: React.ReactNode }) => (
        <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (
                    <ArrowUpDown size={14} className="text-muted-foreground" />
                )}
            </div>
        </TableHead>
    );
    
    // Password risk badges with consistent enterprise styling
    const getPasswordRiskBadge = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "plaintext":
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="destructive">Plain Text</Badge>
                        <span className="text-xs text-destructive">High Risk</span>
                    </div>
                );
            case "easytocrack":
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="secondary">Easy To Crack</Badge>
                        <span className="text-xs text-muted-foreground">Medium Risk</span>
                    </div>
                );
            case "hardtocrack":
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline">Strong Hash</Badge>
                        <span className="text-xs text-muted-foreground">Low Risk</span>
                    </div>
                );
            case "unknown":
            default:
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="secondary">Unknown</Badge>
                        <span className="text-xs text-muted-foreground">Undetermined</span>
                    </div>
                );
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <CardTitle className="text-xl font-medium flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Comprehensive Breach Registry
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Detailed analysis of {breaches.length} identified security incidents
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search breaches..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full md:w-64"
                            />
                        </div>
    
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHeader field="breach">Organization</SortableHeader>
                                <SortableHeader field="xposed_date">Breach Date</SortableHeader>
                                <SortableHeader field="industry">Industry</SortableHeader>
                                <SortableHeader field="xposed_records">Records Exposed</SortableHeader>
                                <SortableHeader field="password_risk">Security Risk</SortableHeader>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedBreaches.length > 0 ? (
                                sortedBreaches.map((breach) => (
                                    <TableRow key={breach.breach}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {breach.logo ? (
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={breach.logo}
                                                            alt={breach.breach}
                                                            className="w-5 h-5 object-contain"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full"><Building size={12} /></div>`;
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                        <Building size={12} />
                                                    </div>
                                                )}
                                                <span>{breach.breach}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                {breach.xposed_date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{breach.industry}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{breach.xposed_records.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell>
                                            {getPasswordRiskBadge(breach.password_risk)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No matching breaches found</p>
                                            {searchTerm && (
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setSearchTerm("")}
                                                    className="mt-2"
                                                >
                                                    Clear search
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
                    <div>
                        {filteredBreaches.length} of {breaches.length} breaches
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}