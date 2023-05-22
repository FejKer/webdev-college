$(document).ready(function() {
    function fetchImages() {
      var filters = {};
  
      // Get the values of each filter field
      filters.q = $('#keyword-input').val();
      filters.media_type = $('#media-type-select').val();
      filters.year_start = $('#year-start-input').val();
      filters.year_end = $('#year-end-input').val();
      filters.location = $('#location-input').val();
  
      // Construct the API URL with the specified filters
      var apiUrl = 'https://images-api.nasa.gov/search?';
      Object.keys(filters).forEach(function(key) {
        if (filters[key]) {
          apiUrl += key + '=' + encodeURIComponent(filters[key]) + '&';
        }
      });
  
      // Make a GET request to the NASA Image and Video Library API
      $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(data) {
          var items = data.collection.items;
          var galleryDiv = $('#image-gallery');
          galleryDiv.empty();
  
          // Display each image in the gallery
          items.forEach(function(item) {
            var mediaType = item.data[0].media_type;
            var mediaUrl = item.links[0].href;
            var mediaTitle = item.data[0].title;
  
            // Create a card for each media item
            var card = $('<div>').addClass('card');
  
            if (mediaType === 'image') {
              card.append($('<img>').addClass('card-img-top').attr('src', mediaUrl).attr('alt', mediaTitle));
            } else if (mediaType === 'video') {
              var videoLink = $('<a>').attr('href', mediaUrl).attr('target', '_blank').text('Watch Video').addClass('btn btn-primary');
              card.append($('<div>').addClass('card-img-top d-flex align-items-center justify-content-center').css('height', '200px').append(videoLink));
            }
            else if (mediaType === 'audio') {
              card.append($('<audio controls>').addClass('card-img-top').append($('<source>').attr('src', mediaUrl)));
            }
  
            card.append($('<div>').addClass('card-body').append($('<h5>').addClass('card-title').text(mediaTitle)));
  
            galleryDiv.append(card);
          });
        },
        error: function(error) {
          console.log('Error:', error);
        }
      });
    }
  
    // Handle the search button click event
    $('#search-button').click(function() {
      fetchImages();
    });
  });
  