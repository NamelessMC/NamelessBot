package com.namelessmc.bot.utils;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class FetchJson {

    public static JsonObject fromUrl(String url) {
        return fromUrl(url, true);
    }

    public static JsonObject fromUrl(String url, boolean showException) {
        JsonObject jsonResponse = new JsonObject();
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; NamelessBot/1.0; +http://namelessmc.com)");
            int responseCode;
            try {
                responseCode = con.getResponseCode();
            } catch (Exception e) {
                // TODO: Actually get the response code
                responseCode = 404;
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            //Read JSON response
            if (responseCode == 404) {
                jsonResponse = new JsonObject();
                jsonResponse.addProperty("responseCode", responseCode);
            } else {
                jsonResponse = new JsonParser().parse(response.toString()).getAsJsonObject();
                jsonResponse.addProperty("responseCode", responseCode);
            }
            return jsonResponse;
        } catch (Exception e) {
            if (showException) {
                e.printStackTrace();
            }
        }
        return jsonResponse;
    }
}
