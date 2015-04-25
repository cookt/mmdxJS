package com.littledevices.mmdxonjs;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
//for geolocation - start
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
//for geolocation - end

import java.io.ByteArrayOutputStream;


public class WebViewActivity extends Activity {
    private WebView mWebView;
    private String imagePath; //passed from the camera activity
    private String image_base64;

    //custom WebViewClient, prevents loading our web app on the external browser
    public class MyWebViewClient extends WebViewClient {

        //Calls the JS function that loads the image and draws it nto canvas
        public void onPageFinished(WebView view, String url) {
            String functionCall = "javascript:loadImage("+"'"+image_base64+"'"+")";
            mWebView.loadUrl(functionCall);

        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if(Uri.parse(url).getHost().endsWith("www/main.html")) {
                // This is our web site, so do not override; let my WebView load the page
                return false;
            }
            // Otherwise, the link is not for a page on my site, so launch another Activity that handles URLs
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            view.getContext().startActivity(intent);
            return true;
        }
    }

    //*********************START*************************
    // ADDING GEOLOCATION SUPPORT, automatically grant viewing permissions -S
     /**
     * WebChromeClient subclass handles UI-related calls
     * Note: think chrome as in decoration, not the Chrome browser
     */
    public class GeoWebChromeClient extends WebChromeClient {
        @Override
        public void onGeolocationPermissionsShowPrompt(String origin,
                GeolocationPermissions.Callback callback) {
            // Always grant permission since the app itself requires location
            // permission and the user has therefore already granted it
            callback.invoke(origin, true, false);
        }
    }
    //*********************END*************************

    // Pass picture path to html file
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);
        Intent intent = getIntent();
        imagePath = intent.getStringExtra("imagePath");

        //convert image to base64 string here
        Bitmap bm = BitmapFactory.decodeFile(imagePath);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos); //bm is the bitmap object
        byte[] b = baos.toByteArray();

        image_base64 = "data:image/jpeg;base64,"+Base64.encodeToString(b, Base64.DEFAULT);

        mWebView = (WebView) findViewById(R.id.webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mWebView.setWebViewClient(new MyWebViewClient());
        //geolocation start
        mWebView.getSettings().setGeolocationEnabled(true); //enabling zoom -s
        mWebView.getSettings().setBuiltInZoomControls(true); // enabling geolocation -s
  
        mWebView.setWebChromeClient(new GeoWebChromeClient()); //setting chrome client above
        //geolocation end
        mWebView.loadUrl("file:///android_asset/www/main.html");


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_web_view, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void backToMain(View view){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }


}

