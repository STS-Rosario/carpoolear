package com.sts.carpoolear;

import android.os.Build;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Disable edge-to-edge on all Android devices so the WebView is laid out
 * below the status bar and above the navigation bar (no overlap).
 *
 * - Android 15+ (API 35): Theme attribute windowOptOutEdgeToEdgeEnforcement in styles.xml.
 * - Android 14 and below: WindowCompat.setDecorFitsSystemWindows(window, true).
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // On API < 35, this insets the content so it doesn't draw behind system bars.
        // On API 35+ this is disabled by the platform; theme opt-out handles it.
        if (Build.VERSION.SDK_INT < 35) {
            WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        }
        super.onCreate(savedInstanceState);
    }
}
