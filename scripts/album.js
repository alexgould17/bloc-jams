var createSongRow = function(songNumber, songName, songLength) {
  var template = '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
      updateSeekBarWhileSongPlays();
      $(this).html(pauseButtonTemplate);
      currentSongFromAlbum = currentAlbum[songNumber-1];
      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});
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
  setTotalTimeInPlayerBar(currentAlbum.songs[currentlyPlayingSongNumber-1].duration);
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

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(e) {
    var offsetX = e.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    if($(this).parent().attr('class') == 'seek-control')
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    else
      setVolume(seekBarFillRatio * 100);
    updateSeekPercentage($(this), seekBarFillRatio);
  });
  $seekBars.find('.thumb').mousedown(function(e) {
    console.log(e);
    var $seekBar = $(this).parent();
    $(document).bind('mousemove.thumb', function(event) {
      console.log(event);
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
      if($(this).parent().attr('class') == 'seek-control')
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      else
        setVolume(seekBarFillRatio * 100);
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var updateSeekBarWhileSongPlays = function() {
  if(currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(e) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(this.getTime());
    });
  }
};

var seek = function(time) {
  if(currentSoundFile)
    currentSoundFile.setTime(time);
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.seek-control .current-time').html(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  $('.seek-control .total-time').html(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
  var secs = parseFloat(timeInSeconds);
  var minutes = Math.floor(secs / 60);
  var seconds = Math.floor(secs - (minutes*60));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});