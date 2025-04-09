import React from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  date: string;
  impact: string;
  location: string;
  imageUrl: string;
  category: string;
}

const PastWorksPage = () => {
  // Sample data - in a real app, this would come from an API
  const projects: Project[] = [
    {
      id: 1,
      title: 'Road Repair Project',
      description: 'Successfully repaired and maintained 5km of roads in rural areas',
      date: '2023-12-15',
      impact: 'Improved accessibility for 1000+ residents',
      location: 'Gandhi Nagar',
      imageUrl: '/road-repair.svg',
      category: 'Infrastructure'
    },
    {
      id: 2,
      title: 'Water Supply Initiative',
      description: 'Installed water purification systems in 3 villages',
      date: '2023-11-20',
      impact: 'Provided clean water access to 500+ families',
      location: 'Rural District',
      imageUrl: '/water-supply.svg',
      category: 'Water'
    },
    // Add more projects as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Past Works</h1>
        <p className="mt-2 text-sm text-gray-600">A showcase of our completed projects and their impact on the community</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="relative h-48 bg-gray-200">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{new Date(project.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{project.location}</span>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-600">{project.impact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastWorksPage;