import React, { useState, useEffect } from 'react';
import { Database, FileText, Tag, Calendar, TrendingUp, Loader2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DatabaseBrowser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPapers: 0,
    yearSpan: '',
    topDecade: '',
    mostCommonEntity: ''
  });
  const [recentPapers, setRecentPapers] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [topEntities, setTopEntities] = useState<any[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  const decades = ['1990s', '2000s', '2010s', '2020s'];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDecade]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get Total Papers
      const { count: totalPapers } = await supabase
        .from('papers')
        .select('*', { count: 'exact', head: true });

      // Get year statistics
      const { data: yearStats } = await supabase
        .from('papers')
        .select('pub_year')
        .not('pub_year', 'is', null);

      const yearCounts = yearStats?.reduce((acc: any, paper: any) => {
        acc[paper.pub_year] = (acc[paper.pub_year] || 0) + 1;
        return acc;
      }, {});

      const yearlyChartData = Object.entries(yearCounts || {})
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year);

      setYearlyData(yearlyChartData);

      const minYear = Math.min(...Object.keys(yearCounts || {}).map(Number));
      const maxYear = Math.max(...Object.keys(yearCounts || {}).map(Number));

      // Get decade data
      const { data: decades } = await supabase.rpc('get_papers_by_decade');
      const topDecade = decades?.sort((a: any, b: any) => b.paper_count - a.paper_count)[0];

      // Get top entities
      const { data: entities } = await supabase.rpc('get_entity_stats');
      setTopEntities((entities || []).slice(0, 30));

      // Get Recent Papers (with decade filter if selected)
      let query = supabase
        .from('papers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (selectedDecade) {
        const decadeStart = parseInt(selectedDecade.slice(0, 4));
        const decadeEnd = decadeStart + 9;
        query = query.gte('pub_year', decadeStart).lte('pub_year', decadeEnd);
      }

      const { data: papers } = await query;
      setRecentPapers(papers || []);

      setStats({
        totalPapers: totalPapers || 0,
        yearSpan: `${minYear}-${maxYear}`,
        topDecade: topDecade?.decade || 'N/A',
        mostCommonEntity: entities?.[0]?.entity || 'N/A'
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading database statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-full overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Database Overview</h2>
          <p className="text-gray-600">Browse and analyze your pharmaceutical research database</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Papers</p>
                  <p className="text-4xl font-bold">{stats.totalPapers.toLocaleString()}</p>
                </div>
                <FileText className="opacity-80" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Year Span</p>
                  <p className="text-3xl font-bold">{stats.yearSpan}</p>
                </div>
                <Calendar className="opacity-80" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Top Decade</p>
                  <p className="text-3xl font-bold">{stats.topDecade}</p>
                </div>
                <TrendingUp className="opacity-80" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Top Topic</p>
                  <p className="text-xl font-bold truncate">{stats.mostCommonEntity}</p>
                </div>
                <Tag className="opacity-80" size={40} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Publications Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Publications Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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

        {/* Decade Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Filter by Decade:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedDecade === null ? "default" : "outline"}
                onClick={() => setSelectedDecade(null)}
                size="sm"
              >
                All
              </Button>
              {decades.map(decade => (
                <Button
                  key={decade}
                  variant={selectedDecade === decade ? "default" : "outline"}
                  onClick={() => setSelectedDecade(decade)}
                  size="sm"
                >
                  {decade}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Papers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText size={20} />
                <span>{selectedDecade ? `Papers from ${selectedDecade}` : 'Recently Added Papers'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPapers.map(paper => (
                  <div key={paper.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {paper.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      {paper.pub_year && (
                        <Badge variant="secondary">{paper.pub_year}</Badge>
                      )}
                    </div>
                    {paper.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2">{paper.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Research Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag size={20} />
                <span>Top Research Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topEntities.map((entity, index) => {
                  const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
                  const sizeClass = sizes[Math.min(Math.floor(index / 6), sizes.length - 1)];
                  return (
                    <Badge
                      key={entity.entity}
                      variant="outline"
                      className={`${sizeClass} px-3 py-1 hover:bg-blue-50 cursor-pointer transition-colors`}
                    >
                      {entity.entity}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
