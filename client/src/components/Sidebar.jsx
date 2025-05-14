import React from 'react';
import Chat from './Chat';
// ... other imports

const Sidebar = ({ projectData }) => {
  // ... your existing sidebar code
  
  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200 w-80">
      {/* Your existing sidebar content */}
      
      {/* Chat section - only show if the user is a participant */}
      {projectData && projectData.conversationId && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Chat conversationId={projectData.conversationId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;