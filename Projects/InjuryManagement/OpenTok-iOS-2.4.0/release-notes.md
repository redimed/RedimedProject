OpenTok iOS SDK release notes
=============================

New features and changes
------------------------

Version 2.4

* This version adds support for the arm64 architecture.

* This version adds support for screen sharing. When publishing a screen-sharing
  stream, set the `videoType` property of the OTPublisherKit object and
  pass in `OTPublisherKitVideoTypeScreen` (defined in the
  OTPublisherKitVideoType enum). This optimizes the video encoding for screen
  sharing. It is recommended to use a low frame rate (5 frames per second or
  lower) with screen sharing. When using the screen video type in
  a session that uses the OpenTok Media Server, you should set the
  `[OTPublisherKit audioFallbackEnabled]` property to `NO` to disable
  the audio-only fallback feature, so that the video does not drop out
  in subscribers. See [the OpenTok Media
  Router](http://tokbox.com/opentok/tutorials/create-session/#media-mode ).

  When a stream is created in a session, you can determine the video type
  of the stream (screen or camera) by checking the `videoType` property of
  the OTStream object. The type of stream is defined by constants in the
  OTStreamVideoType enum: `OTStreamVideoTypeScreen` and
  `OTStreamVideoTypeCamera`.

  To publish a screen-sharing stream, you need to implement a custom video
  capturer for the OTPublisherKit object. For sample code that publishes a
  screen-sharing stream, see the "Screen-Sharing" app in the samples directory.

* You can disable the audio-only fallback feature for a published stream by
  setting the `audioFallbackEnabled` property of the OTPublisher object to
  `NO`. The audio-fallback feature is available in sessions that use the
  [OpenTok Media 
  Router](http://tokbox.com/opentok/tutorials/create-session/#media-mode). With
  the audio-fallback feature enabled (the default), when the OpenTok
  Media Router determines that a stream's quality has degraded significantly for
  a specific subscriber, it disables the video in that subscriber in order to 
  preserve audio quality. For streams that use a have the video source set to
  camera, the audio-fallback feature is enabled by default. For screen-sharing 
  streams, the audio-fallback feature is disabled by default.

Version 2.3.1

* This version fixes a bug that cause apps to crash when running in iOS 6.

Version 2.3.0

* This version adds support for armv7s and i386 architectures (in addition to
  armv7). You can now target the iOS Simulator. However, the XCode iOS Simulator
  does not provide access to the camera. When testing in the iOS Simulator, an
  OTPublisher object uses a demo video instead of the camera.

* This version includes a new custom audio driver API. This lets you use
  custom audio streams and define the audio device used to capture and render
  audio data. The following new classes and protocols support the custom audio
  driver API:

  * OTAudioDeviceManager -- Use this class to set the app to specify a custom
  audio device for use in the app.

  * OTAudioDevice -- Defines an audio device for use in a session.

  * OTAudioBus -- The audio bus marshals audio data between the network and
  the audio device.

  * OTAudioFormat -- Defines the format of the audio.

* There are new delegate protocols and messages for getting the audio level of a
  publisher or subscriber. See the `OTPublisherKit.audioLevelDelegate` property
  and the `OTPublisherKitAudioLevelDelegate` protocol, as well as the
  `OTSubscriberKit.audioLevelDelegate` property and the
  `OTSubscriberKitAudioLevelDelegate` protocol.
  
* The new `[OTSubscriberKitDelegate subscriberVideoEnabled:reason:]` message is sent when
  a subscriber's video stream starts (when there previously was no video) or resumes
  (after video was disabled).

* The `reason` parameter has been added to the
  `[OTSubscriberKitDelegate subscriberVideoDisabled:reason:]` message. This parameter
  describes the reason why the subscriber video is being disabled.
  In the previous version, this message was only sent when the video was
  disabled due to changes in the stream quality (in a session that uses the
  OpenTok Media Router). In version 2.3.0, the message is also sent if the
  publisher stops sending a video stream or the subscriber stops subscribing to
  it (and the `reason` parameter value will be set accordingly).

* The new `[OTSubscriberKitDelegate subscriberVideoDisabledWarning:]` message is
  sent when the OpenTok Media Router determines that the stream quality has
  degraded and the video will be disabled if the quality degrades more. The new
  `[OTSubscriberKitDelegate subscriberVideoDisabledWarningLifted:]` message
  is sent when the stream quality improves. This feature is only available in
  sessions that use the OpenTok Media Router (sessions with the
  [media mode](http://tokbox.com/opentok/tutorials/create-session/#media-mode)
  set to routed), not in sessions with the media mode set to relayed.

* This version adds support for armv7s and i386 architectures, in addition to
  armv7. (The SDK does not support arm64.) You can now target the iOS Simulator.
  However, the XCode iOS Simulator does not provide access to the camera. When
  testing in the iOS Simulator, an OTPublisher object uses a demo video instead
  of the camera.

* This version adds support for iOS 8.
  
Version 2.2.1

* Updated to use version 1.0.1h of OpenSSL.
* Created backwards compatibility with OpenTok iOS SDK 2.1.7 (subscriber
orientation).

Version 2.2.0

* For a list of new features and changes, see 
[Migrating to version 2.2 of the OpenTok SDK]
(http://tokbox.com/opentok/libraries/client/ios/migrating-to-version-2.2.html).

Known issues
------------

This version of the OpenTok iOS SDK does not support displaying videos using
Apple AirPlay.

In a session with the [media
mode](http://tokbox.com/opentok/tutorials/create-session/#media-mode)
set to relayed, only one client can subscribe to a stream published by an
ioS device.

The XCode iOS Simulator does not provide access to the camera. When testing in
the iOS Simulator, an OTPublisher object uses a demo video instead of the
camera.

Subscribing to screen-sharing streams (see "New features and changes - Version
2.4") is not supported in the OpenTok iOS SDK version 2.3 and older. You must
upgrade to version 2.4.

Do not use the `-all_load` linker flag. Instead, use the `-force_load` linker
flag to load specific libraries that require it.
