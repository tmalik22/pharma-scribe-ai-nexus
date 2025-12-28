import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const PaperSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allEntities, setAllEntities] = useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchPapers();
    fetchEntities();
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [currentPage, selectedEntities, minYear, maxYear]);

  const fetchEntities = async () => {
    const { data } = await supabase.rpc('get_entity_stats');
    const topTags = (data || []).slice(0, 30).map((e: any) => e.entity);
    setAllEntities(topTags);
  };

  const fetchPapers = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from('papers')
        .select('*', { count: 'exact' });

      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (minYear) {
        query = query.gte('pub_year', minYear);
      }

      if (maxYear) {
        query = query.lte('pub_year', maxYear);
      }

      if (selectedEntities.length > 0) {
        // Filter papers that have ANY of the selected entities
        selectedEntities.forEach(entity => {
          query = query.contains('entities', [entity]);
        });
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (error) throw error;
      setPapers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPapers();
  };

  const toggleEntity = (entity: string) => {
    setSelectedEntities(prev =>
      prev.includes(entity)
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 bg-gray-50 h-full overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Research Paper Search</h2>
          <p className="text-gray-600">Search and filter through {totalCount.toLocaleString()} research papers</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by title..."
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Search size={20} className="mr-2" />}
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              {/* Year Range Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Year Range (1990-2023)</label>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    min={1990}
                    max={2023}
                    value={minYear || ''}
                    onChange={(e) => {
                      setMinYear(e.target.value ? parseInt(e.target.value) : null);
                      setCurrentPage(1);
                    }}
                    className="w-32"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    min={1990}
                    max={2023}
                    value={maxYear || ''}
                    onChange={(e) => {
                      setMaxYear(e.target.value ? parseInt(e.target.value) : null);
                      setCurrentPage(1);
                    }}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Entity Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Topic</label>
                <div className="flex flex-wrap gap-2">
                  {allEntities.map(entity => (
                    <Badge
                      key={entity}
                      variant={selectedEntities.includes(entity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEntity(entity)}
                    >
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{totalCount} Results</h3>
          {selectedEntities.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEntities([])}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map(paper => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <CardTitle className="text-xl mb-3 hover:text-blue-600 cursor-pointer leading-tight">
                        {paper.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {paper.pub_year && (
                          <Badge variant="secondary">
                            <Calendar size={14} className="mr-1" />
                            {paper.pub_year}
                          </Badge>
                        )}
                        {paper.entities && paper.entities.slice(0, 5).map((entity: string) => (
                          <Badge key={entity} variant="outline" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {paper.summary || paper.findings || "No summary available"}
                  </p>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline">
                      <FileText size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperSearch;
