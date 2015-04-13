package com.littledevices.mmdxonjs;

import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;


public class MainActivity extends ActionBarActivity {

    private final static int CAPTURE_IMAGE_ACTIVITY_REQUEST_CODE = 567; //arbitrarily defined
    private final static int CHOOSE_IMAGE_ACTIVITY_REQUEST_CODE = 321; //arbitrarily defined

    private Uri image;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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

    public void chooseImage(View view){
        Intent i = new Intent(Intent.ACTION_PICK,android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(i, CHOOSE_IMAGE_ACTIVITY_REQUEST_CODE);
    }

    public void activateCamera(View view){
        Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.TITLE, "imageToProcess");
        image = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        i.putExtra(MediaStore.EXTRA_OUTPUT, image);
        startActivityForResult(i, CAPTURE_IMAGE_ACTIVITY_REQUEST_CODE);

    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(resultCode == RESULT_OK){
            if (requestCode == CHOOSE_IMAGE_ACTIVITY_REQUEST_CODE){
                image = data.getData();
            }

            //get picture path
            String[] filePathColumn = { MediaStore.Images.Media.DATA };
            Cursor cursor = getContentResolver().query(image, filePathColumn, null, null, null);
            cursor.moveToFirst();
            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String imagePath = cursor.getString(columnIndex);

            Intent intent = new Intent(this, WebViewActivity.class);
            intent.putExtra("imagePath", imagePath);
            startActivity(intent);


        }
        else{
            //do something else
        }

    }
}
