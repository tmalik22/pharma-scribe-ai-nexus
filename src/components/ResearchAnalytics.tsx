import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Tag, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

const ResearchAnalytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>({});
    const [yearlyData, setYearlyData] = useState<any[]>([]);
    const [decadeData, setDecadeData] = useState<any[]>([]);
    const [topEntities, setTopEntities] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);

            // Get overall stats
            const { count: totalPapers } = await supabase
                .from('papers')
                .select('*', { count: 'exact', head: true });

            // Get year range
            const { data: yearData } = await supabase.rpc('execute_sql', {
                query: `SELECT MIN(pub_year) as min_year, MAX(pub_year) as max_year FROM papers WHERE pub_year IS NOT NULL`
            });

            // Get papers by year
            const { data: yearly } = await supabase
                .from('papers')
                .select('pub_year')
                .not('pub_year', 'is', null);

            const yearCounts = yearly?.reduce((acc: any, paper: any) => {
                acc[paper.pub_year] = (acc[paper.pub_year] || 0) + 1;
                return acc;
            }, {});

            const yearlyChartData = Object.entries(yearCounts || {})
                .map(([year, count]) => ({ year: parseInt(year), count }))
                .sort((a, b) => a.year - b.year);

            setYearlyData(yearlyChartData);

            // Get decade data
            const { data: decades } = await supabase.rpc('get_papers_by_decade');
            setDecadeData(decades || []);

            // Get top entities
            const { data: entities } = await supabase.rpc('get_entity_stats');
            setTopEntities((entities || []).slice(0, 20));

            setStats({
                totalPapers: totalPapers || 0,
                yearRange: yearData?.[0] ? `${yearData[0].min_year}-${yearData[0].max_year}` : 'N/A'
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 h-full overflow-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Research Analytics</h2>
                    <p className="text-gray-600">Comprehensive insights into your research database</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Papers</p>
                                    <p className="text-3xl font-bold">{stats.totalPapers?.toLocaleString()}</p>
                                </div>
                                <BarChart3 size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Year Range</p>
                                    <p className="text-2xl font-bold">{stats.yearRange}</p>
                                </div>
                                <Calendar size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Unique Tags</p>
                                    <p className="text-3xl font-bold">{topEntities.length}</p>
                                </div>
                                <Tag size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Avg per Year</p>
                                    <p className="text-3xl font-bold">
                                        {yearlyData.length > 0 ? Math.round(stats.totalPapers / yearlyData.length) : 0}
                                    </p>
                                </div>
                                <TrendingUp size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Publications Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publications Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Publications by Decade */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publications by Decade</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={decadeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="decade" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="paper_count" fill="#8B5CF6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Research Topics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top 20 Research Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={topEntities} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="entity" type="category" width={200} />
                                <Tooltip />
                                <Bar dataKey="paper_count" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResearchAnalytics;
