package com.namelessmc.discord.functions;

import com.namelessmc.discord.Bot;
import net.dv8tion.jda.core.entities.User;

public class PermissionsCustom {
    public static boolean hasBotAdmin(User user) {
        boolean isAllowed = false;
        for (String adminUserId : Bot.ADMIN_USER_IDS) {
            if (adminUserId.startsWith(user.getId())) {
                isAllowed = true;
            }
        }
        return isAllowed;
    }

    public static boolean hasBotAdmin(String userId) {
        boolean isAllowed = false;
        for (String adminUserId : Bot.ADMIN_USER_IDS) {
            if (adminUserId.startsWith(userId)) {
                isAllowed = true;
            }
        }
        return isAllowed;
    }
}
