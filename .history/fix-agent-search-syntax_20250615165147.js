const fs = require('fs');
const path = require('path');

// Update the FindAgentList component to fix the syntax errors
const fixAgentListComponent = () => {
  const filePath = path.join(__dirname, 'src/components/find-agent/find-agent-list/sub-component/FindAgentList.jsx');
  
  console.log('Reading FindAgentList.jsx...');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix #1: Fix specialties map syntax error
  content = content.replace(
    /{agent\.specialties && agent\.specialties\.length > 0 \? agent\.specialties\.map : \[\]\(\(specialty, index\) => \(/g,
    '{agent.specialties && agent.specialties.length > 0 ? agent.specialties.map((specialty, index) => ('
  );
  
  // Fix #2: Fix languagesSpoken map syntax error
  content = content.replace(
    /{agent\.languagesSpoken && agent\.languagesSpoken\.length > 0 \? agent\.languagesSpoken\.map : \[\]\(\(language, index\) => \(/g,
    '{agent.languagesSpoken && agent.languagesSpoken.length > 0 ? agent.languagesSpoken.map((language, index) => ('
  );
  
  // Fix #3: Add closing parentheses and colon empty array to both map functions
  content = content.replace(
    /\)\)\)}<\/div>/g,
    '))) : []}</div>'
  );
  
  console.log('Writing updated FindAgentList.jsx...');
  fs.writeFileSync(filePath, content);
  console.log('Agent search component syntax fixed successfully!');
};

const main = async () => {
  try {
    console.log('Starting agent search syntax fix...');
    fixAgentListComponent();
    console.log('Agent search syntax fix completed successfully!');
  } catch (error) {
    console.error('Error fixing agent search syntax:', error);
  }
};

main();
