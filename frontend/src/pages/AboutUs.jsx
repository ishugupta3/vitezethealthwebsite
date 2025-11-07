import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AboutUs = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await apiService.getCmsContent('about_us');
        // The API response structure is { status: true, message: "success", result: { ... } }
        // Extract content from response.result.content
        const contentData = response.result && response.result.content ? response.result.content : '';
        setContent(contentData);
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default AboutUs;
