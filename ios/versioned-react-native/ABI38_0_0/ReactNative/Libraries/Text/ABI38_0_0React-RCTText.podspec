# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "..", "package.json")))
version = package['version']



Pod::Spec.new do |s|
  s.name                   = "ABI38_0_0React-RCTText"
  s.version                = version
  s.summary                = "A React component for displaying text." 
  s.homepage               = "http://facebook.github.io/react-native/"
  s.documentation_url      = "https://facebook.github.io/react-native/docs/text"
  s.license                = package["license"]
  s.author                 = "Facebook, Inc. and its affiliates"
  s.platforms              = { :ios => "9.0", :tvos => "9.2" }
  s.source                 = { :path => "." }
  s.source_files           = "**/*.{h,m}"
  s.preserve_paths         = "package.json", "LICENSE", "LICENSE-docs"
  s.header_dir             = "ABI38_0_0RCTText"

  s.dependency "ABI38_0_0React-Core/RCTTextHeaders", version
end
