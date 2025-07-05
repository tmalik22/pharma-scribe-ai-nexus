
import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  tags: string[];
  publishDate: string;
  journal: string;
  citationCount: number;
}

const PaperSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Demo data
  const papers: Paper[] = [
    {
      id: '1',
      title: 'Novel Drug Delivery Systems for Cancer Therapeutics: A Comprehensive Review',
      authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
      abstract: 'This comprehensive review examines recent advances in drug delivery systems for cancer therapeutics, focusing on nanoparticle-based approaches and their clinical applications...',
      tags: ['Oncology', 'Drug Delivery', 'Nanotechnology', 'Clinical Trials'],
      publishDate: '2024-01-15',
      journal: 'Journal of Pharmaceutical Sciences',
      citationCount: 47
    },
    {
      id: '2',
      title: 'Machine Learning Applications in Drug Discovery: Current State and Future Prospects',
      authors: ['Dr. Robert Kim', 'Dr. Lisa Wang'],
      abstract: 'Machine learning has revolutionized pharmaceutical research by accelerating drug discovery processes. This paper explores current applications and future opportunities...',
      tags: ['AI/ML', 'Drug Discovery', 'Computational Biology', 'Bioinformatics'],
      publishDate: '2024-02-03',
      journal: 'Nature Drug Discovery',
      citationCount: 89
    }
  ];

  const allTags = Array.from(new Set(papers.flatMap(paper => paper.tags)));

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Paper Search</h2>
          <p className="text-gray-600">Search through thousands of pharmaceutical research papers</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers by title, author, or keywords..."
                className="pl-10"
              />
            </div>
            <Button>
              <Filter size={20} className="mr-2" />
              Advanced Filter
            </Button>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Search Results ({papers.length})</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar size={16} className="mr-2" />
                Sort by Date
              </Button>
              <Button variant="outline" size="sm">
                Sort by Relevance
              </Button>
            </div>
          </div>

          {papers.map(paper => (
            <Card key={paper.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 hover:text-blue-600 cursor-pointer">
                      {paper.title}
                    </CardTitle>
                    <div className="text-sm text-gray-600 mb-2">
                      {paper.authors.join(', ')} • {paper.journal} • {paper.publishDate}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {paper.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FileText size={16} />
                      <span>Citations: {paper.citationCount}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{paper.abstract}</p>
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline">
                    <FileText size={16} className="mr-2" />
                    View Full Paper
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Tag size={16} className="mr-2" />
                    AI Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperSearch;
