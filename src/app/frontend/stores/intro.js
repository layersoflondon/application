const SHOW_TRAY_AT_INDEX = 2;

const steps = [
  {
    element: '.no-selector',
    intro: `
      <h1>How to use this site</h1>
      <p>
      Layers of London is a map-based history website developed by the Institute of Historical Research. 
      Users can access free historic maps of London and contribute stories, memories and histories to create 
      a social history resource about their area. 
      </p>
      <p>
      The next 7 pages will describe some of the features you can use to get the best experience out of this website. 
      </p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.no-selector',
    intro: `
      <h1>Browsing the map and finding records</h1>
      <p>
      You can scroll around the map and see what records are available in the area you are viewing. You can also search for a place name in the top right corner of your screen (just in case you quickly want to search for somewhere very specific - a postcode, a building name.)
      </p>
      <p>
      Records on the map are represented by little black pins. You can click each one for a summary of what it is about, and click further to see the full record in the tray. 
      </p>
    `,
    position: 'left',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tray-area .open-close',
    intro: `
    <h1>The tray</h1>
    <p>The tray is a list view of all the records on the map that you're currently looking at, and where your search results will appear when you make a search. 
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--search a',
    intro: `
    <h1>Search</h1>
    <p>You can search for records and collections here. There are also options to filter your search by time period and tag.</p>
    <p>When you search, the results will include anything in the Layers of London database. If you just want to find a place on the map, use the box on the map itself. That searches places in modern London.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--layers a',
    intro: `
    <h1>Layers</h1>
    <p>Here you can choose what layers to put on your map. We've got a list of hundreds of historic maps, datasets and other interesting content for you to explore.</p>
    <p>You can choose more than one layer to put on the map at the same time.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--collections a',
    intro: `
    <h1>Collections</h1>
    <p>Collections are groups of records around a theme. You can see all of them in a list, here.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--add a',
    intro: `
    <h1>Add a record</h1>
    <p>Add your own records here. You can add text, videos, audio, and documents, as well as text content.</p>
    <p>You'll need to be logged in to do this. Setting up an account is instant, and free.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },
];

const introOptions = {
  showStepNumbers: false,
  nextLabel: 'Next',
  prevLabel: 'Back',
  hidePrev: true,
  hideNext: true,
  exitOnOverlayClick: false
};


export {steps, introOptions, SHOW_TRAY_AT_INDEX};
