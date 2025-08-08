import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CourseTopic } from '../../types';
import { Trash2 } from 'lucide-react';

interface TopicForm {
  title: string;
  topicdescription: string;
  videoUrl: string;
  documentUrl: string;
  durationMinutes: number;
  sortOrder: number;
  courseId: number;
  universityId: number;
  instructorId: number;
  materials: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSIGNMENT';
}

const AddTopicPage: React.FC = () => {
  const { courseId, universityId, instructorId } = useParams<{ courseId: string; universityId: string; instructorId: string }>();

  const [courseTopics, setCourseTopics] = useState<CourseTopic[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [topicForm, setTopicForm] = useState<TopicForm>({
    title: '',
    topicdescription: '',
    videoUrl: '',
    documentUrl: '',
    durationMinutes: 0,
    sortOrder: 1,
    courseId: Number(courseId),
    universityId: Number(universityId),
    instructorId: Number(instructorId),
    materials: 'DOCUMENT',
  });

  useEffect(() => {
    if (topicForm.courseId) {
      axios.get(`http://localhost:8082/api/topics/by-course/${topicForm.courseId}`)
        .then((res) => setCourseTopics(res.data))
        .catch((err) => console.error('Error fetching topics:', err));
    }
  }, [topicForm.courseId]);

  const handleChange = (field: keyof TopicForm, value: string | number) => {
    if (field === 'materials') {
      setTopicForm((prev) => ({
        ...prev,
        materials: value as TopicForm['materials'],
        videoUrl: '',
        documentUrl: '',
      }));
      setSelectedFile(null);
    } else {
      setTopicForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDeleteTopic = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8082/api/topics/${id}`);
      alert('CourseTopic deleted successfully!');
      const updatedResponse = await axios.get(`http://localhost:8082/api/topics/by-course/${topicForm.courseId}`);
      const updatedTopics: CourseTopic[] = updatedResponse.data;
      setCourseTopics(updatedTopics);
      const maxSortOrder = updatedTopics.reduce((max, topic) => topic.sortOrder > max ? topic.sortOrder : max, 0);
      setTopicForm((prev) => ({ ...prev, sortOrder: maxSortOrder + 1 }));
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error deleting topic. Check console for details.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
    let fileUrl = '';  // Upload file to Spring Boot (S3)
if (selectedFile) {
  const formData = new FormData();
  formData.append('file', selectedFile);

  const uploadRes = await axios.post('http://localhost:8082/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  fileUrl = uploadRes.data; // Assuming backend returns the raw S3 URL as string

  // Assign to appropriate field
  if (topicForm.materials === 'DOCUMENT' || topicForm.materials === 'ASSIGNMENT') {
    topicForm.documentUrl = fileUrl;
  } else if (topicForm.materials === 'VIDEO') {
    topicForm.videoUrl = fileUrl;
  }
}

// Submit topic data
const response = await axios.post('http://localhost:8082/api/topics', topicForm);
alert('Topic uploaded successfully!');

// Refresh topic list
const updatedTopics = await axios.get(
  `http://localhost:8082/api/topics/by-course/${topicForm.courseId}`
);
setCourseTopics(updatedTopics.data);

// Reset form
setTopicForm((prev) => ({
  ...prev,
  title: '',
  topicdescription: '',
  videoUrl: '',
  documentUrl: '',
  durationMinutes: 0,
  sortOrder: prev.sortOrder + 1
}));
setSelectedFile(null);
}catch (error) {
      console.error('Error uploading topic:', error);
      alert('Error uploading topic. Check console for details.');
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center" style={{ backgroundImage: 'url("https://www.chetu.com/img/e-learning/lms/sliderbg/learning-management-system-hero-shot.jpg")' }}>
      <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
        <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-9xl font-extrabold text-black opacity-10 pointer-events-none">Lideo</h1>
        <h2 className="text-2xl font-semibold mb-4">Add Course Topic</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={topicForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Topic Title" required className="w-full p-2 border rounded" />
          <textarea value={topicForm.topicdescription} onChange={(e) => handleChange('topicdescription', e.target.value)} placeholder="Topic Description" required className="w-full p-2 border rounded" />

          <select value={topicForm.materials || ''} onChange={(e) => handleChange('materials', e.target.value as TopicForm['materials'])} className="w-full p-2 border rounded" required>
            <option value="">Select Material Type</option>
            <option value="DOCUMENT">Document</option>
            <option value="VIDEO">Video</option>
            <option value="LINK">Link</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>

          {(topicForm.materials === 'DOCUMENT' || topicForm.materials === 'ASSIGNMENT' || topicForm.materials === 'VIDEO') && (
            <input type="file" accept=".docx" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded" required />
          )}

          {topicForm.materials === 'LINK' && (
            <input type="url" value={topicForm.videoUrl} onChange={(e) => handleChange('videoUrl', e.target.value)} placeholder="External Resource URL" className="w-full p-2 border rounded" required />
          )}

          <input type="number" value={topicForm.durationMinutes} onChange={(e) => handleChange('durationMinutes', Number(e.target.value))} placeholder="Duration in Minutes" required className="w-full p-2 border rounded" />
          <input type="number" value={topicForm.sortOrder} onChange={(e) => handleChange('sortOrder', Number(e.target.value))} placeholder="Sort Order" required className="w-full p-2 border rounded" />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Topic</button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Uploaded Topics</h2>
          {courseTopics.length === 0 ? <p>No topics uploaded yet.</p> : (
            <ul className="space-y-3">
              {courseTopics.map((topic) => (
                <li key={topic.id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <div className="font-medium text-lg">{topic.sortOrder}. {topic.title}</div>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                  <div className="text-sm mt-1"><span className="font-medium">Material:</span> {topic.materials}</div>
                  {topic.videoUrl && <div className="text-sm"><a href={topic.videoUrl} className="text-blue-500 underline" target="_blank">Video</a></div>}
                  {topic.documentUrl && <div className="text-sm"><a href={topic.documentUrl} className="text-blue-500 underline" target="_blank">Document</a></div>}
                  <div className="text-sm"><span className="font-medium">Duration:</span> {topic.durationMinutes} minutes</div>
                  <button onClick={() => handleDeleteTopic(topic.id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTopicPage;
