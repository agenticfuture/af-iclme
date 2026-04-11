import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * A basic user management page. In a real implementation this would be powered
 * by your backend and allow inviting, removing and updating user roles.
 */
export default function UsersPage() {
  // Dummy data; replace with data from your API
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "Member" },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="#">
          <Button>
            Invite user
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}