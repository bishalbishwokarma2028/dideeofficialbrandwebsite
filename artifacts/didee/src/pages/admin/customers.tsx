import { useListCustomers } from "@workspace/api-client-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminCustomers() {
  const { data: customersData, isLoading } = useListCustomers({ limit: 50 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Customers</h1>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9 rounded-none border-border" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-bg text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customersData?.customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-bg/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-muted-foreground">{customer.email}</div>
                      {customer.phone && <div className="text-xs text-muted-foreground mt-1">{customer.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {customer.orderCount || 0}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      NPR {(customer.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!customersData?.customers || customersData.customers.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
