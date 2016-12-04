var currentAlbum; // initialized in onload function
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21'},
    { title: 'Magenta', duration: '2:15'}
  ]
};

// Another Example Album
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Fits in your pocket', duration: '3:21'},
    { title: 'Can you hear me now?', duration: '3:14' },
    { title: 'Wrong phone number', duration: '2:15'}
  ]
};

// My example album
var albumEuler = {
  title: 'Bridges of Konigsberg',
  artist: 'Leonhard Euler',
  label: 'Graph Theory',
  year: '1736',
  albumArtUrl: 'assets/images/album_covers/02.png',
  songs: [
    { title: 'West Island to North Shore #1', duration: '3:01' },
    { title: 'West Island to North Shore #2', duration: '3:02' },
    { title: 'West Island to South Shore #1', duration: '3:03'},
    { title: 'West Island to South Shore #2', duration: '3:04' },
    { title: 'Island to Island', duration: '3:05' },
    { title: 'East Island to North Shore', duration: '3:06' },
    { title: 'East Island to South Shore', duration: '3:07'}
  ]
};

 var createSongRow = function(songNumber, songName, songLength) {
  return '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';
 };

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

var bgImg = document.getElementsByClassName('album-cover-art')[0];
bgImg.onclick = function() {
  currentAlbum++;
  if(currentAlbum % 3 == 0) setCurrentAlbum(albumPicasso);
  else if(currentAlbum % 3 == 1) setCurrentAlbum(albumMarconi);
  else if(currentAlbum % 3 == 2) setCurrentAlbum(albumEuler);
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function() {
  setCurrentAlbum(albumPicasso);
  currentAlbum = 0;
  songListContainer.addEventListener('mouseover', function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
      event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
    }
  });
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      // Selects first child element, which is the song-item-number element
      this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
    });
  }
};