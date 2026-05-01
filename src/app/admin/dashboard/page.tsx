import { createClient } from "@/utils/supabase/server";
import { Users, UtensilsCrossed, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = await createClient();

  const [{ count: leadsCount }, { count: itemsCount }] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("menu_items").select("*", { count: "exact", head: true }),
  ]);

  return {
    leads: leadsCount || 0,
    items: itemsCount || 0,
    estimatedRevenue: 0,
    views: 0,
  };
}

async function getRecentLeads() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const leads = await getRecentLeads();

  const statCards = [
    { label: "Total Leads", value: stats.leads, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Menu Items", value: stats.items, icon: UtensilsCrossed, color: "text-gold", bg: "bg-gold/10" },
    { label: "Est. Revenue", value: `₹${stats.estimatedRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Page Views", value: stats.views.toLocaleString(), icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your celebration business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-navy mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Recent Leads</h2>
          <Link href="/admin/leads" className="text-gold text-sm font-medium hover:text-gold-hover">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Event</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-charcoal">{lead.name}</td>
                    <td className="p-4 text-gray-600">{lead.phone}</td>
                    <td className="p-4 text-gray-600 capitalize">{lead.event_type}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : lead.status === "contacted"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "converted"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
