package com.namelessmc.bot.types;

import java.awt.*;

public enum MessageColor {

    OK(new Color(0x0275D8)),
    SUCCESS(new Color(0x03D63E)),
    ERROR(new Color(0xD60334));

    public Color color;

    MessageColor(Color color) {
        this.color = color;
    }
}
