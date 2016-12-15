var createSongRow = function(songNumber, songName, songLength) {
  var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';
  var $row = $(template);
   
  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

      currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);
      currentSongFromAlbum = currentAlbum[songNumber-1];
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
      if(currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };
   
  var onHover = function(e) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };
  var offHover = function(e) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
  };
  
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function (album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentAlbum.songs[currentlyPlayingSongNumber-1].title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.songs[currentlyPlayingSongNumber-1].title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
  // Index of the current song & Number of the previous song
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) + 1;
  if(currentSongIndex >= currentAlbum.songs.length)
    currentSongIndex = 0;
  var lastSongNumber = currentSongIndex == 0 ? currentAlbum.songs.length : currentSongIndex;
  
  
  // Set the current song global variables & play the song
  setSong(currentSongIndex+1);
  currentSoundFile.play();
  
  // Update the player bar & table cell data info
  updatePlayerBarSong();
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  getSongNumberCell(lastSongNumber).html(lastSongNumber);
};

var previousSong = function() {
  // Index of the current song & Number of the previous song
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) - 1;
  if(currentSongIndex < 0 )
    currentSongIndex = currentAlbum.songs.length - 1;
  var lastSongNumber = currentSongIndex == currentAlbum.songs.length - 1 ? 1 : currentSongIndex+2;
  
  
  // Set the current song global variables & play the song
  setSong(currentSongIndex+1);
  currentSoundFile.play();
  
  // Update the player bar & table cell data info
  updatePlayerBarSong();
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  getSongNumberCell(lastSongNumber).html(lastSongNumber);
};

var setSong = function(songNumber) {
  if(currentSoundFile)
    currentSoundFile.stop();
  if(songNumber === null) {
    currentlyPlayingSongNumber = null;
    currentSongFromAlbum = null;
    currentSoundFile = null;
  } else {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: [ 'mp3' ],
      preload: true
    });
  }
  setVolume(currentVolume);
};

var setVolume = function(volume) {
  if(currentSoundFile)
    currentSoundFile.setVolume(volume);
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
  if(currentSoundFile.isPaused()) {
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play();
  } else if(currentSoundFile !== null) {
    getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};
   
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  var playPauseButton = $('.main-controls .play-pause');
  playPauseButton.click(togglePlayFromPlayerBar);
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});