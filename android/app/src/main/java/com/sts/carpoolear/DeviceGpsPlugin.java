package com.sts.carpoolear;

import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DeviceGps")
public class DeviceGpsPlugin extends Plugin {
    @PluginMethod
    public void hasGps(PluginCall call) {
        boolean has = getContext()
            .getPackageManager()
            .hasSystemFeature(PackageManager.FEATURE_LOCATION_GPS);
        JSObject ret = new JSObject();
        ret.put("value", has);
        call.resolve(ret);
    }
}
