package com.sts.carpoolear;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Keep the WebView out from under system bars.
 *
 * - Android 14 and below: WindowCompat.setDecorFitsSystemWindows(window, true).
 * - Android 15+ (API 35), including Android 16 where the theme opt-out is
 *   ignored: Capacitor android.adjustMarginsForEdgeToEdge = auto.
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        super.onCreate(savedInstanceState);
    }
}
