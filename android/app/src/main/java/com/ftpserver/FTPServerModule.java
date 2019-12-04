package com.ftpserver;

import android.os.Environment;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.apache.ftpserver.FtpServer;
import org.apache.ftpserver.FtpServerFactory;
import org.apache.ftpserver.ftplet.DefaultFtplet;
import org.apache.ftpserver.ftplet.FtpException;
import org.apache.ftpserver.ftplet.FtpRequest;
import org.apache.ftpserver.ftplet.FtpSession;
import org.apache.ftpserver.ftplet.Ftplet;
import org.apache.ftpserver.ftplet.FtpletResult;
import org.apache.ftpserver.listener.ListenerFactory;
import org.apache.ftpserver.usermanager.PropertiesUserManagerFactory;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

//import androidx.core.app.ActivityCompat;
//import androidx.core.content.ContextCompat;

public class FTPServerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static ReactApplicationContext reactContext;
    private FtpServer mFtpServer;
    private int port = 2222;// 端口号
    private String ftpConfigDir = Environment.getExternalStorageDirectory()
            .getAbsolutePath() + "/ftpConfig/";
    private String ftpServerFileDir = Environment.getExternalStorageDirectory()
            .getAbsolutePath() + "/ftpServerFileDir/";
    private String TAG = "mainActivity";


    public FTPServerModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addLifecycleEventListener(this);
    }

    @Nonnull
    @Override
    public String getName() {
        return "FTPServerModule";
    }


    @ReactMethod
    public void startServer(Promise promise) {
        copyResourceFile(R.raw.users, ftpConfigDir + "users.properties");
        copyResourceFile(R.raw.users, ftpConfigDir + "ftpserver.jks");
        copyResourceFile(R.raw.testdownload,ftpServerFileDir+ "testDownload.txt");
        if(this.mFtpServer == null || this.mFtpServer.isStopped()){
            startFTPServer();
        }
        if (!this.mFtpServer.isStopped()) {
            int res = 1;
            promise.resolve(res);
        } else {
            int res = 0;
            promise.resolve(res);
        }
    }

    @ReactMethod
    public void reStartServer(Promise promise) {
        if (!this.mFtpServer.isStopped()) {
            this.mFtpServer.stop();
        }
        if (this.mFtpServer.isStopped()) {
            copyResourceFile(R.raw.users, ftpConfigDir + "users.properties");
            copyResourceFile(R.raw.users, ftpConfigDir + "ftpserver.jks");
            startFTPServer();
            if (!this.mFtpServer.isStopped()) {
                int res = 1;
                promise.resolve(res);
            } else {
                int res = 0;
                promise.resolve(res);
            }
        }
    }

    @ReactMethod
    public void stopServer() {
        this.mFtpServer.stop();
    }

    @ReactMethod
    public void resumeServer() {
        this.mFtpServer.resume();
    }

    private void copyResourceFile(int rid, String targetFile) {
        InputStream fin = reactContext.getResources().openRawResource(rid);
        FileOutputStream fos = null;
        int length;
        try {
            fos = new FileOutputStream(targetFile);
            byte[] buffer = new byte[1024];
            while ((length = fin.read(buffer)) != -1) {
                fos.write(buffer, 0, length);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fin != null) {
                try {
                    fin.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void startFTPServer() {
        FtpServerFactory serverFactory = new FtpServerFactory();
        ListenerFactory factory = new ListenerFactory();
        PropertiesUserManagerFactory userManagerFactory = new PropertiesUserManagerFactory();

        String[] str1 = {"mkdir", ftpConfigDir};
        try {
            Process ps = Runtime.getRuntime().exec(str1);
            try {
                ps.waitFor();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        String[] str2 = {"mkdir", ftpServerFileDir};
        try {
            Process ps = Runtime.getRuntime().exec(str2);
            try {
                ps.waitFor();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        String filename = ftpConfigDir + "users.properties";
        File files = new File(filename);
        userManagerFactory.setFile(files);

        serverFactory.setUserManager(userManagerFactory.createUserManager());

        DefaultFtplet myftplet = new MyFtplet();
        Map<String, Ftplet> map = new HashMap<String, Ftplet>();
        map.put("myFtplet", myftplet);
        serverFactory.setFtplets(map);

        factory.setPort(port);
        try {
            serverFactory.addListener("default", factory.createListener());
            FtpServer server = serverFactory.createServer();
            this.mFtpServer = server;
            server.start();
        } catch (FtpException e) {
            e.printStackTrace();
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    /**
     * @author chenkaideng
     * @fileName MyFtplet.java
     * @date 2015年8月11日
     * @describe 监控事件
     */
    public class MyFtplet extends DefaultFtplet {
        private final Logger logger = Logger.getLogger(MyFtplet.class);

        @Override
        public FtpletResult onLogin(FtpSession session, FtpRequest request) throws FtpException, IOException {
            WritableMap map = Arguments.createMap();
            map.putString("type", "otherEvent");
            map.putString("originIP", session.getClientAddress().toString());
            map.putString("requestLine", request.getRequestLine());
            map.putString("hasArgument",request.hasArgument() + "");
            map.putString("argument",request.getArgument());
            sendEvent(reactContext, "login", map);
            return super.onLogin(session, request);
        }

        @Override
        public FtpletResult onDownloadStart(FtpSession session, FtpRequest request) throws FtpException, IOException {
            Log.i(TAG, "downloadStart");
//            Log.i(TAG,user.toString());
            Log.i(TAG, session.getClientAddress().toString());
            Log.i(TAG, session.getServerAddress().toString());
            WritableMap map = Arguments.createMap();
            map.putString("originIP", session.getClientAddress().toString());
            map.putString("type", "downloadStart");
            map.putString("requestLine", request.getRequestLine());
            sendEvent(reactContext, "downloadStart", map);
//            return false;
            return super.onDownloadStart(session, request);
        }

        @Override
        public FtpletResult onDownloadEnd(FtpSession session, FtpRequest request) throws FtpException, IOException {
            Log.i(TAG, "downloadEnd");
            String requestLine = request.getRequestLine();
            String arguments = request.getArgument();
            String command = request.getCommand();
            boolean hasArgument = request.hasArgument();
            Log.i(TAG, "requestLine:" + requestLine);
            Log.i(TAG, "hasArguments:" + hasArgument);
            Log.i(TAG, "arguments:" + arguments);
            Log.i(TAG, "command:" + command);
            WritableMap map = Arguments.createMap();
            map.putString("originIP", session.getClientAddress().toString());
            map.putString("type", "downloadEnd");
            map.putString("requestLine", request.getRequestLine());
            sendEvent(reactContext, "downloadEnd", map);

            return super.onDownloadEnd(session, request);
        }

        @Override
        public FtpletResult onDisconnect(FtpSession session) throws FtpException, IOException {
            WritableMap map = Arguments.createMap();
            map.putString("originIP", session.getClientAddress().toString());
            map.putString("type", "disconnect");
            sendEvent(reactContext, "disconnect", map);
            return super.onDisconnect(session);
        }

        @Override
        public FtpletResult onDeleteStart(FtpSession session, FtpRequest request) throws FtpException, IOException {
            Log.i(TAG, "onDeleteStart");
            return super.onDeleteStart(session, request);
        }

        @Override
        public FtpletResult onDeleteEnd(FtpSession session, FtpRequest request) throws FtpException, IOException {
            Log.i(TAG, "onDeleteEnd");
            return super.onDeleteEnd(session, request);
        }

    }

    @Override
    public void onHostResume() {
        // Activity `onResume`
        if (mFtpServer != null && mFtpServer.isStopped()) {
            startFTPServer();
        }
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
    }

    @Override
    public void onHostDestroy() {
        // Activity `onDestroy`
        mFtpServer.stop();
    }
}
