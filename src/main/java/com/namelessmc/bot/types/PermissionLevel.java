package com.namelessmc.bot.types;

import com.namelessmc.bot.NamelessBot;

public enum PermissionLevel {

    ADMIN(),
    MEMBER();

    public static PermissionLevel getLevel(String targetId) {
        for (String userId: NamelessBot.ADMIN_USER_IDS) {
            if (targetId.equalsIgnoreCase(userId)) {
                return ADMIN;
            }
        }
        return MEMBER;
    }
}

