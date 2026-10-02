import AVFoundation
import ExpoModulesCore
import Foundation

public class NativeVolumeButtonListenerModule: Module {
  private var isActive = false
  private var volumeObservation: NSKeyValueObservation?
  private var lastVolume: Float = AVAudioSession.sharedInstance().outputVolume

  public func definition() -> ModuleDefinition {
    Name("NativeVolumeButtonListener")

    Events("VolumeUp", "VolumeDown")

    Function("setActive") { (active: Bool) in
      self.isActive = active
      if active {
        self.startObserving()
      } else {
        self.stopObserving()
      }
    }

    OnDestroy {
      self.stopObserving()
    }
  }

  private func startObserving() {
    guard volumeObservation == nil else {
      return
    }
    lastVolume = AVAudioSession.sharedInstance().outputVolume
    // KVO on outputVolume only fires while the shared audio session is
    // active. The category is left untouched (TTS manages its own).
    try? AVAudioSession.sharedInstance().setActive(true)
    volumeObservation = AVAudioSession.sharedInstance().observe(
      \.outputVolume,
      options: [.new]
    ) { [weak self] _, change in
      guard let self, self.isActive, let newVolume = change.newValue else {
        return
      }
      // Volume moves in fixed steps; no change (e.g. already at max) means
      // no event, matching the Android interceptor's behavior of only
      // firing on handled key events.
      if newVolume > self.lastVolume {
        self.sendEvent("VolumeUp")
      } else if newVolume < self.lastVolume {
        self.sendEvent("VolumeDown")
      }
      self.lastVolume = newVolume
    }
  }

  private func stopObserving() {
    volumeObservation?.invalidate()
    volumeObservation = nil
  }
}
