import Ember from 'ember';
import ENV from 'property-praxis/config/environment';
import _ from 'npm:lodash';

export default Ember.Component.extend({
  src: null,
  alt: null,

  classNames: ['streetview'],
  classNameBindings: ['isLoaded'],
  isLoaded: false,

  setSrc: Ember.observer('activeProperty', function () {
    let active = this.get('activeProperty');

    if (_.get(active, 'lat') && _.get(active, 'long')) {
      this.set('src', streetviewUrl([active.lat, active.long]));
    } else {
      this.set('src', null);
    }
  }),

  /**
   * handleLoad also observes coordinates. on change
   * listen once for a load event on the image and
   * toggle isLoaded
   */
  handleLoad: Ember.observer('activeProperty', function() {
    this.set('isLoaded', false); // re-init isLoaded to false on change

    this.$().children('img').one('load', () => {
      this.set('isLoaded', true);
    });
  })
});

function streetviewUrl (coordinates) {
  return `https://maps.googleapis.com/maps/api/streetview?size=640x640&pitch=0&location=${coordinates.join(',')}&pitch=10&key=${ENV.STREETVIEW_KEY}`;
}
