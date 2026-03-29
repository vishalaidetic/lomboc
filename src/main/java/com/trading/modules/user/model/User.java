package com.trading.modules.user.model;

import com.trading.shared.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    // Note: 'id' (UUID) inherited from BaseEntity is used as the system's internal
    // user_id.
    // Use user.getId() to access it.

    @Column(name = "clerk_id", unique = true, nullable = false, length = 100)
    private String clerkId; // Maps to Clerk's 'sub' claim (user_2p...)

    @Column(unique = true, nullable = false)
    private String email;

    private String username;

    private String profileImageUrl;
}
