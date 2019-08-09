import L from 'leaflet';

// override the toolbar labels and tooltip text
L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: '',
        text: ''
      },
      finish: {
        title: '',
        text: ''
      },
      undo: {
        title: '',
        text: ''
      },
      buttons: {
        polyline: '',
        polygon: 'Draw shape',
        rectangle: '',
        circle: '',
        marker: '',
        circlemarker: ''
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: ''
        },
        radius: ''
      },
      circlemarker: {
        tooltip: {
          start: '.'
        }
      },
      marker: {
        tooltip: {
          start: '.'
        }
      },
      polygon: {
        tooltip: {
          start: '',
          cont: '',
          end: ''
        }
      },
      polyline: {
        error: '<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: 'Click to start drawing line',
          cont: 'Click to continue drawing line',
          end: 'Click last point to finish line'
        }
      },
      rectangle: {
        tooltip: {
          start: ''
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Release mouse to finish drawing'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Save changes',
          text: 'Save'
        },
        cancel: {
          title: 'Cancel editing, discards all changes',
          text: 'Cancel'
        },
        clearAll: {
          title: 'Clear all shapes',
          text: 'Clear All'
        }
      },
      buttons: {
        edit: 'Edit shape',
        editDisabled: 'No shapes to edit',
        remove: 'Delete shape',
        removeDisabled: 'No shapes to delete'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Drag handles or markers to edit shapes',
          subtext: 'Click cancel to undo changes'
        }
      },
      remove: {
        tooltip: {
          text: 'Click on a feature to remove'
        }
      }
    }
  }
};

export default null;