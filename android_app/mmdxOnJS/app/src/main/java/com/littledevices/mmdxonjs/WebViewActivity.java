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

import android.webkit.JavascriptInterface;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.*;
import android.content.Context;
import android.widget.Toast;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;


//import com.google.android.gms.common.api.GoogleApiClient;




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

    //*********************Start: Send data to native android and post to Parse *************************
    // Adding stuff to enable sending data - S
    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        /** Allow the JavaScript to pass some data in to us. */
        @JavascriptInterface
        public void setData(String newData) throws JSONException, UnsupportedEncodingException {
            Log.d("checking if called", "MainActivity.setData()");
            Log.d("checking if called", newData);
//            JSONArray streamer = new JSONArray(newData);
//            double[] data = new double[streamer.length()];
//            for (int i = 0; i < streamer.length(); i++) {
//                Double n = streamer.getDouble(i);
//                data[i] = n;
//            }

            //handle sending stuff over to the database
            this.postData(newData);
        }

        public void postData(String data) throws UnsupportedEncodingException {
            // Create a new HttpClient and Post Header
            HttpClient httpclient = new DefaultHttpClient();

            //String formattedData = "lat="+ data[0]+ "&lng="+ data[1] +"&diagnosis=Ebola";
            //String toPost = "http://mmdx.parseapp.com/send_result?"+ formattedData;
            String toPost = "http://mmdx.parseapp.com/send_data";
            HttpPost httppost = new HttpPost(toPost);

            //Extract JSON we just created
            JSONObject object = null;
            try {
                object = new JSONObject(data);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            String message = object.toString();
            Log.d("checking if called msg", message);
            httppost.setEntity(new StringEntity(message, "UTF8"));
            httppost.setHeader("Content-type", "application/json");

            try {

                // Execute HTTP Post Request
                HttpResponse response = httpclient.execute(httppost);
                
            } catch (ClientProtocolException e) {
                // TODO Auto-generated catch block
                Log.i("posDataError", "client Protocol exception");
            } catch (IOException e) {
                // TODO Auto-generated catch block
                Log.i("posDataError", "IOException");
            }
        } 


    }

    //*********************END: Send data to native android and post to Parse **********************


    //*********************START: Allowing Geolocation in JavaScript ******************************
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
    //*********************END: Allowing Geolocation in JavaScript******************************

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
        mWebView.getSettings().setGeolocationEnabled(true);  // enabling geolocation -s
        //mWebView.getSettings().setBuiltInZoomControls(true); //enabling zoom -s

        mWebView.getSettings().setLoadWithOverviewMode(true);
        mWebView.getSettings().setUseWideViewPort(true);

        mWebView.getSettings().setAppCacheEnabled(true);
        mWebView.getSettings().setDatabaseEnabled(true);
        mWebView.getSettings().setDomStorageEnabled(true);
        mWebView.addJavascriptInterface(new WebAppInterface(this), "Android");

        mWebView.setWebChromeClient(new GeoWebChromeClient()); //setting chrome client above
        //geolocation end
        mWebView.loadUrl("file:///android_asset/www/main.html");

        // START: working on native android geolocation -s (experimental)
//        protected synchronized void buildGoogleApiClient() {
//        mGoogleApiClient = new GoogleApiClient.Builder(this)
//            .addConnectionCallbacks(this)
//            .addOnConnectionFailedListener(this)
//            .addApi(LocationServices.API)
//            .build();
//        };
        // END: working on native android geolocation
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

    //to DEBUG?

    public void backToMain(View view){
		finish();
        Intent intent = new Intent(WebViewActivity.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
    }

    //********************* START: Exploring Native android Geolocation *************************
    // links: https://developer.android.com/training/location/retrieve-current.html
    // UNTESTED
//    @Override
//    public void onConnected(Bundle connectionHint) {
//        mLastLocation = LocationServices.FusedLocationApi.getLastLocation(
//                mGoogleApiClient);
//        if (mLastLocation != null) {
//            mLatitudeText.setText(String.valueOf(mLastLocation.getLatitude()));
//            mLongitudeText.setText(String.valueOf(mLastLocation.getLongitude()));
//            Log.d("Latitude form Android", String.valueOf(mLastLocation.getLatitude())));
//            Log.d("LOngitude form Android", String.valueOf(mLastLocation.getLongitude())));
//        }
//    }
    //********************* END: Exploring Native android Geolocation ***************************

}

