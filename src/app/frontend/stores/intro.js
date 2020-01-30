import Cookies from 'universal-cookie';

const cookies = new Cookies();
const SHOW_TRAY_AT_INDEX = 2;

const introExited = () => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const expiryDate = new Date(year+1, date.getMonth(), date.getDate());
  cookies.set("introDone", true, {path: '/map', expires: expiryDate});
};

let showIntro = cookies.get("introDone") !== "true";

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
    overlayOpacity: 1,
  },

  {
    element: '.no-selector',
    intro: `
      <h1>Browsing the map and finding records</h1>
      <p>
      You can scroll around the map and see what records are available in the area you are viewing. You can also search for a place name in the top right corner of your screen (just in case you quickly want to search for somewhere very specific - a postcode, a building name.)
      </p>
      <p>
      Records on the map are represented by little black and white pins. You can click each one for a summary of what it is about, and click further to see the full record in the tray. 
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
    <p>Duis accumsan ornare cursus. Curabitur sit amet commodo nisi. Etiam metus risus, laoreet in euismod nec, convallis non elit. Ut et eros dapibus, tincidunt massa.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--layers a',
    intro: `
    <h1>Layers</h1>
    <p>In laoreet vitae elit vitae semper. Sed cursus orci vitae nunc accumsan, in commodo tortor volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--collections a',
    intro: `
    <h1>Collections</h1>
    <p>Quisque volutpat lacus eget dictum dapibus. Phasellus sit amet finibus justo, a finibus purus. Praesent fringilla, ex a bibendum semper, dui magna imperdiet sapien, quis.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip',
    highlightClass: 'm-tray-area-highlight',
  },

  {
    element: '.m-tools .m-tool-button.m-tool-button--add a',
    intro: `
    <h1>Add a record</h1>
    <p>Suspendisse eleifend lacus erat, id luctus lectus fermentum quis. Aenean velit dolor, gravida vitae placerat sit amet, lacinia et nisi.</p>
    `,
    position: 'right',
    tooltipClass: 'm-tray-area-tooltip m-tray-area-tooltip--last',
    highlightClass: 'm-tray-area-highlight m-tray-area-highlight--last',
  },
];

const introOptions = {
  showStepNumbers: false,
  nextLabel: 'Next',
  prevLabel: 'Back',
  hidePrev: true,
  hideNext: true,
  showStepNumbers: false,
  exitOnOverlayClick: false
};

export {steps, showIntro, introExited, SHOW_TRAY_AT_INDEX, introOptions};
