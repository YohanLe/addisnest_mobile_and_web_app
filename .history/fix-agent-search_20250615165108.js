const fs = require('fs');
const path = require('path');

// Update the FindAgentList component to fix the field name mismatches
const fixAgentListComponent = () => {
  const filePath = path.join(__dirname, 'src/components/find-agent/find-agent-list/sub-component/FindAgentList.jsx');
  
  console.log('Reading FindAgentList.jsx...');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix #1: Fix field name mismatch for agent properties in the render section
  // Change agent.languages to agent.languagesSpoken
  content = content.replace(
    /agent\.languages\.map/g,
    'agent.languagesSpoken ? agent.languagesSpoken.map : []'
  );
  
  // Fix #2: Change agent.name to proper format (first and last name)
  content = content.replace(
    /<h5>{agent.name}<\/h5>/g,
    '<h5>{agent.firstName} {agent.lastName}</h5>'
  );
  
  // Fix #3: Fix rating to use averageRating
  content = content.replace(
    /renderStars\(agent\.rating\)/g,
    'renderStars(agent.averageRating || 0)'
  );
  
  // Fix #4: Fix specialties array check
  content = content.replace(
    /agent\.specialties\.map/g,
    'agent.specialties && agent.specialties.length > 0 ? agent.specialties.map : []'
  );
  
  // Fix #5: Add defaulting for languagesSpoken
  content = content.replace(
    /agent\.languagesSpoken \? agent\.languagesSpoken\.map : \[\]/g,
    'agent.languagesSpoken && agent.languagesSpoken.length > 0 ? agent.languagesSpoken.map : []'
  );
  
  console.log('Writing updated FindAgentList.jsx...');
  fs.writeFileSync(filePath, content);
  console.log('Agent search component updated successfully!');
};

const main = async () => {
  try {
    console.log('Starting agent search fix...');
    fixAgentListComponent();
    console.log('Agent search fix completed successfully!');
  } catch (error) {
    console.error('Error fixing agent search:', error);
  }
};

main();
