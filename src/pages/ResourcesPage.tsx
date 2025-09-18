import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Folder, 
  Download, 
  Search, 
  Filter,
  BookOpen,
  Video,
  Image,
  FileImage,
  ExternalLink,
  Star,
  Eye,
  Upload,
  Plus
} from 'lucide-react';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  const resources = [
    {
      id: 1,
      title: 'Calculus Textbook - Chapter 8',
      description: 'Integration techniques and applications',
      type: 'pdf',
      course: 'Mathematics 101',
      instructor: 'Dr. Smith',
      size: '12.5 MB',
      downloads: 156,
      rating: 4.8,
      uploadDate: '2023-10-15',
      tags: ['textbook', 'calculus', 'integration']
    },
    {
      id: 2,
      title: 'Physics Lab Manual',
      description: 'Complete guide for physics experiments',
      type: 'pdf',
      course: 'Physics Fundamentals',
      instructor: 'Prof. Johnson',
      size: '8.3 MB',
      downloads: 89,
      rating: 4.6,
      uploadDate: '2023-10-12',
      tags: ['manual', 'lab', 'experiments']
    },
    {
      id: 3,
      title: 'Data Structures Lecture Videos',
      description: 'Video series covering arrays, linked lists, and trees',
      type: 'video',
      course: 'Computer Science',
      instructor: 'Dr. Wilson',
      size: '2.1 GB',
      downloads: 234,
      rating: 4.9,
      uploadDate: '2023-10-10',
      tags: ['video', 'data structures', 'algorithms']
    },
    {
      id: 4,
      title: 'Statistical Analysis Datasets',
      description: 'Sample datasets for practice problems',
      type: 'zip',
      course: 'Statistics',
      instructor: 'Prof. Davis',
      size: '45.2 MB',
      downloads: 67,
      rating: 4.5,
      uploadDate: '2023-10-08',
      tags: ['dataset', 'statistics', 'practice']
    },
    {
      id: 5,
      title: 'Mathematical Formulas Reference',
      description: 'Quick reference sheet for common formulas',
      type: 'image',
      course: 'Mathematics 101',
      instructor: 'Dr. Smith',
      size: '1.2 MB',
      downloads: 298,
      rating: 4.7,
      uploadDate: '2023-10-05',
      tags: ['reference', 'formulas', 'cheat sheet']
    },
    {
      id: 6,
      title: 'Online Calculator Tool',
      description: 'Web-based scientific calculator with graphing capabilities',
      type: 'link',
      course: 'Mathematics 101',
      instructor: 'Dr. Smith',
      size: 'N/A',
      downloads: 445,
      rating: 4.8,
      uploadDate: '2023-10-01',
      tags: ['calculator', 'tool', 'online']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'image': return FileImage;
      case 'zip': return Folder;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'destructive';
      case 'video': return 'default';
      case 'image': return 'secondary';
      case 'zip': return 'outline';
      case 'link': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && resource.type === activeTab;
  });

  const stats = {
    total: resources.length,
    pdf: resources.filter(r => r.type === 'pdf').length,
    video: resources.filter(r => r.type === 'video').length,
    other: resources.filter(r => !['pdf', 'video'].includes(r.type)).length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Access course materials, documents, and learning resources</p>
        </div>
        {user?.role === 'faculty' && (
          <div className="flex gap-2">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        )}
      </div>

      {/* Resource Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Available materials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pdf}</div>
            <p className="text-xs text-muted-foreground">PDF files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.video}</div>
            <p className="text-xs text-muted-foreground">Video content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search resources, courses, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="pdf">Documents</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              
              return (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <TypeIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription>{resource.course} • {resource.instructor}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={getTypeColor(resource.type)}>
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>

                    {/* Resource Details */}
                    <div className="flex justify-between text-sm">
                      <span>Size: {resource.size}</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.downloads} downloads
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                        <span className="text-sm text-muted-foreground">rating</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Added {new Date(resource.uploadDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {resource.type === 'link' ? (
                        <Button className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </Button>
                      ) : (
                        <Button className="flex-1">
                          {user?.role === 'faculty' ? (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No resources found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'No resources available in this category'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;