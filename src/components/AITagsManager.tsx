import React, { useState, useEffect } from 'react';
import { Tag, Search, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const AITagsManager = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [allTags, setAllTags] = useState<any[]>([]);
    const [filteredTags, setFilteredTags] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tagPapers, setTagPapers] = useState<any[]>([]);

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredTags(
                allTags.filter(tag =>
                    tag.entity.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredTags(allTags);
        }
    }, [searchTerm, allTags]);

    const fetchTags = async () => {
        try {
            setIsLoading(true);
            const { data } = await supabase.rpc('get_entity_stats');
            setAllTags(data || []);
            setFilteredTags(data || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagClick = async (tagName: string) => {
        setSelectedTag(tagName);

        // Fetch papers with this tag
        const { data } = await supabase
            .from('papers')
            .select('id, title, pub_year, entities')
            .contains('entities', [tagName])
            .limit(10);

        setTagPapers(data || []);
    };

    const getTagSize = (count: number, maxCount: number) => {
        const ratio = count / maxCount;
        if (ratio > 0.7) return 'text-3xl';
        if (ratio > 0.4) return 'text-2xl';
        if (ratio > 0.2) return 'text-xl';
        return 'text-base';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-500">Loading tags...</p>
                </div>
            </div>
        );
    }

    const maxCount = allTags[0]?.paper_count || 1;

    return (
        <div className="p-6 bg-gray-50 h-full overflow-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Tags Manager</h2>
                    <p className="text-gray-600">Explore and analyze research topics across your database</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Unique Tags</p>
                                    <p className="text-4xl font-bold">{allTags.length}</p>
                                </div>
                                <Tag size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Most Popular Tag</p>
                                    <p className="text-xl font-bold truncate">{allTags[0]?.entity || 'N/A'}</p>
                                    <p className="text-purple-100 text-sm">{allTags[0]?.paper_count || 0} papers</p>
                                </div>
                                <TrendingUp size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Avg Papers per Tag</p>
                                    <p className="text-4xl font-bold">
                                        {Math.round(allTags.reduce((sum, tag) => sum + tag.paper_count, 0) / allTags.length)}
                                    </p>
                                </div>
                                <Tag size={40} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tag Explorer */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tag Cloud</CardTitle>
                                <div className="relative mt-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search tags..."
                                        className="pl-10"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="min-h-[400px]">
                                <div className="flex flex-wrap gap-4 justify-center items-center p-4">
                                    {filteredTags.slice(0, 100).map((tag) => (
                                        <Badge
                                            key={tag.entity}
                                            variant={selectedTag === tag.entity ? "default" : "outline"}
                                            className={`cursor-pointer transition-all hover:scale-110 ${getTagSize(tag.paper_count, maxCount)} px-4 py-2`}
                                            onClick={() => handleTagClick(tag.entity)}
                                        >
                                            {tag.entity} ({tag.paper_count})
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tag Details */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tag Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedTag ? (
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">{selectedTag}</h3>
                                        <p className="text-gray-600 mb-4">
                                            {allTags.find(t => t.entity === selectedTag)?.paper_count || 0} papers
                                        </p>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm text-gray-700">Papers with this tag:</h4>
                                            {tagPapers.map(paper => (
                                                <div key={paper.id} className="border-l-4 border-blue-500 pl-3 py-2">
                                                    <p className="font-medium text-sm">{paper.title}</p>
                                                    {paper.pub_year && (
                                                        <p className="text-xs text-gray-500">Year: {paper.pub_year}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <Tag size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Click on a tag to see details</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Tags List */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Top 10 Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {allTags.slice(0, 10).map((tag, index) => (
                                        <div key={tag.entity} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                            onClick={() => handleTagClick(tag.entity)}>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium truncate max-w-[200px]">{tag.entity}</span>
                                            </div>
                                            <Badge variant="secondary">{tag.paper_count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITagsManager;
