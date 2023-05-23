$(document).ready(function() {
  var currentApiUrl;

  function fetchImages() {
    var filters = {};

    filters.q = $('#keyword-input').val();
    filters.media_type = $('#media-type-select').val();
    filters.year_start = $('#year-start-input').val();
    filters.year_end = $('#year-end-input').val();
    filters.location = $('#location-input').val();

    var apiUrl = 'https://images-api.nasa.gov/search?';
    Object.keys(filters).forEach(function(key) {
      if (filters[key]) {
        apiUrl += key + '=' + encodeURIComponent(filters[key]) + '&';
      }
    });

    currentApiUrl = apiUrl;

    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function(data) {
        var items = data.collection.items;
        var galleryDiv = $('#image-gallery');
        galleryDiv.empty();

        items.forEach(function(item) {
          var mediaType;
          var mediaUrl;
          var mediaTitle;
          try {
            mediaType = item.data[0].media_type;
            mediaUrl = item.links[0].href;
            mediaTitle = item.data[0].title;
          } catch(e) {

          }

          var card = $('<div>').addClass('card');

          if (mediaType === 'image') {
            var img = $('<img>').addClass('card-img-top').attr('src', mediaUrl).attr('alt', mediaTitle);
            img.click(function() {
              $('#image-details').empty().append(formatJSON(item.data[0]));
              $('#image-modal').modal('show');
            });            
            card.append(img);
            card.append($('<div>').addClass('card-body').append($('<h5>').addClass('card-title').text(mediaTitle)));
          } else if (mediaType === 'video') {
            var coll = item.href;
            var jsonData;
            fetchData(coll).then(value => {
              const regex = /\.(mp4|mov|mkv)$/i;
              var directVideoLink = value.find(url => regex.test(url));
              var video = $('<video>').addClass('card-img-top').attr('src', directVideoLink).attr('controls', true);
              var cardBody = $('<div>').addClass('card-body').append($('<h5>').addClass('card-title').text(mediaTitle));
              card.append(video);
              card.append(cardBody);
            });
          } else if (mediaType === 'audio') {
            var coll = item.href;
            var jsonData;
            fetchData(coll).then(value => {
              const regex = /\.(mp3)$/i;
              var directAudioLink = value.find(url => regex.test(url));
              card.append($('<div>').addClass('card-body').css('margin-top', '20%').append($('<h5>').addClass('card-title').text("Audio")));
              card.append($('<audio controls>').addClass('card-img-top').css('margin-bottom', '50%').append($('<source>').attr('src', directAudioLink)));
            });
          }
          galleryDiv.append(card);
        });
      },
      error: function(error) {
        console.log('Error:', error);
      }
    });
  }

  function fetchData(coll) {
    return fetch(coll)
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        console.error("Error fetching file:", error);
        return null;
      });
  }

   function formatJSON(data) {
    var formatted = $('<ul>');
    Object.keys(data).forEach(function(key) {
      var value = data[key];
      if (Array.isArray(value)) {
        value = value.join(', ');
      }
      formatted.append($('<li>').text(key + ': ' + value));
    });
    return formatted;
  }

  $('#search-button').click(function() {
    fetchImages();
  });
});
