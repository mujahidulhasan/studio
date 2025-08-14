
'use client';

import type { Record } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SearchResultsProps {
    results: Record[];
}

export default function SearchResults({ results }: SearchResultsProps) {
    if (results.length === 0) {
        return (
            <Alert>
                <AlertTitle>No Results Found</AlertTitle>
                <AlertDescription>
                    We couldn't find any records matching your search criteria. Please try again with different terms.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Phone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={record.avatarUrl} alt={record.studentName}/>
                                        <AvatarFallback>
                                            <User/>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{record.studentName}</div>
                                        <div className="text-sm text-muted-foreground">{record.registration}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{record.id}</TableCell>
                            <TableCell>{record.roll}</TableCell>
                            <TableCell>{record.shift}</TableCell>
                            <TableCell>{record.phone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
