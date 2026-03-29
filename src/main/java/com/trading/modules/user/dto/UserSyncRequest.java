package com.trading.modules.user.dto;

import lombok.Data;

@Data
public class UserSyncRequest {
    private String email;
    private String username;
    private String profileImageUrl;
}
