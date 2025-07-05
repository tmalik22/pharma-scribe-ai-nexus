
import React, { useState } from 'react';
import { Database, FileText, Tag, Calendar, TrendingUp, Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DatabaseBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Demo statistics
  const stats = {
    totalPapers: 1247,
    totalAuthors: 3421,
    totalTags: 156,
    newThisMonth: 89
  };

  // Demo recent papers
  const recentPapers = [
    {
      id: '1',
      title: 'Breakthrough in Alzheimer\'s Treatment: Novel Therapeutic Approach',
      date: '2024-01-20',
      tags: ['Neurology', 'Alzheimer\'s', 'Clinical Trial'],
      authors: 3,
      citations: 12
    },
    {
      id: '2',
      title: 'CRISPR-Cas9 Applications in Genetic Disease Treatment',
      date: '2024-01-18',
      tags: ['Gene Therapy', 'CRISPR', 'Genetic Disorders'],
      authors: 5,
      citations: 28
    },
    {
      id: '3',
      title: 'Immunotherapy Advances in Cancer Treatment',
      date: '2024-01-15',
      tags: ['Oncology', 'Immunotherapy', 'Cancer Research'],
      authors: 4,
      citations: 45
    }
  ];

  // Demo trending topics
  const trendingTopics = [
    { tag: 'mRNA Vaccines', count: 234, trend: '+15%' },
    { tag: 'AI Drug Discovery', count: 189, trend: '+28%' },
    { tag: 'Personalized Medicine', count: 156, trend: '+12%' },
    { tag: 'CRISPR Gene Editing', count: 142, trend: '+22%' },
    { tag: 'Immunotherapy', count: 128, trend: '+8%' }
  ];

  return (
    <div className="p-6 bg-gray-50 h-full overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Overview</h2>
          <p className="text-gray-600">Browse and analyze your pharmaceutical research database</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Papers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPapers.toLocaleString()}</p>
                </div>
                <FileText className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Authors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAuthors.toLocaleString()}</p>
                </div>
                <Users className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Tags</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTags}</p>
                </div>
                <Tag className="text-purple-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                </div>
                <TrendingUp className="text-orange-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Papers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText size={20} />
                <span>Recently Added Papers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPapers.map(paper => (
                  <div key={paper.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {paper.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(paper.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Users size={14} className="mr-1" />
                      <span>{paper.authors} authors</span>
                      <span className="mx-2">•</span>
                      <span>{paper.citations} citations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>Trending Research Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{topic.tag}</p>
                        <p className="text-sm text-gray-500">{topic.count} papers</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {topic.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Search */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Database Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search papers, authors, or topics..."
                  className="pl-10"
                />
              </div>
              <Button>Search Database</Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Search across {stats.totalPapers.toLocaleString()} research papers using AI-powered semantic search
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
