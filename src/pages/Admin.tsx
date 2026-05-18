import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, Search, MessageSquare, Zap, Activity, TrendingUp, Clock, UserCheck } from 'lucide-react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';

const data = [
  { name: 'Mon', users: 400, searches: 240, chats: 240 },
  { name: 'Tue', users: 300, searches: 139, chats: 221 },
  { name: 'Wed', users: 200, searches: 980, chats: 229 },
  { name: 'Thu', users: 278, searches: 390, chats: 200 },
  { name: 'Fri', users: 189, searches: 480, chats: 218 },
  { name: 'Sat', users: 239, searches: 380, chats: 250 },
  { name: 'Sun', users: 349, searches: 430, chats: 210 },
];

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1420,
    dailyVisitors: 156,
    activeUsers: 89,
    medicineSearches: 4210,
    aiUsage: 892
  });

  if (user?.email !== 'anantjeet.bly@gmail.com') {
    return <div className="p-20 text-center font-bold">Access Denied</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-display font-bold text-medical-navy mb-1">Founder Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, Anant Singh. INDUS performance at a glance.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center space-x-2 shadow-sm">
            <Clock className="w-4 h-4 text-medical-blue" />
            <span className="text-sm font-bold text-medical-navy">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Daily Visitors", value: stats.dailyVisitors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Med Searches", value: stats.medicineSearches, icon: Search, color: "text-cyan-600", bg: "bg-cyan-50" },
            { label: "AI Usage", value: stats.aiUsage, icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-5 h-5", s.color)} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-medical-navy mb-1">{s.value.toLocaleString()}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-medical-navy mb-8 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-medical-blue" />
              <span>User Growth</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-medical-navy mb-8 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-medical-cyan" />
              <span>System Activity</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#00D1FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="chats" fill="#0A192F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Popular Medicines */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-medical-navy mb-8">Popular Medical Searches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Paracetamol", count: "1,240", growth: "+12%" },
              { name: "Amoxicillin", count: "892", growth: "+5%" },
              { name: "Metformin", count: "756", growth: "+8%" },
              { name: "Ondansetron", count: "612", growth: "+15%" },
              { name: "Sertraline", count: "543", growth: "+2%" },
              { name: "Lisinopril", count: "432", growth: "-1%" },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                <div>
                  <div className="font-bold text-medical-navy">{m.name}</div>
                  <div className="text-xs text-gray-400 font-medium">{m.count} lookups</div>
                </div>
                <div className={cn("text-xs font-bold px-2 py-1 rounded-lg", m.growth.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  {m.growth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
