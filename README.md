# mobile-videoplayer.js

[![wercker status](https://app.wercker.com/status/84fc7c16eecdfd40bfbb81322392db0b/m "wercker status")](https://app.wercker.com/project/bykey/84fc7c16eecdfd40bfbb81322392db0b)

`mobile-videoplayer.js` is the videoplayer for mobile browser, especially for ios safari which is disabled to autoplay mp4, inspired by [jani](https://github.com/shin1ohno/jani).

Note that `tamagotchi_4u.mp4` which is used to show this product demo is [CC BY](http://creativecommons.org/licenses/by/2.1/jp/), belonged to BandaiJP.

### Usage

Create the container tag.

- `load-scene` class element is displayed until the video is finished loading.
- `replay-scene` class element and `done-scene` class element are displayed after the video is finished playing.
- `replay-scene` class element is going to be registered click event to replay the video.

Set `data-*-url` to send fine-grained impression trackings following `VAST` format as close as possible.

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
      data-did-start-url=""
      data-did-resume-url=""
      data-did-complete-url=""
      data-first-quartile-url=""
      data-midpoint-url=""
      data-third-quartile-url=""
      data-did-pause-url=""
      style="display: none;"
      >
      <div
          data-url="assets/tamagotchi_320x180_1.a9ac945e.jpg"
          class="strip"
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_2.d10717e2.jpg"
          class="strip"
          style="display: none;"
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_3.a6a03603.jpg"
          class="strip"
          style="display: none;"
          >
          <img>
      </div>
      <div
          data-url="assets/tamagotchi_320x180_4.0895f168.jpg"
          class="strip"
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

Pass `container element id` as 1st arg and `is_debug flag to console log` as 2nd arg.

```html
<script src="mvplayer.min.js"></script>
<script>
window.onload = function(){
    MVPlayer.Controller.run(document.getElementById("video_container"), true);
};
</script>
```

### Support

Confirmed to work well in these browsers listed below.

```
IE6, IE7, IE8, Safari(7.1/8), Firefox(31), Chrome(39),
iOS Safari(iOS6, iOS7, iOS8), Android(2.2, 4.4, 5)
```

Also confirmed that time to complete loading and then start video is about 3~4 sec in mobile 3G network.

### Install

Install grunt and bower commands.

```sh
sudo npm install -g grunt-cli
sudo npm install -g bower
```

Then install node module local dependencies.

```sh
npm install
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
