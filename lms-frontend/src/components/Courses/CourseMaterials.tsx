import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Video,
  FileText,
  Beaker,
  GraduationCap,
  Code,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { CourseTopic } from '../../types';

// Define a type for the active material based on the CourseTopic structure
interface ActiveMaterial {
  id: number;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSIGNMENT';
  url?: string;
  durationMinutes?: number;
}

const CourseMaterials = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const rawCourseId = pathSegments[2];
  const courseId = Number(rawCourseId);

  const [topics, setTopics] = useState<CourseTopic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<ActiveMaterial | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!courseId) return;

    const fetchTopics = async () => {
      try {
        const res = await axios.get<CourseTopic[]>(`http://localhost:8082/api/topics/by-course/${courseId}`);
        if (Array.isArray(res.data)) {
          const sortedTopics = res.data.sort((a, b) => a.sortOrder - b.sortOrder);
          setTopics(sortedTopics);
          if (sortedTopics.length > 0) {
            // Set the first topic as active by default
            setActiveTopicId(Number(sortedTopics[0].id));
            // Set the first material of the first topic as active by default
            const firstTopic = sortedTopics[0];
            setActiveMaterial({
              id: firstTopic.id,
              title: firstTopic.title,
              type: firstTopic.materials,
              url: firstTopic.materials === 'VIDEO' ? firstTopic.videoUrl : firstTopic.documentUrl,
              durationMinutes: firstTopic.durationMinutes
            });
          }
        } else {
          setError('Failed to load course materials.');
          setTopics([]);
        }
      } catch (err) {
        setError('Could not connect to the server.');
        setTopics([]);
      }
    };

    fetchTopics();
  }, [courseId]);

  useEffect(() => {
    // Find the active topic and set its material as active when activeTopicId changes
    const activeTopic = topics.find(topic => Number(topic.id) === activeTopicId);
    if (activeTopic) {
      setActiveMaterial({
        id: activeTopic.id,
        title: activeTopic.title,
        type: activeTopic.materials,
        url: activeTopic.materials === 'VIDEO' ? activeTopic.videoUrl : activeTopic.documentUrl,
        durationMinutes: activeTopic.durationMinutes
      });
    } else {
      setActiveMaterial(null);
    }
  }, [activeTopicId, topics]);

  // Improved icon mapping based on material type
  const getIcon = (type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSIGNMENT') => {
    switch (type) {
      case 'VIDEO': return Video;
      case 'DOCUMENT': return FileText;
      case 'LINK': return Code; // Using Code for Link, change if you have a better icon
      case 'ASSIGNMENT': return GraduationCap; // Using GraduationCap for Assignment
      default: return FileText;
    }
  };

  // Format material type for display
  const formatMaterialType = (materialType: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSIGNMENT') => {
    switch (materialType) {
      case 'VIDEO': return 'Video';
      case 'DOCUMENT': return 'Document';
      case 'LINK': return 'Link';
      case 'ASSIGNMENT': return 'Assignment';
      default: return 'Unknown';
    }
  };

  // Enhanced duration formatting
  const formatDuration = (minutes?: number) => {
    if (minutes === undefined) return null;
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds} sec`;
    }
    return `${Math.round(minutes)} min`;
  };

  const renderMaterialContent = () => {
    if (!activeMaterial) return <p className="p-4">Select a material to view.</p>;

    switch (activeMaterial.type) {
      case 'VIDEO':
  return (
    <div className="p-4">
    <h3 className="text-lg font-semibold mb-2">{activeMaterial.title}</h3>
      {activeMaterial.url ? (
        <iframe
          src={convertYouTubeUrl(activeMaterial.url)}
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-[500px] rounded-md"
        />
      ) : (
        <p className="text-red-500">Video URL not available.</p>
      )}
    </div>
  );

      case 'DOCUMENT':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{activeMaterial.title}</h3>
            {activeMaterial.url ? (
               <iframe src={activeMaterial.url} className="w-full h-screen rounded-md" title={activeMaterial.title}></iframe>
            ) : (
              <p className="text-red-500">Document URL not available.</p>
            )}
          </div>
        );
      case 'LINK':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{activeMaterial.title}</h3>
            {activeMaterial.url ? (
              <a href={activeMaterial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open Link</a>
            ) : (
              <p className="text-red-500">Link URL not available.</p>
            )}
          </div>
        );
      case 'ASSIGNMENT':
          return (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{activeMaterial.title}</h3>
              <p>{activeMaterial.url ? <a href={activeMaterial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Assignment</a> : 'Assignment details not available.'}</p>
            </div>
          );
      default:
        return <p className="p-4">Content type not supported yet.</p>;
    }
  };

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="flex w-full font-sans">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            {/* Logo Image */}
            <img
              src="https://cdn5.vectorstock.com/i/1000x1000/60/39/lms-icon-learning-management-system-vector-42366039.jpg"
              alt="Lideo Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-wide">Lideo</h1>

            {/* Back Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/`);
              }}
              className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-100 transition duration-200"
            >
              ← Back
            </button>
  </div>
      {/* Sidebar Menu */}
      <div className="w-full max-w-sm border border-gray-200 bg-white rounded-lg shadow-sm mr-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
          <button
            onClick={() => setIsMenuVisible(!isMenuVisible)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isMenuVisible ? 'Hide menu' : 'Show menu'}
            {isMenuVisible ?
              <ChevronUp className="w-4 h-4 ml-1" /> : 
              <ChevronDown className="w-4 h-4 ml-1" />
            }
          </button>
        </div>

        {isMenuVisible && (
          <div>
            {topics.length === 0 ? (
              <p className="text-gray-500 p-4">No materials available for this course.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {topics.map(topic => {
                  const isActiveTopic = Number(topic.id) === activeTopicId;
                  const Icon = getIcon(topic.materials); // Use the material type directly

                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setActiveTopicId(Number(topic.id));
                        // Set the material of the clicked topic as active
                        setActiveMaterial({
                          id: topic.id,
                          title: topic.title,
                          type: topic.materials,
                          url: topic.materials === 'VIDEO' ? topic.videoUrl : topic.documentUrl,
                          durationMinutes: topic.durationMinutes
                        });
                      }}
                      className={`
                        flex items-start space-x-3 p-4 cursor-pointer transition-colors duration-150
                        ${isActiveTopic
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-white border-l-4 border-transparent hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon 
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActiveTopic ? 'text-blue-600' : 'text-gray-500'}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm ${isActiveTopic ? 'text-blue-800' : 'text-gray-800'}`}>
                          {formatMaterialType(topic.materials)}: {topic.title}
                        </h3>
                        {topic.durationMinutes !== undefined && (
                          <p className={`text-xs mt-1 ${isActiveTopic ? 'text-blue-600' : 'text-gray-500'}`}>
                            {formatDuration(topic.durationMinutes)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 border border-gray-200 bg-white rounded-lg shadow-sm">
        {renderMaterialContent()}
      </div>
    </div>
  );
  
};
const convertYouTubeUrl = (url: string): string => {
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};


export default CourseMaterials;