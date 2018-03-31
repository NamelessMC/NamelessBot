package com.namelessmc.discord.functions;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class fetchJson {
    public static JSONObject fromUrl(String url) {
        JSONObject jsonResponse = new JSONObject();
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("User-Agent", "Mozilla/5.0");
            int responseCode = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            //Read JSON response
            if (!(responseCode == 200 | responseCode == 201)) {
                jsonResponse = new JSONObject().put("responseCode", responseCode);
            } else {
                jsonResponse = new JSONObject(response.toString()).put("responseCode", responseCode);
            }
            return jsonResponse;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonResponse;
    }
}
