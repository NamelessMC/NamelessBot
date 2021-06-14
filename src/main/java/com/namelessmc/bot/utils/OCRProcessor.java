package com.namelessmc.bot.utils;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.awt.image.BufferedImage;

public class OCRProcessor {
    public static String extractTextFromImage(BufferedImage image) {
        ITesseract instance = new Tesseract();
        try {
            String result = instance.doOCR(image);
            return result;
        } catch (TesseractException e) {
            return "";
        }
    }
}
