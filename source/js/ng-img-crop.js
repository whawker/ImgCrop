'use strict';

import CropHost from './classes/crop-host';
import CropPubSub from './classes/crop-pubsub';

var noop = function () {},
  defaultOptions = {
  areaType: 'square',
  changeOnFly: false,
  minSize: 100,
  resultImageSize: 200,
  resultImageFormat: 'image/png',
  resultImageQuality: 1.0,
  maxDimensions: [500, 500],
  onLoadStart: noop,
  onLoadDone: noop,
  onLoadError: noop,
  onImageUpdate: noop
};

const imgCrop = function(element, options = {}) {
  var mergedOptions = Object.assign({}, defaultOptions, options);

  if (!mergedOptions.imageSrc) {
    throw new Error('imageSrc is required')
  }

  // Init Events Manager
  var events = new CropPubSub();
  // Init Crop Host
  var cropHost = new CropHost(element.querySelector('canvas'), {}, events);
  cropHost.setAreaType(mergedOptions.areaType);
  cropHost.setNewImageSource(mergedOptions.imageSrc);
  cropHost.setAreaMinSize(mergedOptions.minSize);
  cropHost.setResultImageSize(mergedOptions.resultImageSize);
  cropHost.setResultImageFormat(mergedOptions.resultImageFormat);
  cropHost.setResultImageQuality(mergedOptions.resultImageQuality);
  cropHost.setMaxDimensions.apply(null, mergedOptions.maxDimensions);

  // Store Result Image to check if it's changed
  var storedResultImage;

  var updateResultImage = function() {
    var resultImage = cropHost.getResultImageDataURI();
    if(storedResultImage !== resultImage) {
      storedResultImage = resultImage;
      if(options.resultImage) {
        options.resultImage.src = resultImage;
      }
      mergedOptions.onImageUpdate(resultImage);
    }
  };

  // Setup CropHost Event Handlers
  events
    .on('load-start', mergedOptions.onLoadStart)
    .on('load-done', mergedOptions.onLoadStart)
    .on('load-error', mergedOptions.onLoadError)
    .on('area-move area-resize', function () {
      if (mergedOptions.changeOnFly) {
        updateResultImage()
      }
    })
    .on('area-move-end area-resize-end image-updated', updateResultImage);

  this.destroy = function() {
    cropHost.destroy();
  };
};

export default imgCrop;