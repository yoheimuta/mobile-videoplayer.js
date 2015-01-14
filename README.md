# mobile-videoplayer.js

[![wercker status](https://app.wercker.com/status/07c0029e4a957bcb24fe5eb2b5430386/m "wercker status")](https://app.wercker.com/project/bykey/07c0029e4a957bcb24fe5eb2b5430386)

`mobile-videoplayer.js` is the videoplayer for mobile browser, especially for ios safari which is disabled to autoplay mp4, inspired by [jani](https://github.com/shin1ohno/jani).

Note that `tamagotchi_4u.mp4` which is used to show this product demo is [CC BY](http://creativecommons.org/licenses/by/2.1/jp/), belonged to BandaiJP.

### Usage

Create the container tag.

```html
<div id="video_container">
  <div class="load-scene">
      <img src="http://placehold.it/320x180">
  </div>

  <div
      class="play-scene"
      data-frame-width=320
      data-frame-height=180
      data-fps=12
      style="display: none;"
      >
      <div
          data-url="assets/tamagotchi_320x180_1.a9ac945e.jpg"
          class="strip"
          data-frames-count=54
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_2.d10717e2.jpg"
          class="strip"
          data-frames-count=54
          style="display: none;"
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_3.a6a03603.jpg"
          class="strip"
          data-frames-count=54
          style="display: none;"
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_4.0895f168.jpg"
          class="strip"
          data-frames-count=21
          style="display: none;"
          >
          <img>
      </div>
  </div>

  <div class="replay-scene" style="display: none;">
      <p>replay ?</p>
  </div>

  <div class="done-scene" style="display: none;">
      <img src="http://placehold.it/320x180">
  </div>
</div>
```

Insert the script.

```html
<script src="mvplayer.min.js"></script>
<script>
window.onload = function(){
    MVPlayer.Controller.run(document.getElementById("video_container"));
};
</script>
```

### Install

Install grunt and bower commands.

```sh
sudo npm install -g grunt-cli
sudo npm install -g bower
```

Then install node module local dependencies.

```sh
sudo npm install
```

And install bower components.

```sh
bower install
```

### Run

```sh
grunt
```

Then access `http://localhost:9000/` or `http://localhost:9000/scroll.html`.

### Test

Run tests using only PhantomJS.

```sh
grunt
```

Run tests using FireFox, Chrome, Safari, PhantomJS and other (see `Grunt.coffee`).

```sh
grunt testem:run:long
```

### Convert mp4 to jpgs

Use [jani-strip_maker](https://github.com/shin1ohno/jani-strip_maker).

```sh
./bin/strip_maker from_movie_to_strips --input_file ./src/assets/tamagotchi_4u.mp4 --fps 12 --height 180 --width 320
```
