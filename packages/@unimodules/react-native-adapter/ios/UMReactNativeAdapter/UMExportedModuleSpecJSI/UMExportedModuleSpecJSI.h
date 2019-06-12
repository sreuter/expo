// Copyright 2019-present 650 Industries. All rights reserved.

#pragma once

#include <ReactCommon/RCTTurboModule.h>

namespace unimodules {

class JSI_EXPORT ExportedModuleSpecJSI : public facebook::react::ObjCTurboModule {
public:
  ExportedModuleSpecJSI(id instance, std::shared_ptr<facebook::react::JSCallInvoker> jsInvoker);
};

} // namespace unimodules